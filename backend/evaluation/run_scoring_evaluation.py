#!/usr/bin/env python3
"""
Scoring evaluation runner script for batch testing route scoring.

This script runs batch evaluations against scoring ground truth examples and outputs
detailed results showing how often the app's chosen best route matches the annotated best route.

Usage:
    python -m backend.evaluation.run_scoring_evaluation [options]

Environment Variables:
    ROUTING_API_KEY: Mapbox API key for routing (required)
    GEOCODING_API_KEY: Mapbox API key for geocoding (defaults to ROUTING_API_KEY)
    MAPILLARY_TOKEN: Optional Mapillary token for image scoring
    CLIP_MODEL_NAME: CLIP model name (default: openai/clip-vit-base-patch32)
    ENABLE_SCORING: Set to "true" to enable CLIP scoring (default: false)
"""

import argparse
import json
import os
import sys
from pathlib import Path
from typing import List

from backend.evaluation.evaluator import (
    RouteEvaluator,
    ScoringEvaluationResult,
)
from backend.evaluation.ground_truth_scoring_examples import get_ground_truth_scoring_examples


def format_result_summary(result: ScoringEvaluationResult) -> str:
    """Format a single scoring evaluation result as a summary string."""
    lines = [
        f"\n{'='*70}",
        f"Example: {result.example_id}",
        f"{'='*70}",
        f"Processing time: {result.processing_time_seconds:.2f}s",
    ]
    
    if result.error:
        lines.append(f"\n❌ ERROR: {result.error}")
        return "\n".join(lines)
    
    # Route selection comparison
    lines.append("\n🎯 Route Selection:")
    status = "✅" if result.match else "❌"
    lines.append(f"  {status} Match: {result.match}")
    lines.append(f"      App chose route index: {result.app_chosen_index}")
    lines.append(f"      Ground truth best index: {result.ground_truth_index}")
    
    # Show scored routes
    if result.scored_routes:
        lines.append("\n📊 Scored Routes (sorted by score, best first):")
        for i, scored_route in enumerate(result.scored_routes):
            route = scored_route.route
            is_app_choice = i == 0  # First route is the app's choice
            is_gt_choice = (result.app_chosen_index == result.ground_truth_index and i == 0) or \
                          (result.app_chosen_index != result.ground_truth_index and 
                           route == result.scored_routes[result.ground_truth_index].route)
            
            marker = ""
            if is_app_choice and is_gt_choice:
                marker = " ✅ (App & GT choice)"
            elif is_app_choice:
                marker = " 👈 (App choice)"
            elif is_gt_choice:
                marker = " ⭐ (GT choice)"
            
            lines.append(f"  Route {i}:")
            lines.append(f"    Overall Score: {scored_route.overall_score:.3f}{marker}")
            lines.append(f"    CLIP Score: {scored_route.clip_score:.3f}")
            lines.append(f"    Efficiency Score: {scored_route.efficiency_score:.3f}")
            lines.append(f"    Preference Match Score: {scored_route.preference_match_score:.3f}")
            lines.append(f"    Waypoints: {len(route.waypoints)}")
            lines.append(f"    Distance: {route.total_distance_meters:.0f}m")
            lines.append(f"    Duration: {route.total_duration_seconds}s")
    
    return "\n".join(lines)


def format_batch_summary(results: List[ScoringEvaluationResult]) -> str:
    """Format batch evaluation summary."""
    successful = [r for r in results if r.error is None]
    matches = sum(1 for r in successful if r.match)
    accuracy = matches / len(successful) * 100.0 if successful else 0.0
    total_time = sum(r.processing_time_seconds for r in results)
    
    lines = [
        f"\n{'='*70}",
        "BATCH EVALUATION SUMMARY",
        f"{'='*70}",
        f"Total examples: {len(results)}",
        f"Successful: {len(successful)}",
        f"Errors: {len(results) - len(successful)}",
        "",
        f"Matches: {matches}/{len(successful)}",
        f"Accuracy: {accuracy:.1f}%",
        "",
        f"Total processing time: {total_time:.2f}s",
        f"Average time per example: {total_time/len(results):.2f}s",
    ]
    
    return "\n".join(lines)


def main():
    """Main entry point for scoring evaluation script."""
    parser = argparse.ArgumentParser(
        description="Run batch scoring evaluation against ground truth examples"
    )
    parser.add_argument(
        "--examples",
        nargs="+",
        help="Specific example IDs to run (default: all examples)",
    )
    parser.add_argument(
        "--output-json",
        type=str,
        help="Path to output JSON file with results",
    )
    parser.add_argument(
        "--quiet",
        action="store_true",
        help="Only show summary, not detailed results",
    )
    
    args = parser.parse_args()
    
    # Get API keys from environment
    routing_api_key = os.getenv("ROUTING_API_KEY")
    if not routing_api_key:
        print("ERROR: ROUTING_API_KEY environment variable is required", file=sys.stderr)
        sys.exit(1)
    
    geocoding_api_key = os.getenv("GEOCODING_API_KEY", routing_api_key)
    mapillary_token = os.getenv("MAPILLARY_TOKEN")
    clip_model_name = os.getenv("CLIP_MODEL_NAME", "openai/clip-vit-base-patch32")
    
    # Initialize evaluator
    evaluator = RouteEvaluator(
        routing_api_key=routing_api_key,
        geocoding_api_key=geocoding_api_key,
        clip_model_name=clip_model_name,
        mapillary_token=mapillary_token,
    )
    
    # Load examples
    all_examples = get_ground_truth_scoring_examples()
    
    # Filter examples if specified
    if args.examples:
        example_ids = set(args.examples)
        examples = [ex for ex in all_examples if ex.example_id in example_ids]
        if len(examples) != len(example_ids):
            found_ids = {ex.example_id for ex in examples}
            missing = example_ids - found_ids
            if missing:
                print(f"WARNING: Example IDs not found: {missing}", file=sys.stderr)
    else:
        examples = all_examples
    
    if not examples:
        print("ERROR: No examples to evaluate", file=sys.stderr)
        sys.exit(1)
    
    print(f"Running scoring evaluation on {len(examples)} example(s)...")
    print(f"ENABLE_SCORING: {os.getenv('ENABLE_SCORING', 'false')}")
    print()
    
    # Run batch evaluation
    results = evaluator.run_scoring_batch(examples)
    
    # Print results
    if not args.quiet:
        for result in results:
            print(format_result_summary(result))
    
    # Print batch summary
    print(format_batch_summary(results))
    
    # Export to JSON if requested
    if args.output_json:
        output_path = Path(args.output_json)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Convert results to JSON-serializable format
        json_results = []
        for result in results:
            json_result = {
                "example_id": result.example_id,
                "app_chosen_index": result.app_chosen_index,
                "ground_truth_index": result.ground_truth_index,
                "match": result.match,
                "processing_time_seconds": result.processing_time_seconds,
                "error": result.error,
                "scored_routes": [
                    {
                        "overall_score": sr.overall_score,
                        "clip_score": sr.clip_score,
                        "efficiency_score": sr.efficiency_score,
                        "preference_match_score": sr.preference_match_score,
                        "num_waypoints": len(sr.route.waypoints),
                        "distance_meters": sr.route.total_distance_meters,
                        "duration_seconds": sr.route.total_duration_seconds,
                    }
                    for sr in result.scored_routes
                ],
            }
            json_results.append(json_result)
        
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(json_results, f, indent=2)
        
        print(f"\nResults exported to: {output_path}")


if __name__ == "__main__":
    main()

