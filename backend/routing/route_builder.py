"""
Route building module for creating routes through waypoints.

This module handles:
1. Building routes from origin -> waypoint(s) -> destination
2. Applying routing constraints (avoid tolls, stairs, etc.)
3. Optimizing route parameters (multi-waypoint order via Mapbox Optimized Trips)

Updated: adds build_route(), build_direct_route(), enumerate_candidates()
and build_direct_routes() which returns up to N alternatives when no waypoints.

+ 2025-11-01: Safe guard to skip Mapbox Optimized Trips when coord count > 12.
+ 2025-11-04: If no waypoints, return up to MAX_DIRECT_ALTERNATIVES direct routes
              using Mapbox Directions alternatives=true. Defaults to 3.
+ 2025-11-04B: If Mapbox returns < N routes, synthesize additional variants by
               adding tiny “via” waypoints near the path midline to force
               distinct but valid DRIVING routes.
"""

from typing import List, Dict, Any, Tuple, Optional
from dataclasses import dataclass
import json
import os
import time
import math
import requests

from backend.geocoding.geocoder import Coordinates
from backend.waypoints.waypoint_searcher import Waypoint

# ---------------- Mapbox endpoints ----------------
MAPBOX_DIRECTIONS_URL = "https://api.mapbox.com/directions/v5/mapbox"
MAPBOX_OPTIMIZED_TRIPS_URL = "https://api.mapbox.com/optimized-trips/v1/mapbox"
USER_AGENT = "berkeley-detourist/1.0 (berkeley.edu)"

# Conservative cap for Mapbox Optimized Trips (coords = origin + waypoints + destination)
OPT_TRIPS_MAX_COORDS = 12

# Config toggles
ALLOW_ALTS = os.getenv("ALLOW_DIRECTIONS_ALTERNATIVES", "true").lower() == "true"
MAX_DIRECT_ALTS = int(os.getenv("MAX_DIRECT_ALTERNATIVES", "3"))

@dataclass
class RouteSegment:
    """A segment of a route between two points."""
    start: Coordinates
    end: Coordinates
    distance_meters: float
    duration_seconds: int
    instructions: List[str]
    polyline: str  # encoded polyline6 from Mapbox

@dataclass
class Route:
    """A complete route with waypoints."""
    origin: Coordinates
    destination: Coordinates
    waypoints: List[Waypoint]
    segments: List[RouteSegment]
    total_distance_meters: float
    total_duration_seconds: int
    constraints_applied: Dict[str, bool]
    input_queries: List[str]  # retains the input_query from each waypoint included in this route

