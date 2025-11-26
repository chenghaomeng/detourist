# Setup Checklist

Follow these steps to get the OpenAI + Google Maps integration working:

## 1. Install Dependencies ✅
- [x] OpenAI SDK installed (`npm install openai`)
- [x] All other dependencies installed

## 2. Environment Variables Setup

Create a `frontend/.env` file with these variables:

```env
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
```

### Getting API Keys:

**OpenAI:**
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to https://platform.openai.com/api-keys
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)

**Google Maps:**
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Directions API
4. Go to Credentials and create an API key
5. Copy the key

## 3. Files Created/Modified ✅

### New Files:
- [x] `frontend/src/services/openai.ts` - OpenAI integration
- [x] `frontend/src/services/directions.ts` - Google Directions API wrapper
- [x] `OPENAI_SETUP.md` - Detailed setup documentation

### Modified Files:
- [x] `frontend/src/App.tsx` - Added route state management
- [x] `frontend/src/components/SemanticMapView.tsx` - Added DirectionsRenderer
- [x] `frontend/src/components/NaturalSearchFlow.tsx` - Integrated OpenAI and Directions API

## 4. Testing

Once your environment variables are set:

1. Start the dev server:
```bash
cd frontend
npm run dev
```

2. Open the app in your browser (http://localhost:5173)

3. Click the Natural Search toggle (sparkle icon)

4. Enter a query like:
   - "Take me to Golden Gate Bridge"
   - "Route from San Francisco to Sausalito"
   - "Drive from downtown SF to Marin County"

5. Expected behavior:
   - ✅ Query is sent to OpenAI GPT-4o-mini
   - ✅ Origin and destination are extracted
   - ✅ Google Directions API fetches the route
   - ✅ Route is displayed on the map with blue polyline
   - ✅ Route details shown in sidebar (duration, distance)

## 5. Troubleshooting

### Browser Console Errors

Check the browser console (F12) for errors:

- `"No response from OpenAI"` → Check OpenAI API key
- `"Directions request failed"` → Check Google Maps API key
- `"CORS error"` → Ensure APIs are enabled in Google Cloud Console

### No Route Displayed

1. Check that both API keys are set in `.env`
2. Restart the dev server after changing `.env`
3. Check browser console for errors
4. Verify APIs are enabled in respective consoles

### TypeScript Errors

If you see TypeScript errors in your IDE:
1. Restart the TypeScript server
2. Run `npm install` again
3. Clear your IDE's cache

## 6. Current Implementation

### What Works:
- ✅ Natural language query input
- ✅ OpenAI extraction of origin/destination
- ✅ Google Directions API integration
- ✅ Route display on map
- ✅ Multiple route alternatives support
- ✅ Duration and distance display

### What's Simplified (for now):
- ⚠️ No scenic/preference extraction (future enhancement)
- ⚠️ Simple route scoring (not based on actual preferences)
- ⚠️ Client-side API calls (not production-ready)
- ⚠️ No caching (each query calls OpenAI)

## 7. Next Steps

For production deployment:
1. Move OpenAI calls to backend
2. Add API call caching
3. Implement rate limiting
4. Add proper error boundaries
5. Enhance route scoring with actual scenic data

## Security Note 🔒

**Important**: This implementation exposes API keys in the browser and is NOT production-ready. Use only for development/demo purposes. For production, create a backend API that handles OpenAI calls server-side.

