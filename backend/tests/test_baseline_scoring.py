"""
Test baseline_duration scoring functionality
Run from project root: python -m backend.tests.test_baseline_scoring
"""
import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from backend.scoring.route_scorer import RouteScorer, ScoringWeights
from backend.routing.route_builder import RouteBuilder, Route, RouteSegment
from backend.waypoints.waypoint_searcher import Waypoint
from backend.geocoding.geocoder import Coordinates
from typing import List
import os


def create_mock_route(duration: int, num_waypoints: int = 0) -> Route:
    """Create a mock route with specified duration."""
    origin = Coordinates(latitude=37.7749, longitude=-122.4194)
    dest = Coordinates(latitude=37.7849, longitude=-122.4094)

    waypoints = []
    for i in range(num_waypoints):
        wp = Waypoint(
            name=f"Waypoint_{i+1}",
            coordinates=Coordinates(
                latitude=37.7749 + (i+1) * 0.01,
                longitude=-122.4194 + (i+1) * 0.01
            ),
            category="tourist_attraction",
            relevance_score=9.0,
            metadata={},
            input_query="scenic"
        )
        waypoints.append(wp)

    segments = [RouteSegment(
        start=origin,
        end=dest,
        distance_meters=5000.0,
        duration_seconds=duration,
        instructions=["Go straight"],
        polyline=""
    )]

    return Route(
        origin=origin,
        destination=dest,
        waypoints=waypoints,
        segments=segments,
        total_distance_meters=5000.0,
        total_duration_seconds=duration,
        constraints_applied={},
        input_queries=["scenic"] * num_waypoints
    )


def test_baseline_normalization():
    """Test that baseline_duration produces different efficiency scores."""
    print("\n" + "="*60)
    print("TEST: Baseline Duration Normalization")
    print("="*60)

    # Create routes with different durations
    baseline_duration = 600  # 10 minutes
    routes = [
        create_mock_route(duration=600),   # Matches baseline
        create_mock_route(duration=900),   # 50% longer
        create_mock_route(duration=1200),  # 100% longer
        create_mock_route(duration=1500),  # 150% longer
    ]

    scorer = RouteScorer(
        weights=ScoringWeights(
            clip_weight=0.0,
            duration_weight=1.0,
            waypoint_relevance_weight=0.0
        )
    )

    print(f"\nBaseline duration: {baseline_duration}s ({baseline_duration/60:.1f} min)")
    print("\nScoring routes with absolute normalization:\n")

    scored = scorer.score_routes(
        routes=routes,
        user_prompt="test",
        baseline_duration=baseline_duration,
        max_images_per_route=0  # Skip images for speed
    )

    # Build expected scores by duration (routes get sorted by overall_score)
    expected_by_duration = {
        600: 100.0,   # Matches baseline
        900: 75.0,    # 50% longer: 100 - 100*(0.5^2) = 75
        1200: 0.0,    # 100% longer: 100 - 100*(1.0^2) = 0
        1500: 0.0,    # 150% longer: capped at 0
    }

    # Verify results
    print("Route | Duration | Expected Efficiency | Actual Efficiency | Pass?")
    print("-" * 70)

    all_passed = True

    for i, score in enumerate(scored):
        duration = score.route.total_duration_seconds
        efficiency = score.efficiency_score
        expected = expected_by_duration[duration]
        passed = abs(efficiency - expected) < 5.0  # Allow 5 point tolerance
        status = "✓" if passed else "✗"

        print(f"  {i+1}   | {duration:4d}s   | {expected:6.1f}             | {efficiency:6.1f}           | {status}")

        if not passed:
            all_passed = False

    print()
    if all_passed:
        print("✓ All efficiency scores are correct!")
    else:
        print("✗ Some scores don't match expected values")

    return all_passed


def test_single_route_not_100():
    """Test that a single route doesn't get 100% when using baseline."""
    print("\n" + "="*60)
    print("TEST: Single Route Scoring (should NOT be 100)")
    print("="*60)

    baseline_duration = 600  # 10 minutes
    route = create_mock_route(duration=1200)  # 20 minutes (2x baseline)

    scorer = RouteScorer()

    scored = scorer.score_routes(
        routes=[route],
        user_prompt="test",
        baseline_duration=baseline_duration,
        max_images_per_route=0
    )

    efficiency = scored[0].efficiency_score

    print(f"\nBaseline duration: {baseline_duration}s")
    print(f"Route duration:    {route.total_duration_seconds}s")
    print(f"Efficiency score:  {efficiency:.1f}/100")

    # Route is 2x baseline (100% longer), so efficiency should be 0
    if efficiency < 5:  # Allow small tolerance
        print("\n✓ PASS: Single route does NOT get 100% score")
        return True
    else:
        print(f"\n✗ FAIL: Expected efficiency ~0, got {efficiency:.1f}")
        return False


