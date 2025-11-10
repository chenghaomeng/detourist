# Prompts used by the LLM extractor.

PREFERENCE_EXTRACTION_PROMPT = """Extract short, comma-separated preferences from a route request.

User request:
{user_prompt}

Return ONLY a comma-separated list of concise preference concepts (no extra text).
Examples of concepts: "parks, viewpoints, scenic, waterfront, coffee".
"""

def create_extraction_prompt_with_candidates(user_prompt: str, candidate_tags: list[str], num_tags: int) -> str:
    """
    Ask the LLM to produce a strict JSON object we can parse.

    Required JSON keys:
      origin (string)
      destination (string)
      time_flexibility_minutes (integer)
      waypoint_queries (array of strings length <= num_tags; MUST be chosen from the candidate list below)
      constraints (object: avoid_tolls, avoid_stairs, avoid_hills, avoid_highways, transport_mode)

    IMPORTANT:
    - waypoint_queries MUST be selected from this candidate list (exact key=value matches).
    - Return ONLY JSON, no backticks, no prose.
    """

    candidates_block = "\n".join(f"- {c}" for c in candidate_tags)
    return f"""
You are a strict JSON generator.

User request:
{user_prompt}

Candidate OSM tags (pick up to {num_tags}):
{candidates_block}

IMPORTANT SELECTION GUIDELINES:
- Prefer common tags over rare ones (e.g., "natural=water" over "waterway=seaway")
- For coastal/waterfront: prefer "natural=water", "natural=beach", "natural=coastline", "leisure=marina"
- For scenic/views: prefer "tourism=viewpoint", "leisure=park", "natural=peak"
- For parks/green: prefer "leisure=park", "leisure=garden", "landuse=forest"
- Avoid very specific tags that may not exist in urban areas

Return ONLY valid minified JSON (no markdown, no commentary) with this schema:
{{
  "origin": "string",
  "destination": "string",
  "time_flexibility_minutes": 10,
  "waypoint_queries": ["key=value", "..."],
  "constraints": {{
    "avoid_tolls": false,
    "avoid_stairs": false,
    "avoid_hills": false,
    "avoid_highways": false,
    "transport_mode": "driving"
  }}
}}
"""
