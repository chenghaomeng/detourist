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
You are a strict JSON generator. Parse the following user request and return a JSON object with extracted route parameters.

User request:
{user_prompt}

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

waypoint_queries MUST be selected exactly from the following candidate list of tags (pick up to {num_tags}):
{candidates_block}

If there is an EXACT waypoint mentioned in the user request, ALWAYS add it to the waypoint_queries in this format: "name=value", even if it doesn't appear in the candidate list.
For example, if the user explicitly says they want to stop by the Empire State Building on the way, you can add it to the waypoint_queries as "name=Empire State Building".
Do NOT add the Origin or Destination to the waypoint_queries. These should be extracted as the origin and destination parameters.

IMPORTANT WAYPOINT QUERY TAG SELECTION GUIDELINES:
- Prefer common tags over rare ones (e.g., "natural=water" over "waterway=seaway")
- For coastal/waterfront: prefer "natural=water", "natural=beach", "natural=coastline", "leisure=marina"
- For scenic/views: prefer "tourism=viewpoint", "leisure=park", "natural=peak"
- For parks/green: prefer "leisure=park", "leisure=garden", "landuse=forest"
- Avoid very specific tags that may not exist in urban areas

IMPORTANT EXTRACTION GUIDELINES:
- When extracting the Origin and Destination, always be as specific as possible and include the city or town.
- If time flexibility is not specified, set it to 10 minutes.
- Transport_mode must be either "walking" or "driving".
"""
