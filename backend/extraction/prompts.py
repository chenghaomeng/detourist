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
    "transport_mode": "walking"
  }}
}}

IMPORTANT:
- waypoint_queries MUST be selected from the candidate list (exact key=value matches).
- when extracting the origin and destination, always be as specific as possible and include the city or town.
"""
