"""
Ground truth examples for route scoring evaluation.

This file contains synthetic ground truth examples used to evaluate the route scoring system.
Each example includes multiple route inputs and indicates which route is the best.
"""

from backend.evaluation.evaluator import ScoringGroundTruthExample, ScoringRouteInput
from backend.geocoding.geocoder import Coordinates


def get_ground_truth_scoring_examples() -> list[ScoringGroundTruthExample]:
    """
    Get all ground truth scoring examples for evaluation.
    
    Returns:
        List of ScoringGroundTruthExample objects
    """
    return [
        # Example 1: San Francisco - Parks Route Comparison
        # Route 0: Direct route (no waypoints) - should be fastest but less scenic
        # Route 1: Route through parks - should score higher for "parks" preference
        ScoringGroundTruthExample(
            example_id="sf_parks_scoring_001",
            user_prompt="I want to walk from Union Square to Golden Gate Park, passing through some parks.",
            route_inputs=[
                # Route 0: Direct route (no waypoints)
                ScoringRouteInput(
                    origin=Coordinates(latitude=37.7880, longitude=-122.4075),  # Union Square
                    destination=Coordinates(latitude=37.7694, longitude=-122.4862),  # Golden Gate Park
                    waypoint_coords=[],
                    constraints={
                        "transport_mode": "walking",
                        "avoid_tolls": False,
                        "avoid_stairs": False,
                        "avoid_hills": False,
                        "avoid_highways": False,
                    },
                ),
                # Route 1: Route through parks
                ScoringRouteInput(
                    origin=Coordinates(latitude=37.7880, longitude=-122.4075),  # Union Square
                    destination=Coordinates(latitude=37.7694, longitude=-122.4862),  # Golden Gate Park
                    waypoint_coords=[
                        Coordinates(latitude=37.7849, longitude=-122.4094),  # Park waypoint 1
                        Coordinates(latitude=37.7799, longitude=-122.4144),  # Park waypoint 2
                    ],
                    constraints={
                        "transport_mode": "walking",
                        "avoid_tolls": False,
                        "avoid_stairs": False,
                        "avoid_hills": False,
                        "avoid_highways": False,
                    },
                ),
            ],
            best_route_index=1,  # Route through parks should score higher
        ),
        
        # Example 2: New York - Coffee Shops Route Comparison
        # Route 0: Direct route (no waypoints) - fastest
        # Route 1: Route through coffee shops - should score higher for "coffee" preference
        ScoringGroundTruthExample(
            example_id="ny_coffee_scoring_001",
            user_prompt="I need to get from Times Square to Central Park, passing by some good coffee shops.",
            route_inputs=[
                # Route 0: Direct route (no waypoints)
                ScoringRouteInput(
                    origin=Coordinates(latitude=40.7580, longitude=-73.9855),  # Times Square
                    destination=Coordinates(latitude=40.7829, longitude=-73.9654),  # Central Park
                    waypoint_coords=[],
                    constraints={
                        "transport_mode": "walking",
                        "avoid_tolls": False,
                        "avoid_stairs": False,
                        "avoid_hills": False,
                        "avoid_highways": False,
                    },
                ),
                # Route 1: Route through coffee shops
                ScoringRouteInput(
                    origin=Coordinates(latitude=40.7580, longitude=-73.9855),  # Times Square
                    destination=Coordinates(latitude=40.7829, longitude=-73.9654),  # Central Park
                    waypoint_coords=[
                        Coordinates(latitude=40.7282, longitude=-73.9942),  # Coffee shop waypoint 1
                        Coordinates(latitude=40.7489, longitude=-73.9880),  # Coffee shop waypoint 2
                    ],
                    constraints={
                        "transport_mode": "walking",
                        "avoid_tolls": False,
                        "avoid_stairs": False,
                        "avoid_hills": False,
                        "avoid_highways": False,
                    },
                ),
            ],
            best_route_index=1,  # Route through coffee shops should score higher
        ),
    ]


# Template for creating new examples:
# 
# ScoringGroundTruthExample(
#     example_id="unique_id_here",
#     user_prompt="Natural language description of what the user wants (for scoring context)",
#     route_inputs=[
#         ScoringRouteInput(
#             origin=Coordinates(latitude=0.0, longitude=0.0),
#             destination=Coordinates(latitude=0.0, longitude=0.0),
#             waypoint_coords=[
#                 Coordinates(latitude=0.0, longitude=0.0),
#                 # Add more waypoint coordinates as needed
#             ],
#             constraints={
#                 "transport_mode": "walking",  # "walking", "driving", or "cycling"
#                 "avoid_tolls": False,
#                 "avoid_stairs": False,
#                 "avoid_hills": False,
#                 "avoid_highways": False,
#             },
#         ),
#         # Add more route inputs (at least 2 total)
#     ],
#     best_route_index=0,  # 0-based index of the best route
# )

