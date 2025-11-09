###################### Switch between old and optimized orchestrator ################
# backend/api.py
################################# TAZRIAN'S UPDATES (Oct 12, 2025) ###############################################

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, root_validator
from typing import List, Dict, Any, Optional
import uvicorn
import os
import dataclasses

# ---- Orchestrator mode switch (parallel vs sync) ----
# Set ORCH_MODE=sync to use backend/orchestrator_sync.py (baseline, no thread fan-out)
# Default is parallel (backend/orchestrator.py)
_ORCH_MODE = os.getenv("ORCH_MODE", "parallel").lower()
if _ORCH_MODE == "sync":
    from backend.orchestrator_sync import RouteOrchestratorSync as RouteOrchestrator, RouteRequest
else:
    from backend.orchestrator import RouteOrchestrator, RouteRequest


# ---------- Pydantic models for API (aligned with UI contract) ----------
class PlaceInput(BaseModel):
    text: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None

    @root_validator
    def must_have_text_or_coords(cls, v):
        if not v.get("text") and (v.get("lat") is None or v.get("lon") is None):
            raise ValueError("Provide either 'text' or both 'lat' and 'lon' for origin/destination.")
        return v


class TimeInput(BaseModel):
    max_duration_min: Optional[int] = Field(default=None, ge=1, le=1440)
    departure_time_utc: Optional[str] = None  # ISO8601


class RouteGenerationRequest(BaseModel):
    user_prompt: str = Field(..., description="Natural language description of desired route")
    max_results: int = Field(default=5, ge=1, le=10)
    origin: Optional[PlaceInput] = None
    destination: Optional[PlaceInput] = None
    time: Optional[TimeInput] = None


class RouteGenerationResponse(BaseModel):
    routes: List[Dict[str, Any]]
    processing_time_seconds: float
    metadata: Dict[str, Any]


class HealthResponse(BaseModel):
    status: str
    modules: Dict[str, str]


app = FastAPI(
    title="Free-form Text to Route API",
    description="Generate custom routes from natural language prompts",
    version="1.0.0"
)

# Parse ALLOW_ORIGINS env safely into a list
_origins = os.getenv("ALLOW_ORIGINS", "*")
allow_origins = ["*"] if _origins.strip() == "*" else [o.strip() for o in _origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator: Optional[RouteOrchestrator] = None


def get_orchestrator() -> RouteOrchestrator:
    global orchestrator
    if orchestrator is None:
        config = {
            "llm_api_key": os.getenv("LLM_API_KEY", ""),
            "geocoding_api_key": os.getenv("GEOCODING_API_KEY", ""),   # Mapbox token
            "poi_api_key": os.getenv("POI_API_KEY", ""),               # (unused for Overpass; kept for parity)
            "routing_api_key": os.getenv("ROUTING_API_KEY", ""),       # Mapbox token (same as geocoding)
            "clip_model_name": os.getenv("CLIP_MODEL_NAME", "openai/clip-vit-base-patch32"),
            "mapillary_token": os.getenv("MAPILLARY_TOKEN", ""),       # optional
            "redis_url": os.getenv("REDIS_URL", "redis://localhost:6379/0"),
        }
        orchestrator = RouteOrchestrator(config)
    return orchestrator


@app.get("/", response_model=Dict[str, str])
async def root():
    return {"message": "Free-form Text to Route API", "version": "1.0.0", "mode": _ORCH_MODE}


@app.get("/health", response_model=HealthResponse)
async def health_check(orch: RouteOrchestrator = Depends(get_orchestrator)):
    try:
        return HealthResponse(status="healthy", modules=orch.health_check())
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service unhealthy: {str(e)}")


@app.get("/healthz", response_model=Dict[str, str])   # fast probe
async def healthz():
    return {"status": "ok"}


@app.post("/generate-routes", response_model=RouteGenerationResponse)
async def generate_routes(
    request: RouteGenerationRequest,
    orch: RouteOrchestrator = Depends(get_orchestrator)
):
    try:
        internal = RouteRequest(
            user_prompt=request.user_prompt,
            max_results=request.max_results,
            origin=request.origin.dict() if request.origin else None,
            destination=request.destination.dict() if request.destination else None,
            time=request.time.dict() if request.time else None,
        )
        resp = orch.generate_routes(internal)

        # Normalize orchestrator output (dataclass OR dict) to a dict:
        if dataclasses.is_dataclass(resp):
            resp = dataclasses.asdict(resp)
        elif not isinstance(resp, dict):
            raise TypeError(f"Unexpected orchestrator return type: {type(resp)}")

        return RouteGenerationResponse(
            routes=resp.get("routes", []),
            processing_time_seconds=float(resp.get("processing_time_seconds", 0.0)),
            metadata=resp.get("metadata", {}),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Route generation failed: {str(e)}")


if __name__ == "__main__":
    uvicorn.run("backend.api:app", host="0.0.0.0", port=8000, reload=True)
