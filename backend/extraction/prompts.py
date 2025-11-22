# Prompts used by the LLM extractor.

PREFERENCE_EXTRACTION_PROMPT = """
Extract a short, comma-separated list of preferences from a route request.

User request:
{user_prompt}

Return ONLY a comma-separated list of concise preference concepts (do not include any other text such as "here are the preferences").
Examples of concepts: "parks, viewpoints, scenic, waterfront, coffee".

DO NOT INCLUDE ANY "AVOID" PREFERENCES FROM THE FOLLOWING LIST:
avoid_tolls, avoid_stairs, avoid_hills, avoid_highways
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
    "transport_mode": "walking"
  }}
}}

IMPORTANT:
- waypoint_queries MUST be selected from the candidate list (exact key=value matches).
- when extracting the origin and destination, always be as specific as possible and include the city or town.
- if time flexibility is not specified, set it to 10 minutes.
- transport_mode must be either "walking" or "driving".
"""