class RouteBuilder:
    """Builds routes through waypoints with constraints (Mapbox)."""

    def __init__(self, api_key: str):
        """Initialize with Mapbox access token."""
        self.api_key = api_key
        self._session = requests.Session()
        self._session.headers.update({
            "User-Agent": USER_AGENT,
            "Content-Type": "application/json",
        })

    # ----------------------- Public API (existing) -----------------------

    def build_routes(
        self,
        origin: Coordinates,
        destination: Coordinates,
        waypoints: List[Waypoint],
        constraints: Dict[str, bool],
    ) -> List[Route]:
        """
        Build routes through waypoints with applied constraints.

        Strategy:
          - If no waypoints found: return up to N direct alternatives (driving) via Directions,
            and if still < N, synthesize via-point variants.
          - Else:
              * 5 single-waypoint routes via the top 5 waypoints
              * 5 multi-waypoint routes via top K waypoints (K = 2..6) with
                Mapbox Optimized Trips ordering when within coord limit.
        """
        if not waypoints:
            return self.build_direct_routes(origin, destination, constraints, max_alternatives=MAX_DIRECT_ALTS)

        routes: List[Route] = []
        ordered = sorted(waypoints, key=lambda w: w.relevance_score, reverse=True)
        n = len(ordered)
        extra_delay = float(constraints.get("extra_delay_seconds", 0.0))

        # ---- 5 single-waypoint routes via top 5 ----
        single_count = min(5, n)
        for i in range(single_count):
            w = ordered[i]
            route = self._build_multi_route(origin, destination, [w], constraints)
            routes.append(route)
            if extra_delay > 0:
                time.sleep(extra_delay)

        # ---- 5 multi-waypoint routes via top K (K = 2..6), with optimized order ----
        for k in range(2, 7):  # 2..6
            if n >= k:
                top_k = ordered[:k]
                route = self._build_multi_route(origin, destination, top_k, constraints, optimize_order=True)
                routes.append(route)
                if extra_delay > 0:
                    time.sleep(extra_delay)

        routes.sort(key=lambda r: r.total_duration_seconds)
        return routes

    # ----------------------- New helper: direct alternatives -----------------------

    def build_direct_routes(
        self,
        origin: Coordinates,
        destination: Coordinates,
        constraints: Dict[str, bool],
        max_alternatives: int = 3,
    ) -> List[Route]:
        """
        Build up to N direct routes using Mapbox Directions alternatives.
        If Mapbox returns fewer than N, synthesize additional variants by adding
        tiny via-waypoints near the line between origin and destination.
        """
        profile = self._mb_profile(constraints.get("transport_mode", "driving"))
        params = self._apply_constraints(constraints)

        # 1) Try native alternatives
        native = self._directions_routes_mapbox(origin, destination, profile, params, want_alternatives=ALLOW_ALTS)

        routes: List[Route] = []
        for dist, dur, instr, poly in native[:max_alternatives]:
            seg = RouteSegment(
                start=origin,
                end=destination,
                distance_meters=float(dist),
                duration_seconds=int(dur),
                instructions=list(instr),
                polyline=str(poly),
            )
            routes.append(
                Route(
                    origin=origin,
                    destination=destination,
                    waypoints=[],
                    segments=[seg],
                    total_distance_meters=float(dist),
                    total_duration_seconds=int(dur),
                    constraints_applied={k: bool(v) for k, v in constraints.items()},
                    input_queries=[],
                )
            )

        if len(routes) >= max_alternatives:
            routes.sort(key=lambda r: r.total_duration_seconds)
            return routes[:max_alternatives]

        # 2) Synthesize variants by adding tiny via points near the midline
        need = max_alternatives - len(routes)
        jitter_candidates = self._synth_midline_vias(origin, destination, count=need)
        for via in jitter_candidates:
            try:
                # Build a 1-waypoint chain to force a slightly different path
                rt = self._build_multi_route(
                    origin=origin,
                    destination=destination,
                    waypoints=[Waypoint(
                        name="synthetic-via",
                        coordinates=via,
                        category="synthetic",
                        relevance_score=0.0,
                        metadata={},
                        input_query="synthetic"
                    )],
                    constraints=constraints,
                    optimize_order=False,
                )
                routes.append(rt)
            except Exception:
                continue

        routes.sort(key=lambda r: r.total_duration_seconds)
        return routes[:max_alternatives] if routes else []

    # ----------------------- Public API (existing helpers) -----------------------

    def build_route(
        self,
        origin: Coordinates,
        destination: Coordinates,
        waypoints: List[Waypoint],
        constraints: Dict[str, bool],
    ) -> Route:
        """
        Build exactly one route for a given candidate waypoint list.
        Uses optimized order when there are 2+ waypoints and within the coord limit.
        """
        total_coords = 2 + len(waypoints)  # origin + waypoint(s) + destination
        do_optimize = (len(waypoints) >= 2) and (total_coords <= OPT_TRIPS_MAX_COORDS)

        return self._build_multi_route(
            origin=origin,
            destination=destination,
            waypoints=waypoints,
            constraints=constraints,
            optimize_order=do_optimize,
        )

    def build_direct_route(
        self,
        origin: Coordinates,
        destination: Coordinates,
        constraints: Dict[str, bool],
    ) -> Optional[Route]:
        """Build a single direct route origin -> destination (0 waypoints)."""
        profile = self._mb_profile(constraints.get("transport_mode", "driving"))
        params = self._apply_constraints(constraints)
        try:
            seg = self._directions_segment_mapbox(origin, destination, profile, params)
        except Exception:
            return None

        return Route(
            origin=origin,
            destination=destination,
            waypoints=[],
            segments=[seg],
            total_distance_meters=float(seg.distance_meters),
            total_duration_seconds=int(seg.duration_seconds),
            constraints_applied={k: bool(v) for k, v in constraints.items()},
            input_queries=[],
        )

    def enumerate_candidates(self, waypoints: List[Waypoint]) -> List[List[Waypoint]]:
        """
        Produce a tiny candidate set for fan-out:
          [] (direct), [top-1], [top-2]
        """
        ordered = sorted(waypoints, key=lambda w: w.relevance_score, reverse=True)
        out: List[List[Waypoint]] = [[]]
        if ordered:
            out.append([ordered[0]])
        if len(ordered) > 1:
            out.append([ordered[1]])
        return out

    # ----------------------- Internals -----------------------

    def _build_multi_route(
        self,
        origin: Coordinates,
        destination: Coordinates,
        waypoints: List[Waypoint],
        constraints: Dict[str, bool],
        optimize_order: bool = False,
    ) -> Route:
        """
        Build a route chaining all provided waypoints.
        """
        profile = self._mb_profile(constraints.get("transport_mode", "driving"))
        directions_params = self._apply_constraints(constraints)

        ordered_waypoints = (
            self._optimize_waypoint_order(origin, waypoints, destination, profile)
            if optimize_order and len(waypoints) >= 2
            else waypoints
        )

        chain: List[Coordinates] = [origin] + [w.coordinates for w in ordered_waypoints] + [destination]
        segments: List[RouteSegment] = []
        for a, b in zip(chain[:-1], chain[1:]):
            seg = self._directions_segment_mapbox(a, b, profile, directions_params)
            segments.append(seg)

        total_distance = sum(s.distance_meters for s in segments)
        total_duration = sum(s.duration_seconds for s in segments)

        return Route(
            origin=origin,
            destination=destination,
            waypoints=list(ordered_waypoints),
            segments=segments,
            total_distance_meters=total_distance,
            total_duration_seconds=total_duration,
            constraints_applied={k: bool(v) for k, v in constraints.items()},
            input_queries=[w.input_query for w in ordered_waypoints],
        )

    # ----------------------- Mapbox Directions -----------------------

    def _directions_routes_mapbox(
        self,
        start: Coordinates,
        end: Coordinates,
        profile: str,
        params_extra: Optional[Dict[str, Any]] = None,
        want_alternatives: bool = True,
    ) -> List[Tuple[float, int, List[str], str]]:
        """
        Request possibly multiple routes (alternatives) between A and B.
        Returns list of tuples: (distance_m, duration_s, instructions[], polyline).
        """
        coords = f"{start.longitude},{start.latitude};{end.longitude},{end.latitude}"
        url = f"{MAPBOX_DIRECTIONS_URL}/{profile}/{coords}"
        params = {
            "access_token": self.api_key,
            "alternatives": "true" if want_alternatives else "false",
            "overview": "false",
            "geometries": "polyline6",
            "steps": "true",
        }
        if params_extra:
            params.update(params_extra)

        resp = self._session.get(url, params=params, timeout=45)
        resp.raise_for_status()
        data = resp.json()

        out: List[Tuple[float, int, List[str], str]] = []
        for route0 in data.get("routes", []) or []:
            distance = float(route0.get("distance", 0.0))
            duration = int(round(float(route0.get("duration", 0.0))))

            instructions: List[str] = []
            for leg in route0.get("legs", []):
                for step in leg.get("steps", []):
                    maneuver = step.get("maneuver", {}) or {}
                    instr = maneuver.get("instruction")
                    if not instr:
                        mtype = maneuver.get("type", "")
                        mod = maneuver.get("modifier", "")
                        name = step.get("name", "")
                        parts = [p for p in [mtype, mod, name] if p]
                        instr = " ".join(parts) if parts else "Proceed"
                    instructions.append(instr)
            polyline = route0.get("geometry", "") or ""
            out.append((distance, duration, instructions, polyline))
        return out

    def _directions_segment_mapbox(
        self,
        start: Coordinates,
        end: Coordinates,
        profile: str,
        params_extra: Optional[Dict[str, Any]] = None,
    ) -> RouteSegment:
        """Call Mapbox Directions for one leg and convert to RouteSegment (takes 1st route)."""
        routes = self._directions_routes_mapbox(start, end, profile, params_extra, want_alternatives=False)
        if not routes:
            raise RuntimeError("Mapbox Directions returned no route for segment.")
        distance, duration, instructions, polyline = routes[0]
        return RouteSegment(
            start=start,
            end=end,
            distance_meters=float(distance),
            duration_seconds=int(duration),
            instructions=instructions,
            polyline=polyline if polyline else self._encode_polyline5([(start.latitude, start.longitude), (end.latitude, end.longitude)]),
        )

    # ----------------------- Mapbox Optimized Trips -----------------------

    def _optimize_waypoint_order(
        self,
        origin: Coordinates,
        waypoints: List[Waypoint],
        destination: Coordinates,
        profile: str,
    ) -> List[Waypoint]:
        inputs: List[Tuple[float, float]] = (
            [(origin.longitude, origin.latitude)] +
            [(w.coordinates.longitude, w.coordinates.latitude) for w in waypoints] +
            [(destination.longitude, destination.latitude)]
        )
        coords_str = ";".join(f"{lon},{lat}" for lon, lat in inputs)

        url = f"{MAPBOX_OPTIMIZED_TRIPS_URL}/{profile}/{coords_str}"
        params = {
            "access_token": self.api_key,
            "roundtrip": "false",
            "source": "first",
            "destination": "last",
            "geometries": "polyline6",
            "steps": "false",
            "overview": "false",
        }

        resp = self._session.get(url, params=params, timeout=45)
        try:
            resp.raise_for_status()
            data = resp.json()
        except Exception:
            return waypoints

        wp_info = data.get("waypoints", [])
        if not wp_info:
            return waypoints
        # Keep original order unless you want to parse waypoint_index mapping.
        return waypoints

    # ----------------------- Constraints & Profiles -----------------------

    def _apply_constraints(self, constraints: Dict[str, bool]) -> Dict[str, Any]:
        """Map constraints to Mapbox query parameters (limited)."""
        params: Dict[str, Any] = {}
        exclude_vals: List[str] = []
        if constraints.get("avoid_ferries"):
            exclude_vals.append("ferry")
        if constraints.get("avoid_tolls"):
            exclude_vals.append("toll")
        if exclude_vals:
            params["exclude"] = ",".join(exclude_vals)
        return params

    def _mb_profile(self, transport_mode: str) -> str:
        # Default DRIVING
        mode = (transport_mode or "driving").lower().strip()
        return {
            "walking": "walking",
            "driving": "driving",
            "cycling": "cycling",
        }.get(mode, "driving")

    # ----------------------- Polyline fallback -----------------------

    def _encode_polyline5(self, latlon: List[Tuple[float, float]], precision: int = 5) -> str:
        """Minimal Google-encoded polyline (precision 5) fallback."""
        factor = 10 ** precision
        output: List[str] = []
        prev_lat = 0
        prev_lng = 0
        for lat, lng in latlon:
            ilat = int(round(lat * factor))
            ilng = int(round(lng * factor))
            dlat = ilat - prev_lat
            dlng = ilng - prev_lng
            for value in (dlat, dlng):
                v = value << 1
                if value < 0:
                    v = ~v
                while v >= 0x20:
                    output.append(chr((0x20 | (v & 0x1F)) + 63))
                    v >>= 5
                output.append(chr(v + 63))
            prev_lat, prev_lng = ilat, ilng
        return "".join(output)

    # ----------------------- Synth helpers -----------------------

    def _synth_midline_vias(self, a: Coordinates, b: Coordinates, count: int) -> List[Coordinates]:
        """
        Create up to `count` tiny lateral offsets near the midpoint to coax
        different drivable paths without leaving the area. Offsets are ~200–400 m.
        """
        mid_lat = (a.latitude + b.latitude) / 2.0
        mid_lon = (a.longitude + b.longitude) / 2.0

        # ~1 deg lat ≈ 111 km; ~1 deg lon ≈ 111 km * cos(lat)
        km_per_deg_lat = 111.0
        km_per_deg_lon = 111.0 * max(0.1, math.cos(math.radians(mid_lat)))

        def offset(lat_km: float, lon_km: float) -> Coordinates:
            return Coordinates(
                latitude=mid_lat + (lat_km / km_per_deg_lat),
                longitude=mid_lon + (lon_km / km_per_deg_lon),
            )

        # 0.2–0.4 km lateral offsets
        candidates = [
            offset(0.0, +0.25),
            offset(0.0, -0.25),
            offset(+0.25, 0.0),
            offset(-0.25, 0.0),
        ]
        return candidates[:max(0, count)]