def test_without_baseline_fallback():
    """Test fallback behavior when no baseline provided."""
    print("\n" + "="*60)
    print("TEST: Fallback to Batch Minimum (no baseline)")
    print("="*60)

    routes = [
        create_mock_route(duration=600),
        create_mock_route(duration=900),
        create_mock_route(duration=1200),
    ]

    print(f"\nCreated {len(routes)} routes:")
    for i, r in enumerate(routes):
        print(f"  Route {i+1}: {r.total_duration_seconds}s")

    scorer = RouteScorer()

    # Score WITHOUT baseline_duration (should use batch minimum)
    print("\nScoring without baseline_duration...")
    scored = scorer.score_routes(
        routes=routes,
        user_prompt="test",
        baseline_duration=None,  # No baseline
        max_images_per_route=0
    )

    print(f"\nGot back {len(scored)} scored routes:")
    for i, s in enumerate(scored):
        print(f"  Route {i+1}: {s.route.total_duration_seconds}s -> efficiency {s.efficiency_score:.1f}")

    # The issue: scorer might be returning fewer routes than input
    if len(scored) != len(routes):
        print(f"\n⚠ WARNING: Expected {len(routes)} routes, got {len(scored)}")
        print("This suggests an issue in route_scorer.py")
        return False

    # Find the route with shortest duration
    fastest = min(scored, key=lambda s: s.route.total_duration_seconds)

    print(f"\nFastest route ({fastest.route.total_duration_seconds}s) gets: {fastest.efficiency_score:.1f}/100")

    # The fastest route should get 100 (old behavior with batch minimum)
    if abs(fastest.efficiency_score - 100.0) < 0.1:
        print("✓ PASS: Fallback to batch minimum works")
        return True
    else:
        print(f"✗ FAIL: Expected 100.0, got {fastest.efficiency_score:.1f}")
        return False


def test_with_route_builder():
    """Integration test with RouteBuilder to compute baseline."""
    print("\n" + "="*60)
    print("TEST: Integration with RouteBuilder.get_baseline_duration()")
    print("="*60)

    # Check if we have Mapbox token
    mapbox_token = os.getenv("MAPBOX_TOKEN") or os.getenv("GEOCODING_API_KEY")
    if not mapbox_token:
        print("\n⚠ SKIP: No MAPBOX_TOKEN found in environment")
        return None

    try:
        builder = RouteBuilder(api_key=mapbox_token)
        scorer = RouteScorer()

        origin = Coordinates(latitude=37.7749, longitude=-122.4194)
        dest = Coordinates(latitude=37.7849, longitude=-122.4094)
        constraints = {"transport_mode": "driving"}

        print("\nComputing baseline duration...")
        baseline_duration = builder.get_baseline_duration(origin, dest, constraints)
        print(f"✓ Baseline: {baseline_duration}s ({baseline_duration/60:.1f} min)")

        # Create a route that's 50% longer
        slower_route = create_mock_route(duration=int(baseline_duration * 1.5))

        scored = scorer.score_routes(
            routes=[slower_route],
            user_prompt="test",
            baseline_duration=baseline_duration,
            max_images_per_route=0
        )

        efficiency = scored[0].efficiency_score
        print(f"\nRoute duration: {slower_route.total_duration_seconds}s (1.5x baseline)")
        print(f"Efficiency score: {efficiency:.1f}/100")

        # Should be around 75 (50% longer: 100 - 100*(0.5^2) = 75)
        if 70 < efficiency < 80:
            print("✓ PASS: Baseline computed and used correctly")
            return True
        else:
            print(f"✗ FAIL: Expected ~75, got {efficiency:.1f}")
            return False

    except Exception as e:
        print(f"\n✗ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("\n" + "╔" + "═" * 58 + "╗")
    print("║" + " "*10 + "BASELINE DURATION SCORING TESTS" + " "*17 + "║")
    print("╚" + "═" * 58 + "╝")

    results = []

    # Run tests
    try:
        results.append(("Baseline Normalization", test_baseline_normalization()))
    except Exception as e:
        print(f"✗ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        results.append(("Baseline Normalization", False))

    try:
        results.append(("Single Route Not 100", test_single_route_not_100()))
    except Exception as e:
        print(f"✗ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        results.append(("Single Route Not 100", False))

    try:
        results.append(("Fallback Behavior", test_without_baseline_fallback()))
    except Exception as e:
        print(f"✗ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        results.append(("Fallback Behavior", False))

    try:
        result = test_with_route_builder()
        if result is not None:
            results.append(("RouteBuilder Integration", result))
    except Exception as e:
        print(f"✗ Test failed with error: {e}")
        import traceback
        traceback.print_exc()

    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)

    for test_name, passed in results:
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"{status}: {test_name}")

    passed_count = sum(1 for _, p in results if p)
    total_count = len(results)

    print(f"\n{passed_count}/{total_count} tests passed")
    print("="*60)

    sys.exit(0 if passed_count == total_count else 1)
