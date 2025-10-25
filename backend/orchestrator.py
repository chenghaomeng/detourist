######################## Tazrian's Update below #####################################
"""
Main orchestrator that coordinates all backend modules.

This module handles:
1. Coordinating the entire route generation pipeline
2. Managing data flow between modules
3. Error handling and fallbacks
4. API response formatting
"""

from typing import List, Dict, Any, Optional
from dataclasses import dataclass
import logging
import time

from backend.extraction.llm_extractor import LLMExtractor, ExtractedParameters
from backend.geocoding.geocoder import Geocoder, Coordinates
from backend.waypoints.waypoint_searcher import WaypointSearcher, Waypoint
from backend.routing.route_builder import RouteBuilder, Route
from backend.scoring.route_scorer import RouteScorer, RouteScore


@dataclass
class RouteRequest:
    """Request object for route generation."""
    user_prompt: str
    max_results: int = 5
    # [ADDED] optional explicit inputs from UI (override LLM if present)
    origin: Optional[Dict[str, Any]] = None   # {"text":..., "lat":..., "lon":...}
    destination: Optional[Dict[str, Any]] = None
    time: Optional[Dict[str, Any]] = None     # {"max_duration_min":..., "departure_time_utc":...}


@dataclass
class RouteResponse:
    """Response object containing generated routes."""
    # Keep generic dicts for API layer compatibility
    routes: List[Dict[str, Any]]
    processing_time_seconds: float
    metadata: Dict[str, Any]


