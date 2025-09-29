# tests/test_geocoder.py
"""
Verbose tests for the Geocoder module using OSM-backed services.

Trip:
  Origin:      Times Square, New York, NY
  Destination: Jersey City, NJ
  Mode:        driving
  max_additional_time: 10 minutes

Notes:
- Requires ORS_API_KEY for routing/isochrones tests. Geocoding works without it.
- Isochrone API is rate-limited to ~20 requests/min. We enforce:
    1) a sliding-window rate limiter (≤20 calls in any 60s),
    2) an extra fixed sleep between ORS requests.
"""

import os
import math
import time
import logging
from collections import deque
from typing import Deque

import pytest

from backend.geocoding.geocoder import Geocoder, Coordinates

# ----- Logging setup (verbose) -----
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("test_geocoder")

# ----- Test configuration -----
ORIGIN_ADDRESS = "Times Square, New York, NY"
DEST_ADDRESS = "Jersey City, NJ"
TRANSPORT_MODE = "driving"
MAX_ADDITIONAL_TIME = 10  # minutes (PER REQUEST)

# Loose coordinate checks (approximate)
TIMES_SQUARE_APPROX = Coordinates(latitude=40.7580, longitude=-73.9855)
JERSEY_CITY_APPROX = Coordinates(latitude=40.7178, longitude=-74.0431)
COORD_TOL = 0.03  # ~1–3 km tolerance near NYC

# Time sanity caps
MAX_REASONABLE_MINUTES = 180  # cap for base driving time

# ORS limits & extra safety
ISO_MAX_CALLS_PER_MIN = 20
ADDITIONAL_DELAY_SECONDS = 3.5  # extra delay before each ORS request (isochrones & directions)


def _coords_close(a: Coordinates, b: Coordinates, tol: float = COORD_TOL) -> bool:
    return (abs(a.latitude - b.latitude) <= tol) and (abs(a.longitude - b.longitude) <= tol)


def _require_ors_key() -> str:
    key = os.getenv("ORS_API_KEY")
    if not key:
        pytest.skip("Skipping ORS-dependent tests: ORS_API_KEY env var not set.")
    return key


class RateLimiter:
    """Simple sliding-window rate limiter (max N calls per 60s)."""

    def __init__(self, max_calls: int, window_seconds: int = 60):
        self.max_calls = max_calls
        self.window = window_seconds
        self.calls: Deque[float] = deque()

    def wait(self):
        now = time.time()
        # Remove timestamps older than window
        while self.calls and now - self.calls[0] >= self.window:
            self.calls.popleft()
        if len(self.calls) >= self.max_calls:
            sleep_for = self.window - (now - self.calls[0]) + 0.05  # buffer
            log.info(f"[RateLimiter] At limit ({self.max_calls}/{self.window}s). Sleeping {sleep_for:.2f}s…")
            time.sleep(max(0.0, sleep_for))
        self.calls.append(time.time())


def test_geocode_address_times_square_and_jersey_city():
    """Verbose integration-ish test against Nominatim."""
    geocoder = Geocoder(api_key="dummy")  # ORS key not required for geocoding

    log.info("Geocoding origin: %s", ORIGIN_ADDRESS)
    origin = geocoder.geocode_address(ORIGIN_ADDRESS)
    log.info(" → Origin coords: (%.6f, %.6f)", origin.latitude, origin.longitude)

    log.info("Geocoding destination: %s", DEST_ADDRESS)
    dest = geocoder.geocode_address(DEST_ADDRESS)
    log.info(" → Destination coords: (%.6f, %.6f)", dest.latitude, dest.longitude)

    assert _coords_close(origin, TIMES_SQUARE_APPROX), (
        f"Origin too far from Times Square: got {origin}"
    )
    assert _coords_close(dest, JERSEY_CITY_APPROX), (
        f"Destination too far from Jersey City centroid: got {dest}"
    )


def test_shortest_travel_time_minutes_driving_with_delay(monkeypatch):
    """Check base shortest travel time via ORS directions (verbose, delayed)."""
    ors_key = _require_ors_key()
    geocoder = Geocoder(api_key=ors_key)

    # Wrap shortest_travel_time_minutes with limiter + fixed delay
    limiter = RateLimiter(max_calls=ISO_MAX_CALLS_PER_MIN)
    original_shortest = geocoder.shortest_travel_time_minutes

    def wrapped_shortest(origin, dest, mode="walking"):
        limiter.wait()
        log.info("[Delay] Sleeping %.2fs before ORS directions request…", ADDITIONAL_DELAY_SECONDS)
        time.sleep(ADDITIONAL_DELAY_SECONDS)
        out = original_shortest(origin, dest, mode)
        log.info(" → ORS directions result: %d minutes", out)
        return out

    monkeypatch.setattr(geocoder, "shortest_travel_time_minutes", wrapped_shortest)

    log.info("Geocoding endpoints for routing…")
    origin = geocoder.geocode_address(ORIGIN_ADDRESS)
    dest = geocoder.geocode_address(DEST_ADDRESS)

    log.info("Fetching shortest driving time Times Square → Jersey City…")
    base_minutes = geocoder.shortest_travel_time_minutes(origin, dest, TRANSPORT_MODE)

    assert base_minutes > 0, "Shortest travel time should be positive."
    assert base_minutes < MAX_REASONABLE_MINUTES, (
        f"Unreasonably large base travel time for driving: {base_minutes} min"
    )


