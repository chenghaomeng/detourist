# backend/extraction/llm_extractor.py

from __future__ import annotations

from dataclasses import dataclass
from typing import List, Dict, Any, Optional
import os
import json
import logging
import textwrap

import requests

from backend.extraction.faiss_osm_validator import FAISSOSMTagValidator
from backend.extraction.prompts import create_extraction_prompt_with_candidates, PREFERENCE_EXTRACTION_PROMPT

logger = logging.getLogger(__name__)
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=LOG_LEVEL)


@dataclass
class ExtractedParameters:
    """
    Normalized parameters that the orchestrator expects.
    """
    origin: str
    destination: str
    time_flexibility_minutes: Optional[int]
    waypoint_queries: List[str]
    constraints: Dict[str, Any]
    preferences: str


class LLMExtractor:
    """
    Extracts structured routing parameters from a free-form user prompt
    using OpenAI's chat completions API.

    This implementation ignores the older multi-provider stack and talks
    directly to OpenAI, controlled by env vars:

      - OPENAI_API_KEY (or LLM_API_KEY)
      - OPENAI_MODEL   (defaults to gpt-4o-mini)
    """

    def __init__(self, llm_api_key: str = ""):
        # Prefer explicit key passed in, then env vars
        self.api_key = (
            (llm_api_key or "").strip()
            or os.getenv("OPENAI_API_KEY", "").strip()
            or os.getenv("LLM_API_KEY", "").strip()
        )
        if not self.api_key:
            logger.warning("[LLMExtractor] No API key set for OpenAI (OPENAI_API_KEY / LLM_API_KEY).")
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        self._validator = FAISSOSMTagValidator(include_descriptions_in_faiss_index=True)

        logger.info(
            "[LLMExtractor] Using OpenAI model=%s (key prefix=%s…)",
            self.model,
            (self.api_key[:8] + "…") if self.api_key else "(missing)",
        )

        # Base URL for legacy-style HTTP API
        self._base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")

    # ----------------- Public API -----------------

    def extract_parameters(self, user_prompt: str, num_tags: int = 5) -> ExtractedParameters:
        """
        Main entrypoint used by RouteOrchestrator.

        Pipeline:
          1) LLM extracts concise preference concepts (plain text, comma-separated).
          2) FAISS finds candidate OSM tags from those concepts.
          3) LLM receives the candidate list and returns STRICT JSON with origin/dest,
             time_flexibility_minutes, waypoint_queries (subset of candidates), constraints.
        """
        try:
            # Step 1: Preference concepts (plain text, comma separated)
            pref_prompt = PREFERENCE_EXTRACTION_PROMPT.format(user_prompt=user_prompt)
            preferences = self._call_openai_for_text(pref_prompt).strip()
            if not preferences:
                raise Exception("LLM returned empty preferences")

            # Step 2: FAISS lookup for candidate OSM tags based on those concepts
            candidate_tags = self._validator.get_candidate_tags(preferences, top_k=max(10, num_tags * 4))
            candidate_tag_strings = [f"{t.key}={t.value}" for t in candidate_tags]

            # Step 3: Strict JSON extraction using the hard candidate list
            extraction_prompt = create_extraction_prompt_with_candidates(user_prompt, candidate_tag_strings, num_tags)
            raw_json = self._call_openai_for_json(extraction_prompt)
            data = self._safe_json_parse(raw_json)

            params = self._create_extracted_parameters(data, preferences)
            logger.info("LLM extractor ok | origin=%s dest=%s tags=%s preferences=%s",
                         params.origin, params.destination, params.waypoint_queries, params.preferences)
            return params

        except Exception as e:
            logger.error("Error extracting parameters from prompt: %s", e, exc_info=True)
            raise Exception(f"Failed to extract parameters: {e}")

    # ----------------- OpenAI helpers -----------------

    def _call_openai_for_text(self, prompt: str) -> str:
        """
        Call OpenAI chat completions and return plain text response.
        Used for preference extraction (step 1).
        """
        if not self.api_key:
            raise RuntimeError(
                "No OpenAI API key configured. Set OPENAI_API_KEY or LLM_API_KEY."
            )

        body: Dict[str, Any] = {
            "model": self.model,
            "messages": [
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.1,
        }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        url = f"{self._base_url}/chat/completions"
        resp = requests.post(url, headers=headers, json=body, timeout=40)
        try:
            resp.raise_for_status()
        except Exception as e:
            text = None
            try:
                text = resp.text
            except Exception:
                pass
            logger.error(
                "[LLMExtractor] OpenAI HTTP error: %s (status=%s, body=%r)",
                e,
                resp.status_code,
                text,
            )
            raise

        js = resp.json()
        try:
            content = js["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error(
                "[LLMExtractor] Unexpected OpenAI response format: %s (json=%r)",
                e,
                js,
            )
            raise RuntimeError("Unexpected response format from OpenAI.")

        return content.strip()

    def _call_openai_for_json(self, prompt: str) -> str:
        """
        Call OpenAI chat completions and request a strict JSON response.

        Uses the "response_format": {"type": "json_object"} contract supported
        by the newer GPT-4o family models.
        """
        if not self.api_key:
            raise RuntimeError(
                "No OpenAI API key configured. Set OPENAI_API_KEY or LLM_API_KEY."
            )

        body: Dict[str, Any] = {
            "model": self.model,
            "messages": [
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.1,
            "response_format": {"type": "json_object"},
        }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        url = f"{self._base_url}/chat/completions"
        resp = requests.post(url, headers=headers, json=body, timeout=40)
        try:
            resp.raise_for_status()
        except Exception as e:
            # Log body to see quota / auth issues
            text = None
            try:
                text = resp.text
            except Exception:
                pass
            logger.error(
                "[LLMExtractor] OpenAI HTTP error: %s (status=%s, body=%r)",
                e,
                resp.status_code,
                text,
            )
            raise

        js = resp.json()
        try:
            content = js["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error(
                "[LLMExtractor] Unexpected OpenAI response format: %s (json=%r)",
                e,
                js,
            )
            raise RuntimeError("Unexpected response format from OpenAI.")

        return content

    def _create_extracted_parameters(self, data: Dict[str, Any], preferences: str) -> ExtractedParameters:
        """
        Create ExtractedParameters from parsed JSON data and preferences string.
        """
        constraints = data.get("constraints", {}) or {}
        if not isinstance(constraints, dict):
            constraints = {}

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
                "transport_mode": constraints.get("transport_mode", os.getenv("DEFAULT_TRANSPORT_MODE", "walking")),
            },
            preferences=preferences,
        )

    def _safe_json_parse(self, s: str) -> Dict[str, Any]:
        """
        Parse JSON from the model. If the model wrapped it in markdown fences,
        strip them first.
        """
        s = s.strip()
        # Strip ```json ... ``` if present
        if s.startswith("```"):
            lines = s.splitlines()
            # drop first and last fence lines
            inner = []
            for line in lines:
                if line.strip().startswith("```"):
                    continue
                inner.append(line)
            s = "\n".join(inner).strip()

        try:
            return json.loads(s)
        except Exception as e:
            logger.error("[LLMExtractor] Failed to parse JSON from model: %s; raw=%r", e, s)
            raise

