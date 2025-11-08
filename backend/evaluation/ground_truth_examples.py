"""
Ground truth examples for route evaluation.

This file contains synthetic ground truth examples used to evaluate the route generation system.
Each example includes the user prompt, expected extraction results, and waypoint coordinates.
"""

from backend.evaluation.evaluator import GroundTruthExample
from backend.geocoding.geocoder import Coordinates


def get_ground_truth_examples() -> list[GroundTruthExample]:
    """
    Get all ground truth examples for evaluation.
    
    Returns:
        List of GroundTruthExample objects
    """
    return [
        # Example 1: San Francisco - Parks and Greenery
        GroundTruthExample(
            example_id="sf_parks_001",
            user_prompt="Take me from Union Square to Golden Gate Park, avoiding hills and stairs. I want to see some parks along the way.",
            origin_text="Union Square",
            origin_coords=Coordinates(latitude=37.7880, longitude=-122.4075),
            destination_text="Golden Gate Park",
            destination_coords=Coordinates(latitude=37.7694, longitude=-122.4862),
            time_flexibility_minutes=15,
            constraints={
                "transport_mode": "walking",
                "avoid_tolls": False,
                "avoid_stairs": True,
                "avoid_hills": True,
                "avoid_highways": False,
            },
            preferences="parks, greenery",
            waypoint_coords=[
                Coordinates(latitude=37.7849, longitude=-122.4094),
                Coordinates(latitude=37.7799, longitude=-122.4144),
            ],
        ),
        
        # Example 2: New York - Coffee Shops
        GroundTruthExample(
            example_id="ny_coffee_001",
            user_prompt="I need to get from my hotel near Times Square to Central Park, but I'd love a route that passes by some good coffee shops. I can spare 20 extra minutes.",
            origin_text="Times Square",
            origin_coords=Coordinates(latitude=40.7580, longitude=-73.9855),
            destination_text="Central Park",
            destination_coords=Coordinates(latitude=40.7829, longitude=-73.9654),
            time_flexibility_minutes=20,
            constraints={
                "transport_mode": "walking",
                "avoid_tolls": False,
                "avoid_stairs": False,
                "avoid_hills": False,
                "avoid_highways": False,
            },
            preferences="coffee shops, cafes",
            waypoint_coords=[
                Coordinates(latitude=40.7282, longitude=-73.9942),
                Coordinates(latitude=40.7489, longitude=-73.9880),
            ],
        ),
    ]


# Template for creating new examples:
# 
# GroundTruthExample(
#     example_id="unique_id_here",
#     user_prompt="Natural language description of the route request",
#     origin_text="Origin location name",
#     origin_coords=Coordinates(latitude=0.0, longitude=0.0),
#     destination_text="Destination location name",
#     destination_coords=Coordinates(latitude=0.0, longitude=0.0),
#     time_flexibility_minutes=10,  # Minutes user is willing to spend extra
#     constraints={
#         "transport_mode": "walking",  # "walking", "driving", or "cycling"
#         "avoid_tolls": False,
#         "avoid_stairs": False,
#         "avoid_hills": False,
#         "avoid_highways": False,
#     },
#     preferences="comma, separated, preferences",  # e.g., "parks, greenery, waterfront"
#     waypoint_coords=[
#         Coordinates(latitude=0.0, longitude=0.0),
#         # Add more waypoint coordinates as needed
#     ],
# )

