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
        # Example 1: SF Ferry Building to Palace of Fine Arts
        GroundTruthExample(
            example_id="sf_ferry_palace_001",
            user_prompt="Walk from San Francisco Ferry Building to Palace of Fine Arts; hug the waterfront, pass parks, avoid stairs; okay with up to 15 extra minutes.",
            origin_text="San Francisco Ferry Building",
            origin_coords=Coordinates(latitude=37.7954, longitude=-122.3936),
            destination_text="Palace of Fine Arts",
            destination_coords=Coordinates(latitude=37.8041, longitude=-122.4484),
            time_flexibility_minutes=15,
            constraints={
                "transport_mode": "walking",
                "avoid_tolls": False,
                "avoid_stairs": True,
                "avoid_hills": False,
                "avoid_highways": False,
            },
            preferences="waterfronts, parks",
            waypoint_coords=[
                Coordinates(latitude=37.8086, longitude=-122.4098),  # Pier 39
                Coordinates(latitude=37.8085, longitude=-122.4156),  # Fisherman's Wharf
                Coordinates(latitude=37.8056, longitude=-122.4225),  # Ghirardelli Square
                Coordinates(latitude=37.8065, longitude=-122.4387),  # Marina Greens
            ],
        ),
        
        # Example 2: SF Civic Center to Golden Gate Bridge Viewpoint
        GroundTruthExample(
            example_id="sf_civic_golden_gate_001",
            user_prompt="Avoid freeways until Presidio. Prefer Marina/Crissy Field/Palace of fine arts. Destination Golden Gate View Point. Starting point civic center",
            origin_text="Civic Center",
            origin_coords=Coordinates(latitude=37.7770, longitude=-122.4195),
            destination_text="Golden Gate Bridge Viewpoint",
            destination_coords=Coordinates(latitude=37.8294, longitude=-122.4860),
            time_flexibility_minutes=15,
            constraints={
                "transport_mode": "driving",
                "avoid_tolls": False,
                "avoid_stairs": True,
                "avoid_hills": False,
                "avoid_highways": True,
            },
            preferences="waterfronts",
            waypoint_coords=[
                Coordinates(latitude=37.8047, longitude=-122.4402),  # Marina Greens
                Coordinates(latitude=37.8050, longitude=-122.4491),  # Palace of Fine Arts
                Coordinates(latitude=37.8033, longitude=-122.4654),  # Crissy Field
                Coordinates(latitude=37.7796, longitude=-122.4673),  # Presidio
            ],
        ),
        
        # Example 3: Marina to FiDi
        GroundTruthExample(
            example_id="sf_marina_fidi_001",
            user_prompt="Marina to Embarcadero using Lombard across Russian Hill and Columbus through North Beach. Go through touristy spots.",
            origin_text="2301 Chestnut St (Marina)",
            origin_coords=Coordinates(latitude=37.8002, longitude=-122.4414),
            destination_text="Embarcadero, San Francisco, CA",
            destination_coords=Coordinates(latitude=37.7955, longitude=-122.3936),
            time_flexibility_minutes=15,
            constraints={
                "transport_mode": "driving",
                "avoid_tolls": False,
                "avoid_stairs": True,
                "avoid_hills": False,
                "avoid_highways": True,
            },
            preferences="historic_streets, landmarks",
            waypoint_coords=[
                Coordinates(latitude=37.8024, longitude=-122.4186),  # Lombard Street
                Coordinates(latitude=37.8047, longitude=-122.4098),  # Columbus Avenue
                Coordinates(latitude=37.7946, longitude=-122.4020),  # Transamerica
                Coordinates(latitude=37.8024, longitude=-122.4186),  # Russian Hill
            ],
        ),
        
        # Example 4: Noe Valley through Twin Peaks
        GroundTruthExample(
            example_id="sf_noe_twin_peaks_001",
            user_prompt="Noe Valley then scenic twin peaks drive and then back down to castro.",
            origin_text="Noe Valley (Clipper St.)",
            origin_coords=Coordinates(latitude=37.7506, longitude=-122.4331),
            destination_text="Market and Castro",
            destination_coords=Coordinates(latitude=37.7614, longitude=-122.4350),
            time_flexibility_minutes=15,
            constraints={
                "transport_mode": "driving",
                "avoid_tolls": False,
                "avoid_stairs": False,
                "avoid_hills": False,
                "avoid_highways": True,
            },
            preferences="hills_vistas, landmarks, scenic overlook",
            waypoint_coords=[
                Coordinates(latitude=37.7506, longitude=-122.4331),  # Noe Valley
                Coordinates(latitude=37.7506, longitude=-122.4331),  # Clipper St.
                Coordinates(latitude=37.7526, longitude=-122.4470),  # Twin Peaks Blvd Switch Backs
                Coordinates(latitude=37.7514, longitude=-122.4470),  # Twin Peaks overlook
                Coordinates(latitude=37.7506, longitude=-122.4331),  # Clarendon Ave
                Coordinates(latitude=37.7614, longitude=-122.4350),  # Market and Castro
            ],
        ),
        
        # Example 5: Chill Coffee in Noe then Japantown
        GroundTruthExample(
            example_id="sf_noe_japantown_001",
            user_prompt="Drive from la luccha coffee bar to japantown, pass by scenic sf parks.",
            origin_text="La Lucha Coffee Bar, Noe Valley",
            origin_coords=Coordinates(latitude=37.7506, longitude=-122.4331),
            destination_text="Japantown Peace Plaza (Post & Buchanan)",
            destination_coords=Coordinates(latitude=37.7855, longitude=-122.4297),
            time_flexibility_minutes=15,
            constraints={
                "transport_mode": "driving",
                "avoid_tolls": False,
                "avoid_stairs": True,
                "avoid_hills": False,
                "avoid_highways": True,
            },
            preferences="boulevards, landmarks, historic_streets, parks",
            waypoint_coords=[
                Coordinates(latitude=37.7506, longitude=-122.4331),  # La Lucha Coffee Bar
                Coordinates(latitude=37.7597, longitude=-122.4264),  # Dolores Street
                Coordinates(latitude=37.7597, longitude=-122.4264),  # Mission Dolores Park
                Coordinates(latitude=37.7764, longitude=-122.4317),  # Steiner St / Alamo Square (Painted Ladies)
                Coordinates(latitude=37.7855, longitude=-122.4297),  # Post St
                Coordinates(latitude=37.7855, longitude=-122.4297),  # Japantown Peace Plaza
            ],
        ),
        
        # Example 6: Civic Center to Coit Tower
        GroundTruthExample(
            example_id="sf_civic_coit_001",
            user_prompt="Go from civic center to coit tower. Take me through popular streets like close to chinatown or busy hilly cable car streets.",
            origin_text="Civic Center, San Francisco",
            origin_coords=Coordinates(latitude=37.7799, longitude=-122.4188),
            destination_text="Coit Tower, San Francisco",
            destination_coords=Coordinates(latitude=37.8024, longitude=-122.4058),
            time_flexibility_minutes=15,
            constraints={
                "transport_mode": "driving",
                "avoid_tolls": False,
                "avoid_stairs": True,
                "avoid_hills": False,
                "avoid_highways": True,
            },
            preferences="historic_streets, landmarks",
            waypoint_coords=[
                Coordinates(latitude=37.7799, longitude=-122.4188),  # Civic Center
                Coordinates(latitude=37.7895, longitude=-122.4206),  # Polk St
                Coordinates(latitude=37.7914, longitude=-122.4206),  # Bush St
                Coordinates(latitude=37.7946, longitude=-122.4058),  # Kearny St (Chinatown)
                Coordinates(latitude=37.8047, longitude=-122.4098),  # Columbus Ave (North Beach)
                Coordinates(latitude=37.8024, longitude=-122.4058),  # Telegraph Hill Blvd
                Coordinates(latitude=37.8024, longitude=-122.4058),  # Coit Tower
            ],
        ),
        
        # Example 7: Beach Chalet to Presidio Tunnel Tops
        GroundTruthExample(
            example_id="sf_beach_presidio_001",
            user_prompt="Beach Chalet restaurant to presidio tunnel tops, as much coastline as possible. Prefer cliffside roads rather than inner city streets.",
            origin_text="Beach Chalet Brewery & Restaurant",
            origin_coords=Coordinates(latitude=37.7694, longitude=-122.5094),
            destination_text="Presidio Tunnel Tops",
            destination_coords=Coordinates(latitude=37.8006, longitude=-122.4581),
            time_flexibility_minutes=15,
            constraints={
                "transport_mode": "driving",
                "avoid_tolls": False,
                "avoid_stairs": True,
                "avoid_hills": False,
                "avoid_highways": True,
            },
            preferences="waterfronts, parks, hills_vistas, landmarks",
            waypoint_coords=[
                Coordinates(latitude=37.7694, longitude=-122.5094),  # Great Highway
                Coordinates(latitude=37.7855, longitude=-122.5094),  # Sea Cliff / El Camino del Mar
                Coordinates(latitude=37.8199, longitude=-122.4783),  # Golden Gate Overlook (optional)
                Coordinates(latitude=37.8024, longitude=-122.4488),  # Lincoln Blvd
                Coordinates(latitude=37.8006, longitude=-122.4581),  # Presidio Tunnel Tops
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

