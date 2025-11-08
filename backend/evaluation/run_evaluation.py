#!/usr/bin/env python3
"""
Evaluation runner script for batch testing route generation.

This script runs batch evaluations against ground truth examples and outputs
detailed results including extraction accuracy and route score comparisons.

Usage:
    python -m backend.evaluation.run_evaluation [options]

Environment Variables:
    ROUTING_API_KEY: Mapbox API key for routing (required)
    GEOCODING_API_KEY: Mapbox API key for geocoding (defaults to ROUTING_API_KEY)
    LLM_API_KEY: Optional LLM API key (for future providers)
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
    EvaluationResult,
)
from backend.evaluation.ground_truth_examples import get_ground_truth_examples


def format_result_summary(result: EvaluationResult) -> str:
    """Format a single evaluation result as a summary string."""
    lines = [
        f"\n{'='*70}",
        f"Example: {result.example_id}",
        f"{'='*70}",
        f"Processing time: {result.processing_time_seconds:.2f}s",
        f"Waypoints provided: {result.num_waypoints_provided}",
    ]
    
    if result.error:
        lines.append(f"\n❌ ERROR: {result.error}")
        return "\n".join(lines)
    
    # Extraction comparison
    if result.extraction_comparison and result.llm_extracted_params:
        comp = result.extraction_comparison
        llm_params = result.llm_extracted_params
        lines.append("\n📊 Extraction Comparison:")
        
        # Origin
        status = "✅" if comp.origin_match else "❌"
        lines.append(f"  {status} Origin: {comp.origin_match}")
        gt_origin = result.ground_truth.origin_text if result.ground_truth else "N/A"
        lines.append(f"      LLM:      \"{llm_params.origin}\"")
        lines.append(f"      Expected: \"{gt_origin}\"")
        
        # Destination
        status = "✅" if comp.destination_match else "❌"
        lines.append(f"  {status} Destination: {comp.destination_match}")
        gt_dest = result.ground_truth.destination_text if result.ground_truth else "N/A"
        lines.append(f"      LLM:      \"{llm_params.destination}\"")
        lines.append(f"      Expected: \"{gt_dest}\"")
        
        # Time flexibility
        status = "✅" if comp.time_flexibility_match else "❌"
        lines.append(f"  {status} Time flexibility: {comp.time_flexibility_match}")
        gt_time = result.ground_truth.time_flexibility_minutes if result.ground_truth else "N/A"
        lines.append(f"      LLM:      {llm_params.time_flexibility_minutes} minutes")
        lines.append(f"      Expected: {gt_time} minutes")
        
        # Constraints
        status = "✅" if comp.constraints_match else "❌"
        lines.append(f"  {status} Constraints: {comp.constraints_match}")
        gt_constraints = result.ground_truth.constraints if result.ground_truth else "N/A"
        lines.append(f"      LLM:      {llm_params.constraints}")
        lines.append(f"      Expected: {gt_constraints}")
        
        # Preferences
        status = "✅" if comp.preferences_match else "❌"
        lines.append(f"  {status} Preferences: {comp.preferences_match}")
        gt_prefs = result.ground_truth.preferences if result.ground_truth else "N/A"
        lines.append(f"      LLM:      \"{llm_params.preferences}\"")
        lines.append(f"      Expected: \"{gt_prefs}\"")
        
        # Calculate extraction accuracy
        matches = sum([
            comp.origin_match,
            comp.destination_match,
            comp.time_flexibility_match,
            comp.constraints_match,
            comp.preferences_match,
        ])
        accuracy = matches / 5.0 * 100
        lines.append(f"\n  Extraction Accuracy: {accuracy:.1f}% ({matches}/5)")
    
    # Score comparison
    lines.append("\n🎯 Route Score Comparison:")
    lines.append(f"  LLM Route Score:      {result.llm_route_score:.3f}")
    lines.append(f"  Ground Truth Score:   {result.ground_truth_route_score:.3f}")
    
    if result.score_comparison is not None:
        status = "✅ PASS" if result.score_comparison else "❌ FAIL"
        lines.append(f"  LLM >= Ground Truth:   {status}")
        if result.llm_route_score and result.ground_truth_route_score:
            diff = result.llm_route_score - result.ground_truth_route_score
            lines.append(f"  Score Difference:      {diff:+.3f}")
    
    # Best route details
    if result.llm_routes:
        best_llm = result.llm_routes[0]
        lines.append("\n🚀 Best LLM Route:")
        lines.append(f"  Overall Score:        {best_llm.overall_score:.3f}")
        lines.append(f"    - CLIP:             {best_llm.clip_score:.3f}")
        lines.append(f"    - Efficiency:       {best_llm.efficiency_score:.3f}")
        lines.append(f"    - Preference Match: {best_llm.preference_match_score:.3f}")
        lines.append(f"    - Images Used:      {best_llm.num_images}")
    
    if result.ground_truth_routes:
        best_gt = result.ground_truth_routes[0]
        lines.append("\n🎯 Best Ground Truth Route:")
        lines.append(f"  Overall Score:        {best_gt.overall_score:.3f}")
        lines.append(f"    - CLIP:             {best_gt.clip_score:.3f}")
        lines.append(f"    - Efficiency:       {best_gt.efficiency_score:.3f}")
        lines.append(f"    - Preference Match: {best_gt.preference_match_score:.3f}")
        lines.append(f"    - Images Used:      {best_gt.num_images}")
    
    # Waypoint comparison
    if result.llm_routes and result.ground_truth_routes:
        lines.append("\n📍 Waypoint Comparison:")
        best_llm_route = result.llm_routes[0].route
        best_gt_route = result.ground_truth_routes[0].route
        
        llm_waypoints = best_llm_route.waypoints
        gt_waypoints = best_gt_route.waypoints
        
        max_waypoints = max(len(llm_waypoints), len(gt_waypoints))
        
        lines.append(f"  LLM Route Waypoints:     {len(llm_waypoints)}")
        lines.append(f"  Ground Truth Waypoints:  {len(gt_waypoints)}")
        lines.append("")
        
        for i in range(max_waypoints):
            if i < len(llm_waypoints) and i < len(gt_waypoints):
                llm_wp = llm_waypoints[i]
                gt_wp = gt_waypoints[i]
                llm_coords = llm_wp.coordinates
                gt_coords = gt_wp.coordinates
                
                # Check if coordinates match (within small tolerance)
                coord_match = (
                    abs(llm_coords.latitude - gt_coords.latitude) < 0.0001 and
                    abs(llm_coords.longitude - gt_coords.longitude) < 0.0001
                )
                status = "✅" if coord_match else "❌"
                
                lines.append(f"  {status} Waypoint {i+1}:")
                lines.append(
                    f"      LLM:      ({llm_coords.latitude:.6f}, {llm_coords.longitude:.6f}) "
                    f"\"{llm_wp.name}\""
                )
                lines.append(
                    f"      Expected: ({gt_coords.latitude:.6f}, {gt_coords.longitude:.6f}) "
                    f"\"{gt_wp.name}\""
                )
            elif i < len(llm_waypoints):
                llm_wp = llm_waypoints[i]
                llm_coords = llm_wp.coordinates
                lines.append(f"  ❌ Waypoint {i+1}:")
                lines.append(
                    f"      LLM:      ({llm_coords.latitude:.6f}, {llm_coords.longitude:.6f}) "
                    f"\"{llm_wp.name}\""
                )
                lines.append("      Expected: (missing)")
            else:
                gt_wp = gt_waypoints[i]
                gt_coords = gt_wp.coordinates
                lines.append(f"  ❌ Waypoint {i+1}:")
                lines.append("      LLM:      (missing)")
                lines.append(
                    f"      Expected: ({gt_coords.latitude:.6f}, {gt_coords.longitude:.6f}) "
                    f"\"{gt_wp.name}\""
                )
    
    return "\n".join(lines)


def format_batch_summary(results: List[EvaluationResult]) -> str:
    """Format batch evaluation summary."""
    total = len(results)
    successful = sum(1 for r in results if r.error is None)
    failed = total - successful
    
    # Extraction accuracy stats
    extraction_results = [r.extraction_comparison for r in results if r.extraction_comparison]
    if extraction_results:
        origin_matches = sum(1 for c in extraction_results if c.origin_match)
        dest_matches = sum(1 for c in extraction_results if c.destination_match)
        time_matches = sum(1 for c in extraction_results if c.time_flexibility_match)
        constraint_matches = sum(1 for c in extraction_results if c.constraints_match)
        preference_matches = sum(1 for c in extraction_results if c.preferences_match)
        
        extraction_stats = f"""
