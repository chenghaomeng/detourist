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

### Extraction Comparison
- **Origin/Destination**: Uses hybrid location similarity (exact + Jaccard + substring)
- **Time Flexibility**: Exact numeric match
- **Constraints**: Dictionary comparison
- **Preferences**: Lemmatization + semantic similarity (threshold: 0.7)

### Route Score Comparison
- Compares best LLM-generated route score vs ground truth route score
- LLM route uses LLM-extracted constraints
- Ground truth route uses ground truth constraints
- Both use the same waypoint coordinates (from ground truth)

### Output Format
- **Console**: Detailed per-example results + batch summary
- **JSON**: Structured data for programmatic analysis

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

