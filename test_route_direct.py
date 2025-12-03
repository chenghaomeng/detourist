#!/usr/bin/env python3
"""
Direct test script for route generation without running the API server.
Usage: python test_route_direct.py "your prompt here"
"""

import sys
import os
import json
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from backend.orchestrator import RouteOrchestrator, RouteRequest

def main():
    # Get prompt from command line or use default
    if len(sys.argv) > 1:
        prompt = " ".join(sys.argv[1:])
    else:
        prompt = "Walk from Union Square to Chinatown in San Francisco, passing through parks"
    
    print(f"Generating routes for prompt: \"{prompt}\"")
    print("=" * 70)
    
    # Load config from environment variables
    config = {
        "llm_api_key": os.getenv("LLM_API_KEY", ""),
        "geocoding_api_key": os.getenv("GEOCODING_API_KEY", ""),
        "routing_api_key": os.getenv("ROUTING_API_KEY", ""),
        "poi_api_key": os.getenv("POI_API_KEY", ""),
        "clip_model_name": os.getenv("CLIP_MODEL_NAME", "openai/clip-vit-base-patch32"),
        "mapillary_token": os.getenv("MAPILLARY_TOKEN", ""),
        "redis_url": os.getenv("REDIS_URL", "redis://localhost:6379/0"),
    }
    
    # Initialize orchestrator
    orchestrator = RouteOrchestrator(config)
    
    # Create request
    request = RouteRequest(
        user_prompt=prompt,
        max_results=3,
    )
    
    # Generate routes
    try:
        response = orchestrator.generate_routes(request)
        
        # Print results
        print(f"\n✅ Generated {len(response.routes)} routes in {response.processing_time_seconds:.2f}s")
        print(f"   Found {response.metadata.get('waypoints_found', 0)} waypoints")
        print(f"   Generated {response.metadata.get('total_routes_generated', 0)} total routes\n")
        
        for i, route in enumerate(response.routes, 1):
            print(f"Route {i}:")
            print(f"  Score: {route['score']:.2f}")
            print(f"  Distance: {route['distance_m']:.0f}m ({route['distance_m']/1609.34:.2f} miles)")
            print(f"  Duration: {route['duration_s']}s ({route['duration_s']/60:.1f} minutes)")
            print(f"  Waypoints: {len(route['waypoints'])}")
            if route['waypoints']:
                for wp in route['waypoints']:
                    print(f"    - {wp['name']} (relevance: {wp['relevance_score']:.2f})")
            print()
        
        # Optionally save to JSON
        output_file = "test_route_output.json"
        with open(output_file, "w") as f:
            json.dump({
                "prompt": prompt,
                "routes": response.routes,
                "processing_time_seconds": response.processing_time_seconds,
                "metadata": response.metadata,
            }, f, indent=2)
        print(f"💾 Full results saved to: {output_file}")
        
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()

