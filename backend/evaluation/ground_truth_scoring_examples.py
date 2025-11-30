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
        
        # Example 3: SF Ferry Building to Palace of Fine Arts - Good vs Bad Waypoints
        # Route 0: Route with irrelevant waypoints (office buildings) - bad waypoints
        # Route 1: Route with relevant waypoints (waterfront parks) - good waypoints
        ScoringGroundTruthExample(
            example_id="sf_ferry_waypoints_001",
            user_prompt="Walk from San Francisco Ferry Building to Palace of Fine Arts, hug the waterfront and pass through parks.",
            route_inputs=[
                # Route 0: Route with bad waypoints (office buildings, not waterfront/parks)
                ScoringRouteInput(
                    origin=Coordinates(latitude=37.7954, longitude=-122.3936),  # Ferry Building
                    destination=Coordinates(latitude=37.8041, longitude=-122.4484),  # Palace of Fine Arts
                    waypoint_coords=[
                        Coordinates(latitude=37.7946, longitude=-122.4020),  # Financial District office
                        Coordinates(latitude=37.7880, longitude=-122.4075),  # Union Square (not waterfront)
                    ],
                    constraints={
                        "transport_mode": "walking",
                        "avoid_tolls": False,
                        "avoid_stairs": False,
                        "avoid_hills": False,
                        "avoid_highways": False,
                    },
                ),
                # Route 1: Route with good waypoints (waterfront parks)
                ScoringRouteInput(
                    origin=Coordinates(latitude=37.7954, longitude=-122.3936),  # Ferry Building
                    destination=Coordinates(latitude=37.8041, longitude=-122.4484),  # Palace of Fine Arts
                    waypoint_coords=[
                        Coordinates(latitude=37.8086, longitude=-122.4098),  # Pier 39 (waterfront)
                        Coordinates(latitude=37.8065, longitude=-122.4387),  # Marina Green (park/waterfront)
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
            best_route_index=1,  # Route with good waypoints should score higher
        ),
        
        # Example 4: Civic Center to Golden Gate Bridge - Wrong Destination
        # Route 0: Correct destination (Golden Gate Bridge)
        # Route 1: Wrong destination (Golden Gate Park instead) - should score lower
        ScoringGroundTruthExample(
            example_id="sf_civic_wrong_dest_001",
            user_prompt="Drive from Civic Center to Golden Gate Bridge, I want to see some landmarks along the way.",
            route_inputs=[
                # Route 0: Correct destination
                ScoringRouteInput(
                    origin=Coordinates(latitude=37.7770, longitude=-122.4195),  # Civic Center
                    destination=Coordinates(latitude=37.8294, longitude=-122.4860),  # Golden Gate Bridge (correct)
                    waypoint_coords=[
                        Coordinates(latitude=37.8050, longitude=-122.4491),  # Palace of Fine Arts
                    ],
                    constraints={
                        "transport_mode": "driving",
                        "avoid_tolls": False,
                        "avoid_stairs": False,
                        "avoid_hills": False,
                        "avoid_highways": True,
                    },
                ),
                # Route 1: Wrong destination (Golden Gate Park instead of Bridge)
                ScoringRouteInput(
                    origin=Coordinates(latitude=37.7770, longitude=-122.4195),  # Civic Center
                    destination=Coordinates(latitude=37.7694, longitude=-122.4862),  # Golden Gate Park (wrong!)
                    waypoint_coords=[
                        Coordinates(latitude=37.8050, longitude=-122.4491),  # Palace of Fine Arts
                    ],
                    constraints={
                        "transport_mode": "driving",
                        "avoid_tolls": False,
                        "avoid_stairs": False,
                        "avoid_hills": False,
                        "avoid_highways": True,
                    },
                ),
            ],
            best_route_index=0,  # Correct destination should score higher
        ),
        
        # Example 5: Marina to Embarcadero - Different Waypoint Sets
        # Route 0: Route with generic waypoints (not historic streets)
        # Route 1: Route with historic street waypoints (Lombard, Columbus) - should score higher
        ScoringGroundTruthExample(
            example_id="sf_marina_waypoints_001",
            user_prompt="Drive from Marina to Embarcadero, take me through historic streets like Lombard or Columbus.",
            route_inputs=[
                # Route 0: Route with generic waypoints (not historic streets)
                ScoringRouteInput(
                    origin=Coordinates(latitude=37.8002, longitude=-122.4414),  # Marina
                    destination=Coordinates(latitude=37.7955, longitude=-122.3936),  # Embarcadero
                    waypoint_coords=[
                        Coordinates(latitude=37.8024, longitude=-122.4414),  # Generic Marina area
                        Coordinates(latitude=37.7946, longitude=-122.4020),  # Financial District (not historic)
                    ],
                    constraints={
                        "transport_mode": "driving",
                        "avoid_tolls": False,
                        "avoid_stairs": False,
                        "avoid_hills": False,
                        "avoid_highways": True,
                    },
                ),
                # Route 1: Route with historic street waypoints
                ScoringRouteInput(
                    origin=Coordinates(latitude=37.8002, longitude=-122.4414),  # Marina
                    destination=Coordinates(latitude=37.7955, longitude=-122.3936),  # Embarcadero
                    waypoint_coords=[
                        Coordinates(latitude=37.8024, longitude=-122.4186),  # Lombard Street (historic)
                        Coordinates(latitude=37.8047, longitude=-122.4098),  # Columbus Avenue (historic)
                    ],
                    constraints={
                        "transport_mode": "driving",
                        "avoid_tolls": False,
                        "avoid_stairs": False,
                        "avoid_hills": False,
                        "avoid_highways": True,
                    },
                ),
            ],
            best_route_index=1,  # Historic streets route should score higher
        ),
        
        # Example 6: Noe Valley to Japantown - Route Takes Too Long
        # Route 0: Efficient route with parks (reasonable time)
        # Route 1: Route that goes way out of the way (takes too long) - should score lower
        ScoringGroundTruthExample(
            example_id="sf_noe_too_long_001",
            user_prompt="Drive from Noe Valley to Japantown, I want to pass by some scenic parks. I can spare 15 minutes.",
            route_inputs=[
                # Route 0: Efficient route with parks
                ScoringRouteInput(
                    origin=Coordinates(latitude=37.7506, longitude=-122.4331),  # Noe Valley
                    destination=Coordinates(latitude=37.7855, longitude=-122.4297),  # Japantown
                    waypoint_coords=[
                        Coordinates(latitude=37.7597, longitude=-122.4264),  # Mission Dolores Park
                    ],
                    constraints={
                        "transport_mode": "driving",
                        "avoid_tolls": False,
                        "avoid_stairs": False,
                        "avoid_hills": False,
                        "avoid_highways": True,
                    },
                ),
                # Route 1: Route that goes way out of the way (too long)
                ScoringRouteInput(
                    origin=Coordinates(latitude=37.7506, longitude=-122.4331),  # Noe Valley
                    destination=Coordinates(latitude=37.7855, longitude=-122.4297),  # Japantown
                    waypoint_coords=[
                        Coordinates(latitude=37.7694, longitude=-122.4862),  # Golden Gate Park (way out of way)
                        Coordinates(latitude=37.8033, longitude=-122.4654),  # Crissy Field (even further)
                        Coordinates(latitude=37.8065, longitude=-122.4387),  # Marina (backtracking)
                    ],
                    constraints={
                        "transport_mode": "driving",
                        "avoid_tolls": False,
                        "avoid_stairs": False,
                        "avoid_hills": False,
                        "avoid_highways": True,
                    },
                ),
            ],
            best_route_index=0,  # Efficient route should score higher (even with fewer waypoints)
        ),
        
        # Example 7: Union Square to Chinatown - Good vs Bad Waypoints
        # Route 0: Route with irrelevant waypoints (residential area)
        # Route 1: Route with relevant waypoints (historic streets/landmarks) - should score higher
        ScoringGroundTruthExample(
            example_id="sf_union_waypoints_001",
            user_prompt="Walk from Union Square to Chinatown, I want to see historic streets and landmarks.",
            route_inputs=[
                # Route 0: Route with bad waypoints (residential, not historic/landmarks)
                ScoringRouteInput(
                    origin=Coordinates(latitude=37.7880, longitude=-122.4075),  # Union Square
                    destination=Coordinates(latitude=37.7946, longitude=-122.4058),  # Chinatown
                    waypoint_coords=[
                        Coordinates(latitude=37.7764, longitude=-122.4247),  # Hayes Valley (residential, not historic)
                    ],
                    constraints={
                        "transport_mode": "walking",
                        "avoid_tolls": False,
                        "avoid_stairs": False,
                        "avoid_hills": False,
                        "avoid_highways": False,
                    },
                ),
                # Route 1: Route with good waypoints (historic streets/landmarks)
                ScoringRouteInput(
                    origin=Coordinates(latitude=37.7880, longitude=-122.4075),  # Union Square
                    destination=Coordinates(latitude=37.7946, longitude=-122.4058),  # Chinatown
                    waypoint_coords=[
                        Coordinates(latitude=37.7914, longitude=-122.4058),  # Historic street area
                        Coordinates(latitude=37.7946, longitude=-122.4058),  # Chinatown entrance (landmark)
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
            best_route_index=1,  # Route with good waypoints should score higher
        ),
        
        # Example 8: Financial District to Alcatraz Ferry - Wrong Destination
        # Route 0: Correct destination (Alcatraz Ferry)
        # Route 1: Wrong destination (Fisherman's Wharf instead) - should score lower
        ScoringGroundTruthExample(
            example_id="sf_fidi_wrong_dest_001",
            user_prompt="Drive from Financial District to Alcatraz ferry terminal, hug the waterfront and see some landmarks.",
            route_inputs=[
                # Route 0: Correct destination
                ScoringRouteInput(
                    origin=Coordinates(latitude=37.7946, longitude=-122.4020),  # Financial District
                    destination=Coordinates(latitude=37.8086, longitude=-122.4098),  # Alcatraz Ferry (correct)
                    waypoint_coords=[
                        Coordinates(latitude=37.8024, longitude=-122.4058),  # Telegraph Hill / Coit Tower
                    ],
                    constraints={
                        "transport_mode": "driving",
                        "avoid_tolls": False,
                        "avoid_stairs": False,
                        "avoid_hills": False,
                        "avoid_highways": True,
                    },
                ),
                # Route 1: Wrong destination (Fisherman's Wharf instead of ferry terminal)
                ScoringRouteInput(
                    origin=Coordinates(latitude=37.7946, longitude=-122.4020),  # Financial District
                    destination=Coordinates(latitude=37.8085, longitude=-122.4156),  # Fisherman's Wharf (wrong!)
                    waypoint_coords=[
                        Coordinates(latitude=37.8024, longitude=-122.4058),  # Telegraph Hill / Coit Tower
                    ],
                    constraints={
                        "transport_mode": "driving",
                        "avoid_tolls": False,
                        "avoid_stairs": False,
                        "avoid_hills": False,
                        "avoid_highways": True,
                    },
                ),
            ],
            best_route_index=0,  # Correct destination should score higher
        ),
        
        # Example 9: Embarcadero to Crissy Field - Route Takes Too Long
        # Route 0: Direct waterfront route (reasonable time)
        # Route 1: Route that goes way out of the way (takes too long) - should score lower
        ScoringGroundTruthExample(
            example_id="sf_embarcadero_too_long_001",
            user_prompt="Walk from Embarcadero to Crissy Field, stay as close to the waterfront as possible. I can spare 20 minutes.",
            route_inputs=[
                # Route 0: Efficient waterfront route
                ScoringRouteInput(
                    origin=Coordinates(latitude=37.7955, longitude=-122.3936),  # Embarcadero
                    destination=Coordinates(latitude=37.8033, longitude=-122.4654),  # Crissy Field
                    waypoint_coords=[
                        Coordinates(latitude=37.8065, longitude=-122.4387),  # Marina Green waterfront
                    ],
                    constraints={
                        "transport_mode": "walking",
                        "avoid_tolls": False,
                        "avoid_stairs": True,
                        "avoid_hills": False,
                        "avoid_highways": False,
                    },
                ),
                # Route 1: Route that goes way out of the way (too long)
                ScoringRouteInput(
                    origin=Coordinates(latitude=37.7955, longitude=-122.3936),  # Embarcadero
                    destination=Coordinates(latitude=37.8033, longitude=-122.4654),  # Crissy Field
                    waypoint_coords=[
                        Coordinates(latitude=37.8086, longitude=-122.4098),  # Pier 39
                        Coordinates(latitude=37.8085, longitude=-122.4156),  # Fisherman's Wharf
                        Coordinates(latitude=37.8056, longitude=-122.4225),  # Ghirardelli Square
                        Coordinates(latitude=37.8041, longitude=-122.4484),  # Palace of Fine Arts (way out of way)
                        Coordinates(latitude=37.8065, longitude=-122.4387),  # Marina Green (backtracking)
                    ],
                    constraints={
                        "transport_mode": "walking",
                        "avoid_tolls": False,
                        "avoid_stairs": True,
                        "avoid_hills": False,
                        "avoid_highways": False,
                    },
                ),
            ],
            best_route_index=0,  # Efficient route should score higher
        ),
        
        # Example 10: Hayes Valley to Golden Gate Park - Different Waypoint Sets
        # Route 0: Route with generic waypoints (not scenic/landmarks)
        # Route 1: Route with scenic landmark waypoints (Alamo Square) - should score higher
        ScoringGroundTruthExample(
            example_id="sf_hayes_waypoints_001",
            user_prompt="Drive from Hayes Valley to Golden Gate Park, take me through scenic streets and past some landmarks.",
            route_inputs=[
                # Route 0: Route with generic waypoints (not scenic/landmarks)
                ScoringRouteInput(
                    origin=Coordinates(latitude=37.7764, longitude=-122.4247),  # Hayes Valley
                    destination=Coordinates(latitude=37.7694, longitude=-122.4862),  # Golden Gate Park
                    waypoint_coords=[
                        Coordinates(latitude=37.7597, longitude=-122.4144),  # Mission District (not scenic)
                        Coordinates(latitude=37.7506, longitude=-122.4331),  # Noe Valley (residential)
                    ],
                    constraints={
                        "transport_mode": "driving",
                        "avoid_tolls": False,
                        "avoid_stairs": False,
                        "avoid_hills": False,
                        "avoid_highways": True,
                    },
                ),
                # Route 1: Route with scenic landmark waypoints
                ScoringRouteInput(
                    origin=Coordinates(latitude=37.7764, longitude=-122.4247),  # Hayes Valley
                    destination=Coordinates(latitude=37.7694, longitude=-122.4862),  # Golden Gate Park
                    waypoint_coords=[
                        Coordinates(latitude=37.7764, longitude=-122.4317),  # Alamo Square (Painted Ladies - landmark)
                    ],
                    constraints={
                        "transport_mode": "driving",
                        "avoid_tolls": False,
                        "avoid_stairs": False,
                        "avoid_hills": False,
                        "avoid_highways": True,
                    },
                ),
            ],
            best_route_index=1,  # Scenic/landmarks route should score higher
        ),
        
        # Example 11: SF Financial District to Golden Gate Park - Efficiency vs Scenic
        # Route 0: Direct route (fastest)
        # Route 1: Scenic route through landmarks (longer but more scenic)
        ScoringGroundTruthExample(
            example_id="sf_fidi_golden_gate_scoring_001",
            user_prompt="Drive from Financial District to Golden Gate Park. I want to see landmarks and take a scenic route, but I don't want it to take too long.",
            route_inputs=[
                # Route 0: Direct route (fastest, no waypoints)
                ScoringRouteInput(
                    origin=Coordinates(latitude=37.7946, longitude=-122.4020),  # Financial District
                    destination=Coordinates(latitude=37.7694, longitude=-122.4862),  # Golden Gate Park
                    waypoint_coords=[],
                    constraints={
                        "transport_mode": "driving",
                        "avoid_tolls": False,
                        "avoid_stairs": False,
                        "avoid_hills": False,
                        "avoid_highways": True,
                    },
                ),
                # Route 1: Scenic route with landmarks (should balance efficiency and scenic value)
                ScoringRouteInput(
                    origin=Coordinates(latitude=37.7946, longitude=-122.4020),  # Financial District
                    destination=Coordinates(latitude=37.7694, longitude=-122.4862),  # Golden Gate Park
                    waypoint_coords=[
                        Coordinates(latitude=37.8024, longitude=-122.4058),  # Telegraph Hill / Coit Tower (landmark)
                        Coordinates(latitude=37.7764, longitude=-122.4317),  # Alamo Square (landmark, scenic)
                    ],
                    constraints={
                        "transport_mode": "driving",
                        "avoid_tolls": False,
                        "avoid_stairs": False,
                        "avoid_hills": False,
                        "avoid_highways": True,
                    },
                ),
                # Route 2: Very long scenic route (too many waypoints, takes too long)
                ScoringRouteInput(
                    origin=Coordinates(latitude=37.7946, longitude=-122.4020),  # Financial District
                    destination=Coordinates(latitude=37.7694, longitude=-122.4862),  # Golden Gate Park
                    waypoint_coords=[
                        Coordinates(latitude=37.8024, longitude=-122.4058),  # Telegraph Hill
                        Coordinates(latitude=37.8047, longitude=-122.4098),  # North Beach
                        Coordinates(latitude=37.8006, longitude=-122.4581),  # Presidio
                        Coordinates(latitude=37.8033, longitude=-122.4654),  # Crissy Field
                        Coordinates(latitude=37.7764, longitude=-122.4317),  # Alamo Square
                    ],
                    constraints={
                        "transport_mode": "driving",
                        "avoid_tolls": False,
                        "avoid_stairs": False,
                        "avoid_hills": False,
                        "avoid_highways": True,
                    },
                ),
            ],
            best_route_index=1,  # Route 1 should score highest - good balance of scenic value and efficiency
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

