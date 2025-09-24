#!/bin/bash

# Setup script for free-form text to route project

set -e

echo "🚀 Setting up free-form text to route project..."

# Check if Python 3.11+ is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3.11+ is required but not installed."
    exit 1
fi

# Check if Poetry is installed
if ! command -v poetry &> /dev/null; then
    echo "❌ Poetry is required but not installed."
    echo "📦 Installing Poetry..."
    curl -sSL https://install.python-poetry.org | python3 -
    export PATH="$HOME/.local/bin:$PATH"
fi

# Check if Node.js 18+ is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 18+ is required but not installed."
    exit 1
fi

# Install Python dependencies with Poetry
echo "📦 Installing Python dependencies with Poetry..."
poetry install

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
cd frontend
npm install
cd ..

# Create necessary directories
echo "📁 Creating project directories..."
mkdir -p models
mkdir -p logs
mkdir -p data
mkdir -p cache

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your API keys before running the application."
fi

# Download CLIP model (optional)
echo "🤖 Setting up CLIP model..."
poetry run python -c "
import clip
import torch
print('Downloading CLIP model...')
model, preprocess = clip.load('ViT-B/32', device='cpu')
print('CLIP model downloaded successfully!')
"

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your API keys"
echo "2. Run backend: poetry run start-backend"
echo "3. Run frontend: cd frontend && npm run dev"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "Poetry commands:"
echo "- Install dependencies: poetry install"
echo "- Add new dependency: poetry add package-name"
echo "- Add dev dependency: poetry add --group dev package-name"
echo "- Run commands: poetry run command"
echo "- Activate shell: poetry shell"
