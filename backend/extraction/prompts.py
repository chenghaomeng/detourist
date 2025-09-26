from typing import List

# Preference extraction prompt for FAISS search
PREFERENCE_EXTRACTION_PROMPT = """You are a route planning assistant. Extract ONLY the user's preferences and interests from their route request.

USER REQUEST: "{user_prompt}"

Extract and return ONLY the preferences and interests that would help find relevant places/amenities along the route. 
Focus on:
- Types of places they want to see (coffee shops, parks, waterfronts, etc.)
- Activities they want to do (walking, cycling, scenic views, etc.)
- Atmosphere preferences (quiet, bustling, scenic, etc.)
- Specific amenities or features they mentioned

Respond with ONLY a clean, concise list of preferences separated by commas. Do not include origin/destination or constraints. Do not include any extra text besides the list.

Example:
User: "Take me from Union Square to Golden Gate Park, avoiding hills. I want to see coffee shops and waterfronts."
Response: "coffee shops, waterfronts, scenic views"

Example:
User: "Route from downtown to the beach, I need bike lanes and want to stop at parks"
Response: "bike lanes, parks, beach access"
"""

# Enhanced extraction prompt template with FAISS candidate selection
def create_extraction_prompt_with_candidates(user_prompt: str, candidate_tags: List[str], num_tags: int = 5) -> str:
    """Create the extraction prompt with candidate OSM tags for LLM selection."""
    candidate_text = "\n".join([f"- {tag}" for tag in candidate_tags])
    return f"""You are a route planning assistant. Extract structured information from the user's route request.

USER REQUEST: "{user_prompt}"

CANDIDATE OSM TAGS (choose the most relevant ones):
{candidate_text}

Please extract the following information and respond with ONLY a valid JSON object:

1. ORIGIN: The starting location (be specific with city/neighborhood if mentioned)
2. DESTINATION: The ending location (be specific with city/neighborhood if mentioned)
3. TIME_FLEXIBILITY: How many extra minutes the user is willing to spend (extract from phrases like "extra 15 minutes", "spare 20 minutes", "willing to spend X more minutes")
4. WAYPOINT_QUERIES: Select the {num_tags} MOST RELEVANT OSM tags from the candidates above that match the user's preferences. 
   - Return them in order of relevance (best match first)
   - Use the format "key=value" (e.g., "amenity=cafe", "leisure=park")
   - Choose exactly {num_tags} tags, no more, no less
5. CONSTRAINTS: Extract routing constraints:
   - "avoid tolls" → avoid_tolls: true
   - "no stairs" → avoid_stairs: true
   - "avoid hills" → avoid_hills: true
   - "no highways" → avoid_highways: true
   - "walking only" → transport_mode: "walking"

RESPOND WITH ONLY THIS JSON FORMAT. DO NOT ADD ANY OTHER TEXT. DO NOT INCLUDE ANY EXPLANATORY COMMENTS:
{{
    "origin": "specific location",
    "destination": "specific location", 
    "time_flexibility_minutes": number,
    "waypoint_queries": ["key=value", "key=value", "key=value", "key=value", "key=value"],
    "constraints": {{
        "avoid_tolls": boolean,
        "avoid_stairs": boolean,
        "avoid_hills": boolean,
        "avoid_highways": boolean,
        "transport_mode": "walking|driving|cycling"
    }}
}}

If information is not specified, use reasonable defaults:
- time_flexibility_minutes: 10
- waypoint_queries: [] (only include tags from the candidates above, exactly {num_tags} tags)
- constraints: {{"avoid_tolls": false, "avoid_stairs": false, "avoid_hills": false, "avoid_highways": false, "transport_mode": "walking"}}"""
