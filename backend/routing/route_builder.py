"""
Route building module for creating routes through waypoints.

This module handles:
1. Building routes from origin -> waypoint -> destination
2. Applying routing constraints (avoid tolls, stairs, etc.)
3. Optimizing route parameters
"""

from typing import List, Dict, Any, Tuple
from dataclasses import dataclass
import json
import math
import time
import requests

from backend.geocoding.geocoder import Coordinates
from backend.waypoints.waypoint_searcher import Waypoint


# Use the GeoJSON endpoint; simpler & stable
ORS_DIRECTIONS_URL = "https://api.openrouteservice.org/v2/directions"
USER_AGENT = "berkeley-detourist/1.0 (berkeley.edu)"


@dataclass
class RouteSegment:
    """A segment of a route between two points."""
    start: Coordinates
    end: Coordinates
    distance_meters: float
    duration_seconds: int
    instructions: List[str]
    polyline: str  # encoded polyline (we encode from GeoJSON geometry)


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


class RouteBuilder:
    """Builds routes through waypoints with constraints."""

    def __init__(self, api_key: str):
        """Initialize with routing API key."""
        self.api_key = api_key
        self._session = requests.Session()
        self._session.headers.update({
            "User-Agent": USER_AGENT,
            "Authorization": self.api_key,
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

        Args:
            origin: Starting point coordinates
            destination: Ending point coordinates
            waypoints: List of waypoints to include (each route uses exactly one waypoint)
            constraints: Routing constraints; keys may include:
                - transport_mode: 'driving'|'walking'|'cycling' (default 'driving')
                - avoid_tolls, avoid_ferries, avoid_stairs, avoid_highways,
                  avoid_tunnels, avoid_unpaved, avoid_fords (bool)
                - extra_delay_seconds: float (sleep after each built route)

        Returns:
            List of Route objects (one per waypoint), sorted by total duration.
        """
        routes: List[Route] = []

        extra_delay = float(constraints.get("extra_delay_seconds", 0.0))

        for w in waypoints:
            route = self._build_single_route(origin, w, destination, constraints)
            routes.append(route)
            if extra_delay > 0:
                time.sleep(extra_delay)

        routes.sort(key=lambda r: r.total_duration_seconds)
        return routes

    # ----------------------- Internals -----------------------

    def _build_single_route(
        self,
        origin: Coordinates,
        waypoint: Waypoint,
        destination: Coordinates,
        constraints: Dict[str, bool],
    ) -> Route:
        """Build a single route through one waypoint using ORS directions."""
        profile = self._ors_profile(constraints.get("transport_mode", "driving")) # type: ignore
        options = self._apply_constraints(constraints)  # {"options": {...}} or {}

        seg1 = self._directions_segment(origin, waypoint.coordinates, profile, options)
        seg2 = self._directions_segment(waypoint.coordinates, destination, profile, options)

        segments = [seg1, seg2]
        total_distance = sum(s.distance_meters for s in segments)
        total_duration = sum(s.duration_seconds for s in segments)

        return Route(
            origin=origin,
            destination=destination,
            waypoints=[waypoint],
            segments=segments,
            total_distance_meters=total_distance,
            total_duration_seconds=total_duration,
            constraints_applied={k: bool(v) for k, v in constraints.items()},
        )

    def _directions_segment(
        self,
        start: Coordinates,
        end: Coordinates,
        profile: str,
        options: Dict[str, Any],
    ) -> RouteSegment:
        """
        Call ORS directions (GeoJSON) for one leg and convert to RouteSegment.
        We keep the payload minimal to avoid 400s.
        """
        url = f"{ORS_DIRECTIONS_URL}/{profile}/geojson"
        payload: Dict[str, Any] = {
            "coordinates": [
                [start.longitude, start.latitude],
                [end.longitude, end.latitude],
            ],
            "instructions": True,  # return turn-by-turn
        }
        if options:
            payload.update(options)

        resp = self._session.post(url, data=json.dumps(payload), timeout=45)
        resp.raise_for_status()
        data = resp.json()

        features = data.get("features", [])
        if not features:
            raise RuntimeError("ORS returned no route for segment.")

        feat0 = features[0]
        props = feat0.get("properties", {})
        summary = props.get("summary", {})
        distance = float(summary.get("distance", 0.0))
        duration = int(round(float(summary.get("duration", 0.0))))

        # Collect readable instructions
        instr_list: List[str] = []
        for seg in props.get("segments", []):
            for step in seg.get("steps", []):
                text = step.get("instruction")
                if text:
                    instr_list.append(text)

        # Encode polyline from LineString geometry (lon, lat)
        geom = feat0.get("geometry", {})
        coords = geom.get("coordinates", [])  # list[[lon,lat], ...]
        polyline = _encode_polyline([(lat, lon) for lon, lat in coords]) if coords else ""

        return RouteSegment(
            start=start,
            end=end,
            distance_meters=distance,
            duration_seconds=duration,
            instructions=instr_list,
            polyline=polyline,
        )

    def _apply_constraints(self, constraints: Dict[str, bool]) -> Dict[str, Any]:
        """
        Map constraints to ORS parameters.
        Supported booleans -> ORS 'avoid_features':
          avoid_tolls       -> "tollways"
          avoid_ferries     -> "ferries"
          avoid_stairs      -> "steps"
          avoid_highways    -> "highways"
          avoid_tunnels     -> "tunnels"
          avoid_unpaved     -> "unpavedroads"
          avoid_fords       -> "fords"
        """
        avoid_map = {
            "avoid_tolls": "tollways",
            "avoid_ferries": "ferries",
            "avoid_stairs": "steps",
            "avoid_highways": "highways",
            "avoid_tunnels": "tunnels",
            "avoid_unpaved": "unpavedroads",
            "avoid_fords": "fords",
        }
        avoid_features = [v for k, v in avoid_map.items() if constraints.get(k)]
        return {"options": {"avoid_features": avoid_features}} if avoid_features else {}

    # ----------------------- Utilities -----------------------

    def _ors_profile(self, transport_mode: str) -> str:
        return {
            "walking": "foot-walking",
            "driving": "driving-car",
            "cycling": "cycling-regular",
        }.get(transport_mode, "driving-car")


# --- Minimal Google-encoded polyline (precision 5) ---
def _encode_polyline(latlon: List[Tuple[float, float]], precision: int = 5) -> str:
    """
    Encode a sequence of (lat, lon) into a Google-encoded polyline (precision 5).
    Input expects [(lat, lon), ...].
    """
    factor = 10 ** precision
    output = []

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
