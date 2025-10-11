"""
Waypoint search module for finding POIs within search zones.

This module handles:
1. Searching for POIs based on waypoint queries
2. Filtering results by search zone boundaries
3. Ranking waypoints by relevance (tag+name similarity only)
"""

from typing import List, Dict, Any, Tuple, Iterable, Optional
from dataclasses import dataclass
import time
import re
import requests

from shapely.geometry import Point, Polygon

from backend.geocoding.geocoder import SearchZone, Coordinates


OVERPASS_URL = "https://overpass-api.de/api/interpreter"
USER_AGENT = "berkeley-detourist/1.0 (berkeley.edu)"


@dataclass
class Waypoint:
    """A point of interest that can be used as a route waypoint."""
    name: str
    coordinates: Coordinates
    category: str
    relevance_score: float  # 0..10
    metadata: Dict[str, Any]
    input_query: str  # the original query string that produced this waypoint


class WaypointSearcher:
    """Searches for waypoints within specified zones."""
    
    def __init__(self, api_key: str = ""):
        """
        Initialize with POI search API key (not needed for Overpass; kept for interface parity).
        """
        self.api_key = api_key
        self._session = requests.Session()
        self._session.headers.update({"User-Agent": USER_AGENT})

    # --------------------------- Public API ---------------------------

    def search_waypoints(
        self,
        search_zone: SearchZone,
        waypoint_queries: List[str]
    ) -> List[Waypoint]:
        """
        Search for waypoints within the search zone using Overpass.
        Assumes `waypoint_queries` are already well-formatted OSM tag filters
        (e.g., "amenity=school", '["tourism"="viewpoint"]', "landuse=forest").
        """
        zone_poly = self._zone_polygon(search_zone)
        if zone_poly is None or zone_poly.is_empty:
            return []

        all_waypoints: List[Waypoint] = []

        for q in waypoint_queries:
            # Build a single-query Overpass request for nodes/ways/relations within polygon
            elements = self._overpass_query_polygon(zone_poly, q)
            # Spatial filter (belt & suspenders), then convert to Waypoints
            elements_in = self._filter_by_zone(elements, search_zone)
            waypoints = self._convert_pois_to_waypoints(elements_in, q)
            # Rank for this query (centrality removed; only tag+name similarity)
            ranked = self._rank_waypoints(
                waypoints,
                query=q,
                origin=search_zone.origin_isochrone.center,
                destination=search_zone.destination_isochrone.center,
            )
            all_waypoints.extend(ranked)
            # Be polite to Overpass (shared resource)
            time.sleep(1.0)

        # De-dupe by (name, lat, lon) keeping highest score (query not included in dedupe key)
        dedup: Dict[Tuple[str, float, float], Waypoint] = {}
        for w in all_waypoints:
            key = (w.name, round(w.coordinates.latitude, 6), round(w.coordinates.longitude, 6))
            if key not in dedup or w.relevance_score > dedup[key].relevance_score:
                dedup[key] = w

        # Overall ranking
        return sorted(dedup.values(), key=lambda w: w.relevance_score, reverse=True)

    # --------------------------- Overpass ---------------------------

    def _overpass_query_polygon(
        self,
        zone_poly: Polygon,
        query_filter: str,
        timeout_s: int = 45
    ) -> List[Dict[str, Any]]:
        """
        Run a single Overpass query for the given pre-encoded OSM filter within the polygon.
        `query_filter` examples: "amenity=school", '["tourism"="viewpoint"]', "landuse=forest".
        """
        # polygon string: "lat lon lat lon ..." using exterior ring
        latlon_pairs = " ".join(f"{lat} {lon}" for lon, lat in zone_poly.exterior.coords)

        # Normalize the filter into Overpass [ "k"="v" ] syntax
        filt = self._normalize_overpass_filter(query_filter)

        # Query nodes, ways, relations with OR inside the same filter
        ov = f"""
        [out:json][timeout:{timeout_s}];
        (
          node{filt}(poly:"{latlon_pairs}");
          way{filt}(poly:"{latlon_pairs}");
          relation{filt}(poly:"{latlon_pairs}");
        );
        out center tags;
        """

        resp = self._session.post(OVERPASS_URL, data={"data": ov}, timeout=timeout_s + 10)
        resp.raise_for_status()
        data = resp.json()
        return data.get("elements", [])

    def _normalize_overpass_filter(self, q: str) -> str:
        """
        Accepts a well-formatted tag expression and returns an Overpass filter segment:
          Input: "amenity=school"       -> Output: ["amenity"="school"]
                 '["tourism"="zoo"]'    -> Output: ["tourism"="zoo"]
                 "landuse"              -> Output: ["landuse"]    (any value)
                 '["landuse"]'          -> Output: ["landuse"]
                 "landuse=*"            -> Output: ["landuse"]
        """
        s = q.strip()
        # Already bracketed form like ["key"="value"] or ["key"]
        if s.startswith("[") and s.endswith("]"):
            return s
        if "=" in s:
            key, val = [p.strip() for p in s.split("=", 1)]
            if not key:
                return ""
            if val == "*" or val == "":
                return f'["{key}"]'
            return f'["{key}"="{val}"]'
        return f'["{s}"]' if s else ""

    # --------------------------- Spatial / Conversion ---------------------------

    def _zone_polygon(self, search_zone: SearchZone) -> Optional[Polygon]:
        """Build a Shapely polygon from SearchZone.intersection_polygon."""
        ring = search_zone.intersection_polygon or []
        if len(ring) < 3:
            return None
        coords = [(c.longitude, c.latitude) for c in ring]
        try:
            poly = Polygon(coords).buffer(0)
            return poly if poly.is_valid else poly.buffer(0)
        except Exception:
            return None

    def _filter_by_zone(self, pois: List[Dict], search_zone: SearchZone) -> List[Dict]:
        """Filter POIs to only include those within the search zone."""
        poly = self._zone_polygon(search_zone)
        if poly is None or poly.is_empty:
            return []
        inside: List[Dict] = []
        for e in pois:
            pt = self._element_point(e)
            if pt is None:
                continue
            if poly.contains(pt) or poly.touches(pt):
                inside.append(e)
        return inside

    def _element_point(self, element: Dict[str, Any]) -> Optional[Point]:
        """Representative point for an OSM element (node/way/relation)."""
        t = element.get("type")
        if t == "node":
            lat = element.get("lat")
            lon = element.get("lon")
            if lat is None or lon is None:
                return None
            return Point(float(lon), float(lat))
        center = element.get("center")
        if center and "lat" in center and "lon" in center:
            return Point(float(center["lon"]), float(center["lat"]))
        return None

    def _convert_pois_to_waypoints(self, pois: List[Dict[str, Any]], query: str) -> List[Waypoint]:
        """Turn Overpass elements into Waypoint dataclasses, retaining the input query."""
        out: List[Waypoint] = []
        for e in pois:
            tags = e.get("tags", {}) or {}
            pt = self._element_point(e)
            if pt is None:
                continue
            name = tags.get("name") or tags.get("alt_name") or self._synthetic_name(e, query)
            out.append(
                Waypoint(
                    name=name,
                    coordinates=Coordinates(latitude=pt.y, longitude=pt.x),
                    category=self._category_from_tags(tags, query),
                    relevance_score=0.0,  # filled in ranking
                    metadata={"osm_id": e.get("id"), "osm_type": e.get("type"), "tags": tags},
                    input_query=query,
                )
            )
        return out

    def _category_from_tags(self, tags: Dict[str, Any], fallback_query: str) -> str:
        for k in ("leisure", "amenity", "tourism", "landuse", "natural", "water", "shop", "sport"):
            if k in tags:
                return f"{k}={tags[k]}"
        return fallback_query

    # --------------------------- Ranking ---------------------------

    def _rank_waypoints(
        self,
        waypoints: List[Waypoint],
        query: str,
        origin: Coordinates,        # kept for API compatibility (ignored)
        destination: Coordinates    # kept for API compatibility (ignored)
    ) -> List[Waypoint]:
        """
        Rank by:
          - exact tag match to the provided query filter (already pre-encoded),
          - lightweight name similarity to the query.
        Centrality is intentionally removed.

        Final score is scaled to 0..10.
        """
        TAG_WEIGHT = 0.85
        NAME_WEIGHT = 0.15

        ranked: List[Waypoint] = []
        for w in waypoints:
            tags = w.metadata.get("tags", {})
            tag_s = self._calculate_relevance_score(tags, query)     # 0..1
            name_s = self._name_similarity_score(w.name, query)      # 0..1
            score01 = TAG_WEIGHT * tag_s + NAME_WEIGHT * name_s      # 0..1
            w.relevance_score = float(round(score01 * 10.0, 6))      # 0..10
            ranked.append(w)

        return sorted(ranked, key=lambda w: w.relevance_score, reverse=True)

    def _calculate_relevance_score(self, tags: Dict[str, Any], query: str) -> float:
        """
        Score (0..1): exactness of tag match against the already-encoded query.
        Supports:
          - key=value (e.g., "amenity=school")
          - ["key"="value"] (Overpass form)
          - key (any value) / ["key"] / key=*
        """
        k, v, mode = self._parse_query_kv(query)
        if not k:
            return 0.0

        tag_val = None
        if k in tags:
            tag_val = str(tags.get(k, "")).lower()

        if mode == "key_only":
            return 1.0 if tag_val is not None else 0.0
        if mode == "any_value":
            return 1.0 if tag_val is not None else 0.0
        if mode == "exact":
            return 1.0 if (tag_val == v) else 0.0
        return 0.0

    # --------------------------- Utils ---------------------------

    def _parse_query_kv(self, q: str) -> Tuple[Optional[str], Optional[str], str]:
        """
        Parse a pre-encoded query into (key, value, mode):
          - 'amenity=school'          -> ('amenity','school','exact')
          - '["amenity"="school"]'    -> ('amenity','school','exact')
          - 'landuse=*'               -> ('landuse',None,'any_value')
          - '["landuse"]' or 'landuse'-> ('landuse',None,'key_only')
        """
        s = q.strip()
        m = re.fullmatch(r'\[\s*"([^"]+)"\s*=\s*"([^"]+)"\s*\]', s)
        if m:
            return m.group(1).strip(), m.group(2).strip().lower(), "exact"
        m = re.fullmatch(r'\[\s*"([^"]+)"\s*\]', s)
        if m:
            return m.group(1).strip(), None, "key_only"
        if "=" in s:
            key, val = [p.strip() for p in s.split("=", 1)]
            if val == "*" or val == "":
                return key, None, "any_value"
            return key, val.lower(), "exact"
        if s:
            return s, None, "key_only"
        return None, None, "unknown"

    def _name_similarity_score(self, name: str, query: str) -> float:
        """Tiny token overlap between name and query tokens; returns 0..1."""
        if not name or not query:
            return 0.0
        name_tokens = {t for t in _tokenize(name)}
        query_tokens = {t for t in _tokenize(query)}
        if not name_tokens or not query_tokens:
            return 0.0
        overlap = len(name_tokens & query_tokens)
        return min(1.0, overlap / max(1, len(query_tokens)))

    def _synthetic_name(self, element: Dict[str, Any], query: str) -> str:
        osm_type = element.get("type", "elem")
        osm_id = element.get("id", "unknown")
        return f"{query} ({osm_type} {osm_id})"


# Helper
def _tokenize(s: str) -> Iterable[str]:
    buf = []
    for ch in s.lower():
        buf.append(ch if ch.isalnum() else " ")
    return (t for t in " ".join(buf).split() if t)