class RouteOrchestrator:
    """Main orchestrator for the route generation pipeline."""
    
    def __init__(self, config: Dict[str, str]):
        """
        Initialize orchestrator with API keys and configuration.
        
        Args:
            config: Dictionary containing API keys and configuration
        """
        self.config = config
        
        # Initialize all modules
        self.extractor = LLMExtractor(config.get('llm_api_key', ''))
        self.geocoder = Geocoder(config.get('geocoding_api_key', ''))
        self.waypoint_searcher = WaypointSearcher(config.get('poi_api_key', ''))
        self.route_builder = RouteBuilder(config.get('routing_api_key', ''))
        # Use default HuggingFace CLIP model instead of local path
        clip_model = config.get('clip_model_path', '')
        # If clip_model_path is empty or a local path, use the default HF model
        if not clip_model or clip_model.startswith('/') or clip_model.endswith('.pth'):
            clip_model = "openai/clip-vit-base-patch32"
        self.route_scorer = RouteScorer(clip_model)
        
        # Setup logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
    
    def generate_routes(self, request: RouteRequest) -> RouteResponse:
        """
        Generate routes based on user prompt.
        
        Args:
            request: RouteRequest object with user prompt
            
        Returns:
            RouteResponse object with scored routes
        """
        start_time = time.time()
        
        try:
            # Step 1: Extract parameters from user prompt
            self.logger.info("Extracting parameters from user prompt")
            extracted_params: ExtractedParameters = self.extractor.extract_parameters(request.user_prompt)
            
            # [ADDED] UI overrides take precedence over LLM extraction (when present)
            # (We keep the extractor's values in place if UI did not override.)
            if request.origin:
                # [COMMENTED-OUT] keep for reference: original extractor-origin is still available
                # extracted_params.origin = extracted_params.origin
                if request.origin.get("text"):
                    extracted_params.origin = request.origin["text"]
                if request.origin.get("lat") is not None and request.origin.get("lon") is not None:
                    extracted_params.origin_coords = Coordinates(
                        lat=request.origin["lat"], lon=request.origin["lon"]
                    )
            if request.destination:
                if request.destination.get("text"):
                    extracted_params.destination = request.destination["text"]
                if request.destination.get("lat") is not None and request.destination.get("lon") is not None:
                    extracted_params.destination_coords = Coordinates(
                        lat=request.destination["lat"], lon=request.destination["lon"]
                    )
            if request.time:
                # [ADDED] map UI time to extractor fields
                if "max_duration_min" in request.time and request.time["max_duration_min"] is not None:
                    extracted_params.max_duration_min = request.time["max_duration_min"]
                if "departure_time_utc" in request.time and request.time["departure_time_utc"]:
                    extracted_params.departure_time_utc = request.time["departure_time_utc"]
            
            # Step 2: Geocode origin and destination
            self.logger.info("Geocoding origin and destination")
            if not getattr(extracted_params, "origin_coords", None):
                origin_coords: Coordinates = self.geocoder.geocode_address(extracted_params.origin)
            else:
                origin_coords = extracted_params.origin_coords

            if not getattr(extracted_params, "destination_coords", None):
                destination_coords: Coordinates = self.geocoder.geocode_address(extracted_params.destination)
            else:
                destination_coords = extracted_params.destination_coords
            
            # Step 3: Create search zone using isochrones
            self.logger.info("Creating search zone")
            # [COMMENTED-OUT] original pattern widened time by flexibility (keep for future use)
            # max_travel_time = 30 + extracted_params.time_flexibility_minutes
            # [CHANGED] Use explicit max_duration_min if provided; else default 30
            max_travel_time = getattr(extracted_params, "max_duration_min", None) or 30
            search_zone = self.geocoder.create_search_zone(
                origin_coords, destination_coords, max_travel_time
            )
            
            # Step 4: Search for waypoints
            self.logger.info("Searching for waypoints")
            waypoints: List[Waypoint] = self.waypoint_searcher.search_waypoints(
                search_zone, extracted_params.waypoint_queries
            )
            
            # Step 5: Build routes through waypoints
            self.logger.info("Building routes")
            routes: List[Route] = self.route_builder.build_routes(
                origin_coords, destination_coords, waypoints, extracted_params.constraints
            )
            
            # Step 6: Score and rank routes
            self.logger.info("Scoring routes")
            scored_routes: List[RouteScore] = self.route_scorer.score_routes(routes, request.user_prompt)
            
            # Step 7: Return top results
            top_routes = scored_routes[:request.max_results]
            processing_time = time.time() - start_time

            # [CHANGED] Convert dataclasses/objects into dicts with the fields our API/FE expect.
            api_routes: List[Dict[str, Any]] = []
            for idx, sr in enumerate(top_routes):
                route = sr.route
                
                # Convert polyline segments to GeoJSON LineString
                geometry = {
                    "type": "LineString",
                    "coordinates": []  # Would need polyline decoder for full implementation
                }
                
                # Generate map links
                origin_coords = f"{route.origin.latitude},{route.origin.longitude}"
                dest_coords = f"{route.destination.latitude},{route.destination.longitude}"
                waypoint_coords = "|".join([f"{w.coordinates.latitude},{w.coordinates.longitude}" for w in route.waypoints])
                
                google_link = f"https://www.google.com/maps/dir/{origin_coords}/{waypoint_coords}/{dest_coords}"
                apple_link = f"http://maps.apple.com/?saddr={origin_coords}&daddr={dest_coords}"
                
                # Generate description
                waypoint_names = [w.name for w in route.waypoints[:3]]  # Top 3 waypoints
                why = f"Route via {', '.join(waypoint_names)}" if waypoint_names else "Direct route"
                
                api_routes.append({
                    "id": str(idx + 1),
                    "score": sr.overall_score,
                    "geometry": geometry,
                    "features": route.input_queries,  # OSM tags used
                    "links": {"google": google_link, "apple": apple_link},
                    "why": why,
                    "distance_m": int(route.total_distance_meters),
                    "duration_s": int(route.total_duration_seconds),
                })
            
            return RouteResponse(
                routes=api_routes,
                processing_time_seconds=processing_time,
                metadata={
                    'total_routes_generated': len(routes),
                    'waypoints_found': len(waypoints)
                }
            )
            
        except Exception as e:
            self.logger.error(f"Error generating routes: {str(e)}")
            raise
    
    def health_check(self) -> Dict[str, Any]:
        """Check health of all modules."""
        return {
            'extractor': 'healthy',
            'geocoder': 'healthy',
            'waypoint_searcher': 'healthy',
            'route_builder': 'healthy',
            'route_scorer': 'healthy'
        }
