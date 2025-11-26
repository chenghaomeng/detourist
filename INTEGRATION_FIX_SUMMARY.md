# Backend-Frontend Integration Fix Summary

## Problem
The frontend UI was not properly receiving and displaying data from the backend because several required fields were missing from the backend response.

## Root Cause
The backend was returning route data, but it was missing several fields that the frontend expected:
- `id` - Unique identifier for each route
- `features` - List of OSM tags/features (e.g., "leisure=park")
- `coordinates` - Nested structure with lat/lng format for origin, destination, and waypoints
- `why` - Descriptive explanation of why the route was chosen
- `links` - Google Maps and Apple Maps deep links

## Changes Made

### Backend Changes (`backend/orchestrator.py`)

#### 1. Enhanced Route Response Format
Added missing fields to the `_route_to_api` function:

```python
def _route_to_api(o: RouteScore, route_index: int) -> Dict[str, Any]:
    # Added fields:
    - "id": str(route_index + 1)  # 1-indexed for UI
    - "features": [...]  # Extracted from waypoint categories
    - "why": "..."  # Generated description based on waypoints
    - "links": {  # Deep links to maps
        "google": google_url,
        "apple": apple_url,
    }
    - "coordinates": {  # lat/lng format
        "origin": {"lat": ..., "lng": ...},
        "destination": {"lat": ..., "lng": ...},
        "waypoints": [{"lat": ..., "lng": ..., "name": ...}]
    }
```

#### 2. Added Origin/Destination to Metadata
Modified the response metadata to include the extracted origin and destination text:

```python
"metadata": {
    "total_routes_generated": len(routes),
    "waypoints_found": len(waypoints),
    "origin_text": origin_text,
    "destination_text": dest_text,
    "timings": timings,
}
```

#### 3. Features Extraction Logic
- Extracts features from waypoint categories
- Includes OSM tags from input queries
- Provides user-friendly tags for display

#### 4. Descriptive "Why" Generation
- Creates human-readable explanations for each route
- Mentions number of waypoints and their names
- Falls back to generic descriptions when needed

#### 5. Map Links Generation
- Generates Google Maps deep links with waypoints
- Generates Apple Maps deep links
- Properly formats coordinates for URL parameters

### Frontend Changes

#### 1. TypeScript Interface Updates (`frontend/src/services/backend-api.ts`)
Updated `BackendRoute` interface to include all new fields:

```typescript
export interface BackendRoute {
  id: string;  // Added
  score: number;
  scores: {...};
  distance_m: number;
  duration_s: number;
  origin: {...};
  destination: {...};
  waypoints: [...];
  segments: [...];
  features: string[];  // Added
  why: string;  // Added
  links: {  // Added
    google: string;
    apple: string;
  };
  coordinates: {  // Added
    origin: { lat: number; lng: number; };
    destination: { lat: number; lng: number; };
    waypoints: Array<{ lat: number; lng: number; name: string; }>;
  };
}
```

Updated `BackendRouteResponse` metadata interface:

```typescript
metadata: {
  total_routes_generated: number;
  waypoints_found: number;
  origin_text?: string;  // Added
  destination_text?: string;  // Added
  timings?: Record<string, number>;  // Added
}
```

#### 2. Route Conversion Simplification (`frontend/src/components/NaturalSearchFlow.tsx`)

Simplified `convertBackendRoutesToUI()`:
- Uses backend-provided `features` directly
- Uses backend-provided `why` for descriptions
- Uses backend-provided `links` for map integration
- Uses backend-provided `id` for route identification
- Maps backend scores properly to UI scoreBreakdown

#### 3. Route Selection Fix
Fixed route ID handling:
```typescript
const handleRouteSelect = async (routeId: string) => {
  // routeId is 1-indexed from backend, convert to 0-indexed for array access
  const arrayIndex = parseInt(routeId) - 1;
  // ... rest of logic
}
```