Extraction Accuracy:
  Origin:         {origin_matches}/{len(extraction_results)} ({origin_matches/len(extraction_results)*100:.1f}%)
  Destination:    {dest_matches}/{len(extraction_results)} ({dest_matches/len(extraction_results)*100:.1f}%)
  Time Flex:      {time_matches}/{len(extraction_results)} ({time_matches/len(extraction_results)*100:.1f}%)
  Constraints:    {constraint_matches}/{len(extraction_results)} ({constraint_matches/len(extraction_results)*100:.1f}%)
  Preferences:    {preference_matches}/{len(extraction_results)} ({preference_matches/len(extraction_results)*100:.1f}%)
"""
    else:
        extraction_stats = ""
    
    # Score comparison stats
    score_comparisons = [r.score_comparison for r in results if r.score_comparison is not None]
    score_wins = sum(1 for s in score_comparisons if s)
    score_losses = len(score_comparisons) - score_wins
    
    score_stats = ""
    if score_comparisons:
        score_stats = f"""
Route Score Comparison:
  LLM >= Ground Truth: {score_wins}/{len(score_comparisons)} ({score_wins/len(score_comparisons)*100:.1f}%)
  LLM < Ground Truth:  {score_losses}/{len(score_comparisons)} ({score_losses/len(score_comparisons)*100:.1f}%)
