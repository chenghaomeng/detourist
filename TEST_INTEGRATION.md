# Testing Backend-Frontend Integration

## Quick Test Guide

### 1. Start the Application

```bash
# Make sure you're in the project root
cd /Users/matthewpaterno/Documents/mids/mids-210/free-form-text-to-route

# Start all services
docker-compose up --build
```

Wait for services to start:
- ✅ Redis: Ready to accept connections
- ✅ Backend: Application startup complete
- ✅ Frontend: Local: http://localhost:3000/

### 2. Test Backend API Directly

```bash
# Test health endpoint
curl http://localhost:8000/health

# Expected response:
# {
#   "status": "healthy",
#   "modules": {
#     "extractor": "healthy",
#     "geocoder": "healthy",
#     "waypoint_searcher": "healthy",
#     "route_builder": "healthy",
#     "route_scorer": "healthy"
#   }
# }
```

### 3. Test Route Generation API

```bash
curl -X POST http://localhost:8000/generate-routes \
  -H "Content-Type: application/json" \
  -d '{
    "user_prompt": "scenic route with parks from union square san francisco to chinatown san francisco",
    "max_results": 3
  }'
```

Expected response structure:
```json
{
  "routes": [
    {
      "id": "1",
      "score": 75.5,
      "scores": {
        "clip": 80.2,
        "efficiency": 70.5,
        "preference": 75.8,
        "images_used": 5
      },
      "distance_m": 2500,
      "duration_s": 900,
      "origin": {
        "latitude": 37.7879,
        "longitude": -122.4075
      },
      "destination": {
        "latitude": 37.7941,
        "longitude": -122.4078
      },
      "waypoints": [
        {
          "name": "Portsmouth Square",
          "category": "leisure=park",
          "relevance_score": 85.5,
          "input_query": "leisure=park",
          "coordinates": {
            "latitude": 37.7941,
            "longitude": -122.4078
          }
        }
      ],
      "segments": [...],
      "features": ["leisure=park"],
      "why": "This route includes 1 scenic waypoint: Portsmouth Square.",
      "links": {
        "google": "https://www.google.com/maps/dir/37.7879,-122.4075/37.7941,-122.4078/37.7941,-122.4078",
        "apple": "https://maps.apple.com/?saddr=37.7879,-122.4075&daddr=37.7941,-122.4078"
      },
      "coordinates": {
        "origin": {"lat": 37.7879, "lng": -122.4075},
        "destination": {"lat": 37.7941, "lng": -122.4078},
        "waypoints": [
          {"lat": 37.7941, "lng": -122.4078, "name": "Portsmouth Square"}
        ]
      }
    }
  ],
  "processing_time_seconds": 12.5,
  "metadata": {
    "total_routes_generated": 5,
    "waypoints_found": 3,
    "origin_text": "union square san francisco",
    "destination_text": "chinatown san francisco",
    "timings": {...}
  }
}
```

### 4. Test Frontend Integration

1. Open browser: http://localhost:3000

2. You should see the Natural Search interface

3. Enter a query:
   ```
   scenic route with parks from union square san francisco to chinatown san francisco
   ```

4. Toggle "Enhanced" mode (this uses the backend)

5. Click "Update Routes"

6. Verify the following are displayed:
   - ✅ Origin: "union square san francisco"
   - ✅ Destination: "chinatown san francisco"
   - ✅ Route cards with titles (e.g., "Most Scenic", "Balanced Route")
   - ✅ Duration and distance for each route
   - ✅ Score display (e.g., "8.7/10")
   - ✅ Features/tags as blue chips (e.g., "Parks", "Attractions")
   - ✅ "Why this route?" description
   - ✅ Waypoint count

7. Click on a route card to view details:
   - ✅ Route title and stats
   - ✅ "Why this route?" section with description
   - ✅ Key waypoints section with expandable items
   - ✅ "Open in Maps" section with Google/Apple links
   - ✅ AI Score display

8. Test map links:
   - Click "Google Maps" - should open in new tab with route
   - Click "Apple Maps" - should open in new tab with route

### 5. Check Browser Console

Open DevTools (F12) and check for errors:

✅ No errors should appear related to:
- Missing fields (e.g., `route.id`, `route.features`, `route.why`)
- Type mismatches
- Failed API calls

✅ Should see successful API responses:
```
POST /api/generate-routes 200 OK
```

### 6. Test Different Queries

Try various queries to test robustness:

```
1. "quiet route avoiding highways from downtown to golden gate park"
2. "fastest route from fisherman's wharf to alcatraz ferry"
3. "scenic coastal drive with ocean views"
4. "route through historic neighborhoods with cafes"
```

### 7. Verify Score Display

Check that scores are displayed correctly:
- Overall score should be 0-100 scale in backend
- UI should show as X.X/10 (e.g., 8.7/10)
- Score breakdown should show scenic, safety, duration, quiet

### 8. Test Error Handling

Try invalid queries:
```
1. Empty query - should show validation error
2. Invalid location - should show "Location not found" error
3. No routes found - should show appropriate message
```

## Troubleshooting

### Backend Not Starting
```bash
# Check logs
docker-compose logs backend

# Common issues:
# - Missing environment variables
# - Redis not available
# - Port 8000 already in use
```

### Frontend Not Connecting to Backend
```bash
# Check proxy configuration in vite.config.ts
# Should have:
# proxy: {
#   '/api': {
#     target: 'http://backend:8000',
#     changeOrigin: true,
#     rewrite: (path) => path.replace(/^\/api/, ''),
#   }
# }
```

### Routes Not Displaying
1. Check browser console for errors
2. Verify API response structure matches `BackendRoute` interface
3. Check that all required fields are present in response

### Map Not Updating
1. Verify `convertBackendRouteToDirections` is working
2. Check that `onDirectionsResult` is being called
3. Verify Google Maps API key is set

### Score Display Issues
1. Backend returns scores as 0-100
2. Frontend should normalize to /10 display
3. Check conversion logic in `convertBackendRoutesToUI`

## Integration Points Verified

✅ Backend API endpoint: `/generate-routes`
✅ Request format: `BackendRouteRequest`
✅ Response format: `BackendRouteResponse`
✅ All required fields present in response
✅ Frontend TypeScript interfaces match backend
✅ Route conversion logic working
✅ Route selection and display working
✅ Map integration working
✅ Origin/destination display working
✅ Features/tags display working
✅ Score display working
✅ Map links working

## Performance Expectations

- First request: 10-30 seconds (LLM processing, no cache)
- Cached requests: 2-5 seconds
- Redis caching: LLM extraction, geocoding, waypoints
- Backend timeout: 5 minutes (for Ollama inference)

## Success Criteria

The integration is working correctly if:
1. ✅ Backend starts without errors
2. ✅ Frontend connects to backend
3. ✅ Route query returns results within 30 seconds
4. ✅ All route data is displayed in UI
5. ✅ Route selection works
6. ✅ Map integration works
7. ✅ No console errors
8. ✅ Map links work
9. ✅ Score displays correctly
10. ✅ Origin/destination display correctly

## Next Steps After Successful Test

1. Test with real-world queries
2. Verify performance with multiple users
3. Add more test cases
4. Implement automated tests
5. Monitor error rates
6. Add analytics/logging
7. Optimize caching strategy
8. Add route preview images

