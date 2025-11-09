# backend/geocoding/geocoder.py
from __future__ import annotations
from typing import List, Tuple, Dict, Any, Optional
from dataclasses import dataclass
import os
import json
import math
import requests
from shapely.geometry import shape, Polygon, MultiPolygon, Point
from shapely.ops import unary_union

# ---------------- Mapbox endpoints ----------------
MAPBOX_GEOCODE_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places"
MAPBOX_DIRECTIONS_URL = "https://api.mapbox.com/directions/v5/mapbox"
MAPBOX_ISOCHRONE_URL = "https://api.mapbox.com/isochrone/v1/mapbox"

USER_AGENT = "berkeley-detourist/1.0 (berkeley.edu)"

# Hard cap per Mapbox isochrone request. Can override with env:
#   MB_ISO_MAX_MIN=60 (recommended)
ISO_MAX_MINUTES = int(os.getenv("MB_ISO_MAX_MIN", "60"))

# If the API/orchestrator doesn’t pass transport_mode, we enforce driving here too.
FORCE_TRANSPORT_MODE = os.getenv("FORCE_TRANSPORT_MODE", "").strip().lower()

@dataclass
class Coordinates:
    latitude: float
    longitude: float

@dataclass
class Isochrone:
    center: Coordinates
    travel_time_minutes: int
    polygon: List[Coordinates]  # exterior ring (lat, lon)

@dataclass
class SearchZone:
    origin_isochrone: Isochrone
    destination_isochrone: Isochrone
    intersection_polygon: List[Coordinates]  # exterior of union of overlaps

