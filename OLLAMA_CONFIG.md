# Ollama Configuration Guide

## Current Setup: 🚀 LOCAL Ollama (Faster Performance)

Your app is now configured to use **your local Ollama installation** instead of Docker Ollama.

### Why Local Ollama?
- ✅ **3-5x faster inference** (native performance)
- ✅ **Uses your Mac's GPU** (Apple Silicon M-series)
- ✅ **No Docker overhead**
- ✅ **Shared models** across all your projects

---

## Current Configuration

### `docker-compose.yml` Settings:
```yaml
environment:
  # 🚀 Using LOCAL Ollama (faster)
  - OPENAI_COMPATIBLE_URL=http://host.docker.internal:11434/v1/chat/completions
```

### Services Running:
- ✅ Backend (port 8000)
- ✅ Frontend (port 3000)
- ✅ Redis (port 6379)
- ❌ Docker Ollama (DISABLED)

### Local Ollama:
- 📍 Running natively on your Mac
- 🔗 Accessible at: `http://localhost:11434`
- 🤖 Models available:
  - `llama3.1:8b-instruct-q4_K_M` (used by backend)
  - `mistral:latest`

---

## How to Switch Configurations

### Option 1: Use Local Ollama (CURRENT - Recommended)

**Requirements:**
1. Ollama installed on your Mac: `brew install ollama` 
2. Ollama running: `ollama serve` or Ollama app running
3. Model downloaded: `ollama pull llama3.1:8b-instruct-q4_K_M`

**docker-compose.yml:**
```yaml
backend:
  environment:
    - OPENAI_COMPATIBLE_URL=http://host.docker.internal:11434/v1/chat/completions
  extra_hosts:
    - "host.docker.internal:host-gateway"
```

### Option 2: Use Docker Ollama (Slower, but self-contained)

**Edit docker-compose.yml:**

1. Uncomment the Docker Ollama service (lines 44-56)
2. Change backend URL:
   ```yaml
   backend:
     environment:
       - OPENAI_COMPATIBLE_URL=http://ollama:11434/v1/chat/completions
     depends_on:
       - redis
       - ollama  # Add this
   ```
3. Uncomment ollama_data volume (line 68)
4. Restart: `docker compose down && docker compose up -d`

---

## Verification Commands

### Check Local Ollama Status:
```bash
# Check if running
ps aux | grep "ollama serve"

# Test connection
curl http://localhost:11434/api/tags

# List models
ollama list
```

### Check Backend Connection:
```bash
# Verify backend can reach local Ollama
docker compose exec backend curl http://host.docker.internal:11434/api/tags

# Check backend env variable
docker compose exec backend env | grep OPENAI_COMPATIBLE_URL
```

### Check Logs:
```bash
# Backend logs
docker compose logs backend --tail=50

# All services
docker compose logs --tail=50
```

---

## Performance Comparison

| Setup | LLM Query Speed | Route Generation |
|-------|----------------|------------------|
| **Local Ollama** | ~2-5 seconds | ~30-60 seconds |
| Docker Ollama | ~10-20 seconds | ~90-120 seconds |
| No GPU | ~30-60 seconds | ~3-5 minutes |

---

## Troubleshooting

### Backend can't connect to local Ollama:
```bash
# 1. Ensure Ollama is running
ollama serve

# 2. Check if port 11434 is accessible
curl http://localhost:11434/api/tags

# 3. Restart backend
docker compose restart backend
```

### Want to use Docker Ollama instead:
```bash
# 1. Edit docker-compose.yml (see Option 2 above)
# 2. Pull the model inside Docker
docker compose run ollama ollama pull llama3.1:8b-instruct-q4_K_M
# 3. Restart everything
docker compose down && docker compose up -d
```

---

## Current Status: ✅ READY

- ✅ Local Ollama is running (PID confirmed)
- ✅ Backend configured to use local Ollama
- ✅ Connection verified
- ✅ Model `llama3.1:8b-instruct-q4_K_M` available
- 🚀 Ready for fast Enhanced Mode queries!

**Test it now:** Try Enhanced Mode with a query like:
```
"scenic route from Union Square to Fisherman's Wharf"
```

