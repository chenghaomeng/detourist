# backend/orchestrator_sync.py
# Synchronous orchestrator with same logic/limits as parallel version.
# Single Overpass pass, many candidates (bounded), ranking + timings.

from typing import List, Dict, Any, Optional
from dataclasses import dataclass
import logging, time, os, json, hashlib
from datetime import timedelta

from redis import Redis

from backend.extraction.llm_extractor import LLMExtractor, ExtractedParameters
from backend.geocoding.geocoder import Geocoder, Coordinates, Isochrone, SearchZone
from backend.waypoints.waypoint_searcher import WaypointSearcher, Waypoint
from backend.routing.route_builder import RouteBuilder, Route, RouteSegment
from backend.scoring.route_scorer import RouteScorer, RouteScore


# -------------------- Small Redis JSON cache --------------------
class Cache:
    def __init__(self, url: Optional[str] = None):
        self.client = Redis.from_url(url or os.getenv("REDIS_URL", "redis://localhost:6379/0"))

    @staticmethod
    def _hash_key(namespace: str, payload: Dict[str, Any]) -> str:
        s = json.dumps(payload, sort_keys=True, separators=(",", ":"))
        return f"{namespace}:{hashlib.sha256(s.encode('utf-8')).hexdigest()}"

    def get_json(self, namespace: str, payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        key = self._hash_key(namespace, payload)
        val = self.client.get(key)
        return json.loads(val) if val else None

    def set_json(self, namespace: str, payload: Dict[str, Any], value: Dict[str, Any], ttl_seconds: int = 600) -> None:
        key = self._hash_key(namespace, payload)
        self.client.setex(key, timedelta(seconds=ttl_seconds), json.dumps(value))


# ---------- API-facing dataclasses ----------
@dataclass
class RouteRequest:
    user_prompt: str
    max_results: int = 5
    origin: Optional[Dict[str, Any]] = None
    destination: Optional[Dict[str, Any]] = None
    time: Optional[Dict[str, Any]] = None


@dataclass
class RouteResponse:
    routes: List[Dict[str, Any]]
    processing_time_seconds: float
    metadata: Dict[str, Any]


class RouteOrchestratorSync:
    def __init__(self, config: Dict[str, str]):
        self.config = config

        # Modules
        self.extractor = LLMExtractor(config.get("llm_api_key", ""))
        mapbox_key = config.get("geocoding_api_key", "") or config.get("routing_api_key", "")
        self.geocoder = Geocoder(mapbox_key)
        self.waypoint_searcher = WaypointSearcher(config.get("poi_api_key", ""))
        self.route_builder = RouteBuilder(mapbox_key)
        self.route_scorer = RouteScorer(
            clip_model_name=os.getenv("CLIP_MODEL_NAME", config.get("clip_model_name", "openai/clip-vit-base-patch32")),
            mapillary_token=os.getenv("MAPILLARY_TOKEN", config.get("mapillary_token", "")) or None,
        )

        # knobs to mirror parallel defaults
        self.wp_top_k = int(os.getenv("WP_TOP_K", "12"))
        self.route_max_single = int(os.getenv("ROUTE_MAX_SINGLE", "6"))
        self.route_max_pairs  = int(os.getenv("ROUTE_MAX_PAIRS", "6"))
        self.route_max_triples= int(os.getenv("ROUTE_MAX_TRIPLES", "0"))

        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
        self.cache = Cache(config.get("redis_url"))

    # -------------------- helpers (same as parallel) --------------------
    def _coords_to_dict(self, c: Coordinates) -> Dict[str, float]:
        return {"latitude": c.latitude, "longitude": c.longitude}

    def _coords_from_dict(self, d: Dict[str, float]) -> Coordinates:
        return Coordinates(latitude=float(d["latitude"]), longitude=float(d["longitude"]))

    def _iso_to_dict(self, iso: Isochrone) -> Dict[str, Any]:
        return {
            "center": self._coords_to_dict(iso.center),
            "travel_time_minutes": int(iso.travel_time_minutes),
            "polygon": [self._coords_to_dict(p) for p in iso.polygon],
        }

    def _iso_from_dict(self, d: Dict[str, Any]) -> Isochrone:
        return Isochrone(
            center=self._coords_from_dict(d["center"]),
            travel_time_minutes=int(d["travel_time_minutes"]),
            polygon=[self._coords_from_dict(p) for p in d.get("polygon", [])],
        )

    def _zone_to_dict(self, z: SearchZone) -> Dict[str, Any]:
        return {
            "origin_isochrone": self._iso_to_dict(z.origin_isochrone),
            "destination_isochrone": self._iso_to_dict(z.destination_isochrone),
            "intersection_polygon": [self._coords_to_dict(p) for p in z.intersection_polygon],
        }

    def _zone_from_dict(self, d: Dict[str, Any]) -> SearchZone:
        return SearchZone(
            origin_isochrone=self._iso_from_dict(d["origin_isochrone"]),
            destination_isochrone=self._iso_from_dict(d["destination_isochrone"]),
            intersection_polygon=[self._coords_from_dict(p) for p in d.get("intersection_polygon", [])],
        )

    def _wp_to_dict(self, w: Waypoint) -> Dict[str, Any]:
        return {
            "name": w.name,
            "coordinates": self._coords_to_dict(w.coordinates),
            "category": w.category,
            "relevance_score": float(w.relevance_score),
            "metadata": w.metadata,
            "input_query": w.input_query,
        }

    def _wp_from_dict(self, d: Dict[str, Any]) -> Waypoint:
        return Waypoint(
            name=d["name"],
            coordinates=self._coords_from_dict(d["coordinates"]),
            category=d["category"],
            relevance_score=float(d["relevance_score"]),
            metadata=d.get("metadata", {}),
            input_query=d.get("input_query", ""),
        )

    def _seg_to_dict(self, s: RouteSegment) -> Dict[str, Any]:
        return {
            "start": self._coords_to_dict(s.start),
            "end": self._coords_to_dict(s.end),
            "distance_meters": float(s.distance_meters),
            "duration_seconds": int(s.duration_seconds),
            "instructions": s.instructions,
            "polyline": s.polyline,
        }

    def _seg_from_dict(self, d: Dict[str, Any]) -> RouteSegment:
        return RouteSegment(
            start=self._coords_from_dict(d["start"]),
            end=self._coords_from_dict(d["end"]),
            distance_meters=float(d["distance_meters"]),
            duration_seconds=int(d["duration_seconds"]),
            instructions=list(d.get("instructions", [])),
            polyline=d.get("polyline", ""),
        )

    def _route_to_dict(self, r: Route) -> Dict[str, Any]:
        return {
            "origin": self._coords_to_dict(r.origin),
            "destination": self._coords_to_dict(r.destination),
            "waypoints": [self._wp_to_dict(w) for w in r.waypoints],
            "segments": [self._seg_to_dict(s) for s in r.segments],
            "total_distance_meters": float(r.total_distance_meters),
            "total_duration_seconds": int(r.total_duration_seconds),
            "constraints_applied": r.constraints_applied,
            "input_queries": list(getattr(r, "input_queries", [])),
        }

    def _route_from_dict(self, d: Dict[str, Any]) -> Route:
        return Route(
            origin=self._coords_from_dict(d["origin"]),
            destination=self._coords_from_dict(d["destination"]),
            waypoints=[self._wp_from_dict(w) for w in d.get("waypoints", [])],
            segments=[self._seg_from_dict(s) for s in d.get("segments", [])],
            total_distance_meters=float(d["total_distance_meters"]),
            total_duration_seconds=int(d["total_duration_seconds"]),
            constraints_applied=d.get("constraints_applied", {}),
            input_queries=list(d.get("input_queries", [])),
        )

    def _wp_key(self, w: Waypoint) -> str:
        return f"{w.name}:{round(w.coordinates.latitude,6)}:{round(w.coordinates.longitude,6)}"

    def _make_candidates(self, waypoints: List[Waypoint]) -> List[List[Waypoint]]:
        ordered = sorted(waypoints, key=lambda w: w.relevance_score, reverse=True)[: self.wp_top_k]
        cands: List[List[Waypoint]] = [[]]
        for w in ordered[: self.route_max_single]:
            cands.append([w])
        cnt_pairs = 0
        L = min(len(ordered), self.route_max_single)
        for i in range(L):
            for j in range(i + 1, len(ordered)):
                if cnt_pairs >= self.route_max_pairs:
                    break
                cands.append([ordered[i], ordered[j]])
                cnt_pairs += 1
            if cnt_pairs >= self.route_max_pairs:
                break
        if self.route_max_triples > 0:
            cnt_tri = 0
            for i in range(L):
                for j in range(i + 1, L):
                    for k in range(j + 1, L):
                        if cnt_tri >= self.route_max_triples:
                            break
                        cands.append([ordered[i], ordered[j], ordered[k]])
                        cnt_tri += 1
                    if cnt_tri >= self.route_max_triples:
                        break
                if cnt_tri >= self.route_max_triples:
                    break
        return cands

    # -------------------- Main entrypoint --------------------
    def generate_routes(self, request: RouteRequest) -> RouteResponse:
        t0 = time.time()
        timings: Dict[str, float] = {}

        try:
            # 1) LLM extract (cache)
            t = time.time()
            llm_key = {"prompt": request.user_prompt}
            cached_llm = self.cache.get_json("llm_extract_v1", llm_key)
            if cached_llm:
                ep = ExtractedParameters(**cached_llm)
            else:
                ep = self.extractor.extract_parameters(request.user_prompt)
                self.cache.set_json(
                    "llm_extract_v1",
                    llm_key,
                    {
                        "origin": ep.origin,
                        "destination": ep.destination,
                        "time_flexibility_minutes": ep.time_flexibility_minutes,
                        "waypoint_queries": ep.waypoint_queries,
                        "constraints": ep.constraints,
                    },
                    ttl_seconds=1800,
                )
            timings["llm_extract_sync"] = time.time() - t

            # 2) geocode (cache)
            t = time.time()
            def _cached_geocode(text: str) -> Coordinates:
                gkey = {"text": (text or "").strip().lower()}
                cached = self.cache.get_json("geocode_v1", gkey)
                if cached:
                    return self._coords_from_dict(cached)
                coords = self.geocoder.geocode_address(text)
                self.cache.set_json("geocode_v1", gkey, self._coords_to_dict(coords), ttl_seconds=86400)
                return coords

            origin_text = (request.origin or {}).get("text") or ep.origin
            dest_text = (request.destination or {}).get("text") or ep.destination

            if request.origin and request.origin.get("lat") is not None and request.origin.get("lon") is not None:
                origin_coords = Coordinates(float(request.origin["lat"]), float(request.origin["lon"]))
            else:
                origin_coords = _cached_geocode(origin_text)

            if request.destination and request.destination.get("lat") is not None and request.destination.get("lon") is not None:
                dest_coords = Coordinates(float(request.destination["lat"]), float(request.destination["lon"]))
            else:
                dest_coords = _cached_geocode(dest_text)
            timings["geocode_sync"] = time.time() - t

            # 3) search zone (cache)
            t = time.time()
            transport_mode = (ep.constraints or {}).get("transport_mode", os.getenv("DEFAULT_TRANSPORT_MODE", "driving"))
            max_additional_minutes = ep.time_flexibility_minutes or 30
            if request.time and isinstance(request.time.get("max_duration_min"), int):
                max_additional_minutes = request.time["max_duration_min"]

            zone_key = {
                "o": self._coords_to_dict(origin_coords),
                "d": self._coords_to_dict(dest_coords),
                "max_additional": int(max_additional_minutes),
                "mode": transport_mode,
            }
            cached_zone = self.cache.get_json("search_zone_v1", zone_key)
            if cached_zone:
                search_zone = self._zone_from_dict(cached_zone)
            else:
                search_zone = self.geocoder.create_search_zone(
                    origin=origin_coords,
                    destination=dest_coords,
                    max_additional_time=int(max_additional_minutes),
                    transport_mode=transport_mode,
                )
                self.cache.set_json("search_zone_v1", zone_key, self._zone_to_dict(search_zone), ttl_seconds=1800)
            timings["search_zone_sync"] = time.time() - t

            # 4) waypoints (single Overpass pass)
            t = time.time()
            waypoint_queries = ep.waypoint_queries or []
            wp_key = {"zone": zone_key, "queries": waypoint_queries}
            cached_wps = self.cache.get_json("waypoints_v2", wp_key)
            if cached_wps:
                waypoints = [self._wp_from_dict(w) for w in cached_wps]
            else:
                try:
                    waypoints = self.waypoint_searcher.search_waypoints(search_zone, waypoint_queries)
                except Exception as e:
                    self.logger.warning("Waypoint search failed: %s", e)
                    waypoints = []
                # de-dupe & top-K
                seen = set()
                dedup: List[Waypoint] = []
                for w in sorted(waypoints, key=lambda w: w.relevance_score, reverse=True):
                    k = self._wp_key(w)
                    if k not in seen:
                        seen.add(k); dedup.append(w)
                    if len(dedup) >= self.wp_top_k:
                        break
                waypoints = dedup
                self.cache.set_json("waypoints_v2", wp_key, [self._wp_to_dict(w) for w in waypoints], ttl_seconds=1800)
            timings["waypoints_sync"] = time.time() - t

            # 5) build candidates (sequential Mapbox)
            t = time.time()
            constraints = dict(ep.constraints or {})
            constraints.setdefault("transport_mode", transport_mode)
            _force_mode = os.getenv("FORCE_TRANSPORT_MODE") or os.getenv("DEFAULT_TRANSPORT_MODE")
            if _force_mode:
                constraints["transport_mode"] = _force_mode.strip().lower()

            candidates = self._make_candidates(waypoints)
            built: List[Route] = []
            if not candidates:
                candidates = [[]]

            for c in candidates:
                try:
                    r = self.route_builder.build_route(origin_coords, dest_coords, c, constraints)
                    if r:
                        built.append(r)
                except Exception as e:
                    self.logger.warning("Route build failed: %s", e)

            if not built:
                self.logger.warning("No routes built; trying direct route fallback.")
                direct = self.route_builder.build_direct_route(origin_coords, dest_coords, constraints)
                if direct:
                    built = [direct]

            routes = built
            timings["routes_build_sync"] = time.time() - t

            # 6) score (sequential)
            t = time.time()
            use_images = os.getenv("ENABLE_SCORING", "false").lower() == "true"
            min_imgs = int(os.getenv("SCORING_MIN_IMAGES", "3" if use_images else "0"))
            max_imgs = int(os.getenv("SCORING_MAX_IMAGES", "6" if use_images else "0"))
            scored: List[RouteScore] = self.route_scorer.score_routes(
                routes,
                request.user_prompt,
                min_images_per_route=min_imgs,
                max_images_per_route=max_imgs,
            )
            scored.sort(key=lambda s: s.overall_score, reverse=True)
            max_results = max(1, int(request.max_results or 3))
            top = scored[:max_results]
            timings["score_sync"] = time.time() - t

            # 7) API output
            def _route_to_api(o: RouteScore) -> Dict[str, Any]:
                r = o.route
                return {
                    "score": round(float(o.overall_score), 3),
                    "scores": {
                        "clip": round(float(o.clip_score), 3),
                        "efficiency": round(float(o.efficiency_score), 3),
                        "preference": round(float(o.preference_match_score), 3),
                        "images_used": int(o.num_images),
                    },
                    "distance_m": float(r.total_distance_meters),
                    "duration_s": int(r.total_duration_seconds),
                    "origin": self._coords_to_dict(r.origin),
                    "destination": self._coords_to_dict(r.destination),
                    "waypoints": [
                        {
                            "name": w.name,
                            "category": w.category,
                            "relevance_score": float(w.relevance_score),
                            "input_query": w.input_query,
                            "coordinates": self._coords_to_dict(w.coordinates),
                        }
                        for w in r.waypoints
                    ],
                    "segments": [
                        {
                            "distance_m": float(s.distance_meters),
                            "duration_s": int(s.duration_seconds),
                            "instructions": s.instructions,
                            "polyline": s.polyline,
                            "start": self._coords_to_dict(s.start),
                            "end": self._coords_to_dict(s.end),
                        }
                        for s in r.segments
                    ],
                }

            api_routes = [_route_to_api(x) for x in top]
            total = time.time() - t0

            return RouteResponse(
                routes=api_routes,
                processing_time_seconds=total,
                metadata={
                    "total_routes_generated": len(routes),
                    "waypoints_found": len(waypoints),
                    "timings": {
                        "llm_extract_sync": timings.get("llm_extract_sync", 0.0),
                        "geocode_sync": timings.get("geocode_sync", 0.0),
                        "search_zone_sync": timings.get("search_zone_sync", 0.0),
                        "waypoints_sync": timings.get("waypoints_sync", 0.0),
                        "routes_build_sync": timings.get("routes_build_sync", 0.0),
                        "score_sync": timings.get("score_sync", 0.0),
                        "total_sync": total,
                    },
                },
            )
        except Exception as e:
            self.logger.exception("Error (sync) generating routes: %s", e)
            raise

    def health_check(self) -> Dict[str, Any]:
        return {
            "extractor": "healthy",
            "geocoder": "healthy",
            "waypoint_searcher": "healthy",
            "route_builder": "healthy",
            "route_scorer": "healthy",
        }
