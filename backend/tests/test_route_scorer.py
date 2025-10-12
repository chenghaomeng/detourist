"""
Test file for RouteScorer - Located in backend/tests/
"""
import sys
from pathlib import Path

# Add project root to path (go up two levels from backend/tests)
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from backend.scoring.route_scorer import RouteScorer, ScoringWeights
from backend.routing.route_builder import Route, RouteSegment
from backend.waypoints.waypoint_searcher import Waypoint
from backend.geocoding.geocoder import Coordinates
from typing import List


def create_mock_route(
    route_id: int,
    origin: tuple,
    destination: tuple,
    waypoints_data: List[tuple],
    duration: int
) -> Route:
    """
    Create a mock route for testing.

    Args:
        route_id: Route identifier
        origin: (lat, lon) tuple
        destination: (lat, lon) tuple
        waypoints_data: List of ((lat, lon), relevance_score) tuples
        duration: Total duration in seconds
    """
    origin_coords = Coordinates(latitude=origin[0], longitude=origin[1])
    dest_coords = Coordinates(latitude=destination[0], longitude=destination[1])

    # Create waypoints - MUST include input_query (required field)
    waypoints = []
    input_queries = []
    for (lat, lon), relevance in waypoints_data:
        wp = Waypoint(
            name=f"Waypoint_{len(waypoints)+1}",
            coordinates=Coordinates(latitude=lat, longitude=lon),
            category="tourist_attraction",
            relevance_score=float(relevance),
            metadata={},
            input_query="scenic landmark"  # REQUIRED field from waypoint_searcher.py
        )
        waypoints.append(wp)
        input_queries.append(wp.input_query)

    # Create mock segments
    segments = []
    all_points = [origin_coords] + [wp.coordinates for wp in waypoints] + [dest_coords]
    for i in range(len(all_points) - 1):
        segment = RouteSegment(
            start=all_points[i],
            end=all_points[i+1],
            distance_meters=5000.0,
            duration_seconds=duration // len(all_points),
            instructions=[f"Continue to next point"],
            polyline=""
        )
        segments.append(segment)

    # Create route - include input_queries (required field from route_builder.py)
    route = Route(
        origin=origin_coords,
        destination=dest_coords,
        waypoints=waypoints,
        segments=segments,
        total_distance_meters=sum(s.distance_meters for s in segments),
        total_duration_seconds=duration,
        constraints_applied={},
        input_queries=input_queries  # REQUIRED field from route_builder.py
    )

    return route


def test_lightweight_scorer():
    """Test scoring without images - fastest option."""
    print("=" * 60)
    print("TEST 1: Lightweight Scorer (No Images)")
    print("=" * 60)

    # Create test routes
    routes = [
        create_mock_route(
            route_id=1,
            origin=(-35, 35),
            destination=(-30, 40),
            waypoints_data=[((-32, 37), 82)],
            duration=15 * 60
        ),
        create_mock_route(
            route_id=2,
            origin=(-35, 35),
            destination=(-30, 40),
            waypoints_data=[((-33, 36), 23)],
            duration=19 * 60
        ),
        create_mock_route(
            route_id=3,
            origin=(-35, 35),
            destination=(-30, 40),
            waypoints_data=[((-32, 37), 82), ((-31, 41), 61)],
            duration=13 * 60
        ),
    ]

    # Initialize lightweight scorer
    scorer = RouteScorer(
        clip_model_name="openai/clip-vit-base-patch32",
        weights=ScoringWeights(
            clip_weight=0.0,
            duration_weight=0.5,
            waypoint_relevance_weight=0.5
        )
    )

    # Score routes
    user_prompt = "scenic route with interesting landmarks"
    scored_routes = scorer.score_routes(routes, user_prompt)

    # Display results
    print(f"\nScored {len(scored_routes)} routes")
    print(f"User prompt: '{user_prompt}'")
    print("\nResults (ranked by score):\n")

    for i, score in enumerate(scored_routes, 1):
        print(f"Rank {i}: Route {routes.index(score.route) + 1}")
        print(f"  Overall Score:        {score.overall_score:.2f}")
        print(f"  Efficiency Score:     {score.efficiency_score:.2f}")
        print(f"  Waypoint Relevance:   {score.preference_match_score:.2f}")
        print(f"  Duration:             {score.route.total_duration_seconds/60:.1f} min")
        print(f"  Waypoints:            {len(score.route.waypoints)}")
        print()

    return scored_routes