#############################################################################################
######################## Old Code with Ollama model (commented out) #########################
#############################################################################################
# """
# LLM-based extraction for turning a user prompt into structured route parameters.
# Requires FAISS + sentence-transformers (handled in requirements.txt) and Ollama.

# Pipeline:
#   1) LLM extracts concise preference concepts (plain text, comma-separated).
#   2) FAISS finds candidate OSM tags from those concepts.
#   3) LLM receives the candidate list and returns STRICT JSON with origin/dest,
#      time_flexibility_minutes, waypoint_queries (subset of candidates), constraints.
# """

# from __future__ import annotations
# from typing import Dict, List
# from dataclasses import dataclass
# import json
# import logging

# from .llm_providers import LLMProviderManager
# from .prompts import create_extraction_prompt_with_candidates, PREFERENCE_EXTRACTION_PROMPT
# from .faiss_osm_validator import FAISSOSMTagValidator as OSMTagValidator


# @dataclass
# class ExtractedParameters:
#     origin: str
#     destination: str
#     time_flexibility_minutes: int
#     waypoint_queries: List[str]
#     constraints: Dict[str, object]
#     preferences: str  # Simplified, comma-separated preferences string


# class LLMExtractor:
#     def __init__(self, api_key: str = ""):
#         self.api_key = api_key
#         self.provider_manager = LLMProviderManager(api_key)
#         self.osm_validator = OSMTagValidator(include_descriptions_in_faiss_index=True)
#         self.logger = logging.getLogger(__name__)

