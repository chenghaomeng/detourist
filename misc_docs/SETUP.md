# Setup Instructions

## Prerequisites

Make sure you have the following installed:
- Docker and Docker Compose
- Git

## 1. Get API Keys

### Mapbox (Required for Backend)
1. Go to https://account.mapbox.com/
2. Create a new access token or use your default public token
3. Copy the token (starts with `pk.`)

### OpenAI (Required for Frontend Quick Mode)
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key (starts with `sk-`)

## 2. Configure Environment Variables

### Backend Configuration

Create a `.env` file in the project root:

```bash
# Mapbox API Keys
GEOCODING_API_KEY=pk.your_mapbox_access_token
POI_API_KEY=pk.your_mapbox_access_token
ROUTING_API_KEY=pk.your_mapbox_access_token
MAPILLARY_TOKEN=optional_for_street_view_images

# LLM Configuration (Ollama - no key needed)
OPENAI_COMPATIBLE_URL=http://ollama:11434/v1/chat/completions
OPENAI_COMPATIBLE_API_KEY=dummy-key

# Optional: CLIP model path
CLIP_MODEL_PATH=/app/models/clip_model.pth
```

### Frontend Configuration

Create a `frontend/.env.local` file:

```bash
VITE_BACKEND_URL=http://localhost:8000
VITE_OPENAI_API_KEY=sk-your_openai_api_key

# Also add to root .env for docker-compose
VITE_OPENAI_API_KEY=sk-your_openai_api_key
```

**Important:** Replace the placeholder values with your actual API keys!

## 3. Start Services

### Start All Services with Docker Compose

```bash
# Start all services (backend, frontend, ollama, redis)
docker compose up -d

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend
```

### Pull the Llama Model (First Time Only)

This step downloads the Llama 3.1 8B quantized model (~4.7GB). It takes about 5-10 minutes depending on your internet connection.

```bash
# Pull the model into the Ollama container
docker compose exec ollama ollama pull llama3.1:8b-instruct-q4_K_M

# Verify the model is downloaded
docker compose exec ollama ollama list
```

### Verify Services are Running

```bash
# Check all containers are up
docker compose ps

# Test backend health
curl http://localhost:8000/health

# Should return something like:
# {"status":"healthy","modules":{"extractor":"healthy","geocoder":"healthy",...}}
```

## 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 5. How to Use

### Quick Mode (⚡ - Default)
- **Speed**: 2-3 seconds
- **Uses**: OpenAI GPT-4o-mini + Google Maps Directions API
- **Best for**: Fast, standard routes

1. Enable "Natural Search" toggle (blue sparkle icon)
2. Keep "Enhanced" toggle OFF (lightning bolt visible)
3. Type your query: e.g., "Scenic route from Central Park to Brooklyn Bridge"
4. Hit search

### Enhanced Mode (✨ - AI-Powered)
- **Speed**: 10-30 seconds
- **Uses**: Backend with Llama 3.1 + AI waypoint discovery + CLIP scoring
- **Best for**: Scenic routes with custom waypoints

1. Enable "Natural Search" toggle (blue sparkle icon)
2. Enable "Enhanced" toggle (green brain icon)
3. Type your query: e.g., "Scenic route avoiding highways with parks and viewpoints"
4. Hit search
5. Wait for AI to analyze (watch the progress messages)

## 6. Troubleshooting

### Backend Won't Start
```bash
# Check backend logs
docker compose logs backend

# Common issues:
# 1. Missing API keys - check .env file
# 2. Port 8000 already in use - stop other services
# 3. Ollama not ready - wait 30 seconds and restart
docker compose restart backend
```

### Frontend Won't Build
```bash
# Check frontend logs
docker compose logs frontend

# Rebuild frontend
docker compose up -d --build frontend
```

### Ollama Model Not Loading
```bash
# Check if Ollama is running
docker compose exec ollama ollama list

# If model not found, pull it again
docker compose exec ollama ollama pull llama3.1:8b-instruct-q4_K_M

# Check Ollama logs
docker compose logs ollama
```

### "Network Error" in Frontend
```bash
# Check if backend is accessible
curl http://localhost:8000/health

# Check if frontend can reach backend (from inside container)
docker compose exec frontend wget -O- http://backend:8000/health

# Restart services
docker compose restart
```

