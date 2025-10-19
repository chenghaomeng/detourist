"""
LLM-based extraction for turning a user prompt into structured route parameters.
Requires FAISS + sentence-transformers (handled in requirements.txt) and Ollama.

Pipeline:
  1) LLM extracts concise preference concepts (plain text, comma-separated).
  2) FAISS finds candidate OSM tags from those concepts.
  3) LLM receives the candidate list and returns STRICT JSON with origin/dest,
     time_flexibility_minutes, waypoint_queries (subset of candidates), constraints.
"""

from __future__ import annotations
from typing import Dict, List
from dataclasses import dataclass
import json
import logging

from .llm_providers import LLMProviderManager
from .prompts import create_extraction_prompt_with_candidates, PREFERENCE_EXTRACTION_PROMPT
from .faiss_osm_validator import FAISSOSMTagValidator as OSMTagValidator


@dataclass
class ExtractedParameters:
    origin: str
    destination: str
    time_flexibility_minutes: int
    waypoint_queries: List[str]
    constraints: Dict[str, object]


class LLMExtractor:
    def __init__(self, api_key: str = ""):
        self.api_key = api_key
        self.provider_manager = LLMProviderManager(api_key)
        self.osm_validator = OSMTagValidator(include_descriptions_in_faiss_index=True)
        self.logger = logging.getLogger(__name__)

    def extract_parameters(self, user_prompt: str, num_tags: int = 5) -> ExtractedParameters:
        try:
            # 1) Preference concepts (plain text, comma separated)
            pref_prompt = PREFERENCE_EXTRACTION_PROMPT.format(user_prompt=user_prompt)
            preferences = self.provider_manager.extract_parameters(pref_prompt, expect_json=False).strip()
            if not preferences:
                raise Exception("LLM returned empty preferences")

            # 2) FAISS lookup for candidate OSM tags based on those concepts
            candidate_tags = self.osm_validator.get_candidate_tags(preferences, top_k=max(10, num_tags * 4))
            candidate_tag_strings = [f"{t.key}={t.value}" for t in candidate_tags]

            # 3) Strict JSON extraction using the hard candidate list
            extraction_prompt = create_extraction_prompt_with_candidates(user_prompt, candidate_tag_strings, num_tags)
            raw = self.provider_manager.extract_parameters(extraction_prompt, expect_json=True)
            data = self._parse_llm_response(raw)

            params = self._create_extracted_parameters(data)
            self.logger.info("LLM extractor ok | origin=%s dest=%s tags=%s",
                             params.origin, params.destination, params.waypoint_queries)
            return params

        except Exception as e:
            self.logger.error(f"Error extracting parameters: {e}")
            raise Exception(f"Failed to extract parameters: {e}")

    # ---------- helpers ----------

    def _parse_llm_response(self, response: str) -> Dict:
        """Parse JSON returned by the LLM. Accepts naked JSON or ```json fenced blocks."""
        try:
            txt = response.strip()
            if txt.startswith("```json"):
                txt = txt[7:]
            if txt.endswith("```"):
                txt = txt[:-3]
            return json.loads(txt)
        except Exception as e:
            self.logger.error(f"Failed to parse LLM JSON: {e}. Response head: {response[:300]}")
            raise

    def _create_extracted_parameters(self, data: Dict) -> ExtractedParameters:
        constraints = data.get("constraints", {}) or {}
        wq = [q for q in data.get("waypoint_queries", []) if isinstance(q, str) and q.strip()]
        return ExtractedParameters(
            origin=data.get("origin", ""),
            destination=data.get("destination", ""),
            time_flexibility_minutes=int(data.get("time_flexibility_minutes", 10)),
            waypoint_queries=wq[:10],
            constraints={
                "avoid_tolls": bool(constraints.get("avoid_tolls", False)),
                "avoid_stairs": bool(constraints.get("avoid_stairs", False)),
                "avoid_hills": bool(constraints.get("avoid_hills", False)),
                "avoid_highways": bool(constraints.get("avoid_highways", False)),
                "transport_mode": constraints.get("transport_mode", "walking"),
            },
        )
