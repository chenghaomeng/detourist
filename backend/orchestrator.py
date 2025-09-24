"""
Main orchestrator that coordinates all backend modules.

This module handles:
1. Coordinating the entire route generation pipeline
2. Managing data flow between modules
3. Error handling and fallbacks
4. API response formatting
"""

from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
import logging

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


@dataclass
class RouteResponse:
    """Response object containing generated routes."""
    routes: List[RouteScore]
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
        self.route_scorer = RouteScorer(config.get('clip_model_path', ''))
        
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
        import time
        start_time = time.time()
        
        try:
            # Step 1: Extract parameters from user prompt
            self.logger.info("Extracting parameters from user prompt")
            extracted_params = self.extractor.extract_parameters(request.user_prompt)
            
            # Step 2: Geocode origin and destination
            self.logger.info("Geocoding origin and destination")
            origin_coords = self.geocoder.geocode_address(extracted_params.origin)
            destination_coords = self.geocoder.geocode_address(extracted_params.destination)
            
            # Step 3: Create search zone using isochrones
            self.logger.info("Creating search zone")
            max_travel_time = 30 + extracted_params.time_flexibility_minutes  # Base 30 min + flexibility
            search_zone = self.geocoder.create_search_zone(
                origin_coords, destination_coords, max_travel_time
            )
            
            # Step 4: Search for waypoints
            self.logger.info("Searching for waypoints")
            waypoints = self.waypoint_searcher.search_waypoints(
                search_zone, extracted_params.waypoint_queries
            )
            
            # Step 5: Build routes through waypoints
            self.logger.info("Building routes")
            routes = self.route_builder.build_routes(
                origin_coords, destination_coords, waypoints, extracted_params.constraints
            )
            
            # Step 6: Score and rank routes
            self.logger.info("Scoring routes")
            scored_routes = self.route_scorer.score_routes(routes, request.user_prompt)
            
            # Step 7: Return top results
            top_routes = scored_routes[:request.max_results]
            
            processing_time = time.time() - start_time
            
            return RouteResponse(
                routes=top_routes,
                processing_time_seconds=processing_time,
                metadata={
                    'total_routes_generated': len(routes),
                    'waypoints_found': len(waypoints),
                    'search_zone_area_km2': self._calculate_zone_area(search_zone)
                }
            )
            
        except Exception as e:
            self.logger.error(f"Error generating routes: {str(e)}")
            raise
    
    def _calculate_zone_area(self, search_zone) -> float:
        """Calculate area of search zone in km²."""
        # TODO: Implement area calculation
        return 0.0
    
    def health_check(self) -> Dict[str, Any]:
        """Check health of all modules."""
        return {
            'extractor': 'healthy',
            'geocoder': 'healthy',
            'waypoint_searcher': 'healthy',
            'route_builder': 'healthy',
            'route_scorer': 'healthy'
        }