def test_with_images():
    """Test scoring with image fetching."""
    print("=" * 60)
    print("TEST 2: Full Scorer with Image Fetching")
    print("=" * 60)

    # Use real coordinates for testing (San Francisco area)
    routes = [
        create_mock_route(
            route_id=1,
            origin=(37.7749, -122.4194),
            destination=(37.8199, -122.4783),
            waypoints_data=[((37.8024, -122.4058), 85)],
            duration=25 * 60
        ),
        create_mock_route(
            route_id=2,
            origin=(37.7749, -122.4194),
            destination=(37.8199, -122.4783),
            waypoints_data=[((37.7955, -122.3937), 60)],
            duration=30 * 60
        ),
    ]

    # Initialize with Mapillary token
    MAPILLARY_TOKEN = "MLY|24741425755510189|de1b5b073cb3f00435583c22f772c43b"

    scorer = RouteScorer(
        clip_model_name="openai/clip-vit-base-patch32",
        mapillary_token=MAPILLARY_TOKEN,
        weights=ScoringWeights(
            clip_weight=0.4,
            duration_weight=0.3,
            waypoint_relevance_weight=0.3
        )
    )

    # Score routes with images
    user_prompt = "waterfront views with bridges and boats"

    print("\nFetching images and computing CLIP scores...")
    print("(This may take a minute...)\n")

    scored_routes = scorer.score_routes(
        routes,
        user_prompt,
        min_images_per_route=3,
        max_images_per_route=10,
        debug=True
    )

    # Display results
    print(f"\nScored {len(scored_routes)} routes")
    print(f"User prompt: '{user_prompt}'")
    print("\nResults (ranked by score):\n")

    for i, score in enumerate(scored_routes, 1):
        print(f"Rank {i}: Route {routes.index(score.route) + 1}")
        print(f"  Overall Score:        {score.overall_score:.2f}")
        print(f"  CLIP Score:           {score.clip_score:.2f}")
        print(f"  Efficiency Score:     {score.efficiency_score:.2f}")
        print(f"  Waypoint Relevance:   {score.preference_match_score:.2f}")
        print(f"  Images Analyzed:      {score.num_images}")
        print(f"  Duration:             {score.route.total_duration_seconds/60:.1f} min")
        print(f"  Waypoints:            {len(score.route.waypoints)}")

        if score.image_scores:
            print(f"  Image Scores:         {[f'{s:.2f}' for s in score.image_scores[:5]]}")
        print()

    return scored_routes


def test_waypoint_bonus():
    """Test the new waypoint bonus algorithm."""
    print("=" * 60)
    print("TEST 3: Waypoint Bonus Algorithm")
    print("=" * 60)

    routes = [
        # 1 waypoint @ 60 relevance
        create_mock_route(
            route_id=1,
            origin=(37.7749, -122.4194),
            destination=(37.8199, -122.4783),
            waypoints_data=[((37.8024, -122.4058), 60)],
            duration=20 * 60
        ),
        # 3 waypoints @ 50 average
        create_mock_route(
            route_id=2,
            origin=(37.7749, -122.4194),
            destination=(37.8199, -122.4783),
            waypoints_data=[
                ((37.7850, -122.4100), 45),
                ((37.7950, -122.4200), 50),
                ((37.8050, -122.4300), 55)
            ],
            duration=25 * 60
        ),
    ]

    scorer = RouteScorer(
        weights=ScoringWeights(
            clip_weight=0.0,
            duration_weight=0.0,
            waypoint_relevance_weight=1.0
        ),
        waypoint_bonus_rate=0.1  # 10% bonus per additional waypoint
    )

    scored_routes = scorer.score_routes(routes, "test")

    print("\nResults:")
    for score in scored_routes:
        num_wp = len(score.route.waypoints)
        avg_rel = sum(wp.relevance_score for wp in score.route.waypoints) / num_wp
        bonus = 1.0 + 0.1 * (num_wp - 1)

        print(f"\nRoute with {num_wp} waypoint(s):")
        print(f"  Average Relevance: {avg_rel:.1f}")
        print(f"  Bonus Multiplier:  {bonus:.2f}")
        print(f"  Final Score:       {score.preference_match_score:.2f}")
        print(f"  Expected:          {avg_rel * bonus:.2f}")

    print("\n" + "=" * 60)


if __name__ == "__main__":
    print("\n")
    print("╔" + "═" * 58 + "╗")
    print("║" + " " * 15 + "ROUTE SCORER TEST SUITE" + " " * 20 + "║")
    print("╚" + "═" * 58 + "╝")
    print()

    # Test 1: Lightweight scoring
    try:
        test_lightweight_scorer()
        print("✓ Test 1 passed!\n")
    except Exception as e:
        print(f"✗ Test 1 failed: {e}\n")
        import traceback
        traceback.print_exc()

    # Test 2: Waypoint bonus
    try:
        test_waypoint_bonus()
        print("✓ Test 3 passed!\n")
    except Exception as e:
        print(f"✗ Test 3 failed: {e}\n")
        import traceback
        traceback.print_exc()

    # Test 3: Image scoring (optional)
    print("\n" + "─" * 60)
    response = input("\nRun test with image fetching? (requires Mapillary token) [y/N]: ")

    if response.lower() in ['y', 'yes']:
        try:
            test_with_images()
            print("✓ Test 2 passed!\n")
        except Exception as e:
            print(f"✗ Test 2 failed: {e}\n")
            import traceback
            traceback.print_exc()
    else:
        print("Skipping image test.\n")

    print("=" * 60)
    print("Tests complete!")
    print("=" * 60)