#### 4. Origin/Destination Display
Updated to use metadata for origin/destination text:
```typescript
if (backendResponse.metadata.origin_text && backendResponse.metadata.destination_text) {
  setStartLocation(backendResponse.metadata.origin_text);
  setDestination(backendResponse.metadata.destination_text);
}
```

#### 5. Route Card Selection Highlighting
Fixed comparison to use consistent ID format:
```typescript
className={`... ${
  selectedRoute === route.id  // Was: selectedRouteIndex === parseInt(route.id)
    ? 'border-blue-500 border-2 shadow-lg'
    : 'border-gray-200 hover:shadow-md'
}`}
```

## Score Format
All scores are on a 0-100 scale:
- `overall_score`: Weighted combination (typically 0-100)
- `clip_score`: CLIP similarity score (0-100)
- `efficiency_score`: Route efficiency (0-100)
- `preference_match_score`: Waypoint relevance (0-100)

The UI converts these to a /10 display scale:
```typescript
{(route.score > 1 ? route.score / 10 : route.score * 10).toFixed(1)}/10
```

## Testing Checklist
- [ ] Backend starts successfully
- [ ] Frontend connects to backend via proxy
- [ ] Natural search query is processed
- [ ] Routes are displayed with all fields
- [ ] Route selection works correctly
- [ ] Origin/destination are displayed correctly
- [ ] Map links work (Google Maps, Apple Maps)
- [ ] Features/tags are displayed properly
- [ ] "Why this route" descriptions are shown
- [ ] Score displays correctly

## Environment Variables Required
Ensure these are set in your `.env` file:

```bash
# Backend
LLM_API_KEY=your-openai-key
GEOCODING_API_KEY=your-mapbox-token
ROUTING_API_KEY=your-mapbox-token
REDIS_URL=redis://redis:6379/0
OPENAI_COMPATIBLE_URL=http://host.docker.internal:11434/v1/chat/completions
OPENAI_COMPATIBLE_API_KEY=dummy-key

# Frontend
VITE_OPENAI_API_KEY=your-openai-key
VITE_BACKEND_URL=http://backend:8000
```

## How to Run
1. Start the services:
   ```bash
   docker-compose up --build
   ```

2. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

3. Test a natural search:
   - Enter a query like "scenic route with parks from union square to chinatown"
   - Switch to "Enhanced" mode
   - Click "Update Routes"
   - Verify all route data is displayed correctly

## Known Issues Fixed
1. ✅ Routes not displaying (missing `id` field)
2. ✅ Features not showing (missing `features` field)
3. ✅ Waypoints not accessible (missing `coordinates` structure)
4. ✅ No route descriptions (missing `why` field)
5. ✅ Map links not working (missing `links` field)
6. ✅ Origin/destination not showing (missing metadata fields)
7. ✅ Route selection highlighting not working (ID comparison issue)
8. ✅ Route index mismatch (1-indexed vs 0-indexed)

## Architecture Notes

### Data Flow
1. User enters natural language query in frontend
2. Frontend sends query to backend `/generate-routes` endpoint
3. Backend:
   - Extracts parameters using LLM
   - Geocodes origin/destination
   - Finds waypoints using Overpass API
   - Builds routes using Mapbox Directions API
   - Scores routes using CLIP + efficiency + relevance
   - Returns top N routes with all metadata
4. Frontend:
   - Displays routes in UI cards
   - Converts first route to Google Maps directions for display
   - Shows origin/destination from metadata
   - Allows route selection and detail view

### Key Components
- **Backend**: FastAPI server with orchestrator pattern
- **Frontend**: React + TypeScript + Vite
- **Proxy**: Vite dev server proxies `/api` to backend
- **Cache**: Redis for LLM extraction, geocoding, and waypoint results
- **Routing**: Mapbox Directions API
- **POI**: Overpass API for OpenStreetMap data
- **Scoring**: CLIP + custom efficiency metrics

## Next Steps
1. Test with real queries and verify all data displays correctly
2. Verify map integration works with backend routes
3. Test route selection and navigation flow
4. Verify performance with caching
5. Add error handling for missing fields (defensive programming)
6. Consider adding route preview images (Mapillary integration)