#     def extract_parameters(self, user_prompt: str, num_tags: int = 5) -> ExtractedParameters:
#         try:
#             # 1) Preference concepts (plain text, comma separated)
#             pref_prompt = PREFERENCE_EXTRACTION_PROMPT.format(user_prompt=user_prompt)
#             preferences = self.provider_manager.extract_parameters(pref_prompt, expect_json=False).strip()
#             if not preferences:
#                 raise Exception("LLM returned empty preferences")

#             # 2) FAISS lookup for candidate OSM tags based on those concepts
#             candidate_tags = self.osm_validator.get_candidate_tags(preferences, top_k=max(10, num_tags * 4))
#             candidate_tag_strings = [f"{t.key}={t.value}" for t in candidate_tags]

#             # 3) Strict JSON extraction using the hard candidate list
#             extraction_prompt = create_extraction_prompt_with_candidates(user_prompt, candidate_tag_strings, num_tags)
#             raw = self.provider_manager.extract_parameters(extraction_prompt, expect_json=True)
#             data = self._parse_llm_response(raw)

#             params = self._create_extracted_parameters(data, preferences)
#             self.logger.info("LLM extractor ok | origin=%s dest=%s tags=%s preferences=%s",
#                              params.origin, params.destination, params.waypoint_queries, params.preferences)
#             return params

#         except Exception as e:
#             self.logger.error(f"Error extracting parameters: {e}")
#             raise Exception(f"Failed to extract parameters: {e}")

#     # ---------- helpers ----------

#     def _parse_llm_response(self, response: str) -> Dict:
#         """Parse JSON returned by the LLM. Accepts naked JSON or ```json fenced blocks."""
#         try:
#             txt = response.strip()
#             if txt.startswith("```json"):
#                 txt = txt[7:]
#             if txt.endswith("```"):
#                 txt = txt[:-3]
#             return json.loads(txt)
#         except Exception as e:
#             self.logger.error(f"Failed to parse LLM JSON: {e}. Response head: {response[:300]}")
#             raise

#     def _create_extracted_parameters(self, data: Dict, preferences: str) -> ExtractedParameters:
#         constraints = data.get("constraints", {}) or {}
#         wq = [q for q in data.get("waypoint_queries", []) if isinstance(q, str) and q.strip()]
#         return ExtractedParameters(
#             origin=data.get("origin", ""),
#             destination=data.get("destination", ""),
#             time_flexibility_minutes=int(data.get("time_flexibility_minutes", 10)),
#             waypoint_queries=wq[:10],
#             constraints={
#                 "avoid_tolls": bool(constraints.get("avoid_tolls", False)),
#                 "avoid_stairs": bool(constraints.get("avoid_stairs", False)),
#                 "avoid_hills": bool(constraints.get("avoid_hills", False)),
#                 "avoid_highways": bool(constraints.get("avoid_highways", False)),
#                 "transport_mode": constraints.get("transport_mode", "walking"),
#             },
#             preferences=preferences,
#         )