### Enhanced Mode Times Out
```bash
# Check backend processing
docker compose logs -f backend

# The first request may be slow as Ollama loads the model
# Subsequent requests should be faster

# If consistently timing out, check:
# 1. System has enough RAM (8GB minimum)
# 2. Ollama model is loaded: docker compose exec ollama ollama list
```

## 7. Development Mode

### Run Frontend Locally (Hot Reload)

```bash
cd frontend
npm install
npm run dev
```

Frontend will be at http://localhost:3000 with hot reload.

### Run Backend Locally (Without Docker)

```bash
# Install dependencies
poetry install

# Start backend
poetry run python -m uvicorn backend.api:app --reload

# Or use the convenience command
poetry run start-backend
```

Backend will be at http://localhost:8000 with auto-reload.

### Run Ollama Separately

```bash
# If you have Ollama installed locally
ollama serve &
ollama pull llama3.1:8b-instruct-q4_K_M

# Update backend to use local Ollama
# In .env, change:
OPENAI_COMPATIBLE_URL=http://localhost:11434/v1/chat/completions
```

## 8. Stopping Services

```bash
# Stop all services
docker compose down

# Stop and remove volumes (clears cache)
docker compose down -v

# Stop and remove images
docker compose down --rmi all
```

## 9. Updating the Code

```bash
# Pull latest changes
git pull

# Rebuild containers
docker compose up -d --build

# If you changed dependencies:
# Backend
docker compose exec backend poetry install

# Frontend
docker compose exec frontend npm install
```

## 10. Architecture Overview

```
┌─────────────────┐
│   Frontend      │  React + Vite (localhost:3000)
│   (Nginx)       │  • Quick Mode: OpenAI + Google Maps
│                 │  • Enhanced Mode: Calls Backend API
└────────┬────────┘
         │ /api/* proxied to backend:8000
         ▼
┌─────────────────┐
│   Backend       │  FastAPI (localhost:8000)
│   (Python)      │  • LLM Extraction (Ollama)
└────────┬────────┘  • Geocoding (Mapbox)
         │           • Waypoint Search (Mapbox)
         ├───────────• Route Building (Mapbox)
         │           • CLIP Scoring
         ▼
┌─────────────────┐
│   Ollama        │  LLM Inference (localhost:11434)
│   (Llama 3.1)   │  • Llama 3.1 8B quantized model
└─────────────────┘  • Parameter extraction

┌─────────────────┐
│   Redis         │  Cache (localhost:6379)
│   (Alpine)      │  • API response caching
└─────────────────┘
```

## 11. Performance Notes

### Quick Mode
- **Response time**: 2-3 seconds
- **API calls**: OpenAI (1x) + Google Maps (1x)
- **Cost per request**: ~$0.001 (OpenAI)

### Enhanced Mode
- **Response time**: 10-30 seconds (first request may be slower)
- **API calls**: Mapbox Geocoding + POI Search + Directions
- **Processing**:
  - LLM extraction: 3-8 seconds
  - Waypoint search: 2-4 seconds
  - Route building: 3-5 seconds
  - CLIP scoring: 2-5 seconds (if enabled)
- **Cost per request**: ~$0.00 (local Ollama, only Mapbox API costs)

### System Requirements
- **Minimum**: 8GB RAM, 2 CPU cores
- **Recommended**: 16GB RAM, 4 CPU cores
- **Storage**: ~10GB (5GB for Ollama model)

## 12. Next Steps

1. ✅ Get your API keys
2. ✅ Configure .env files
3. ✅ Start services with `docker compose up -d`
4. ✅ Pull Llama model
5. ✅ Test Quick Mode
6. ✅ Test Enhanced Mode
7. 🎉 Start exploring scenic routes!

## Support

If you encounter issues:
1. Check the logs: `docker compose logs -f`
2. Verify API keys in `.env` files
3. Ensure ports 3000, 8000, 11434, 6379 are not in use
4. Check Docker has enough resources (8GB RAM minimum)

For more details, see:
- Backend documentation: `backend/README.md`
- API documentation: http://localhost:8000/docs
- Team guide: `TEAM_GUIDE.md`

