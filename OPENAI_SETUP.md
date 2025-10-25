# OpenAI and Google Maps Integration Setup

This guide explains how to set up the OpenAI GPT-4o-mini integration for route extraction and Google Maps Directions API for route display.

## Prerequisites

1. **OpenAI API Key**
   - Sign up at https://platform.openai.com/
   - Create an API key at https://platform.openai.com/api-keys
   - **Note**: This integration uses client-side API calls, which exposes your API key in the browser. This is NOT production-ready and is only for development/demo purposes.

2. **Google Maps API Key**
   - Create a project in Google Cloud Console: https://console.cloud.google.com/
   - Enable the following APIs:
     - Maps JavaScript API
     - Directions API
   - Create an API key at https://console.cloud.google.com/apis/credentials
   - (Optional) Restrict the API key to specific domains for security

## Installation

1. Install frontend dependencies (including OpenAI SDK):
```bash
cd frontend
npm install
```

2. Create a `.env` file in the `frontend/` directory:
```bash
cd frontend
cp .env.example .env  # or create manually
```

3. Add your API keys to `frontend/.env`:
```env
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
```

## Running the Application

1. Start the development server:
```bash
cd frontend
npm run dev
```

2. Open your browser to the URL shown (typically http://localhost:5173)

3. Try a natural language query like:
   - "Take me to Golden Gate Bridge"
   - "Route from downtown SF to Marin County"
   - "Calm scenic route to Sausalito"

## How It Works

### Architecture

1. **User Input**: User enters a natural language route query
2. **OpenAI Extraction**: Query is sent to GPT-4o-mini to extract origin and destination
3. **Google Directions**: Extracted locations are sent to Google Maps Directions API
4. **Route Display**: Routes are displayed on the map with turn-by-turn directions

### Key Files

- `frontend/src/services/openai.ts` - OpenAI GPT-4o-mini integration
- `frontend/src/services/directions.ts` - Google Maps Directions API wrapper
- `frontend/src/components/NaturalSearchFlow.tsx` - Main search flow logic
- `frontend/src/components/SemanticMapView.tsx` - Map display with route rendering
- `frontend/src/App.tsx` - Root component with state management

### Flow Diagram

```
User Query → OpenAI GPT-4o-mini → Extract {origin, destination}
                                         ↓
                                 Google Directions API
                                         ↓
                              Route Data {polyline, duration, distance}
                                         ↓
                                 Map Display (DirectionsRenderer)
```

## Limitations

### Security
- ⚠️ **API keys are exposed in the browser** - This is not production-ready!
- For production, move OpenAI calls to a backend service
- Consider using environment-specific API keys with rate limits

### Cost Considerations
- OpenAI GPT-4o-mini: ~$0.15 per 1M input tokens
- Google Directions API: $5 per 1000 requests (with $200 free credit/month)

### Known Issues
- No caching of OpenAI responses (each query costs API credits)
- No rate limiting on client side
- Limited error handling for network failures
- No fallback for "Current Location" - user must allow geolocation or specify origin

## Next Steps

To make this production-ready:

1. **Move to Backend**: Create a backend endpoint that:
   - Accepts the user query
   - Calls OpenAI server-side (keeps API key secure)
   - Calls Google Directions API
   - Returns the processed route data

2. **Add Caching**: Cache OpenAI responses for similar queries

3. **Add Rate Limiting**: Implement rate limiting to prevent abuse

4. **Add Geolocation**: Use browser geolocation API to get actual "Current Location"

5. **Add Route Preferences**: Extend OpenAI extraction to include preferences (scenic, avoid highways, etc.)

6. **Multiple Routes**: Show multiple route alternatives from Google Directions

## Troubleshooting

### "Error: Invalid API Key"
- Check that your API keys are correct in `.env`
- Make sure you've restarted the dev server after changing `.env`
- Verify your OpenAI API key has credits

### "Directions request failed"
- Check that you've enabled Directions API in Google Cloud Console
- Verify your Google Maps API key is valid
- Check browser console for detailed error messages

### Routes not displaying on map
- Check browser console for JavaScript errors
- Verify Google Maps JavaScript API is enabled
- Make sure both API keys are set in `.env`

### TypeScript errors
- Run `npm install` to ensure all dependencies are installed
- Try restarting the TypeScript server in your IDE
- Check that `@types/google.maps` is installed

