#!/bin/bash

# Simple Ollama setup script for Llama 3.1 8B q4_K_M
# This script pulls the optimized quantized model after Ollama starts

set -e

echo "🚀 Setting up Ollama with Llama 3.1 8B q4_K_M..."

# Function to wait for Ollama to be ready
wait_for_ollama() {
    local max_attempts=30
    local attempt=1
    
    echo "⏳ Waiting for Ollama to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
            echo "✅ Ollama is ready!"
            return 0
        fi
        
        echo "Attempt $attempt/$max_attempts - Ollama not ready yet..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "❌ Ollama failed to start within expected time"
    return 1
}

# Function to pull model if not already present
pull_model_if_needed() {
    local model_name=$1
    
    echo "🔍 Checking if model $model_name is available..."
    
    if curl -s http://localhost:11434/api/tags | grep -q "$model_name"; then
        echo "✅ Model $model_name is already available"
        return 0
    fi
    
    echo "📥 Pulling model $model_name..."
    docker exec free-form-text-to-route-ollama-1 ollama pull "$model_name"
    echo "✅ Model $model_name pulled successfully"
}

# Main setup process
main() {
    # Wait for Ollama to be ready
    wait_for_ollama
    
    # Pull the q4_K_M quantized Llama 3.1 8B model (optimal balance)
    pull_model_if_needed "llama3.1:8b-instruct-q4_K_M"
    
    echo "🎉 Ollama setup complete!"
    echo "📋 Available models:"
    docker exec free-form-text-to-route-ollama-1 ollama list
}

# Run main function
main "$@"
