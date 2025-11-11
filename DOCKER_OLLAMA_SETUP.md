# Docker Ollama Setup Guide

Your application is now configured to use **Docker Ollama** instead of a local installation.

## 🚀 Quick Start

### 1. Start the services

```bash
docker compose up -d
```

This will start:
- **Backend** (FastAPI server on port 8000)
- **Frontend** (React app on port 3000)
- **Ollama** (LLM server on port 11434)
- **Redis** (Cache on port 6379)

### 2. Pull the Llama 3.1 model

After the containers are running, pull the model:

```bash
./scripts/setup-ollama.sh
```

This will automatically:
- Wait for Ollama to be ready
- Pull `llama3.1:8b-instruct-q4_K_M` (optimized 4-bit quantized version)
- Verify the model is available

**Note**: The first pull will download ~4.7GB of model data. This is stored in a Docker volume (`ollama_data`) so you only need to do this once.

### 3. Verify everything is working

```bash
# Check all services are running
docker compose ps

# Test Ollama directly
curl http://localhost:11434/api/tags

# Test backend health
curl http://localhost:8000/healthz
```

## 🔧 Configuration

### Current Setup

```yaml
# Backend connects to Ollama service
OPENAI_COMPATIBLE_URL=http://ollama:11434/v1/chat/completions
```

### Available Models

To list all pulled models:
```bash
docker exec free-form-text-to-route-ollama-1 ollama list
```

To pull a different model:
```bash
docker exec free-form-text-to-route-ollama-1 ollama pull <model-name>
```

Popular models:
- `llama3.1:8b-instruct-q4_K_M` - **Recommended** (4.7GB, best balance)
- `llama3.1:8b-instruct-q8_0` - Higher quality (8.5GB)
- `llama3.1:8b-instruct` - Full precision (16GB)
- `llama3.2:3b-instruct-q4_K_M` - Smaller/faster (2GB)

## 🐛 Troubleshooting

### Issue: "Connection refused" to Ollama

**Solution**: Wait for Ollama to fully start (can take 30-60 seconds)
```bash
# Watch the logs
docker compose logs -f ollama
```

### Issue: Model not found

**Solution**: Pull the model again
```bash
./scripts/setup-ollama.sh
```

### Issue: Out of memory

**Symptoms**: Ollama crashes or becomes unresponsive

**Solution**: The q4_K_M model requires ~6GB RAM. Options:
1. Use a smaller model: `llama3.2:3b-instruct-q4_K_M` (~3GB)
2. Increase Docker memory limits (Docker Desktop → Settings → Resources)
3. Add memory limits to docker-compose.yml

### Issue: Slow inference

**Possible causes**:
- CPU-only inference (no GPU acceleration in Docker)
- Insufficient memory
- Model still loading

**Solutions**:
1. Wait for model to fully load (first request is slow)
2. For GPU acceleration, see "GPU Support" below

## 🚀 GPU Support (Optional)

To enable GPU acceleration with NVIDIA GPUs:

### 1. Install NVIDIA Container Toolkit

```bash
# Ubuntu/Debian
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list

sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
sudo systemctl restart docker
```

### 2. Update docker-compose.yml

Add to the `ollama` service:
```yaml
ollama:
  image: ollama/ollama:latest
  deploy:
    resources:
      reservations:
        devices:
          - driver: nvidia
            count: 1
            capabilities: [gpu]
  environment:
    - OLLAMA_GPU_LAYERS=35  # Adjust based on VRAM
```

### 3. Restart services

```bash
docker compose down
docker compose up -d
./scripts/setup-ollama.sh
```

## 📊 Performance Comparison

| Configuration | First Token | Tokens/sec | Memory |
|--------------|-------------|------------|---------|
| Local Ollama (CPU) | ~2s | 15-20 | 6GB |
| Docker Ollama (CPU) | ~3s | 12-18 | 6GB |
| Docker Ollama (GPU) | ~0.5s | 40-80 | 4GB RAM + 4GB VRAM |

**Note**: Docker adds slight overhead (~10-20%) vs local installation, but provides better isolation and portability.

## 🔄 Switching Back to Local Ollama

If you want to use a local Ollama installation instead:

1. Update `docker-compose.yml`:
```yaml
# Change backend environment
- OPENAI_COMPATIBLE_URL=http://host.docker.internal:11434/v1/chat/completions

# Add back extra_hosts
extra_hosts:
  - "host.docker.internal:host-gateway"

# Remove ollama from depends_on
depends_on:
  redis:
    condition: service_started
  # Remove: ollama

# Comment out the ollama service
# ollama:
#   ...
```

2. Restart:
```bash
docker compose down
docker compose up -d
```

## 💾 Data Persistence

The Ollama models are stored in a Docker volume:
```bash
# View volume info
docker volume inspect free-form-text-to-route_ollama_data

# Backup models
docker run --rm -v free-form-text-to-route_ollama_data:/data -v $(pwd):/backup alpine tar czf /backup/ollama_backup.tar.gz /data

# Restore models
docker run --rm -v free-form-text-to-route_ollama_data:/data -v $(pwd):/backup alpine tar xzf /backup/ollama_backup.tar.gz -C /
```

## 🧹 Cleanup

To completely remove Ollama and its data:

```bash
# Stop and remove containers
docker compose down

# Remove the volume (WARNING: Deletes all models!)
docker volume rm free-form-text-to-route_ollama_data
```

## 📝 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OLLAMA_HOST` | `0.0.0.0` | Listen address |
| `OLLAMA_KEEP_ALIVE` | `10m` | How long to keep model in memory |
| `OLLAMA_NUM_PARALLEL` | `1` | Number of parallel requests |
| `OLLAMA_MAX_LOADED_MODELS` | `1` | Max models in memory |

Modify these in `docker-compose.yml` under the `ollama` service.

