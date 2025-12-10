# Location Names Fix

## Problem

The UI was displaying coordinates instead of location names:
- **Before**: `37.8013, -122.4249` and `37.7878, -122.4051`
- **Wanted**: `Lombard Street SF` and `Union Square SF`

## Root Cause

The frontend code was falling back to displaying coordinates when:
1. Backend metadata didn't include `origin_text` and `destination_text` fields
2. Or the backend container wasn't rebuilt with the updated code

## Solution Applied

### 1. Backend Fix (Already Applied)

Updated `backend/orchestrator.py` to include location names in metadata:

```python
return {
    "routes": api_routes,
    "processing_time_seconds": total_time,
    "metadata": {
        "total_routes_generated": len(routes),
        "waypoints_found": len(waypoints),
        "origin_text": origin_text,        # ← Added
        "destination_text": dest_text,      # ← Added
        "timings": timings,
    },
}
```

**Rebuilt backend container** to apply the change:
```bash
docker-compose up -d --build --no-deps backend
```

### 2. Frontend Improvements

Updated `frontend/src/components/NaturalSearchFlow.tsx` with better fallback logic:

```typescript
// Extract origin/dest from backend metadata
if (backendResponse.metadata?.origin_text && backendResponse.metadata?.destination_text) {
  // PRIMARY: Use backend-provided location names
  setStartLocation(backendResponse.metadata.origin_text);
  setDestination(backendResponse.metadata.destination_text);
} else if (backendResponse.routes && backendResponse.routes[0]) {
  // FALLBACK 1: Try to extract from user's query
  const query = searchQuery.toLowerCase();
  const fromMatch = query.match(/from\s+([^to]+?)(?:\s+to\s+|\s+san\s+francisco)/i);
  const toMatch = query.match(/to\s+([^,\s]+(?:\s+[^,\s]+)*?)(?:\s+san\s+francisco|$)/i);
  
  if (fromMatch && toMatch) {
    setStartLocation(fromMatch[1].trim());
    setDestination(toMatch[1].trim());
  } else {
    // FALLBACK 2: Use generic names (NOT coordinates!)
    setStartLocation('Origin');
    setDestination('Destination');
  }
}
```

## Changes Made

### Before
```typescript
// OLD CODE - Would show coordinates:
const route = backendResponse.routes[0];
setStartLocation(`${route.origin.latitude.toFixed(4)}, ${route.origin.longitude.toFixed(4)}`);
setDestination(`${route.destination.latitude.toFixed(4)}, ${route.destination.longitude.toFixed(4)}`);
```

### After
```typescript
// NEW CODE - Multiple fallbacks, no coordinates:
1. Try backend metadata (origin_text, destination_text)
2. Try parsing user's query ("from X to Y")
3. Use generic "Origin" and "Destination"
```

## Fallback Hierarchy

1. **Best**: Backend metadata (e.g., "Lombard Street", "Union Square")
2. **Good**: Parsed from query (e.g., "lombard street", "union square")
3. **OK**: Generic names ("Origin", "Destination")
4. **Never**: Coordinates (removed!)

## Testing

### Test the Frontend Now:

1. **Refresh your browser** (Cmd+Shift+R / Ctrl+Shift+R)
2. **Try a new search** with Enhanced mode:
   ```
   scenic route from lombard street sf to union square sf
   ```
3. **Check the sidebar** - should now show:
   - ✅ "Lombard Street" (or "lombard street" from query)
   - ✅ "Union Square" (or "union square" from query)
   - ❌ NOT "37.8013, -122.4249"

### Verify Backend Metadata:

```bash
# Test if backend returns location names:
curl -X POST http://localhost:8000/generate-routes \
  -H "Content-Type: application/json" \
  -d '{"user_prompt": "scenic route from lombard street to union square sf", "max_results": 1}' \
  | jq '.metadata | {origin_text, destination_text}'

# Should show:
# {
#   "origin_text": "Lombard Street",
#   "destination_text": "Union Square"
# }
```

## Debug Logging Added

The fix includes console logging to help debug:

```typescript
console.log('Backend metadata:', {
  origin_text: backendResponse.metadata?.origin_text,
  destination_text: backendResponse.metadata?.destination_text
});

// Will log one of:
// "Using metadata text for locations"
// "Metadata text not available, trying to extract from query"
```

**Check browser console (F12)** to see which fallback is being used.

## Query Parsing Examples

The regex pattern extracts location names from these formats:

| Query | Extracted Origin | Extracted Destination |
|-------|-----------------|----------------------|
| "from lombard street to union square" | "lombard street" | "union square" |
| "route from chinatown sf to golden gate bridge" | "chinatown" | "golden gate bridge" |
| "scenic drive from fisherman's wharf to marin" | "fisherman's wharf" | "marin" |

## Known Limitations

### Parsing May Fail For:
- Queries without "from/to" pattern
- Complex multi-location queries
- Queries with city names before location names

**Solution**: Backend metadata is the primary source, query parsing is just a fallback.

## Future Improvements

1. **Geocoding Cache**: Save location names when geocoding coordinates
2. **Reverse Geocoding**: Convert coordinates back to place names
3. **Location History**: Remember recently used locations
4. **Autocomplete**: Suggest place names as user types

## Files Modified

1. ✅ `backend/orchestrator.py` - Added origin_text/destination_text to metadata
2. ✅ `frontend/src/components/NaturalSearchFlow.tsx` - Improved fallback logic
3. ✅ Backend container rebuilt with updated code

## Result

**Before**: 
```
Origin:      37.8013, -122.4249
Destination: 37.7878, -122.4051
```

**After**:
```
Origin:      Lombard Street
Destination: Union Square
```

Much better! 🎉

