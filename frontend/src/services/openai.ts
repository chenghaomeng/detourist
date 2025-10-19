import OpenAI from 'openai';

interface RouteExtraction {
  origin: string;
  destination: string;
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Note: This exposes API key in browser - not for production!
});

/**
 * Extract origin and destination from a natural language route query using OpenAI GPT-4o-mini
 * @param query - User's natural language route description
 * @returns Object containing origin and destination
 */
export async function extractRouteFromQuery(query: string): Promise<RouteExtraction> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that extracts route information from natural language queries.
Extract the starting location (origin) and destination from the user's route query.
Return ONLY a JSON object with "origin" and "destination" fields.
If the origin is not specified, use "Current Location" as the origin.
Be specific with location names and include city/state when mentioned.

Examples:
- "Take me to Golden Gate Bridge" -> {"origin": "Current Location", "destination": "Golden Gate Bridge, San Francisco, CA"}
- "Route from downtown SF to Marin County" -> {"origin": "Downtown San Francisco, CA", "destination": "Marin County, CA"}
- "Calm scenic route to Marin County" -> {"origin": "Current Location", "destination": "Marin County, CA"}`
        },
        {
          role: "user",
          content: query
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    const extraction: RouteExtraction = JSON.parse(responseContent);
    
    console.log('OpenAI Route Extraction:', extraction);
    
    return extraction;
  } catch (error) {
    console.error('Error extracting route from query:', error);
    throw new Error(`Failed to extract route: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

