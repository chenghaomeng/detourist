from typing import List, Tuple, Dict, Any, Optional
from dataclasses import dataclass
import json
import time
import math
import requests
from shapely.geometry import shape, Polygon, MultiPolygon, Point
from shapely.ops import unary_union

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
ORS_ISOCHRONE_URL = "https://api.openrouteservice.org/v2/isochrones"
ORS_DIRECTIONS_URL = "https://api.openrouteservice.org/v2/directions"


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
    """Geocoding, routing, and isochrone creation (OSM-based)."""

    def __init__(self, api_key: str, user_agent: str = "berkeley-detourist/1.0 (berkeley.edu)"):
        """
        api_key:      openrouteservice API key (free tier OK)
        user_agent:   required descriptive UA for Nominatim
        """
        self.api_key = api_key
        self._ua = user_agent
        self._iso_cache: Dict[Tuple[float, float, int, str], Polygon | MultiPolygon] = {}

    # ---------------- Geocoding (Nominatim) ----------------
    def geocode_address(self, address: str) -> Coordinates:
        params = {"q": address, "format": "jsonv2", "limit": 1}
        headers = {"User-Agent": self._ua}
        r = requests.get(NOMINATIM_URL, params=params, headers=headers, timeout=15)
        r.raise_for_status()
        data = r.json()
        if not data:
            raise ValueError(f"Address not found: {address}")
        time.sleep(1)
        return Coordinates(latitude=float(data[0]["lat"]), longitude=float(data[0]["lon"]))

    # ---------------- Routing (ORS Directions) ----------------
    def _ors_profile(self, transport_mode: str) -> str:
        return {
            "walking": "foot-walking",
            "driving": "driving-car",
            "cycling": "cycling-regular",
        }.get(transport_mode, "foot-walking")

    def shortest_travel_time_minutes(
        self, origin: Coordinates, destination: Coordinates, transport_mode: str = "walking"
    ) -> int:
        """Shortest travel time (minutes) using ORS directions."""
        profile = self._ors_profile(transport_mode)
        url = f"{ORS_DIRECTIONS_URL}/{profile}/geojson"
        headers = {"Authorization": self.api_key, "Content-Type": "application/json"}
        payload = {
            "coordinates": [
                [origin.longitude, origin.latitude],
                [destination.longitude, destination.latitude],
            ],
            "instructions": False,
        }
        resp = requests.post(url, headers=headers, data=json.dumps(payload), timeout=30)
        resp.raise_for_status()
        gj = resp.json()
        if not gj.get("features"):
            raise RuntimeError("Directions API returned no route.")
        seconds = gj["features"][0]["properties"]["summary"]["duration"]
        return max(0, int(round(seconds / 60.0)))

    # ---------------- Isochrones (ORS) ----------------
    def create_isochrone(
        self, center: Coordinates, travel_time_minutes: int, transport_mode: str = "walking"
    ) -> Isochrone:
        """Exterior ring (largest shell) of an ORS isochrone."""
        profile = self._ors_profile(transport_mode)
        key = (round(center.latitude, 6), round(center.longitude, 6), int(travel_time_minutes), profile)

        if key in self._iso_cache:
            geom = self._iso_cache[key]
        else:
            url = f"{ORS_ISOCHRONE_URL}/{profile}"
            headers = {"Authorization": self.api_key, "Content-Type": "application/json"}
            payload = {
                "locations": [[center.longitude, center.latitude]],
                "range": [max(0, int(travel_time_minutes) * 60)],
                "range_type": "time",
            }
            resp = requests.post(url, headers=headers, data=json.dumps(payload), timeout=30)
            resp.raise_for_status()
            gj = resp.json()
            feats = gj.get("features", [])
            if not feats:
                raise RuntimeError("Isochrone generation returned no features.")
            geom = unary_union([shape(f["geometry"]) for f in feats]).buffer(0)
            self._iso_cache[key] = geom

        if isinstance(geom, Polygon):
            exterior = geom.exterior
        else:  # MultiPolygon
            largest = max(geom.geoms, key=lambda g: g.area)
            exterior = largest.exterior

        coords = [Coordinates(latitude=lat, longitude=lon) for lon, lat in exterior.coords]
        return Isochrone(center=center, travel_time_minutes=int(travel_time_minutes), polygon=coords)

    # ---------------- Search zone (grid search over splits) ----------------
    def create_search_zone(
        self,
        origin: Coordinates,
        destination: Coordinates,
        max_additional_time: int,
        transport_mode: str = "walking",
    ) -> SearchZone:
        """
        Build the search zone as the UNION of intersections from isochrone-size pairs
        that sum to: shortest_travel_time + max_additional_time.
        - Use 5-minute increments normally.
        - If base shortest time > 60 minutes, cap to 20 combos (even spacing).
        """
        base = self.shortest_travel_time_minutes(origin, destination, transport_mode)
        max_travel_time = base + int(max_additional_time)

        # choose combo schedule
        if base > 60:
            combos = self._evenly_spaced_minutes(max_travel_time, max_count=20)
        else:
            combos = list(range(0, max_travel_time + 1, 5))

        # collect overlaps (as shapely geoms)
        overlaps: List[Polygon | MultiPolygon] = []
        # keep one representative pair to return in dataclass
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

        # convert union to exterior ring for dataclass
        if union_geom.is_empty:
            intersection_coords: List[Coordinates] = []
        elif isinstance(union_geom, Polygon):
            intersection_coords = [Coordinates(latitude=lat, longitude=lon) for lon, lat in union_geom.exterior.coords]
        else:
            largest = max(union_geom.geoms, key=lambda g: g.area)
            intersection_coords = [Coordinates(latitude=lat, longitude=lon) for lon, lat in largest.exterior.coords]

        origin_iso = self.create_isochrone(origin, repr_origin_min, transport_mode)
        dest_iso = self.create_isochrone(destination, repr_dest_min, transport_mode)

        return SearchZone(
            origin_isochrone=origin_iso,
            destination_isochrone=dest_iso,
            intersection_polygon=intersection_coords,
        )

    # ---------------- Helpers ----------------
    def _iso_geom(self, center: Coordinates, minutes: int, transport_mode: str):
        """Return shapely geometry for an isochrone; tiny buffer for 0 minutes."""
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