class Geocoder:
    """Geocoding, routing, and isochrone creation (Mapbox)."""

    def __init__(self, api_key: str, user_agent: str = USER_AGENT):
        """
        api_key:      Mapbox access token (store as GEOCODING_API_KEY in .env)
        user_agent:   used for HTTP requests
        """
        self.api_key = api_key
        self._ua = user_agent
        # cache: (lat, lon, minutes, profile) -> shapely Polygon/MultiPolygon
        self._iso_cache: Dict[Tuple[float, float, int, str], Polygon | MultiPolygon] = {}
        self._session = requests.Session()
        self._session.headers.update({"User-Agent": self._ua})

    # ---------------- Geocoding (Mapbox) ----------------
    def geocode_address(self, address: str) -> Coordinates:
        """
        Convert address string to coordinates using Mapbox Geocoding.
        """
        url = f"{MAPBOX_GEOCODE_URL}/{requests.utils.quote(address)}.json"
        params = {
            "access_token": self.api_key,
            "limit": 1,
        }
        r = self._session.get(url, params=params, timeout=20)
        r.raise_for_status()
        data = r.json()
        feats = data.get("features", [])
        if not feats:
            raise ValueError(f"Address not found: {address}")
        # Mapbox center is [lon, lat]
        lon, lat = feats[0]["center"]
        return Coordinates(latitude=float(lat), longitude=float(lon))

    # ---------------- Routing (Mapbox Directions) ----------------
    def _mb_profile(self, transport_mode: str) -> str:
        # Force if configured
        mode = (FORCE_TRANSPORT_MODE or transport_mode or "").lower().strip()
        return {
            "walking": "walking",
            "driving": "driving",
            "cycling": "cycling",
        }.get(mode, "driving")  # <— default DRIVING

    def shortest_travel_time_minutes(
        self, origin: Coordinates, destination: Coordinates, transport_mode: str = "driving"
    ) -> int:
        """
        Shortest travel time (minutes) using Mapbox Directions.
        """
        profile = self._mb_profile(transport_mode)
        coords = f"{origin.longitude},{origin.latitude};{destination.longitude},{destination.latitude}"
        url = f"{MAPBOX_DIRECTIONS_URL}/{profile}/{coords}"
        params = {
            "access_token": self.api_key,
            "alternatives": "false",
            "overview": "false",
            "geometries": "geojson",
        }
        resp = self._session.get(url, params=params, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        routes = data.get("routes", [])
        if not routes:
            raise RuntimeError("Directions API returned no route.")
        seconds = float(routes[0].get("duration", 0.0))
        return max(0, int(round(seconds / 60.0)))

    # ---------------- Isochrones (Mapbox) ----------------
    @staticmethod
    def _cap_minutes(minutes: int) -> int:
        if minutes > ISO_MAX_MINUTES:
            print(f"[Isochrone] requested {minutes} min > cap {ISO_MAX_MINUTES}; clamping.")
            return ISO_MAX_MINUTES
        if minutes < 0:
            return 0
        return minutes

    def create_isochrone(
        self, center: Coordinates, travel_time_minutes: int, transport_mode: str = "driving"
    ) -> Isochrone:
        """
        Exterior ring (largest shell) of a Mapbox Isochrone for a single contour in minutes.
        ALWAYS caps contours_minutes <= ISO_MAX_MINUTES.
        """
        profile = self._mb_profile(transport_mode)
        capped = self._cap_minutes(int(travel_time_minutes))
        key = (round(center.latitude, 6), round(center.longitude, 6), int(capped), profile)

        if key in self._iso_cache:
            geom = self._iso_cache[key]
        else:
            url = f"{MAPBOX_ISOCHRONE_URL}/{profile}/{center.longitude},{center.latitude}"
            params = {
                "access_token": self.api_key,
                "contours_minutes": int(capped),
                "polygons": "true",
            }
            resp = self._session.get(url, params=params, timeout=30)
            resp.raise_for_status()
            gj = resp.json()
            feats = gj.get("features", [])
            if not feats:
                pt = Point(center.longitude, center.latitude)
                geom = pt.buffer(1e-9)
            else:
                geoms = [shape(f["geometry"]) for f in feats]
                geom = unary_union(geoms).buffer(0)
            self._iso_cache[key] = geom

        if isinstance(geom, Polygon):
            exterior = geom.exterior
        else:  # MultiPolygon
            largest = max(geom.geoms, key=lambda g: g.area)
            exterior = largest.exterior

        coords = [Coordinates(latitude=lat, longitude=lon) for lon, lat in exterior.coords]
        return Isochrone(center=center, travel_time_minutes=int(capped), polygon=coords)

    # ---------------- Search zone (grid search over splits) ----------------
    def create_search_zone(
        self,
        origin: Coordinates,
        destination: Coordinates,
        max_additional_time: int,
        transport_mode: str = "driving",
    ) -> SearchZone:
        """
        Build the search zone as the UNION of intersections from isochrone-size pairs
        that sum to: shortest_travel_time + max_additional_time.
        """
        base = self.shortest_travel_time_minutes(origin, destination, transport_mode)
        max_travel_time = base + int(max_additional_time)

        if base > 60:
            combos = self._evenly_spaced_minutes(max_travel_time, max_count=20)
        else:
            combos = list(range(0, max_travel_time + 1, 5))

        overlaps: List[Polygon | MultiPolygon] = []
        repr_origin_min = combos[len(combos) // 2]
        repr_dest_min = max_travel_time - repr_origin_min

        for o_min in combos:
            d_min = max_travel_time - o_min
            o_geom = self._iso_geom(origin, o_min, transport_mode)
            d_geom = self._iso_geom(destination, d_min, transport_mode)
            inter = self._intersect_isochrones(o_geom, d_geom)
            if inter is not None and not inter.is_empty:
                overlaps.append(inter)

        union_geom = self._union_areas(overlaps)

        if union_geom.is_empty:
            intersection_coords: List[Coordinates] = []
        elif isinstance(union_geom, Polygon):
            intersection_coords = [
                Coordinates(latitude=lat, longitude=lon) for lon, lat in union_geom.exterior.coords
            ]
        else:
            largest = max(union_geom.geoms, key=lambda g: g.area)
            intersection_coords = [
                Coordinates(latitude=lat, longitude=lon) for lon, lat in largest.exterior.coords
            ]

        origin_iso = self.create_isochrone(origin, repr_origin_min, transport_mode)
        dest_iso = self.create_isochrone(destination, repr_dest_min, transport_mode)

        return SearchZone(
            origin_isochrone=origin_iso,
            destination_isochrone=dest_iso,
            intersection_polygon=intersection_coords,
        )

    # ---------------- Helpers ----------------
    def _iso_geom(self, center: Coordinates, minutes: int, transport_mode: str):
        """Return shapely geometry for an isochrone; tiny buffer for 0 minutes. (Minutes are capped internally.)"""
        if minutes <= 0:
            return Point(center.longitude, center.latitude).buffer(1e-6)
        iso = self.create_isochrone(center, minutes, transport_mode)
        ring = [(c.longitude, c.latitude) for c in iso.polygon]
        return Polygon(ring).buffer(0)

    def _intersect_isochrones(
        self, geom1: Polygon | MultiPolygon, geom2: Polygon | MultiPolygon
    ) -> Optional[Polygon | MultiPolygon]:
        """Pairwise intersection of two isochrone geometries (cleaned)."""
        inter = geom1.intersection(geom2)
        if inter.is_empty:
            return None
        if inter.geom_type in ("Polygon", "MultiPolygon"):
            return inter.buffer(0)
        return None

    def _union_areas(self, geoms: List[Polygon | MultiPolygon]) -> Polygon | MultiPolygon:
        """Union a list of polygonal areas (safe if empty)."""
        if not geoms:
            return Polygon()
        return unary_union(geoms).buffer(0)

    def _evenly_spaced_minutes(self, max_travel_time: int, max_count: int = 20) -> List[int]:
        """Return <= max_count evenly spaced minute values from 0..max_travel_time (inclusive)."""
        n = max(2, min(max_count, max_travel_time + 1))
        return [int(round(i * (max_travel_time / (n - 1)))) for i in range(n)]
