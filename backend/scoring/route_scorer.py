"""
Route scoring module for evaluating and ranking routes using CLIP,
fetching images via the Mapillary Graph API (no SDK).

This module handles:
1. Fetching geotagged images along routes using the Mapillary Graph API
2. Computing CLIP scores against the user prompt
3. Combining scoring metrics (CLIP + efficiency + waypoint relevance)
4. Ranking routes by overall score
"""

from typing import List, Dict, Any, Tuple, Optional
from dataclasses import dataclass
import os
import logging
import math
import time
import requests
import numpy as np
from PIL import Image
from io import BytesIO
import torch
from transformers import CLIPProcessor, CLIPModel

# Project types
from backend.routing.route_builder import Route, RouteSegment
from backend.waypoints.waypoint_searcher import Waypoint
from backend.geocoding.geocoder import Coordinates

LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=LOG_LEVEL)
logger = logging.getLogger(__name__)

# ------------------------- Weights -------------------------

@dataclass
class ScoringWeights:
    """Weights for different scoring components."""
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


# ------------------------- Scorer -------------------------

class RouteScorer:
    """Scores and ranks routes based on CLIP, time efficiency, and waypoint relevance."""

    def __init__(
        self,
        clip_model_name: str = "openai/clip-vit-base-patch32",
        mapillary_token: Optional[str] = None,
        weights: Optional[ScoringWeights] = None,
        waypoint_bonus_rate: float = 0.1,
    ):
        """
        Args:
            clip_model_name: HF model id for CLIP
            mapillary_token: Mapillary client token (format: "MLY|..."). If not provided, try env.
            weights: weights for score combination
            waypoint_bonus_rate: multiplicative bonus per extra waypoint
        """
        self.weights = weights or ScoringWeights()
        self.mapillary_token = mapillary_token or os.getenv("MAPILLARY_TOKEN")
        self.waypoint_bonus_rate = waypoint_bonus_rate
        self.logger = logging.getLogger(__name__)

        # Toggle CLIP/Image scoring with env
        self.enable_scoring = os.getenv("ENABLE_SCORING", "false").lower() == "true"

        # Lazy CLIP load
        self._clip_ready = False
        self._clip_model_name = clip_model_name
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

        # Scoring knobs
        self.min_images_default = int(os.getenv("SCORING_MIN_IMAGES", "0"))
        self.max_images_default = int(os.getenv("SCORING_MAX_IMAGES", "0"))

        # Mapillary knobs
        self._mly_api = "https://graph.mapillary.com"
        self._bbox_deg = float(os.getenv("MAPILLARY_BBOX_DEGREES", "0.00025"))  # ~25–30m

        # HTTP
        self._http = requests.Session()
        self._http.headers.update({"User-Agent": "berkeley-detourist/1.0 (berkeley.edu)"})

    # ------------------------- Public API -------------------------

    def score_routes(
        self,
        routes: List[Route],
        user_prompt: str,
        min_images_per_route: Optional[int] = None,
        max_images_per_route: Optional[int] = None,
        debug: bool = False,
    ) -> List[RouteScore]:
        """
        Score routes and return ranked results.
        If Mapillary token/scoring disabled or no images found, CLIP score becomes 0.
        """
        if not routes:
            return []

        # Resolve image limits
        if min_images_per_route is None:
            min_images_per_route = self.min_images_default
        if max_images_per_route is None:
            max_images_per_route = self.max_images_default

        scored_routes: List[RouteScore] = []
        min_duration = min(r.total_duration_seconds for r in routes)
        max_clip_score = 0.0

        # Pass 1: fetch images & compute raw clip scores
        route_clip_scores: List[Tuple[float, List[float]]] = []
        for i, route in enumerate(routes):
            if debug:
                logger.info(f"[scoring] Route {i+1}/{len(routes)}")

            images: List[Image.Image] = []
            if self.enable_scoring and self.mapillary_token and max_images_per_route > 0:
                images = self._fetch_route_images_via_mapillary(
                    route,
                    min_images=min_images_per_route,
                    max_images=max_images_per_route,
                    debug=debug,
                )

            if images:
                image_scores = self._compute_clip_scores(images, user_prompt)
                clip_score = float(np.mean(image_scores)) if image_scores else 0.0
            else:
                image_scores = []
                clip_score = 0.0

            route_clip_scores.append((clip_score, image_scores))
            max_clip_score = max(max_clip_score, clip_score)

        # Pass 2: normalize and combine
        for i, route in enumerate(routes):
            clip_score_raw, image_scores = route_clip_scores[i]
            normalized_clip = (clip_score_raw / max_clip_score * 100) if max_clip_score > 0 else 0.0
            efficiency_score = self._calculate_efficiency_score(route, min_duration)
            preference_score = self._calculate_preference_match_score(route)
            overall = self._combine_scores(normalized_clip, efficiency_score, preference_score)

            scored_routes.append(
                RouteScore(
                    route=route,
                    clip_score=float(normalized_clip),
                    efficiency_score=float(efficiency_score),
                    preference_match_score=float(preference_score),
                    overall_score=float(overall),
                    image_scores=[float(s) for s in image_scores],
                    num_images=len(image_scores),
                )
            )

        scored_routes.sort(key=lambda x: x.overall_score, reverse=True)
        return scored_routes

    # ------------------------- Mapillary (Graph API) -------------------------

    def _mly_headers(self) -> Dict[str, str]:
        return {"Authorization": f"OAuth {self.mapillary_token}"} if self.mapillary_token else {}

    def _bbox_around(self, c: Coordinates, d: float) -> Tuple[float, float, float, float]:
        # d is degrees; keep small to avoid API errors
        return (c.longitude - d, c.latitude - d, c.longitude + d, c.latitude + d)

    def _images_in_bbox(self, bbox: Tuple[float, float, float, float], limit: int = 5) -> List[str]:
        """
        Returns a list of image IDs inside bbox using Graph API:
        GET /images?fields=id&bbox=minLon,minLat,maxLon,maxLat&limit=...
        """
        params = {
            "fields": "id",
            "bbox": f"{bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]}",
            "limit": str(limit),
        }
        r = self._http.get(f"{self._mly_api}/images", params=params, headers=self._mly_headers(), timeout=12)
        r.raise_for_status()
        data = r.json() or {}
        items = data.get("data", [])
        return [str(it.get("id")) for it in items if it.get("id")]

    def _image_thumb_url(self, image_id: str) -> Optional[str]:
        """
        GET /{id}?fields=thumb_1024_url,thumb_2048_url
        Prefer 1024 (smaller).
        """
        params = {"fields": "thumb_1024_url,thumb_2048_url"}
        r = self._http.get(f"{self._mly_api}/{image_id}", params=params, headers=self._mly_headers(), timeout=10)
        if r.status_code != 200:
            return None
        js = r.json() or {}
        return js.get("thumb_1024_url") or js.get("thumb_2048_url")

    def _fetch_route_images_via_mapillary(
        self,
        route: Route,
        min_images: int = 3,
        max_images: int = 6,
        debug: bool = False,
    ) -> List[Image.Image]:
        """
        Sample points along the route (origin + waypoints + destination + midpoints),
        look up nearby Mapillary images via a small bbox, fetch thumbnails.
        """
        points = self._sample_route_points(route, max_images * 2)  # oversample a bit
        images: List[Image.Image] = []
        bbox_deg = self._bbox_deg

        for idx, c in enumerate(points):
            try:
                bbox = self._bbox_around(c, bbox_deg)
                ids = self._images_in_bbox(bbox, limit=3)
                if not ids:
                    # expand once if no results
                    ids = self._images_in_bbox(self._bbox_around(c, bbox_deg * 1.8), limit=3)

                got = False
                for image_id in ids:
                    url = self._image_thumb_url(image_id)
                    if not url:
                        continue
                    img_r = self._http.get(url, timeout=10)
                    img_r.raise_for_status()
                    img = Image.open(BytesIO(img_r.content)).convert("RGB")
                    images.append(img)
                    got = True
                    break

                if debug:
                    logger.info(f"[mapillary] point {idx+1}/{len(points)} -> {'✓' if got else 'no image'}")

                if len(images) >= max_images:
                    break
            except Exception as e:
                if debug:
                    logger.warning(f"[mapillary] error at point {idx+1}: {e}")
                continue

        if debug:
            logger.info(f"[mapillary] fetched {len(images)} images")

        # ensure at least min_images if possible (already bounded by max_images)
        return images[:max_images] if len(images) >= min_images else images

    # ------------------------- CLIP -------------------------

    def _ensure_clip(self):
        if self._clip_ready:
            return
        if not self.enable_scoring:
            logger.info("CLIP scoring disabled (ENABLE_SCORING=false).")
            return
        logger.info(f"Loading CLIP model: {self._clip_model_name}")
        self.clip_model = CLIPModel.from_pretrained(self._clip_model_name)
        self.clip_processor = CLIPProcessor.from_pretrained(self._clip_model_name)
        self.clip_model.to(self.device).eval()
        torch.set_grad_enabled(False)
        self._clip_ready = True

    def _compute_clip_scores(self, images: List[Image.Image], prompt: str) -> List[float]:
        if not images:
            return []
        self._ensure_clip()
        if not self._clip_ready:
            return [0.0] * len(images)
        try:
            with torch.no_grad():
                inputs = self.clip_processor(text=[prompt], images=images, return_tensors="pt", padding=True)
                inputs = {k: v.to(self.device) for k, v in inputs.items()}
                outputs = self.clip_model(**inputs)
                image_embeds = outputs.image_embeds
                text_embeds = outputs.text_embeds
                image_embeds = image_embeds / image_embeds.norm(p=2, dim=-1, keepdim=True)
                text_embeds = text_embeds / text_embeds.norm(p=2, dim=-1, keepdim=True)
                sim = (image_embeds @ text_embeds.T).squeeze()
                vals = [sim.item()] if sim.dim() == 0 else sim.cpu().numpy().tolist()
                # [-1,1] -> [0,1]
                return [float((v + 1.0) / 2.0) for v in vals]
        except Exception as e:
            logger.error(f"CLIP scoring error: {e}")
            return [0.0] * len(images)

    # ------------------------- Other metrics -------------------------

    def _calculate_efficiency_score(self, route: Route, min_duration: int) -> float:
        if min_duration <= 0:
            return 100.0
        duration = route.total_duration_seconds
        ratio = (duration - min_duration) / max(1, min_duration)
        score = 100 - 10 * ((ratio + 1) ** 3)
        return float(max(0.0, min(100.0, score)))

    def _calculate_preference_match_score(self, route: Route) -> float:
        if not route.waypoints:
            return -1.0
        avg_rel = float(np.mean([w.relevance_score for w in route.waypoints]))
        bonus = 1.0 + self.waypoint_bonus_rate * (len(route.waypoints) - 1)
        return float(min(100.0, avg_rel * bonus))

    def _combine_scores(self, clip_score: float, efficiency_score: float, preference_score: float) -> float:
        if preference_score < 0:
            w = self.weights
            tot = w.clip_weight + w.duration_weight
            cw = w.clip_weight / tot if tot > 0 else 0.5
            dw = w.duration_weight / tot if tot > 0 else 0.5
            return cw * clip_score + dw * efficiency_score
        return (
            self.weights.clip_weight * clip_score
            + self.weights.duration_weight * efficiency_score
            + self.weights.waypoint_relevance_weight * preference_score
        )

    # ------------------------- Sampling helpers -------------------------

    def _sample_route_points(self, route: Route, num_samples: int) -> List[Coordinates]:
        points = [route.origin]
        for w in route.waypoints:
            points.append(w.coordinates)
        points.append(route.destination)
        # add midpoints of segments if needed
        if len(points) < num_samples and route.segments:
            for s in route.segments[: max(0, num_samples - len(points))]:
                points.append(Coordinates(latitude=(s.start.latitude + s.end.latitude) / 2.0,
                                          longitude=(s.start.longitude + s.end.longitude) / 2.0))
        return points[:num_samples]
