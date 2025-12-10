# Enabling CLIP Scoring

## Current Status: ❌ DISABLED

CLIP scoring is currently **disabled** in your setup. Routes are only scored using:
- ✅ Efficiency (30% weight) - route duration
- ✅ Preference matching (30% weight) - waypoint relevance  
- ❌ **CLIP (40% weight) - NOT RUNNING**

## What CLIP Scoring Does

CLIP (Contrastive Language-Image Pre-training) analyzes **street-level imagery** from Mapillary to score routes based on how well they match your natural language preferences like "scenic", "coastal views", "tree-lined", etc.

**How it works:**
1. Fetches 3-10 street-level images along each route from Mapillary
2. Uses CLIP AI model to compare images against your text query
3. Scores routes based on visual similarity to your preferences
4. Routes with better matching imagery get higher scores

## Steps to Enable CLIP Scoring

### 1. Get a Mapillary API Token

Mapillary provides free street-level imagery (like Google Street View but open source).

1. **Sign up**: https://www.mapillary.com/developer
2. **Create an application**: https://www.mapillary.com/dashboard/developers
3. **Copy your token**: It will look like `MLY|1234567890abcdef...`

### 2. Add Token to `.env` File

Add this line to your `.env` file in the project root:

```bash
MAPILLARY_TOKEN=MLY|your_token_here
```

Your `.env` should now have:
```bash
# Existing tokens
GEOCODING_API_KEY=your_mapbox_token
ROUTING_API_KEY=your_mapbox_token
VITE_OPENAI_API_KEY=your_openai_key

# NEW: Mapillary for CLIP scoring
MAPILLARY_TOKEN=MLY|your_mapillary_token
```

### 3. Restart Backend

```bash
docker-compose restart backend

# Or fully rebuild if needed:
docker-compose down
docker-compose up --build
```

### 4. Verify CLIP is Working

Look for these log messages:

```bash
docker-compose logs backend | grep -i "clip\|image"
```

**Good signs:**
```
INFO:backend.scoring.route_scorer:Fetching images for route...
INFO:backend.scoring.route_scorer:Computing CLIP scores for 5 images
INFO:backend.scoring.route_scorer:CLIP score: 0.75
```

**Bad signs (CLIP disabled):**
```
INFO:backend.scoring.route_scorer:CLIP scoring disabled (ENABLE_SCORING=false)
INFO:backend.scoring.route_scorer:No Mapillary token provided
```

## Configuration Options

These are now set in `docker-compose.yml`:

| Variable | Default | Description |
|----------|---------|-------------|
| `ENABLE_SCORING` | `true` | Enable/disable CLIP scoring |
| `SCORING_MIN_IMAGES` | `3` | Minimum images to fetch per route |
| `SCORING_MAX_IMAGES` | `10` | Maximum images to fetch per route |
| `MAPILLARY_TOKEN` | (required) | Your Mapillary API token |
| `CLIP_MODEL_NAME` | `openai/clip-vit-base-patch32` | HuggingFace CLIP model |

## Performance Impact

**With CLIP Enabled:**
- ⏱️ **First request**: 60-90 seconds
  - Downloads CLIP model (~600MB) on first run
  - Model is cached for future requests
- ⏱️ **Subsequent requests**: 15-25 seconds
  - Fetches 3-10 images per route from Mapillary
  - Runs CLIP inference on each image
  - GPU highly recommended but works on CPU

**Without CLIP (current state):**
- ⏱️ **Requests**: 10-20 seconds
- No image fetching or CLIP inference

## Testing CLIP Scoring

Once enabled, test with visual preference queries:

### Good Test Queries:
```
scenic route with coastal views from sf to marin
tree-lined route through parks from downtown to golden gate park
route with mountain views and water features
```

### What to Look For:

**In the response:**
```json
{
  "routes": [{
    "scores": {
      "clip": 75.5,        // 🎨 Should be > 0 now!
      "efficiency": 82.3,
      "preference": 88.1,
      "images_used": 7     // Number of images analyzed
    }
  }]
}
```

**In the logs:**
```
INFO:backend.scoring.route_scorer:Fetching images for route 1/3
INFO:backend.scoring.route_scorer:Found 7 images via Mapillary
INFO:backend.scoring.route_scorer:Computing CLIP scores...
INFO:backend.scoring.route_scorer:CLIP score: 0.75 (from 7 images)
```

## Troubleshooting

### "CLIP scoring disabled"

**Check:**
1. Is `ENABLE_SCORING=true` in docker-compose.yml? ✅ (now added)
2. Is `MAPILLARY_TOKEN` set in `.env`? ❓ (you need to add this)
3. Is `SCORING_MAX_IMAGES > 0`? ✅ (set to 10)

### "No images found for route"

**Possible causes:**
- Mapillary doesn't have coverage in that area
- Route is too short (< 100m)
- Bbox too small (try increasing `MAPILLARY_BBOX_DEGREES`)

**Solution**: Routes will still work, CLIP score will be 0

### "CLIP model download failed"

**Possible causes:**
- Network issues
- Not enough disk space (need ~1GB)
- HuggingFace API issues

**Solution**: Model is cached in container, will retry on next request

### Very slow first request

**Expected!** First CLIP request needs to:
1. Download CLIP model (~600MB)
2. Load model into memory
3. Fetch images from Mapillary
4. Run inference

This can take 60-90 seconds. Subsequent requests are much faster (15-25s).

## Cost & Rate Limits

### Mapillary API
- **Free tier**: 50,000 requests/month
- **Cost**: Free for non-commercial use
- **Rate limit**: ~100 requests/minute

### Impact on Your App
- Each route generation: ~3-10 API calls to Mapillary
- You can do ~5,000-15,000 route generations/month on free tier
- Caching reduces repeated calls for same areas

## Comparison: With vs Without CLIP

### Example: "Scenic coastal route SF to Marin"

**Without CLIP (current):**
```json
{
  "score": 65.0,
  "scores": {
    "clip": 0,          // ❌ No image analysis
    "efficiency": 75,
    "preference": 85
  }
}
```

**With CLIP:**
```json
{
  "score": 82.5,
  "scores": {
    "clip": 88,         // ✅ Analyzed coastal imagery
    "efficiency": 75,
    "preference": 85,
    "images_used": 8
  }
}
```

Routes with actual coastal views get higher scores when CLIP is enabled!

## Recommendation

### For Development/Testing:
- ✅ Enable CLIP with `SCORING_MIN_IMAGES=3`, `SCORING_MAX_IMAGES=5`
- Lower image counts = faster but less accurate

### For Production:
- ✅ Enable CLIP with `SCORING_MIN_IMAGES=5`, `SCORING_MAX_IMAGES=10`
- Higher image counts = slower but more accurate
- Consider GPU for faster inference
- Monitor Mapillary API usage

### For Demo/Quick Testing:
- ⚠️ Keep CLIP disabled (current state)
- Much faster response times
- Still gets decent scores from efficiency + waypoint relevance

## Next Steps

1. ✅ **Already done**: Updated `docker-compose.yml` with CLIP config
2. 🔲 **You need to do**: Get Mapillary token and add to `.env`
3. 🔲 **You need to do**: Restart backend
4. 🔲 **Test**: Try a scenic route query and check logs

Once you add the Mapillary token, CLIP scoring will be fully enabled! 🎨