"""
    
    # Average processing time
    avg_time = sum(r.processing_time_seconds for r in results) / total if total > 0 else 0.0
    
    return f"""
{'='*70}
BATCH EVALUATION SUMMARY
{'='*70}
Total Examples:        {total}
Successful:            {successful} ✅
Failed:                {failed} ❌
Average Processing:    {avg_time:.2f}s per example
{extraction_stats}{score_stats}
"""


def export_results_json(results: List[EvaluationResult], output_path: Path):
    """Export evaluation results to JSON file."""
    def result_to_dict(result: EvaluationResult) -> dict:
        """Convert EvaluationResult to dictionary for JSON serialization."""
        data = {
            "example_id": result.example_id,
            "processing_time_seconds": result.processing_time_seconds,
            "num_waypoints_provided": result.num_waypoints_provided,
            "error": result.error,
        }
        
        if result.extraction_comparison:
            comp = result.extraction_comparison
            data["extraction_comparison"] = {
                "origin_match": comp.origin_match,
                "destination_match": comp.destination_match,
                "time_flexibility_match": comp.time_flexibility_match,
                "constraints_match": comp.constraints_match,
                "preferences_match": comp.preferences_match,
            }
        
        if result.llm_extracted_params:
            params = result.llm_extracted_params
            data["llm_extracted_params"] = {
                "origin": params.origin,
                "destination": params.destination,
                "time_flexibility_minutes": params.time_flexibility_minutes,
                "preferences": params.preferences,
                "waypoint_queries": params.waypoint_queries,
                "constraints": params.constraints,
            }
        
        data["llm_route_score"] = result.llm_route_score
        data["ground_truth_route_score"] = result.ground_truth_route_score
        data["score_comparison"] = result.score_comparison
        
        if result.llm_routes:
            data["llm_routes"] = [
                {
                    "overall_score": float(r.overall_score),
                    "clip_score": float(r.clip_score),
                    "efficiency_score": float(r.efficiency_score),
                    "preference_match_score": float(r.preference_match_score),
                    "num_images": r.num_images,
                }
                for r in result.llm_routes[:3]  # Top 3 routes
            ]
        
        if result.ground_truth_routes:
            data["ground_truth_routes"] = [
                {
                    "overall_score": float(r.overall_score),
                    "clip_score": float(r.clip_score),
                    "efficiency_score": float(r.efficiency_score),
                    "preference_match_score": float(r.preference_match_score),
                    "num_images": r.num_images,
                }
                for r in result.ground_truth_routes[:3]  # Top 3 routes
            ]
        
        return data
    
    json_data = {
        "evaluation_results": [result_to_dict(r) for r in results],
        "summary": {
            "total": len(results),
            "successful": sum(1 for r in results if r.error is None),
            "failed": sum(1 for r in results if r.error is not None),
        }
    }
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, indent=2)
    
    print(f"\n✅ Results exported to: {output_path}")


def main():
    """Main evaluation runner."""
    parser = argparse.ArgumentParser(
        description="Run batch evaluation against ground truth examples",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    
    parser.add_argument(
        "--max-routes",
        type=int,
        default=10,
        help="Maximum number of routes to generate per example (default: 10)"
    )
    
    parser.add_argument(
        "--output-json",
        type=Path,
        help="Path to export results as JSON file"
    )
    
    parser.add_argument(
        "--examples",
        type=str,
        nargs="+",
        help="Specific example IDs to run (default: all examples)"
    )
    
    parser.add_argument(
        "--quiet",
        action="store_true",
        help="Suppress detailed per-example output"
    )
    
    args = parser.parse_args()
    
    # Get API keys from environment
    routing_api_key = os.getenv("ROUTING_API_KEY")
    if not routing_api_key:
        print("❌ ERROR: ROUTING_API_KEY environment variable is required")
        print("   Set it with: export ROUTING_API_KEY=your-mapbox-key")
        sys.exit(1)
    
    geocoding_api_key = os.getenv("GEOCODING_API_KEY") or routing_api_key
    llm_api_key = os.getenv("LLM_API_KEY", "")
    mapillary_token = os.getenv("MAPILLARY_TOKEN")
    clip_model_name = os.getenv("CLIP_MODEL_NAME", "openai/clip-vit-base-patch32")
    
    # Initialize evaluator
    print("🚀 Initializing Route Evaluator...")
    evaluator = RouteEvaluator(
        routing_api_key=routing_api_key,
        geocoding_api_key=geocoding_api_key,
        llm_api_key=llm_api_key,
        clip_model_name=clip_model_name,
        mapillary_token=mapillary_token,
    )
    
    # Load ground truth examples
    print("📋 Loading ground truth examples...")
    all_examples = get_ground_truth_examples()
    
    # Filter examples if specific IDs provided
    if args.examples:
        examples = [e for e in all_examples if e.example_id in args.examples]
        if len(examples) != len(args.examples):
            found_ids = {e.example_id for e in examples}
            missing = set(args.examples) - found_ids
            print(f"⚠️  Warning: Example IDs not found: {missing}")
    else:
        examples = all_examples
    
    if not examples:
        print("❌ ERROR: No examples to evaluate")
        sys.exit(1)
    
    print(f"📊 Running evaluation on {len(examples)} example(s)...\n")
    
    # Run batch evaluation
    results = evaluator.run_batch(
        examples=examples,
        max_routes=args.max_routes,
    )
    
    # Print results
    if not args.quiet:
        for result in results:
            print(format_result_summary(result))
    
    # Print summary
    print(format_batch_summary(results))
    
    # Export to JSON if requested
    if args.output_json:
        export_results_json(results, args.output_json)
    
    # Exit with error code if any failures
    failed = sum(1 for r in results if r.error is not None)
    if failed > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()

