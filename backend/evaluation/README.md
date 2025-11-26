# Evaluation Module

This module provides batch evaluation capabilities for testing route generation against ground truth examples.

## Quick Start

### Using Docker (Recommended)

1. **Ensure services are running:**
   ```bash
   docker compose up -d
   ```

2. **Set up environment variables:**
   Create a `.env` file in the project root with:
   ```bash
   ROUTING_API_KEY=your-mapbox-api-key
   GEOCODING_API_KEY=your-mapbox-api-key  # Same as routing for Mapbox
   LLM_API_KEY=  # Optional, for future providers
   MAPILLARY_TOKEN=your-mapillary-token  # Optional, for image scoring
   CLIP_MODEL_NAME=openai/clip-vit-base-patch32
   ENABLE_SCORING=false  # Set to "true" to enable CLIP scoring
   ```

3. **Run evaluation inside Docker container:**
   ```bash
   # Run all examples
   docker compose exec backend python -m backend.evaluation.run_evaluation

   # Run specific examples
   docker compose exec backend python -m backend.evaluation.run_evaluation --examples sf_parks_001 ny_coffee_001

   # Export results to JSON
   docker compose exec backend python -m backend.evaluation.run_evaluation --output-json /app/logs/evaluation_results.json

   # Quiet mode (summary only)
   docker compose exec backend python -m backend.evaluation.run_evaluation --quiet
   ```

4. **Access results:**
   ```bash
   # If exported to /app/logs, results are available on host at ./logs/evaluation_results.json
   cat logs/evaluation_results.json
   ```

### Alternative: Run as one-off container command

```bash
# Run evaluation and exit
docker compose run --rm backend python -m backend.evaluation.run_evaluation
```

## Adding Ground Truth Examples

Edit `ground_truth_examples.py` and add your examples to the `get_ground_truth_examples()` function:

```python
GroundTruthExample(
    example_id="your_example_id",
    user_prompt="Natural language route request",
    origin_text="Origin location",
    origin_coords=Coordinates(latitude=0.0, longitude=0.0),
    destination_text="Destination location",
    destination_coords=Coordinates(latitude=0.0, longitude=0.0),
    time_flexibility_minutes=10,
    constraints={
        "transport_mode": "walking",
        "avoid_tolls": False,
        "avoid_stairs": False,
        "avoid_hills": False,
        "avoid_highways": False,
    },
    preferences="comma, separated, preferences",
    waypoint_coords=[
        Coordinates(latitude=0.0, longitude=0.0),
    ],
)
```

## Understanding Results

### Evaluation Flow

The evaluation process follows these steps:

1. **LLM Extraction**: Extract parameters (origin, destination, constraints, preferences, waypoint queries) from the user prompt using the LLM extractor.

2. **Extraction Comparison**: Compare LLM-extracted parameters with ground truth:
   - **Origin/Destination**: Uses hybrid location similarity (exact + Jaccard + substring)
   - **Time Flexibility**: Exact numeric match
   - **Constraints**: Dictionary comparison (order-invariant, transport-mode aware)
   - **Preferences**: Lemmatization + semantic similarity (threshold: 0.6, 40% match required)

3. **App Route Building** (matches production behavior):
   - Geocode LLM-extracted origin/destination
   - Create search zone based on time flexibility
   - Search for waypoints using LLM-extracted queries
   - Build multiple candidate routes
   - **Score routes with preference scores** (`evaluation_mode=False`) to select the best route
   - **Re-score best route without preference** (`evaluation_mode=True`) for fair comparison

4. **Ground Truth Route Building**:
   - Build a single definitive route using ALL provided waypoint coordinates
   - Score without preference (`evaluation_mode=True`) since waypoints are provided directly

5. **Score Comparison**:
   - Extract absolute CLIP scores from both routes
   - Normalize CLIP scores relative to the maximum across both routes
   - Recompute overall scores using normalized CLIP scores (without preference)
   - Compare: LLM score >= (GT score - 0.5) to pass

### Key Design Decisions

- **Preference scores are used for route selection** (matches production) but **excluded from comparison** (fair evaluation)
- **CLIP scores are normalized across both routes** to ensure fair comparison regardless of absolute similarity values
- **Ground truth routes use all provided waypoints** (no selection) to represent the definitive ideal route
- **App routes go through full pipeline** (waypoint search, route building, scoring) to test real-world behavior

### Output Format

The evaluation report shows:

- **Extraction Comparison**: Field-by-field comparison of LLM extraction vs ground truth
- **Route Score Comparison**: 
  - Comparison overall scores (re-normalized CLIP + efficiency, no preference)
  - Raw CLIP scores (absolute values for transparency)
  - Efficiency scores
  - Image counts
- **Waypoint Comparison**: Lists waypoints found by app vs provided in ground truth (informational)

**Note**: Preference scores are not shown in the report since they're not used for comparison, but they are used for route selection (matching production behavior).

### Console Output
- Detailed per-example results with extraction and score breakdowns
- Batch summary with accuracy statistics

### JSON Export
- Structured data for programmatic analysis
- Includes all scores, routes, and comparison metrics

## Troubleshooting

### "ROUTING_API_KEY not set"
- Ensure `.env` file exists with `ROUTING_API_KEY`
- Or export: `export ROUTING_API_KEY=your-key`
- Docker Compose automatically loads `.env` file

### "Ollama connection failed"
- Ensure Ollama service is running: `docker compose ps ollama`
- Check logs: `docker compose logs ollama`
- Wait for model to load (first run takes time)

### "NLTK data not found"
- NLTK data downloads automatically on first use
- If issues persist, manually download:
  ```bash
  docker compose exec backend python -c "import nltk; nltk.download('punkt'); nltk.download('wordnet')"
  ```

### Slow evaluation
- CLIP scoring is disabled by default (`ENABLE_SCORING=false`)
- Set `--max-routes` to lower value (e.g., `--max-routes 5`)
- Use `--quiet` to reduce output overhead

