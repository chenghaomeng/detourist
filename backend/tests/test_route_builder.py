# scripts/test_route_builder.py
"""
Verbose tests for Mapbox-backed RouteBuilder with optimized multi-waypoint routes.

Generates:
  - 5 single-waypoint routes via the top 5 waypoints (by relevance_score)
  - 5 multi-waypoint routes via the top K waypoints (K = 2..6), with waypoint order
    optimized using Mapbox Optimized Trips (source=first, destination=last).

Environment:
  export GEOCODING_API_KEY=pk.your_mapbox_token

Run:
  python scripts/test_route_builder.py
  # or
  pytest -vv -s scripts/test_route_builder.py
"""

import os
import sys
import logging
from typing import Dict, List

import pytest

from backend.routing.route_builder import RouteBuilder
from backend.geocoding.geocoder import Coordinates
from backend.waypoints.waypoint_searcher import Waypoint

# ---------- Logging ----------
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("test_route_builder")

# ---------- Helpers ----------

def _require_mapbox_key() -> str:
    key = os.getenv("GEOCODING_API_KEY")
    if not key:
        pytest.skip("Skipping Mapbox-dependent tests: GEOCODING_API_KEY not set.")
    return key


def _sample_origin_destination() -> tuple[Coordinates, Coordinates]:
    # Origin: Times Square; Destination: Jersey City waterfront (near Exchange Place)
    origin = Coordinates(latitude=40.7580, longitude=-73.9855)
    destination = Coordinates(latitude=40.7178, longitude=-74.0431)
    return origin, destination


def _sample_waypoints() -> List[Waypoint]:
    """
    Six realistic POIs between Midtown and Lower Manhattan / near waterfront.
    Relevance scores descend so the top K sets are deterministic.
    """
    return [
        Waypoint(  # 1
            name="Bryant Park",
            coordinates=Coordinates(latitude=40.7536, longitude=-73.9832),
            category="leisure=park",
            relevance_score=10.0,
            metadata={"note": "Midtown green space"},
            input_query="leisure=park",
        ),
        Waypoint(  # 2
            name="The High Line (14th St)",
            coordinates=Coordinates(latitude=40.7410, longitude=-74.0087),
            category="tourism=viewpoint",
            relevance_score=9.5,
            metadata={"note": "Elevated park & viewpoints"},
            input_query="tourism=viewpoint",
        ),
        Waypoint(  # 3
            name="Washington Square Park",
            coordinates=Coordinates(latitude=40.730823, longitude=-73.997332),
            category="leisure=park",
            relevance_score=9.0,
            metadata={"note": "Greenwich Village"},
            input_query="leisure=park",
        ),
        Waypoint(  # 4
            name="Hudson River Park (Pier 25)",
            coordinates=Coordinates(latitude=40.7206, longitude=-74.0125),
            category="natural=water",
            relevance_score=8.5,
            metadata={"note": "Waterfront / piers"},
            input_query="natural=water",
        ),
        Waypoint(  # 5
            name="One World Trade Center Plaza",
            coordinates=Coordinates(latitude=40.7127, longitude=-74.0134),
            category="tourism=viewpoint",
            relevance_score=8.0,
            metadata={"note": "Downtown viewpoint"},
            input_query="tourism=viewpoint",
        ),
        Waypoint(  # 6
            name="Battery Park",
            coordinates=Coordinates(latitude=40.7033, longitude=-74.0170),
            category="leisure=park",
            relevance_score=7.5,
            metadata={"note": "Southern tip park"},
            input_query="leisure=park",
        ),
    ]


def _summarize_routes(routes):
    log.info("------ SUMMARY OF GENERATED ROUTES (%d) ------", len(routes))
    for i, r in enumerate(routes, start=1):
        wp_names = " -> ".join([w.name for w in r.waypoints]) if r.waypoints else "(none)"
        kind = "multi" if len(r.waypoints) > 1 else "single"
        mins = round(r.total_duration_seconds / 60.0, 1)
        km = round(r.total_distance_meters / 1000.0, 2)
        log.info(
            "[%02d] %-6s | %d wp | %6.2f km | %6.1f min | order: %s",
            i, kind, len(r.waypoints), km, mins, wp_names
        )
        log.info("      queries: %s", r.input_queries)


# ---------- Tests ----------

@pytest.mark.timeout(900)
def test_build_10_routes_verbose_summary_and_integrity():
    """
    Full, verbose test:
      - Constructs 6 candidate waypoints with input_query populated
      - Requests 10 routes from the builder (5 single + 5 multi optimized)
      - Prints a route summary and inspects each route/segment for basic integrity
    """
    api_key = _require_mapbox_key()
    rb = RouteBuilder(api_key=api_key)

    origin, destination = _sample_origin_destination()
    waypoints = _sample_waypoints()

    # Prefer driving for speed; optionally exclude ferries (Holland Tunnel is typical)
    constraints: Dict[str, bool] = {
        "transport_mode": "driving",
        "avoid_ferries": True,
        # Be polite to Mapbox API: small delay after each route (10 routes total)
        "extra_delay_seconds": 1.0,
    }

    routes = rb.build_routes(origin, destination, waypoints, constraints)

    # Expect 10 routes (5 single + 5 multi for 6 waypoints)
    assert len(routes) == 10, f"Expected 10 routes, got {len(routes)}"

    _summarize_routes(routes)

    # Validate each route in detail
    for idx, r in enumerate(routes, start=1):
        log.info("---- Route %02d details ----", idx)
        log.info("Origin: (%.6f, %.6f)  Destination: (%.6f, %.6f)",
                 r.origin.latitude, r.origin.longitude, r.destination.latitude, r.destination.longitude)
        log.info("Waypoints (%d): %s", len(r.waypoints), " -> ".join(w.name for w in r.waypoints) or "(none)")
        log.info("Input queries: %s", r.input_queries)

        # Basic metrics
        assert r.total_distance_meters > 0.0
        assert r.total_duration_seconds > 0
        # number of segments should be (#waypoints + 1)
        expected_segments = len(r.waypoints) + 1
        assert len(r.segments) == expected_segments, f"Segments mismatch: expected {expected_segments}, got {len(r.segments)}"

        # Check each segment
        for sidx, seg in enumerate(r.segments, start=1):
            log.info("  Segment %d: dist=%.0f m, dur=%d s, instr=%d, polyline_len=%d",
                     sidx, seg.distance_meters, seg.duration_seconds, len(seg.instructions), len(seg.polyline or ""))
            assert seg.distance_meters > 0.0
            assert seg.duration_seconds > 0
            assert isinstance(seg.instructions, list)
            assert isinstance(seg.polyline, str)

    # Sanity: routes are sorted by total duration ascending
    durations = [r.total_duration_seconds for r in routes]
    assert durations == sorted(durations), "Routes are not sorted by increasing duration."

    # Print a final human-friendly recap
    fastest = routes[0]
    slowest = routes[-1]
    log.info("FASTEST:  %.2f km, %.1f min, via: %s",
             fastest.total_distance_meters / 1000.0,
             fastest.total_duration_seconds / 60.0,
             " -> ".join(w.name for w in fastest.waypoints) or "(none)")
    log.info("SLOWEST:  %.2f km, %.1f min, via: %s",
             slowest.total_distance_meters / 1000.0,
             slowest.total_duration_seconds / 60.0,
             " -> ".join(w.name for w in slowest.waypoints) or "(none)")


if __name__ == "__main__":
    sys.exit(pytest.main([__file__, "-vv", "-s"]))
