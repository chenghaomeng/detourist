# scripts/test_route_builder.py
import os
import sys
import logging
import pytest
from typing import Dict

from backend.routing.route_builder import RouteBuilder
from backend.geocoding.geocoder import Coordinates
from backend.waypoints.waypoint_searcher import Waypoint

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("test_route_builder")

def _require_ors_key() -> str:
    key = os.getenv("ORS_API_KEY")
    if not key:
        pytest.skip("Skipping ORS-dependent tests: ORS_API_KEY not set.")
    return key


def test_build_route_driving_with_constraints_and_delay():
    api_key = _require_ors_key()
    rb = RouteBuilder(api_key=api_key)

    origin = Coordinates(latitude=40.7580, longitude=-73.9855)
    waypoint = Waypoint(
        name="Washington Square Park",
        coordinates=Coordinates(latitude=40.730823, longitude=-73.997332),
        category="leisure=park",
        relevance_score=0.9,
        metadata={"source": "test"},
    )
    destination = Coordinates(latitude=40.7178, longitude=-74.0431)

    constraints: Dict[str, bool] = {
        "transport_mode": "driving",
        "avoid_tolls": True,
        "avoid_ferries": True,
        "extra_delay_seconds": 3.0,
    }

    routes = rb.build_routes(origin, destination, [waypoint], constraints)
    assert len(routes) == 1

    route = routes[0]
    assert route.total_distance_meters > 0.0
    assert route.total_duration_seconds > 0
    assert len(route.segments) == 2
    for seg in route.segments:
        assert seg.distance_meters > 0.0
        assert seg.duration_seconds > 0
        assert isinstance(seg.instructions, list)
        assert seg.polyline and isinstance(seg.polyline, str)


def test_build_route_walking_avoid_stairs():
    api_key = _require_ors_key()
    rb = RouteBuilder(api_key=api_key)

    origin = Coordinates(latitude=40.7681, longitude=-73.9819)
    waypoint = Waypoint(
        name="Bethesda Terrace",
        coordinates=Coordinates(latitude=40.7740, longitude=-73.9700),
        category="tourism=viewpoint",
        relevance_score=0.8,
        metadata={"source": "test"},
    )
    destination = Coordinates(latitude=40.7580, longitude=-73.9855)

    constraints: Dict[str, bool] = {
        "transport_mode": "walking",
        "avoid_stairs": True,
        "extra_delay_seconds": 2.0,
    }

    routes = rb.build_routes(origin, destination, [waypoint], constraints)
    assert len(routes) == 1

    route = routes[0]
    assert route.total_distance_meters > 0.0
    assert route.total_duration_seconds > 0
    assert len(route.segments) == 2
    for seg in route.segments:
        assert seg.distance_meters > 0.0
        assert seg.duration_seconds > 0
        assert isinstance(seg.instructions, list)
        assert seg.polyline and isinstance(seg.polyline, str)

if __name__ == "__main__":
    sys.exit(pytest.main([__file__, "-vv", "-s"]))
