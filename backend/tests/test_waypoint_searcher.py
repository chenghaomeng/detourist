# scripts/test_waypoint_searcher.py
"""
Verbose tests for Overpass-backed WaypointSearcher (tag+name relevance only).

We avoid ORS/isochrone API calls by crafting a SearchZone whose
intersection polygon covers Lower Manhattan (rich in OSM POIs). This keeps tests
fast and avoids other service rate limits.

Example queries (as requested): viewpoints, waterfront, parks
Encoded for Overpass:
  - viewpoints -> tourism=viewpoint
  - waterfront -> natural=water
  - parks      -> leisure=park

Run directly:
    python scripts/test_waypoint_searcher.py

Or with pytest (equivalent):
    pytest -vv -s scripts/test_waypoint_searcher.py
"""

import sys
import logging
from typing import List

import pytest
from shapely.geometry import Polygon, Point

from backend.waypoints.waypoint_searcher import WaypointSearcher, Waypoint
from backend.geocoding.geocoder import Coordinates, Isochrone, SearchZone

# ----- Logging -----
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("test_waypoint_searcher")

# ----- Helpers to build a fixed SearchZone -----
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

# ----- Tests -----

@pytest.mark.timeout(300)
def test_search_waypoints_lower_manhattan_verbose_and_scores():
    """
    Integration-like test hitting Overpass API with a fixed polygon.
    Validates:
      - Non-empty results for rich tags
      - Every waypoint is inside the polygon
      - Relevance scores are in [0, 10] and sorting is descending
      - Final list of waypoints and scores are printed for inspection
    """
    zone = _lower_manhattan_zone()
    searcher = WaypointSearcher()  # Uses Overpass; no API key required

    # Example queries requested: viewpoints, waterfront, parks
    # Encoded to OSM filters for Overpass:
    queries: List[str] = ["tourism=viewpoint", "natural=water", "leisure=park"]
    log.info("Using queries (viewpoints, waterfront, parks): %s", queries)

    waypoints = searcher.search_waypoints(zone, waypoint_queries=queries)

    log.info("Total waypoints returned: %d", len(waypoints))
    # Display ALL waypoints (name, category, coords, score)
    for i, w in enumerate(waypoints, start=1):
        tags_str = str(w.metadata.get("tags", {}))
        log.info(
            "[%03d] score=%5.2f  name=%-40s  category=%-20s  (%.6f, %.6f)  tags=%s%s",
            i,
            w.relevance_score,
            (w.name or "<unnamed>")[:40],
            w.category,
            w.coordinates.latitude,
            w.coordinates.longitude,
            tags_str[:120],
            "…" if len(tags_str) > 120 else "",
        )

    # Basic sanity
    assert isinstance(waypoints, list)
    assert len(waypoints) > 0, "Expected some POIs for viewpoint/water/park in Lower Manhattan."

    # Build polygon for containment checks
    poly = Polygon([(c.longitude, c.latitude) for c in zone.intersection_polygon])
    assert poly.is_valid and not poly.is_empty

    # Validate each result
    prev_score = float("inf")
    for w in waypoints:
        # Scores in [0, 10]
        assert 0.0 <= w.relevance_score <= 10.0, f"Score out of range for {w.name}: {w.relevance_score}"
        # Sorted descending
        assert w.relevance_score <= prev_score + 1e-9, "Waypoints not sorted by descending relevance."
        prev_score = w.relevance_score

        # Inside polygon
        pt = Point(w.coordinates.longitude, w.coordinates.latitude)
        assert poly.contains(pt) or poly.touches(pt), f"Waypoint outside zone: {w.name} @ {w.coordinates}"

        # Category present
        assert isinstance(w.category, str) and len(w.category) > 0

    # Spot-check that we see expected top-level keys among top categories
    top_cats = {w.category.split("=")[0] if "=" in w.category else w.category for w in waypoints[:15]}
    log.info("Top categories observed among first 15: %s", sorted(top_cats))
    assert any(k in top_cats for k in ("tourism", "natural", "leisure")), "Unexpected categories in top results."


@pytest.mark.timeout(300)
def test_single_query_dedup_and_pretty_print():
    """
    Focused test on one tag to ensure stable behavior and deduplication.
    Prints the top 20 waypoints with full dataclass repr + score.
    """
    zone = _lower_manhattan_zone()
    searcher = WaypointSearcher()

    # Use 'parks' example specifically
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

    # Pretty print top 20 with full repr and numeric score
    log.info("Top 20 parks (full objects):")
    for i, w in enumerate(res[:20], start=1):
        log.info("[%02d] score=%5.2f  %r", i, w.relevance_score, w)


if __name__ == "__main__":
    # Allow running directly:
    # - python scripts/test_waypoint_searcher.py
    # Or via pytest:
    # - pytest -vv -s scripts/test_waypoint_searcher.py
    sys.exit(pytest.main([__file__, "-vv", "-s"]))
