"""
LLM-based extraction module for parsing user prompts into structured parameters.

This module extracts:
1. Origin and Destination locations
2. Time flexibility (additional minutes willing to spend)
3. Waypoint queries (translated preferences)
4. Constraint parameters (avoid tolls, stairs, etc.)
"""

from typing import Dict, List
from dataclasses import dataclass
import json
import logging
from .llm_providers import LLMProviderManager
from .prompts import create_extraction_prompt_with_candidates, PREFERENCE_EXTRACTION_PROMPT
from .faiss_osm_validator import FAISSOSMTagValidator as OSMTagValidator


@dataclass
class ExtractedParameters:
    """Structured parameters extracted from user prompt."""
    origin: str
    destination: str
    time_flexibility_minutes: int
    waypoint_queries: List[str]
    constraints: Dict[str, bool]


class LLMExtractor:
    """Extracts structured parameters from natural language prompts using multiple LLM providers."""
    
    def __init__(self, api_key: str = ""):
        """Initialize with LLM provider manager and OSM tag validator."""
        self.api_key = api_key  # For future LLM providers that need API keys
        self.provider_manager = LLMProviderManager(api_key)
        # Whether to include descriptions when building the FAISS index
        self.osm_validator = OSMTagValidator(include_descriptions_in_faiss_index=True)
        self.logger = logging.getLogger(__name__)
    
    def extract_parameters(self, user_prompt: str, num_tags: int = 5) -> ExtractedParameters:
        """
        Extract structured parameters from user prompt using two-step LLM process:
        1. Extract preferences for FAISS search
        2. Extract full parameters with FAISS candidates
        
        Args:
            user_prompt: Natural language description of desired route
            num_tags: Number of waypoint query tags to extract (default: 5)
            
        Returns:
            ExtractedParameters object with structured data
        """
        try:
            # Step 1: Extract preferences for cleaner FAISS search
            preferences = self._extract_preferences(user_prompt)
            
            # Step 2: Get candidate OSM tags using cleaned preferences
            candidate_tags = self.osm_validator.get_candidate_tags(preferences, top_k=30)
            candidate_tag_strings = [f"{tag.key}={tag.value}" for tag in candidate_tags]
            
            # Step 3: Extract full parameters with FAISS candidates
            extraction_prompt = create_extraction_prompt_with_candidates(user_prompt, candidate_tag_strings, num_tags)
            response = self.provider_manager.extract_parameters(extraction_prompt)
            
            # Parse the response
            extracted_data = self._parse_llm_response(response)
            
            # Convert to ExtractedParameters object
            extracted_params = self._create_extracted_parameters(extracted_data)
            
            # Print extraction results to console for debugging
            print("\n" + "="*60)
            print("🔍 LLM EXTRACTION DEBUG")
            print("="*60)
            print(f"📝 User Prompt: {user_prompt}")
            print(f"🔍 Extracted Preferences: {preferences}")
            print(f"🏷️  Candidate Tags ({len(candidate_tag_strings)}): {', '.join(candidate_tag_strings)}")
            print(f"📍 Origin: {extracted_params.origin}")
            print(f"🎯 Destination: {extracted_params.destination}")
            print(f"⏱️  Time Flexibility: {extracted_params.time_flexibility_minutes} minutes")
            print(f"🔍 Waypoint Queries: {extracted_params.waypoint_queries}")
            print(f"⚙️  Constraints: {extracted_params.constraints}")
            print("="*60 + "\n")
            
            self.logger.info(f"Selected waypoint queries from candidates: {extracted_params.waypoint_queries}")
            
            return extracted_params
            
        except Exception as e:
            self.logger.error(f"Error extracting parameters: {str(e)}")
            # Fallback to mock data if LLM fails
            return self._get_fallback_parameters(user_prompt)
    
    
    
    def _parse_llm_response(self, response: str) -> Dict:
        """Parse LLM response and extract JSON."""
        try:
            # Clean the response - remove any markdown formatting
            cleaned_response = response.strip()
            if cleaned_response.startswith("```json"):
                cleaned_response = cleaned_response[7:]
            if cleaned_response.endswith("```"):
                cleaned_response = cleaned_response[:-3]
            
            # Parse JSON
            return json.loads(cleaned_response.strip())
            
        except json.JSONDecodeError as e:
            self.logger.error(f"JSON parsing error: {str(e)}")
            self.logger.error(f"Response was: {response}")
            raise Exception(f"Failed to parse LLM response as JSON: {str(e)}")
    
    def _create_extracted_parameters(self, data: Dict) -> ExtractedParameters:
        """Convert parsed data to ExtractedParameters object."""
        constraints = data.get("constraints", {})
        
        return ExtractedParameters(
            origin=data.get("origin", ""),
            destination=data.get("destination", ""),
            time_flexibility_minutes=data.get("time_flexibility_minutes", 10),
            waypoint_queries=data.get("waypoint_queries", []),
            constraints={
                "avoid_tolls": constraints.get("avoid_tolls", False),
                "avoid_stairs": constraints.get("avoid_stairs", False),
                "avoid_hills": constraints.get("avoid_hills", False),
                "avoid_highways": constraints.get("avoid_highways", False),
                "transport_mode": constraints.get("transport_mode", "walking")
            }
        )
    
    def _extract_preferences(self, user_prompt: str) -> str:
        """
        Extract user preferences for cleaner FAISS search.
        
        Args:
            user_prompt: Natural language description of desired route
            
        Returns:
            Clean string of preferences for FAISS search
        """
        try:
            # Create preference extraction prompt
            preference_prompt = PREFERENCE_EXTRACTION_PROMPT.format(user_prompt=user_prompt)
            
            # Call LLM to extract preferences (expect plain text, not JSON)
            preferences = self.provider_manager.extract_parameters(preference_prompt, expect_json=False)
            
            # Clean up the response (remove any extra text)
            preferences = preferences.strip()
            
            self.logger.info(f"🎯 Extracted preferences: {preferences}")
            return preferences
            
        except Exception as e:
            self.logger.warning(f"Preference extraction failed: {str(e)}")
            # Fallback to using original prompt
            return user_prompt
    
    def _get_fallback_parameters(self, user_prompt: str) -> ExtractedParameters:
        """Provide fallback parameters when LLM extraction fails."""
        self.logger.warning("Using fallback parameters due to LLM extraction failure")
        
        # Simple fallback - return basic parameters
        return ExtractedParameters(
            origin="Central Park, New York",  # Default fallback
            destination="Times Square, New York",  # Default fallback
            time_flexibility_minutes=10,
            waypoint_queries=[],  # Empty - let FAISS handle it
            constraints={
                "avoid_tolls": False,
                "avoid_stairs": False,
                "avoid_hills": False,
                "avoid_highways": False,
                "transport_mode": "walking"
            }
        )
