# Free-form Text to Route

A web application that generates custom routes from natural language prompts, incorporating user preferences like scenic views, avoiding stairs, or specific landmarks.

## 🎯 Overview

This application takes free-form text input (e.g., "I want to go from Central Park to Times Square, taking a scenic route with lots of greenery") and generates optimized routes that match user preferences using:

- **LLM-based extraction** to parse user intent
- **Geocoding and isochrones** to define search areas
- **Waypoint discovery** based on user preferences
- **Route optimization** with constraints
- **Visual scoring** using CLIP models

## 🏗️ Architecture

### Backend Components

The backend is modularized for team development:

```
backend/
├── extraction/          # LLM-based parameter extraction
│   └── llm_extractor.py
├── geocoding/           # Address geocoding and isochrone creation
│   └── geocoder.py
├── waypoints/           # POI search and filtering
│   └── waypoint_searcher.py
├── routing/             # Route building with constraints
│   └── route_builder.py
├── scoring/             # Route evaluation and ranking
│   ├── route_scorer.py
│   └── image_processor.py
├── orchestrator.py      # Main coordination logic
└── api.py              # FastAPI web server
```

### Frontend Components

Modern React application with Material-UI:

```
frontend/
├── src/
│   ├── components/      # React components
│   │   ├── RouteGenerator.tsx
│   │   └── RouteResults.tsx
│   ├── services/        # API integration
│   │   └── api.ts
│   ├── types/           # TypeScript definitions
│   │   └── index.ts
│   └── App.tsx
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Poetry (for Python dependency management)
- Node.js 18+
- API keys for:
  - LLM service (OpenAI)
  - Geocoding (Google Maps or Mapbox)
  - POI search (Google Places or Foursquare)
  - Routing (Google Maps or Mapbox)

### Setup

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd free-form-text-to-route
   ./scripts/setup.sh
   ```

2. **Configure API keys**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Run the application**:
   ```bash
   # Terminal 1: Backend
   poetry run start-backend

   # Terminal 2: Frontend
   cd frontend
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Docker Setup

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `LLM_API_KEY` | OpenAI API key | `sk-...` |
| `GEOCODING_API_KEY` | Google Maps API key | `AIza...` |
| `POI_API_KEY` | Google Places API key | `AIza...` |
| `ROUTING_API_KEY` | Google Maps API key | `AIza...` |
| `CLIP_MODEL_PATH` | Path to CLIP model | `models/clip_model.pth` |

### API Endpoints

- `POST /generate-routes` - Generate routes from text prompt
- `GET /health` - Health check
- `GET /docs` - API documentation

## 🧪 Development

### Backend Development

```bash
# Install dependencies
poetry install

# Run tests
poetry run pytest

# Format code
poetry run black backend/
poetry run flake8 backend/

# Type checking
poetry run mypy backend/

# Add new dependency
poetry add package-name

# Add development dependency
poetry add --group dev package-name
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## 📊 Algorithm Flow

1. **Extraction**: Parse user prompt to extract:
   - Origin and destination
   - Time flexibility
   - Waypoint preferences
   - Routing constraints

2. **Geocoding**: Convert addresses to coordinates and create isochrones

3. **Waypoint Search**: Find POIs within search zones based on preferences

4. **Route Building**: Generate routes through waypoints with constraints

5. **Scoring**: Evaluate routes using:
   - CLIP scores (visual similarity)
   - Efficiency metrics
   - Preference matching

## 🎨 Example Prompts

- "Take me from Union Square to Golden Gate Park, avoiding hills and stairs. I want to see some art galleries along the way."
- "I need to get from my hotel near Times Square to Central Park, but I'd love a route that passes by some good coffee shops. I can spare 20 extra minutes."
- "Route from downtown to the waterfront, avoiding tolls and preferring quiet streets over busy roads."

## 🤝 Team Development

This project is designed for a 5-person team with clear module separation:

- **LLM Extraction**: Focus on prompt parsing and parameter extraction
- **Geocoding**: Handle address conversion and isochrone creation
- **Waypoints**: Implement POI search and filtering
- **Routing**: Build route optimization with constraints
- **Scoring**: Develop evaluation metrics and CLIP integration

Each module has clear interfaces and can be developed independently.

## 📝 TODO

- [ ] Implement LLM extraction logic
- [ ] Add geocoding API integration
- [ ] Build waypoint search functionality
- [ ] Create route optimization algorithms
- [ ] Integrate CLIP model for visual scoring
- [ ] Add comprehensive testing
- [ ] Implement caching for performance
- [ ] Add user authentication
- [ ] Create admin dashboard

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For questions or issues:
1. Check the API documentation at `/docs`
2. Review the health check at `/health`
3. Check logs in the `logs/` directory
4. Open an issue in the repository