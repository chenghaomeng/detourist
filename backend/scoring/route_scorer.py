"""
Route scoring module for evaluating and ranking routes.

This module handles:
1. Fetching geotagged images along routes using Mapillary SDK
2. Computing CLIP scores against user prompts
3. Combining multiple scoring metrics
4. Ranking routes by overall score
"""
from typing import List, Dict, Any, Tuple, Optional
from dataclasses import dataclass
import numpy as np
import requests
from PIL import Image
from io import BytesIO
import torch
from transformers import CLIPProcessor, CLIPModel

try:
    from mapillary import interface as mapillary_interface
except ImportError:
    mapillary_interface = None
    print("Warning: Mapillary SDK not installed. Image scoring will be disabled.")
    print("Install with: pip install mapillary")

try:
    from backend.routing.route_builder import Route, RouteSegment
    from backend.waypoints.waypoint_searcher import Waypoint
    from backend.geocoding.geocoder import Coordinates
except ModuleNotFoundError:
    # If running from within backend directory
    import sys
    from pathlib import Path
    sys.path.insert(0, str(Path(__file__).parent.parent.parent))
    from backend.routing.route_builder import Route, RouteSegment
    from backend.waypoints.waypoint_searcher import Waypoint
    from backend.geocoding.geocoder import Coordinates


@dataclass
class ScoringWeights:
    """Weights for different scoring components. Should be updated via tuning at a later date."""
    clip_weight: float = 0.4
    duration_weight: float = 0.3
    waypoint_relevance_weight: float = 0.3


@dataclass
class RouteScore:
    """Score breakdown for a route."""
    route: Route
    clip_score: float
    efficiency_score: float
    preference_match_score: float
    overall_score: float
    image_scores: List[float]
    num_images: int


