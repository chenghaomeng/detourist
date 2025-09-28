# Team Development Guide

This guide helps your 5-person team understand the project structure and development workflow.

## 👥 Team Roles & Responsibilities

### 1. LLM Extraction Developer
**Module**: `backend/extraction/`
**Focus**: Natural language processing and parameter extraction

**Key Tasks**:
- Implement two-step LLM extraction process
- Integrate with Ollama + Llama 3.1 8B quantized model
- Map user preferences to waypoint queries
- Extract routing constraints from prompts
- Handle edge cases and ambiguous inputs

**Dependencies**: Ollama, Llama 3.1 model, FAISS OSM tag search

### 2. Geocoding Developer
**Module**: `backend/geocoding/`
**Focus**: Address conversion and spatial analysis

**Key Tasks**:
- Implement `Geocoder.geocode_address()` method
- Create isochrone generation logic
- Build search zone intersection algorithms
- Handle geocoding errors and fallbacks

**Dependencies**: Google Maps API, Mapbox API, spatial libraries

### 3. Waypoint Search Developer
**Module**: `backend/waypoints/`
**Focus**: POI discovery and filtering

**Key Tasks**:
- Implement `WaypointSearcher.search_waypoints()` method
- Build spatial filtering for search zones
- Create relevance scoring algorithms
- Integrate with POI APIs (Google Places, Foursquare)

**Dependencies**: POI APIs, spatial filtering libraries

### 4. Route Building Developer
**Module**: `backend/routing/`
**Focus**: Route optimization and constraint handling

**Key Tasks**:
- Implement `RouteBuilder.build_routes()` method
- Apply routing constraints (avoid tolls, stairs, etc.)
- Optimize waypoint ordering
- Integrate with routing APIs

**Dependencies**: Google Maps Routing API, Mapbox Directions API

### 5. Scoring Developer
**Module**: `backend/scoring/`
**Focus**: Route evaluation and visual analysis

**Key Tasks**:
- Implement `RouteScorer.score_routes()` method
- Integrate CLIP model for visual scoring
- Build efficiency and preference scoring
- Implement `ImageProcessor` for street view images

**Dependencies**: CLIP model, street view APIs, PyTorch

## 🔄 Development Workflow

### 1. Setup Development Environment

```bash
# Each developer should run:
git clone <repository-url>
cd free-form-text-to-route

# Start with Docker Compose (recommended)
docker compose up -d
./scripts/setup-ollama.sh

# Or for local development:
# 1. Install Python dependencies
poetry install

# 2. Install frontend dependencies
cd frontend
npm install
cd ..

# 3. Create .env file with your API keys
# Add their specific API keys to .env

# Poetry commands for development:
poetry add package-name           # Add new dependency
poetry add --group dev package-name  # Add dev dependency
poetry run command               # Run command in Poetry environment
poetry shell                     # Activate Poetry shell
```

### 2. Module Development

Each developer works on their assigned module:

```bash
# Example for LLM extraction developer:
cd backend/extraction/
# Implement llm_extractor.py, llm_providers.py, faiss_osm_validator.py
# Add tests
# Update documentation
```

### 3. Integration Testing

```bash
# Test individual modules:
python -m pytest backend/extraction/tests/

# Test full pipeline:
python -m pytest backend/tests/integration/
```

### 4. API Development

The orchestrator (`backend/orchestrator.py`) coordinates all modules. Test the full pipeline:

```bash
# Start backend server
python -m uvicorn backend.api:app --reload

# Test API endpoints
curl -X POST "http://localhost:8000/generate-routes" \
  -H "Content-Type: application/json" \
  -d '{"user_prompt": "Test prompt", "max_results": 3, "num_tags": 5}'
```

## 🧪 Testing Strategy

### Unit Tests
Each module should have comprehensive unit tests:

```python
# Example: backend/extraction/tests/test_llm_extractor.py
import pytest
from backend.extraction.llm_extractor import LLMExtractor

def test_extract_parameters():
    extractor = LLMExtractor("test_key")
    result = extractor.extract_parameters("Go from A to B", num_tags=5)
    assert result.origin == "A"
    assert result.destination == "B"
```

### Integration Tests
Test module interactions:

