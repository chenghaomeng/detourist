# Usage Guide - Natural Search Routing

## ⚠️ Important: How to Write Queries for Enhanced Mode

### The Problem

Enhanced Mode uses AI to find **scenic waypoints** based on your preferences. If you don't specify any preferences, the system won't know what to search for and will return **0 routes**.

### ❌ Bad Queries (No Preferences)

```
"route from chinatown to union square"
"directions to golden gate bridge"
"take me to marin county"
```

**Why they fail**: No preferences mentioned, so the AI doesn't know what waypoints to search for (parks? views? cafes?).

### ✅ Good Queries (Include Preferences)

```
"scenic route with parks from union square to chinatown"
"quiet route avoiding highways to golden gate bridge"
"coastal drive with ocean views from sf to marin"
"calm route through tree-lined streets to downtown"
"route with cafes and attractions from fisherman's wharf to alcatraz"
```

**Why they work**: They include specific preferences that the AI can use to find relevant waypoints.

## Supported Preference Keywords

The system understands these types of preferences:

### Scenic Preferences
- **scenic** - general scenic routes
- **coastal** - routes along the coast
- **waterfront** - routes along water
- **ocean views** - routes with ocean views
- **mountain views** - routes with mountain views
- **tree-lined** - routes through tree-lined streets

### POI (Point of Interest) Preferences
- **parks** - routes through parks
- **gardens** - routes through gardens
- **museums** - routes near museums
- **attractions** - routes near tourist attractions
- **cafes** - routes near cafes
- **restaurants** - routes near restaurants
- **historic** - routes through historic areas

### Route Character Preferences
- **quiet** - avoid busy roads
- **calm** - peaceful routes
- **avoid highways** - no highway segments
- **residential** - through residential areas

## How to Use Each Mode

### Quick Mode (Default)
- Uses OpenAI GPT-4o-mini to extract origin/destination
- Gets standard Google Maps routes
- **Fast** (2-5 seconds)
- Good for basic directions without scenic preferences

**Example**:
```
"directions from ferry building to golden gate park"
```

### Enhanced Mode (Toggle the green button)
- Uses full backend AI pipeline:
  1. LLM extracts origin, destination, AND preferences
  2. Finds scenic waypoints matching your preferences
  3. Builds routes through those waypoints
  4. Scores routes using CLIP (image analysis) + efficiency
- **Slower** (10-30 seconds)
- Best for scenic/custom routes with preferences

**Example**:
```
"scenic route with parks and coastal views from downtown to marin"
```

## Step-by-Step: Making Your First Enhanced Route

1. **Toggle Enhanced Mode** - Click the green "Enhanced" button so it's active

2. **Write a detailed query** with preferences:
   ```
   scenic route with parks from union square san francisco to chinatown san francisco
   ```

3. **Click "Update Routes"** or press Enter

4. **Wait 10-30 seconds** - You'll see:
   - "Analyzing with AI (this may take 10-30 seconds)..."
   - Then "Understanding your preferences..."
   - Finally route results!

5. **View your routes** - You'll see multiple options ranked by scenic score

6. **Click on a route** to see:
   - Waypoints found (parks, attractions, etc.)
   - AI score explanation
   - Links to open in Google/Apple Maps

## Common Issues & Solutions

### Issue: "No scenic waypoints found"

**Cause**: Your query doesn't include preferences

**Solution**: Add keywords like "scenic", "parks", "quiet", etc.

**Before**:
```
route from point A to point B
```

**After**:
```
scenic route with parks from point A to point B
```

### Issue: Takes too long (>30 seconds)

**Cause**: First request needs to:
- Download LLM model (Ollama)
- Build FAISS index
- Query Overpass API

**Solution**: 
- First request is slow (30-60s)
- Subsequent requests are faster (10-20s) due to caching
- Try simpler queries or use Quick Mode

### Issue: Backend returns empty routes

**Check**:
1. Are you in Enhanced Mode? (green button should be active)
2. Did you include preferences in your query?
3. Is your area covered by OpenStreetMap? (most cities are)

## Examples by Use Case

### Tourist Route
```
scenic route with museums and historic sites from ferry building to golden gate bridge
```

### Nature Route
```
quiet route through parks and gardens from downtown sf to golden gate park
```

### Coastal Drive
```
coastal drive with ocean views from san francisco to half moon bay
```

### Urban Exploration
```
route with cafes and attractions avoiding highways from mission to north beach
```

### Commute Alternative
```
calm residential route avoiding highways from oakland to san francisco
```

## Performance Tips

1. **Use caching**: The system caches:
   - LLM extractions (similar queries)
   - Geocoding results
   - Waypoint searches
   
2. **Be specific**: More specific = better results
   - ✅ "scenic route with parks from union square to chinatown"
   - ❌ "scenic route in sf"

3. **Limit waypoints**: Fewer preferences = faster
   - ✅ "scenic route with parks"
   - ❌ "scenic route with parks, museums, cafes, gardens, and historic sites"

## Technical Details

### What Happens in Enhanced Mode?

1. **LLM Extraction** (~10s)
   - Analyzes your query
   - Extracts origin, destination, preferences
   - Finds matching OSM tags using FAISS

2. **Geocoding** (~0.2s)
   - Converts location names to coordinates
   - Cached for repeated locations

3. **Search Zone Creation** (~40s on first run, ~1s cached)
   - Creates isochrones (travel time polygons)
   - Finds intersection area to search

4. **Waypoint Search** (~0.5s)
   - Queries OpenStreetMap via Overpass API
   - Finds matching POIs in search zone

5. **Route Building** (~1s per route)
   - Builds routes via Mapbox Directions API
   - Includes waypoints in route

6. **Route Scoring** (~2s)
   - CLIP analysis of street-level imagery
   - Efficiency scoring
   - Preference matching

### Why Some Queries Return 0 Routes

1. **No preferences**: System doesn't know what to search for
2. **No matching waypoints**: Area doesn't have requested features
3. **Too restrictive**: Preferences too specific for the area
4. **API limits**: Overpass/Mapbox rate limits

## Best Practices

1. ✅ **DO** include at least one preference keyword
2. ✅ **DO** be specific about locations (include city/state)
3. ✅ **DO** wait the full 10-30 seconds for Enhanced mode
4. ✅ **DO** try different preference combinations

5. ❌ **DON'T** use Enhanced mode for simple A-to-B directions
6. ❌ **DON'T** expect instant results (it's doing a lot of AI work!)
7. ❌ **DON'T** forget to include city names for less-known locations
8. ❌ **DON'T** be too vague ("scenic route") - add specifics!

## Troubleshooting

### Check Backend Logs
```bash
docker-compose logs backend --tail=50
```

Look for:
- `tags=[]` - means no preferences were extracted
- `waypoints_found=0` - means no matching waypoints
- `total_routes_generated=0` - means no routes were built

### Check Frontend Console
Open browser DevTools (F12) and look for:
- "Calling backend API with query: ..."
- "Backend response received: ..."
- "Using backend routes: X"

### Common Error Messages

**"No scenic waypoints found. Try adding preferences..."**
- Add keywords like "scenic", "parks", "quiet"

**"Failed to extract route: ..."**
- Check if OpenAI API key is set (Quick mode)
- Check if Ollama is running (Enhanced mode)

**"Directions request failed: ..."**
- Check Mapbox API key
- Check if location is valid

## Need Help?

1. Check the logs: `docker-compose logs backend --tail=100`
2. Check browser console (F12)
3. Try a simpler query first
4. Make sure preferences are included
5. Verify APIs are configured (see SETUP.md)

Happy routing! 🗺️✨

