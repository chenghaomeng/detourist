# Simple Ollama Setup with Llama 3.1 8B Quantized

This guide shows how to set up Ollama with **Llama 3.1 8B Quantized (q4_K_M)** for both local development and deployment. The quantized model is faster and uses less memory while maintaining excellent quality.

## 🚀 Quick Start

### 1. Start the Services
```bash
docker compose up -d
```

### 2. Pull the Model
```bash
./scripts/setup-ollama.sh
```

That's it! Your application will now use Llama 3.1 8B Quantized for route extraction.

## 📋 What This Setup Includes

- **Ollama**: Official Docker image with GPU acceleration support
- **Llama 3.1 8B Quantized (q4_K_M)**: ~4.9GB model (optimal balance of speed and quality)
- **Persistent Storage**: Models stored in Docker volumes
- **Simple Setup**: One script to pull the model
- **GPU Acceleration**: Automatic Metal Performance Shaders (MPS) on Apple Silicon

## 🔧 How It Works

1. **Docker Compose**: Starts Ollama container with persistent volume
2. **Setup Script**: Waits for Ollama to start, then pulls the model
3. **LLM Provider**: Automatically detects and uses the available model
4. **Fallback**: Works for both local development and deployment

## 🌍 Deployment Ready

This setup works for:
- **Local Development**: Uses `localhost:11434`
- **Docker Compose**: Uses `ollama:11434` service name
- **Production**: Same Docker setup, just run on your server

## 📊 Model Details

- **Model**: `llama3.1:8b-instruct-q4_K_M`
- **Size**: ~4.9GB (quantized)
- **Quality**: Excellent for structured data extraction
- **Speed**: TBD testing
- **Quantization**: q4_K_M (4-bit with mixed precision)

## 🛠️ Troubleshooting

### Model Not Available
```bash
# Check if Ollama is running
docker compose ps ollama

# Check available models
docker exec free-form-text-to-route-ollama-1 ollama list

# Pull model manually
docker exec free-form-text-to-route-ollama-1 ollama pull llama3.1:8b-instruct-q4_K_M
```

### Out of Memory
- Ensure you have at least 8GB RAM available
- Close other applications if needed
- Consider using CPU-only mode if GPU memory is limited

### Connection Issues
- Verify Ollama is running: `curl http://localhost:11434/api/tags`
- Check Docker logs: `docker compose logs ollama`

## 🔄 Updates

To update the model:
```bash
docker exec free-form-text-to-route-ollama-1 ollama pull llama3.1:8b-instruct-q4_K_M
```

## 💡 Pro Tips

1. **First Run**: The model download takes 5-10 minutes depending on internet speed
2. **Subsequent Runs**: Models persist in Docker volumes, no re-download needed
3. **Development**: The setup script handles everything automatically
4. **Production**: Same commands work on any server with Docker

This simple setup gives you a production-ready Ollama deployment with minimal complexity!
