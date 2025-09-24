"""
LLM-based extraction module for parsing user prompts into structured parameters.

This module extracts:
1. Origin and Destination locations
2. Time flexibility (additional minutes willing to spend)
3. Waypoint queries (translated preferences)
4. Constraint parameters (avoid tolls, stairs, etc.)
"""

from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
import json


@dataclass
class ExtractedParameters:
    """Structured parameters extracted from user prompt."""
    origin: str
    destination: str
    time_flexibility_minutes: int
    waypoint_queries: List[str]
    constraints: Dict[str, bool]


class LLMExtractor:
    """Extracts structured parameters from natural language prompts."""
    
    def __init__(self, api_key: str):
        """Initialize with LLM API key."""
        self.api_key = api_key
    
    def extract_parameters(self, user_prompt: str) -> ExtractedParameters:
        """
        Extract structured parameters from user prompt.
        
        Args:
            user_prompt: Natural language description of desired route
            
        Returns:
            ExtractedParameters object with structured data
        """
        # TODO: Implement LLM-based extraction
        # This will use an LLM API to parse the prompt and extract:
        # - Origin/destination locations
        # - Time flexibility
        # - Waypoint preferences (e.g., "scenic" -> ["park", "viewpoint"])
        # - Constraints (avoid tolls, stairs, etc.)
        
        # Mock implementation for testing
        return ExtractedParameters(
            origin="Central Park, New York",
            destination="Times Square, New York",
            time_flexibility_minutes=15,
            waypoint_queries=["park", "scenic", "green"],
            constraints={"avoid_tolls": True, "avoid_stairs": True}
        )
    
    def _parse_preferences_to_queries(self, preferences: str) -> List[str]:
        """Convert user preferences to searchable waypoint queries."""
        # TODO: Map preferences like "scenic", "green", "quiet" to POI categories
        pass
    
    def _extract_constraints(self, prompt: str) -> Dict[str, bool]:
        """Extract routing constraints from prompt."""
        # TODO: Identify constraints like "avoid tolls", "no stairs", etc.
        pass
