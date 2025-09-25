"""
FastAPI backend server for the route generation service.

This module provides:
1. REST API endpoints for route generation
2. Request/response validation
3. Error handling
4. Health checks
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import uvicorn
import os

from backend.orchestrator import RouteOrchestrator, RouteRequest, RouteResponse


# Pydantic models for API
class RouteGenerationRequest(BaseModel):
    """Request model for route generation."""
    user_prompt: str = Field(..., description="Natural language description of desired route")
    max_results: int = Field(default=5, ge=1, le=10, description="Maximum number of routes to return")


class RouteGenerationResponse(BaseModel):
    """Response model for route generation."""
    routes: List[Dict[str, Any]]
    processing_time_seconds: float
    metadata: Dict[str, Any]


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    modules: Dict[str, str]


# Initialize FastAPI app
app = FastAPI(
    title="Free-form Text to Route API",
    description="Generate custom routes from natural language prompts",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global orchestrator instance
orchestrator: Optional[RouteOrchestrator] = None


def get_orchestrator() -> RouteOrchestrator:
    """Dependency to get orchestrator instance."""
    global orchestrator
    if orchestrator is None:
        config = {
            'llm_api_key': os.getenv('LLM_API_KEY', ''),
            'geocoding_api_key': os.getenv('GEOCODING_API_KEY', ''),
            'poi_api_key': os.getenv('POI_API_KEY', ''),
            'routing_api_key': os.getenv('ROUTING_API_KEY', ''),
            'clip_model_path': os.getenv('CLIP_MODEL_PATH', '')
        }
        orchestrator = RouteOrchestrator(config)
    return orchestrator


@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint."""
    return {"message": "Free-form Text to Route API", "version": "1.0.0"}


@app.get("/health", response_model=HealthResponse)
async def health_check(orch: RouteOrchestrator = Depends(get_orchestrator)):
    """Health check endpoint."""
    try:
        health_status = orch.health_check()
        return HealthResponse(
            status="healthy",
            modules=health_status
        )
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service unhealthy: {str(e)}")


@app.post("/generate-routes", response_model=RouteGenerationResponse)
async def generate_routes(
    request: RouteGenerationRequest,
    orch: RouteOrchestrator = Depends(get_orchestrator)
):
    """
    Generate routes from natural language prompt.
    
    Args:
        request: Route generation request with user prompt
        orch: Route orchestrator dependency
        
    Returns:
        RouteGenerationResponse with generated routes
    """
    try:
        # Convert API request to internal request
        internal_request = RouteRequest(
            user_prompt=request.user_prompt,
            max_results=request.max_results
        )
        
        # Generate routes
        response = orch.generate_routes(internal_request)
        
        # Convert internal response to API response
        return RouteGenerationResponse(
            routes=[route.__dict__ for route in response.routes],
            processing_time_seconds=response.processing_time_seconds,
            metadata=response.metadata
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Route generation failed: {str(e)}")


if __name__ == "__main__":
    uvicorn.run(
        "backend.api:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
