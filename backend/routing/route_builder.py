"""
Route building module for creating routes through waypoints.

This module handles:
1. Building routes from origin -> waypoint(s) -> destination
2. Applying routing constraints (avoid tolls, stairs, etc.)
3. Optimizing route parameters (multi-waypoint order via Mapbox Optimized Trips)
"""

from typing import List, Dict, Any, Tuple, Optional
from dataclasses import dataclass
import json
import time
import requests

from backend.geocoding.geocoder import Coordinates
from backend.waypoints.waypoint_searcher import Waypoint


# ---------------- Mapbox endpoints ----------------
MAPBOX_DIRECTIONS_URL = "https://api.mapbox.com/directions/v5/mapbox"
MAPBOX_OPTIMIZED_TRIPS_URL = "https://api.mapbox.com/optimized-trips/v1/mapbox"
USER_AGENT = "berkeley-detourist/1.0 (berkeley.edu)"


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

    # ----------------------- Public API -----------------------

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
          - Sort waypoints by relevance (desc)
          - Generate:
              * 5 single-waypoint routes via the top 5 waypoints
              * 5 multi-waypoint routes via top K waypoints (K = 2..6), with
                the waypoint order optimized via Mapbox Optimized Trips.
          - Per route, call Mapbox Directions for each adjacent pair to build segments.

        Args:
            origin: Starting point coordinates
            destination: Ending point coordinates
            waypoints: Candidate waypoints to consider (with relevance_score and input_query)
            constraints: Routing constraints; keys may include:
                - transport_mode: 'driving'|'walking'|'cycling' (default 'driving')
                - extra_delay_seconds: float (sleep after each built route)
              (Note: Mapbox HTTP API supports limited "avoid" options directly; see _apply_constraints.)

        Returns:
            List of Route objects, sorted by total duration (ascending).
        """
        routes: List[Route] = []
        if not waypoints:
            return routes

        # Sort by relevance_score desc (higher is better)
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
        for k in range(2, 7):  # 2,3,4,5,6
            if n >= k:
                top_k = ordered[:k]
                route = self._build_multi_route(origin, destination, top_k, constraints, optimize_order=True)
                routes.append(route)
                if extra_delay > 0:
                    time.sleep(extra_delay)

        # Sort by total duration ascending
        routes.sort(key=lambda r: r.total_duration_seconds)
        return routes

    def build_single_route(
        self,
        origin: Coordinates,
        destination: Coordinates,
        waypoints: List[Waypoint],
        constraints: Dict[str, bool],
        optimize_order: bool = True,
    ) -> Route:
        """
        Build a single route using ALL provided waypoints.
        
        This is useful for ground truth routes where you want a definitive route
        that uses all waypoints, rather than selecting from multiple candidates.
        
        Args:
            origin: Starting point coordinates
            destination: Ending point coordinates
            waypoints: All waypoints to include in the route
            constraints: Routing constraints
            optimize_order: Whether to optimize waypoint order for efficiency (default: True)
            
        Returns:
            A single Route object using all provided waypoints
        """
        return self._build_multi_route(origin, destination, waypoints, constraints, optimize_order)

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
        If optimize_order=True and there are >= 2 waypoints, we use Mapbox Optimized Trips
        to find the most time-efficient sequence between the fixed origin and destination.
        """
        profile = self._mb_profile(constraints.get("transport_mode", "driving"))  # type: ignore
        directions_params = self._apply_constraints(constraints)  # currently minimal, see note inside
        # Produce the sequence of waypoint indices to traverse
        ordered_waypoints = (
            self._optimize_waypoint_order(origin, waypoints, destination, profile) if optimize_order and len(waypoints) >= 2
            else waypoints
        )

        # Build segments origin -> wp1 -> ... -> wpN -> destination using Directions
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

    def _directions_segment_mapbox(
        self,
        start: Coordinates,
        end: Coordinates,
        profile: str,
        params_extra: Optional[Dict[str, Any]] = None,
    ) -> RouteSegment:
        """
        Call Mapbox Directions for one leg and convert to RouteSegment.
        We request geometries=polyline6 and steps=true.
        """
        coords = f"{start.longitude},{start.latitude};{end.longitude},{end.latitude}"
        url = f"{MAPBOX_DIRECTIONS_URL}/{profile}/{coords}"
        params = {
            "access_token": self.api_key,
            "alternatives": "false",
            "overview": "false",      # per-segment geometry from the leg; we rely on polyline6 at route level if needed
            "geometries": "polyline6",
            "steps": "true",
        }
        if params_extra:
            params.update(params_extra)

        resp = self._session.get(url, params=params, timeout=45)
        resp.raise_for_status()
        data = resp.json()

        routes = data.get("routes", [])
        if not routes:
            raise RuntimeError("Mapbox Directions returned no route for segment.")

        route0 = routes[0]
        distance = float(route0.get("distance", 0.0))
        duration = int(round(float(route0.get("duration", 0.0))))

        # Collect readable instructions from legs/steps
        instructions: List[str] = []
        for leg in route0.get("legs", []):
            for step in leg.get("steps", []):
                maneuver = step.get("maneuver", {}) or {}
                # Mapbox doesn't always provide a ready-made instruction string; synthesize a readable line
                # Prefer `instruction` if present; otherwise build from type/modifier and step name
                instr = maneuver.get("instruction")
                if not instr:
                    mtype = maneuver.get("type", "")
                    mod = maneuver.get("modifier", "")
                    name = step.get("name", "")
                    parts = [p for p in [mtype, mod, name] if p]
                    instr = " ".join(parts) if parts else "Proceed"
                instructions.append(instr)

        # Geometry: if "overview":"false", segment-level polyline can be embedded in legs->steps,
        # but to ensure a non-empty polyline, request "overview=full" and take route geometry if available.
        # However, overview=false is fine; Mapbox still returns overall route geometry string at top level.
        polyline = route0.get("geometry", "")
        if not polyline:
            # Fallback: synthesize tiny 2-point polyline (not ideal, but ensures contract)
            polyline = self._encode_polyline5([(start.latitude, start.longitude), (end.latitude, end.longitude)])

        return RouteSegment(
            start=start,
            end=end,
            distance_meters=distance,
            duration_seconds=duration,
            instructions=instructions,
            polyline=polyline,
        )

    # ----------------------- Mapbox Optimized Trips -----------------------

    def _optimize_waypoint_order(
        self,
        origin: Coordinates,
        waypoints: List[Waypoint],
        destination: Coordinates,
        profile: str,
    ) -> List[Waypoint]:
        """
        Use Mapbox Optimized Trips to compute an efficient order of the given waypoints
        while fixing the start at `origin` and end at `destination`.

        We request `roundtrip=false`, `source=first`, `destination=last`.
        Then, we reconstruct the in-between waypoint order by sorting the in-between
        inputs according to their returned `waypoint_index` in the optimized trip.
        """
        # Build coordinate list: origin + waypoints + destination
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
            "steps": "false",  # we only need order here; per-leg details come from Directions calls
            "overview": "false",
        }

        resp = self._session.get(url, params=params, timeout=45)
        # If optimizer errors (e.g., too close/identical points), fall back to given order
        try:
            resp.raise_for_status()
            data = resp.json()
        except Exception:
            return waypoints

        # The response contains a 'waypoints' array with 'waypoint_index' indicating
        # the position of each input coordinate in the optimized trip order.
        waypoints_info = data.get("waypoints", [])
        if not waypoints_info:
            return waypoints

        # Build mapping from input index -> trip order index
        # Input index mapping:
        #   0                       -> origin
        #   1..len(waypoints)       -> our waypoints
        #   len(waypoints)+1        -> destination
        order_by_trip_index: List[Tuple[int, int]] = []
        for wp in waypoints_info:
            input_idx = wp.get("waypoint_index_input") or wp.get("waypoint_index")  # compatibility
            # Mapbox's field name is 'waypoint_index' (position in input) and 'trips_index' or 'waypoint_index' representing order.
            # Different SDKs expose slightly different keys; robustly infer both:
            trip_pos = wp.get("trips_index")
            if trip_pos is None:
                trip_pos = wp.get("waypoint_index")  # sometimes this is used for order; if so input index is in 'original_index' or 'waypoint_index'
            original = wp.get("original_index")
            if isinstance(original, int):
                input_idx = original

            if input_idx is None or trip_pos is None:
                # Fall back logic later
                continue
            order_by_trip_index.append((int(input_idx), int(trip_pos)))

        if not order_by_trip_index:
            # Fallback: use given order
            return waypoints

        # Keep only the in-between waypoints (exclude origin=0 and destination=len(waypoints)+1)
        last_input_idx = len(waypoints) + 1
        inner = [(inp_idx, trip_pos) for (inp_idx, trip_pos) in order_by_trip_index
                 if 1 <= inp_idx <= len(waypoints)]
        if not inner:
            return waypoints

        # Sort by the trip order
        inner_sorted = sorted(inner, key=lambda t: t[1])
        optimized = [waypoints[inp_idx - 1] for (inp_idx, _trip_pos) in inner_sorted]
        return optimized

    # ----------------------- Constraints & Profiles -----------------------

    def _apply_constraints(self, constraints: Dict[str, bool]) -> Dict[str, Any]:
        """
        Map constraints to Mapbox query parameters.
        Note: Mapbox HTTP Directions supports limited "avoid" options compared to ORS.
        Common knobs:
          - 'approaches' for curb-side, 'exclude' for toll/ferry (where available by profile/region).
        Here we conservatively pass through only supported, widely available params.

        If you need stronger avoidance (e.g., tolls/ferries), consider adding
        'exclude=toll' / 'exclude=ferry' when compatible with your profile/region.
        """
        params: Dict[str, Any] = {}
        # Example: basic excludes if requested (may not be universally supported)
        exclude_vals: List[str] = []
        if constraints.get("avoid_ferries"):
            exclude_vals.append("ferry")
        if constraints.get("avoid_tolls"):
            exclude_vals.append("toll")
        if exclude_vals:
            params["exclude"] = ",".join(exclude_vals)

        # No direct 'avoid_stairs' in Mapbox; choosing walking profile typically steers clear,
        # but you may post-filter or bias using custom data/snap-to-ways if needed.
        return params

    def _mb_profile(self, transport_mode: str) -> str:
        # Mapbox profiles: driving | walking | cycling
        return {
            "walking": "walking",
            "driving": "driving",
            "cycling": "cycling",
        }.get(transport_mode, "driving")

    # ----------------------- Polyline fallback -----------------------

    def _encode_polyline5(self, latlon: List[Tuple[float, float]], precision: int = 5) -> str:
        """
        Minimal Google-encoded polyline (precision 5). Used only as a fallback
        when Mapbox doesn't return a geometry string (rare).
        """
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
