"""
Verbose tests for Overpass-backed WaypointSearcher contained in a single script.

We intentionally avoid ORS/isochrone API calls by crafting a SearchZone whose
intersection polygon covers Lower Manhattan (rich in OSM POIs). This keeps the
test fast and avoids other service rate limits.

Queries:
  - leisure=park
  - amenity=school
  - tourism=viewpoint
"""

import math
import logging
import sys
from typing import List

import pytest
from shapely.geometry import Polygon, Point

# Project imports (adjusted path)
from backend.waypoints.waypoint_searcher import WaypointSearcher, Waypoint
from backend.geocoding.geocoder import Coordinates, Isochrone, SearchZone

# ----- Logging -----
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("test_waypoint_searcher")


def _lower_manhattan_zone() -> SearchZone:
    """
    Construct a SearchZone whose intersection polygon is a rectangle roughly covering
    Lower Manhattan (Battery Park -> City Hall / Lower East Side bounds).

    (lon,lat) guide for rectangle corners:
       NW: (-74.020, 40.730)
       NE: (-73.990, 40.730)
       SE: (-73.990, 40.700)
       SW: (-74.020, 40.700)
    """
    ring = [
        Coordinates(latitude=40.7300, longitude=-74.0200),
        Coordinates(latitude=40.7300, longitude=-73.9900),
        Coordinates(latitude=40.7000, longitude=-73.9900),
        Coordinates(latitude=40.7000, longitude=-74.0200),
        Coordinates(latitude=40.7300, longitude=-74.0200),  # close ring
    ]

    origin = Coordinates(latitude=40.7128, longitude=-74.0060)  # near City Hall
    dest   = Coordinates(latitude=40.7033, longitude=-74.0170)  # near Battery Park

    # Minimal Isochrone shells (not used by Overpass, but required by dataclass)
    o_iso = Isochrone(center=origin, travel_time_minutes=10, polygon=[origin, dest, origin])
    d_iso = Isochrone(center=dest,   travel_time_minutes=10, polygon=[dest, origin, dest])

    return SearchZone(
        origin_isochrone=o_iso,
        destination_isochrone=d_iso,
        intersection_polygon=ring,
    )


def test_search_waypoints_lower_manhattan_verbose():
    """
    Integration-like test hitting Overpass API with a fixed polygon.
    Validates:
      - We get non-empty results for rich tags
      - Every waypoint is inside the polygon
      - Scores are in [0, 1] and sorting is descending
    """
    zone = _lower_manhattan_zone()
    searcher = WaypointSearcher()  # UA set internally to berkeley-detourist/1.0

    queries: List[str] = ["leisure=park", "amenity=school", "tourism=viewpoint"]
    log.info("Using queries: %s", queries)

    # Run search
    waypoints = searcher.search_waypoints(zone, waypoint_queries=queries)

    log.info("Total waypoints returned: %d", len(waypoints))
    # Show top 10 for debugging
    for i, w in enumerate(waypoints[:10], start=1):
        log.info(
            "[%02d] %.3f  %-30s  %-18s  (%.6f, %.6f)",
            i,
            w.relevance_score,
            (w.name or "<unnamed>")[:30],
            w.category,
            w.coordinates.latitude,
            w.coordinates.longitude,
        )

    # Basic sanity
    assert isinstance(waypoints, list)
    # Expect at least *some* POIs in Lower Manhattan for these tags
    assert len(waypoints) > 0, "Expected some POIs for park/school/viewpoint in Lower Manhattan."

    # Build polygon for containment checks
    poly = Polygon([(c.longitude, c.latitude) for c in zone.intersection_polygon])
    assert poly.is_valid and not poly.is_empty

    # Validate each result
    prev_score = float("inf")
    for w in waypoints:
        # Scores in [0, 1]
        assert 0.0 <= w.relevance_score <= 1.0, f"Score out of range for {w.name}: {w.relevance_score}"
        # Sorted descending
        assert w.relevance_score <= prev_score + 1e-9, "Waypoints not sorted by descending relevance."
        prev_score = w.relevance_score

        # Inside polygon
        pt = Point(w.coordinates.longitude, w.coordinates.latitude)
        assert poly.contains(pt) or poly.touches(pt), f"Waypoint outside zone: {w.name} @ {w.coordinates}"

        # Category present
        assert isinstance(w.category, str) and len(w.category) > 0

    # Spot-check that we see a mix of categories among top results
    top_cats = {w.category.split("=")[0] if "=" in w.category else w.category for w in waypoints[:10]}
    log.info("Top categories observed among first 10: %s", sorted(top_cats))
    assert any(k in top_cats for k in ("leisure", "amenity", "tourism")), "Unexpected categories in top results."


def test_single_query_behaviour_and_deduplication():
    """
    Focused test on one tag to ensure stable behavior and deduplication.
    """
    zone = _lower_manhattan_zone()
    searcher = WaypointSearcher()

    query = ["leisure=park"]
    res = searcher.search_waypoints(zone, query)

    log.info("Parks returned: %d", len(res))
    assert len(res) > 0

    # Ensure unique (name, lat, lon) among the first N
    seen = set()
    for w in res[:50]:
        key = (w.name, round(w.coordinates.latitude, 6), round(w.coordinates.longitude, 6))
        assert key not in seen, f"Duplicate waypoint encountered: {key}"
        seen.add(key)


if __name__ == "__main__":
    import sys
    sys.exit(pytest.main([__file__, "-vv", "-s"]))