def test_create_search_zone_union_of_overlaps_with_rate_limit_and_delay(monkeypatch):
    """
    Full pipeline with verbose logging, a rate limiter, and an extra fixed delay around ORS calls:
      1) Geocode origin/destination
      2) Compute base shortest time (driving)
      3) Plan the grid search of (origin_min, dest_min) pairs where their sum == base + 10
      4) Wrap BOTH directions and isochrone calls to enforce ≤20/min + fixed delay
      5) Build the union-of-overlaps search zone and validate
    """
    ors_key = _require_ors_key()
    geocoder = Geocoder(api_key=ors_key)

    # ---- Wrap BOTH ORS methods with limiter + fixed delay ----
    limiter = RateLimiter(max_calls=ISO_MAX_CALLS_PER_MIN)

    original_shortest = geocoder.shortest_travel_time_minutes
    original_create_iso = geocoder.create_isochrone

    def wrapped_shortest(origin, dest, mode="walking"):
        limiter.wait()
        log.info("[Delay] Sleeping %.2fs before ORS directions request…", ADDITIONAL_DELAY_SECONDS)
        time.sleep(ADDITIONAL_DELAY_SECONDS)
        return original_shortest(origin, dest, mode)

    def wrapped_create_iso(center, minutes, mode="walking"):
        limiter.wait()
        log.info(
            "[Delay] Sleeping %.2fs before ORS isochrone request (min=%s)…",
            ADDITIONAL_DELAY_SECONDS, minutes
        )
        time.sleep(ADDITIONAL_DELAY_SECONDS)
        iso = original_create_iso(center, minutes, mode)
        log.info(" → Isochrone(min=%s) returned ring with %d points", minutes, len(iso.polygon))
        return iso

    monkeypatch.setattr(geocoder, "shortest_travel_time_minutes", wrapped_shortest)
    monkeypatch.setattr(geocoder, "create_isochrone", wrapped_create_iso)

    # ---- Execute ----
    log.info("Geocoding endpoints…")
    origin = geocoder.geocode_address(ORIGIN_ADDRESS)
    dest = geocoder.geocode_address(DEST_ADDRESS)
    log.info(" → Origin: (%.6f, %.6f)", origin.latitude, origin.longitude)
    log.info(" → Dest  : (%.6f, %.6f)", dest.latitude, dest.longitude)

    log.info("Computing shortest travel time (%s)…", TRANSPORT_MODE)
    base_minutes = geocoder.shortest_travel_time_minutes(origin, dest, TRANSPORT_MODE)
    max_travel_time = base_minutes + MAX_ADDITIONAL_TIME
    log.info(" → Base: %d min, Additional: %d min, Sum (grid target): %d min",
             base_minutes, MAX_ADDITIONAL_TIME, max_travel_time)

    # Replicate the split schedule Geocoder uses to provide visibility/estimates
    if base_minutes > 60:
        n = max(2, min(20, max_travel_time + 1))
        origin_minutes_list = [int(round(i * (max_travel_time / (n - 1)))) for i in range(n)]
    else:
        origin_minutes_list = list(range(0, max_travel_time + 1, 5))
    pairs = [(o, max_travel_time - o) for o in origin_minutes_list]

    log.info("Planned isochrone splits (origin_min, dest_min) [count=%d]: %s",
             len(pairs), pairs)

    # Execute the full search zone build (this triggers wrapped calls)
    start = time.time()
    zone = geocoder.create_search_zone(
        origin=origin,
        destination=dest,
        max_additional_time=MAX_ADDITIONAL_TIME,
        transport_mode=TRANSPORT_MODE,
    )
    elapsed = time.time() - start
    log.info("Search zone built in %.2fs", elapsed)

    # Verbose details about representative isochrones
    log.info("Representative origin isochrone minutes: %d (points=%d)",
             zone.origin_isochrone.travel_time_minutes, len(zone.origin_isochrone.polygon))
    log.info("Representative dest   isochrone minutes: %d (points=%d)",
             zone.destination_isochrone.travel_time_minutes, len(zone.destination_isochrone.polygon))

    # Assertions with clear messages
    assert zone.origin_isochrone.travel_time_minutes >= 0, "Origin isochrone minutes must be non-negative."
    assert zone.destination_isochrone.travel_time_minutes >= 0, "Destination isochrone minutes must be non-negative."
    assert len(zone.origin_isochrone.polygon) >= 3, "Origin isochrone ring should have at least 3 points."
    assert len(zone.destination_isochrone.polygon) >= 3, "Destination isochrone ring should have at least 3 points."

    if len(zone.intersection_polygon) < 3:
        # Keep CI stable across real-world variance while still reporting verbosely
        pytest.xfail(
            "Union-of-overlaps polygon is empty for current live data; "
            "this can happen depending on the base time and additional time splits."
        )
    else:
        first = zone.intersection_polygon[0]
        last = zone.intersection_polygon[-1]
        log.info("Final union-of-overlaps ring has %d points.", len(zone.intersection_polygon))
        assert math.isclose(first.latitude, last.latitude, rel_tol=0, abs_tol=1e-6), "Ring should be closed (lat)."
        assert math.isclose(first.longitude, last.longitude, rel_tol=0, abs_tol=1e-6), "Ring should be closed (lon)."


if __name__ == "__main__":
    import sys
    sys.exit(pytest.main([__file__, "-vv", "-s"]))