```python
# Example: backend/tests/test_integration.py
def test_full_pipeline():
    orchestrator = RouteOrchestrator(config)
    request = RouteRequest("Test prompt")
    response = orchestrator.generate_routes(request)
    assert len(response.routes) > 0
```

### API Tests
Test the web API:

```python
# Example: backend/tests/test_api.py
def test_generate_routes_endpoint():
    response = client.post("/generate-routes", json={
        "user_prompt": "Test",
        "max_results": 3,
        "num_tags": 5
    })
    assert response.status_code == 200
```

## 📊 Data Flow

```
User Prompt
    ↓
Two-Step LLM Extraction:
  Step 1: Extract Preferences → FAISS OSM Search
  Step 2: Extract Parameters with Candidates
    ↓
Geocoder → Coordinates + Search Zone
    ↓
Waypoint Searcher → Candidate Waypoints
    ↓
Route Builder → Route Options
    ↓
Route Scorer → Ranked Routes
    ↓
API Response
```

## 🔧 Configuration Management

### Environment Variables
Each developer needs different API keys:

```bash
# .env file structure:
LLM_API_KEY=sk-your-openai-key  # Reserved for future providers (not used with Ollama)
GEOCODING_API_KEY=AIza-your-google-key
POI_API_KEY=AIza-your-places-key
ROUTING_API_KEY=AIza-your-maps-key
CLIP_MODEL_PATH=models/clip_model.pth
```

### Module Configuration
Each module can have its own config:

```python
# Example: backend/extraction/config.py
EXTRACTION_CONFIG = {
    'model': 'llama3.1:8b-instruct-q4_K_M',
    'ollama_url': 'http://ollama:11434/api/generate',
    'num_tags': 5,
    'temperature': 0.1
}
```

## 🚀 Deployment

### Development
```bash
# Backend
poetry run start-backend

# Frontend
cd frontend && npm run dev
```

### Production
```bash
# Using Docker Compose (recommended)
docker compose up --build -d
./scripts/setup-ollama.sh

# Or manual deployment
# Backend
poetry install --only=main
poetry run start-backend-prod

# Frontend
cd frontend
npm run build
# Serve dist/ directory
```

## 🐛 Debugging

### Logging
Each module should use structured logging:

```python
import logging
logger = logging.getLogger(__name__)

def some_function():
    logger.info("Processing request", extra={
        'module': 'extraction',
        'function': 'extract_parameters'
    })
```

### Error Handling
Implement proper error handling:

```python
try:
    result = api_call()
except APIError as e:
    logger.error(f"API call failed: {e}")
    return fallback_result
```

### Health Checks
Each module should provide health status:

```python
def health_check():
    return {
        'status': 'healthy',
        'api_available': check_api_connection(),
        'model_loaded': check_model_status()
    }
```

## 📈 Performance Considerations

### Caching
Implement caching for expensive operations:

```python
from functools import lru_cache

@lru_cache(maxsize=1000)
def geocode_address(address: str):
    # Expensive geocoding operation
    pass
```

### Async Operations
Use async/await for I/O operations:

```python
async def fetch_waypoints(query: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"/search?q={query}")
        return response.json()
```

### Rate Limiting
Implement rate limiting for API calls:

```python
import time
from functools import wraps

def rate_limit(calls_per_second=10):
    def decorator(func):
        last_called = [0.0]
        @wraps(func)
        def wrapper(*args, **kwargs):
            elapsed = time.time() - last_called[0]
            left_to_wait = 1.0 / calls_per_second - elapsed
            if left_to_wait > 0:
                time.sleep(left_to_wait)
            ret = func(*args, **kwargs)
            last_called[0] = time.time()
            return ret
        return wrapper
    return decorator
```

## 📚 Resources

### Documentation
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://reactjs.org/docs/)
- [Material-UI Documentation](https://mui.com/)
- [Leaflet Documentation](https://leafletjs.com/)

### APIs
- [Ollama Documentation](https://ollama.ai/docs)
- [Llama 3.1 Documentation](https://huggingface.co/meta-llama/Llama-3.1-8B)
- [Google Maps API](https://developers.google.com/maps)
- [Mapbox API](https://docs.mapbox.com/)
- [CLIP Model](https://github.com/openai/CLIP)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [React Developer Tools](https://reactjs.org/blog/2019/08/15/new-react-devtools.html)
- [Python Debugger](https://docs.python.org/3/library/pdb.html)