class RouteScorer:
    """Scores and ranks routes based on multiple criteria."""

    def __init__(
        self,
        clip_model_name: str = "openai/clip-vit-base-patch32",
        mapillary_token: Optional[str] = None,
        weights: Optional[ScoringWeights] = None,
        waypoint_bonus_rate: float = 0.1
    ):
        """
        Initialize with CLIP model and API credentials.

        Args:
            clip_model_name: HuggingFace model identifier for CLIP
            mapillary_token: Mapillary API token (get from mapillary.com)
            weights: Custom scoring weights
            waypoint_bonus_rate: Bonus per additional waypoint (default 0.1 = 10% per waypoint)
                Example: 3 waypoints @ avg 50 score → 50 * (1 + 0.1*2) = 60
                         1 waypoint @ 60 score → 60 * (1 + 0.1*0) = 60
        """
        self.weights = weights or ScoringWeights()
        self.mapillary_token = mapillary_token
        self.waypoint_bonus_rate = waypoint_bonus_rate

        # Set up Mapillary SDK if available
        if mapillary_token and mapillary_interface:
            mapillary_interface.set_access_token(mapillary_token)

        # Load CLIP model
        print(f"Loading CLIP model: {clip_model_name}")
        self.clip_model = CLIPModel.from_pretrained(clip_model_name)
        self.clip_processor = CLIPProcessor.from_pretrained(clip_model_name)
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.clip_model.to(self.device)
        self.clip_model.eval()

    def score_routes(
        self,
        routes: List[Route],
        user_prompt: str,
        min_images_per_route: int = 5,
        max_images_per_route: int = 10,
        debug: bool = False
    ) -> List[RouteScore]:
        """
        Score all routes and return ranked results.

        Args:
            routes: List of routes to score
            user_prompt: Original user prompt for CLIP scoring
            min_images_per_route: Minimum number of images to fetch per route
            max_images_per_route: Maximum number of images to fetch per route
            debug: Enable debug output to see image fetching progress

        Returns:
            List of RouteScore objects, ranked by overall score
        """
        if not routes:
            return []

        scored_routes = []

        # Calculate minimum duration for normalization
        min_duration = min(r.total_duration_seconds for r in routes)
        max_clip_score = 0.0

        # First pass: calculate CLIP scores
        route_clip_scores = []
        for i, route in enumerate(routes):
            if debug:
                print(f"\nRoute {i+1}:")

            images = self._fetch_route_images(
                route,
                min_images=min_images_per_route,
                max_images=max_images_per_route,
                debug=debug
            )

            if images:
                image_scores = self._compute_clip_scores(images, user_prompt)
                clip_score = np.mean(image_scores) if image_scores else 0.0
            else:
                image_scores = []
                clip_score = 0.0

            route_clip_scores.append((clip_score, image_scores))
            max_clip_score = max(max_clip_score, clip_score)

        # Second pass: normalize and combine scores
        for i, route in enumerate(routes):
            clip_score, image_scores = route_clip_scores[i]

            # Normalize CLIP score
            normalized_clip = (clip_score / max_clip_score * 100) if max_clip_score > 0 else 0.0

            # Calculate efficiency score (duration-based)
            efficiency_score = self._calculate_efficiency_score(
                route,
                min_duration
            )

            # Calculate waypoint relevance score (with multi-waypoint bonus)
            preference_score = self._calculate_preference_match_score(route)

            # Combine scores
            overall_score = self._combine_scores(
                normalized_clip,
                efficiency_score,
                preference_score
            )

            route_score = RouteScore(
                route=route,
                clip_score=normalized_clip,
                efficiency_score=efficiency_score,
                preference_match_score=preference_score,
                overall_score=overall_score,
                image_scores=image_scores,
                num_images=len(image_scores)
            )
            scored_routes.append(route_score)

        # Sort by overall score (highest first)
        scored_routes.sort(key=lambda x: x.overall_score, reverse=True)
        return scored_routes

    def _fetch_route_images(
        self,
        route: Route,
        min_images: int = 5,
        max_images: int = 20,
        debug: bool = False
    ) -> List[Image.Image]:
        """
        Fetch geotagged images along the route.

        Samples points along the route and fetches nearby images.
        """
        images = []

        # Sample points along route waypoints
        sample_points = self._sample_route_points(route, max_images)

        if debug:
            print(f"  Sampling {len(sample_points)} points along route...")

        for i, coords in enumerate(sample_points):
            try:
                if debug:
                    print(f"  Point {i+1}/{len(sample_points)}: ({coords.latitude:.4f}, {coords.longitude:.4f})", end=" ")

                img = self._fetch_image_at_location(coords, debug=debug)

                if img is not None:
                    images.append(img)
                    if debug:
                        print("✓ Image found")
                else:
                    if debug:
                        print("✗ No image")

                if len(images) >= max_images:
                    break
            except Exception as e:
                if debug:
                    print(f"✗ Error: {e}")
                continue

        if debug:
            print(f"  Total images fetched: {len(images)}")

        return images

    def _sample_route_points(
        self,
        route: Route,
        num_samples: int
    ) -> List[Coordinates]:
        """Sample points along the route for image fetching."""
        points = [route.origin]

        # Add waypoint coordinates
        for waypoint in route.waypoints:
            points.append(waypoint.coordinates)

        points.append(route.destination)

        # If we need more samples, interpolate between waypoints
        if len(points) < num_samples and len(route.segments) > 0:
            # Add segment midpoints
            for segment in route.segments[:num_samples - len(points)]:
                mid_lat = (segment.start.latitude + segment.end.latitude) / 2
                mid_lon = (segment.start.longitude + segment.end.longitude) / 2
                points.append(Coordinates(latitude=mid_lat, longitude=mid_lon))

        return points[:num_samples]

    def _fetch_image_at_location(self, coords: Coordinates, debug: bool = False) -> Optional[Image.Image]:
        """
        Fetch a street view image at the given coordinates using Mapillary SDK.

        Uses hybrid approach:
        1. SDK to find nearby images
        2. Direct API call to get thumbnail URL
        3. Download the image
        """
        if not self.mapillary_token or not mapillary_interface:
            return None

        try:
            # Use Mapillary SDK to find images near this location
            result = mapillary_interface.get_image_close_to(
                longitude=coords.longitude,
                latitude=coords.latitude,
                radius=25  # 25 meter radius
            )

            # Check if we found any images
            if not result or not hasattr(result, 'features') or not result.features:
                if debug:
                    print("(no images)", end=" ")
                return None

            # Get the first image ID
            first_feature = result.features[0]
            image_id = first_feature.properties.id

            # Use direct API call to get thumbnail URL
            api_url = f"https://graph.mapillary.com/{image_id}"
            params = {
                "access_token": self.mapillary_token,
                "fields": "id,thumb_1024_url,thumb_2048_url,thumb_256_url"
            }

            response = requests.get(api_url, params=params, timeout=10)

            if response.status_code == 200:
                image_data = response.json()

                # Try to get thumbnail URL (prefer 1024)
                thumb_url = (image_data.get('thumb_1024_url') or
                            image_data.get('thumb_2048_url') or
                            image_data.get('thumb_256_url'))

                if thumb_url:
                    # Download the image
                    img_response = requests.get(thumb_url, timeout=10)
                    img_response.raise_for_status()
                    return Image.open(BytesIO(img_response.content)).convert("RGB")

            return None

        except Exception as e:
            if debug:
                print(f"(error: {str(e)[:20]})", end=" ")
            return None

    def _compute_clip_scores(
        self,
        images: List[Image.Image],
        prompt: str
    ) -> List[float]:
        """
        Compute CLIP similarity scores between images and prompt.

        Returns a list of similarity scores (0-1 scale).
        """
        if not images:
            return []

        try:
            with torch.no_grad():
                # Process inputs
                inputs = self.clip_processor(
                    text=[prompt],
                    images=images,
                    return_tensors="pt",
                    padding=True
                )

                # Move to device
                inputs = {k: v.to(self.device) for k, v in inputs.items()}

                # Get embeddings
                outputs = self.clip_model(**inputs)

                # Calculate similarity scores
                image_embeds = outputs.image_embeds
                text_embeds = outputs.text_embeds

                # Normalize embeddings
                image_embeds = image_embeds / image_embeds.norm(p=2, dim=-1, keepdim=True)
                text_embeds = text_embeds / text_embeds.norm(p=2, dim=-1, keepdim=True)

                # Calculate cosine similarity
                similarity = (image_embeds @ text_embeds.T).squeeze()

                # Convert to list of floats
                if similarity.dim() == 0:
                    scores = [similarity.item()]
                else:
                    scores = similarity.cpu().numpy().tolist()

                # Scale from [-1, 1] to [0, 1]
                scores = [(s + 1) / 2 for s in scores]

                return scores

        except Exception as e:
            print(f"CLIP scoring error: {e}")
            return [0.0] * len(images)

    def _calculate_efficiency_score(
        self,
        route: Route,
        min_duration: int
    ) -> float:
        """
        Calculate efficiency score based on route duration.

        Uses cubic penalty for longer routes:
        - Routes at minimum duration get score of 100
        - Score decreases cubically as duration increases
        - Routes taking 2x minimum duration get score of ~20
        """
        duration = route.total_duration_seconds
        print(duration, min_duration)
        if min_duration <= 0:
            return 100.0

        # Cubic penalty for longer routes
        duration_ratio = (duration - min_duration) / min_duration
        efficiency_score = 100 - 10 * ((duration_ratio + 1) ** 3)

        # Clamp to [0, 100]
        return max(0.0, min(100.0, efficiency_score))

    def _calculate_preference_match_score(self, route: Route) -> float:
        """
        Calculate how well route matches user preferences.

        Based on average waypoint relevance scores with bonus for more waypoints.
        Returns -1 if no waypoints (will be handled in score combination).

        Multi-waypoint bonus:
        - 1 waypoint: bonus = 1.0 (no bonus)
        - 2 waypoints: bonus = 1.1 (10% bonus)
        - 3 waypoints: bonus = 1.2 (20% bonus)

        Example: 3 waypoints @ avg 50 → 50 * 1.2 = 60
                 1 waypoint @ 60 → 60 * 1.0 = 60 (similar score)
        """
        if not route.waypoints:
            return -1.0

        # Average the relevance scores of all waypoints
        avg_relevance = np.mean([wp.relevance_score for wp in route.waypoints])

        # Apply multi-waypoint bonus
        num_waypoints = len(route.waypoints)
        bonus_multiplier = 1.0 + self.waypoint_bonus_rate * (num_waypoints - 1)

        # Scale to 0-100 (assuming relevance_score is 0-100)
        score_with_bonus = float(avg_relevance) * bonus_multiplier

        # Clamp to [0, 100] to ensure we don't exceed bounds
        return min(100.0, score_with_bonus)

    def _combine_scores(
        self,
        clip_score: float,
        efficiency_score: float,
        preference_score: float
    ) -> float:
        """
        Combine individual scores into overall score using weights.

        Handles cases where preference_score is -1 (no waypoints).
        """
        # If no waypoints, redistribute weight to other components
        if preference_score < 0:
            total_weight = self.weights.clip_weight + self.weights.duration_weight
            if total_weight > 0:
                clip_weight_adjusted = self.weights.clip_weight / total_weight
                duration_weight_adjusted = self.weights.duration_weight / total_weight
            else:
                clip_weight_adjusted = 0.5
                duration_weight_adjusted = 0.5

            overall = (
                clip_weight_adjusted * clip_score +
                duration_weight_adjusted * efficiency_score
            )
        else:
            overall = (
                self.weights.clip_weight * clip_score +
                self.weights.duration_weight * efficiency_score +
                self.weights.waypoint_relevance_weight * preference_score
            )

        return overall

    def get_top_route(
        self,
        routes: List[Route],
        user_prompt: str,
        **kwargs
    ) -> Optional[RouteScore]:
        """Convenience method to get the top-ranked route."""
        scored = self.score_routes(routes, user_prompt, **kwargs)
        return scored[0] if scored else None
