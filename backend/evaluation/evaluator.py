"""
Evaluation module for batch testing against ground truth examples.

This module allows running batch evaluations against synthetic ground truth examples
by comparing LLM-extracted routes with ground truth routes.
"""

from typing import List, Dict, Any, Optional
from dataclasses import dataclass
import logging
import os
import time
import re
import numpy as np
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet as wn
import nltk
from sentence_transformers import SentenceTransformer

from backend.geocoding.geocoder import Coordinates, Geocoder
from backend.waypoints.waypoint_searcher import Waypoint, WaypointSearcher
from backend.routing.route_builder import RouteBuilder, Route
from backend.scoring.route_scorer import RouteScorer, RouteScore
from backend.extraction.llm_extractor import LLMExtractor, ExtractedParameters

# Download required NLTK data on first use (if not already downloaded)
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)
try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet', quiet=True)


@dataclass
class GroundTruthExample:
    """
    A ground truth example for evaluation.
    
    Attributes:
        user_prompt: Natural language user prompt string
        origin_text: Origin address/location text
        origin_coords: Origin coordinates
        destination_text: Destination address/location text
        destination_coords: Destination coordinates
        time_flexibility_minutes: Time flexibility in minutes
        constraints: Routing constraints (e.g., {"transport_mode": "walking", "avoid_tolls": True})
        preferences: Simplified, comma-separated list of extracted user preferences (e.g., "parks, greenery, waterfront")
        waypoint_coords: List of waypoint coordinates to use (bypasses waypoint search)
        example_id: Optional identifier for this example
    """
    user_prompt: str
    origin_text: str
    origin_coords: Coordinates
    destination_text: str
    destination_coords: Coordinates
    time_flexibility_minutes: int
    constraints: Dict[str, Any]
    preferences: str  # Comma-separated preferences string
    waypoint_coords: List[Coordinates]
    example_id: Optional[str] = None


@dataclass
class ExtractionComparison:
    """
    Comparison between LLM extraction and ground truth.
    
    Uses NLP similarity metrics (Jaccard similarity, token overlap, substring matching)
    instead of exact string matching for more robust evaluation.
    
    Attributes:
        origin_match: Whether origin text matches (using hybrid location similarity)
        destination_match: Whether destination text matches (using hybrid location similarity)
        time_flexibility_match: Whether time flexibility matches exactly (numeric)
        constraints_match: Whether constraints match (dictionary comparison)
        preferences_match: Whether preferences match (Jaccard similarity >= 0.5)
    """
    origin_match: bool
    destination_match: bool
    time_flexibility_match: bool
    constraints_match: bool
    preferences_match: bool


@dataclass
class EvaluationResult:
    """
    Result of evaluating a single ground truth example.
    
    Attributes:
        example_id: Identifier for the example
        llm_extracted_params: Parameters extracted by LLM
        extraction_comparison: Comparison between LLM extraction and ground truth
        llm_route_score: Best route score from LLM-extracted parameters
        ground_truth_route_score: Route score from ground truth parameters
        score_comparison: Whether LLM route score >= ground truth route score
        llm_routes: List of routes generated from LLM extraction
        ground_truth_routes: List of routes generated from ground truth
        processing_time_seconds: Time taken to process this example
        num_waypoints_provided: Number of waypoints in the ground truth
        ground_truth: The ground truth example (for displaying comparison values)
        error: Optional error message if evaluation failed
    """
    example_id: Optional[str]
    llm_extracted_params: Optional[ExtractedParameters] = None
    extraction_comparison: Optional[ExtractionComparison] = None
    llm_route_score: Optional[float] = None
    ground_truth_route_score: Optional[float] = None
    score_comparison: Optional[bool] = None  # True if LLM >= ground truth
    llm_routes: List[RouteScore] = None
    ground_truth_routes: List[RouteScore] = None
    processing_time_seconds: float = 0.0
    num_waypoints_provided: int = 0
    ground_truth: Optional[GroundTruthExample] = None
    error: Optional[str] = None

    def __post_init__(self):
        """Initialize empty lists if None."""
        if self.llm_routes is None:
            self.llm_routes = []
        if self.ground_truth_routes is None:
            self.ground_truth_routes = []


@dataclass
class ScoringRouteInput:
    """
    A single route input for scoring evaluation.
    
    Attributes:
        origin: Origin coordinates
        destination: Destination coordinates
        waypoint_coords: List of waypoint coordinates
        constraints: Routing constraints
    """
    origin: Coordinates
    destination: Coordinates
    waypoint_coords: List[Coordinates]
    constraints: Dict[str, Any]


@dataclass
class ScoringGroundTruthExample:
    """
    A ground truth example for scoring evaluation.
    
    Contains multiple route inputs and indicates which is the best route.
    
    Attributes:
        example_id: Optional identifier for this example
        route_inputs: List of route inputs to evaluate
        best_route_index: Index (0-based) of the best route in route_inputs
        user_prompt: Optional user prompt for scoring context
    """
    route_inputs: List[ScoringRouteInput]
    best_route_index: int
    example_id: Optional[str] = None
    user_prompt: Optional[str] = None


@dataclass
class ScoringEvaluationResult:
    """
    Result of evaluating a single scoring ground truth example.
    
    Attributes:
        example_id: Identifier for the example
        app_chosen_index: Index of the route chosen by the app (0-based)
        ground_truth_index: Index of the ground truth best route (0-based)
        match: Whether app's choice matches ground truth
        scored_routes: List of scored routes (sorted by score, best first)
        processing_time_seconds: Time taken to process this example
        error: Optional error message if evaluation failed
    """
    example_id: Optional[str]
    app_chosen_index: Optional[int] = None
    ground_truth_index: int = 0
    match: bool = False
    scored_routes: List[RouteScore] = None
    processing_time_seconds: float = 0.0
    error: Optional[str] = None

    def __post_init__(self):
        """Initialize empty lists if None."""
        if self.scored_routes is None:
            self.scored_routes = []


class RouteEvaluator:
    """
    Evaluator for batch testing against ground truth examples.
    
    This evaluator:
    1. Calls LLM extraction on the user prompt
    2. Compares LLM extraction with ground truth (excluding waypoint queries)
    3. Builds and scores routes using LLM-extracted parameters
    4. Builds and scores routes using ground truth parameters
    5. Compares the two scores to see if the app route is equal or better
    """

    def __init__(
        self,
        routing_api_key: str,
        llm_api_key: str = "",
        clip_model_name: str = "openai/clip-vit-base-patch32",
        mapillary_token: Optional[str] = None,
        embedding_model_name: str = "all-MiniLM-L6-v2",
        geocoding_api_key: Optional[str] = None,
    ):
        """
        Initialize the evaluator with required API keys and configuration.
        
        Args:
            routing_api_key: Mapbox API key for routing
            llm_api_key: Optional LLM API key (for future providers)
            clip_model_name: CLIP model name for scoring (default: openai/clip-vit-base-patch32)
            mapillary_token: Optional Mapillary token for image fetching
            embedding_model_name: Sentence transformer model for semantic similarity (default: all-MiniLM-L6-v2)
            geocoding_api_key: Mapbox API key for geocoding (defaults to routing_api_key)
        """
        self.llm_extractor = LLMExtractor(llm_api_key)
        geocoding_key = geocoding_api_key or routing_api_key
        self.geocoder = Geocoder(geocoding_key)
        self.waypoint_searcher = WaypointSearcher("")  # Overpass doesn't need API key
        self.route_builder = RouteBuilder(routing_api_key)
        self.route_scorer = RouteScorer(
            clip_model_name=clip_model_name,
            mapillary_token=mapillary_token,
        )
        self.logger = logging.getLogger(__name__)
        
        # Initialize NLP tools for preference comparison
        self.lemmatizer = WordNetLemmatizer()
        
        # Initialize embedding model for semantic similarity (lazy load)
        self.embedding_model_name = embedding_model_name
        self._embedding_model = None

    def _get_embedding_model(self):
        """Lazy load embedding model for semantic similarity."""
        if self._embedding_model is None:
            self._embedding_model = SentenceTransformer(self.embedding_model_name)
            self.logger.info("Loaded embedding model: %s", self.embedding_model_name)
        return self._embedding_model

    def _lemmatize_token(self, token: str) -> str:
        """
        Lemmatize a token to its base form (e.g., "parks" -> "park").
        
        Args:
            token: Token to lemmatize
            
        Returns:
            Lemmatized token
        """
        # Use NLTK WordNet lemmatizer
        # Try noun first (most common for preferences like "parks", "trees")
        lemmatized = self.lemmatizer.lemmatize(token, pos=wn.NOUN)
        # If unchanged, try verb
        if lemmatized == token:
            lemmatized = self.lemmatizer.lemmatize(token, pos=wn.VERB)
        return lemmatized

    def _semantic_similarity(self, token1: str, token2: str, threshold: float = 0.7) -> bool:
        """
        Compute semantic similarity between two tokens using embeddings.
        
        Args:
            token1: First token
            token2: Second token
            threshold: Minimum cosine similarity to consider a match (default: 0.7)
            
        Returns:
            True if similarity >= threshold
        """
        model = self._get_embedding_model()
        
        # Get embeddings for both tokens
        embeddings = model.encode([token1, token2], convert_to_numpy=True)
        
        # Compute cosine similarity
        # Normalize embeddings
        emb1 = embeddings[0] / (np.linalg.norm(embeddings[0]) + 1e-8)
        emb2 = embeddings[1] / (np.linalg.norm(embeddings[1]) + 1e-8)
        
        # Cosine similarity = dot product of normalized vectors
        similarity = float(np.dot(emb1, emb2))
        
        return similarity >= threshold

    def _coords_to_waypoint(self, coords: Coordinates, index: int, source: str = "ground_truth") -> Waypoint:
        """
        Convert coordinates to a Waypoint object.
        
        Args:
            coords: Coordinates to convert
            index: Index of this waypoint (for naming)
            source: Source identifier for the waypoint
            
        Returns:
            Waypoint object with minimal metadata
        """
        return Waypoint(
            name=f"Waypoint {index + 1}",
            coordinates=coords,
            category="evaluation",
            relevance_score=10.0,  # Max score since these are ground truth
            metadata={"source": source, "index": index},
            input_query=source,
        )

    def _tokenize(self, text: str) -> set:
        """Tokenize text into lowercase word set."""
        words = re.findall(r'\b\w+\b', text.lower())
        return set(words)

    def _jaccard_similarity(self, set1: set, set2: set) -> float:
        """Calculate Jaccard similarity between two sets."""
        if not set1 and not set2:
            return 1.0
        if not set1 or not set2:
            return 0.0
        intersection = len(set1 & set2)
        union = len(set1 | set2)
        return intersection / union if union > 0 else 0.0

    def _location_similarity(self, str1: str, str2: str) -> bool:
        """
        Hybrid similarity for location names using multiple strategies:
        1. Exact match (case-insensitive)
        2. Jaccard similarity on tokens (threshold: 0.7)
        3. Substring containment (for partial matches)
        
        Args:
            str1: First location string
            str2: Second location string
            
        Returns:
            True if any strategy indicates a match
        """
        str1_normalized = str1.strip().lower()
        str2_normalized = str2.strip().lower()
        
        # Strategy 1: Exact match (case-insensitive)
        if str1_normalized == str2_normalized:
            return True
        
        # Strategy 2: Jaccard similarity on tokens
        tokens1 = self._tokenize(str1)
        tokens2 = self._tokenize(str2)
        if tokens1 and tokens2:
            similarity = self._jaccard_similarity(tokens1, tokens2)
            if similarity >= 0.7:
                return True
        
        # Strategy 3: Substring containment (for partial matches like "Golden Gate Park" vs "Golden Gate")
        if str1_normalized in str2_normalized or str2_normalized in str1_normalized:
            return True
        
        return False

    def _compare_extraction(
        self,
        llm_params: ExtractedParameters,
        ground_truth: GroundTruthExample,
    ) -> ExtractionComparison:
        """
        Compare LLM extraction with ground truth (excluding waypoint queries).
        
        Uses NLP similarity metrics instead of exact matches.
        
        Args:
            llm_params: Parameters extracted by LLM
            ground_truth: Ground truth example
            
        Returns:
            ExtractionComparison with match results
        """
        # Compare origin using hybrid location similarity
        origin_match = self._location_similarity(
            llm_params.origin, ground_truth.origin_text
        )

        # Compare destination using hybrid location similarity
        destination_match = self._location_similarity(
            llm_params.destination, ground_truth.destination_text
        )

        # Compare time flexibility (exact match for numbers)
        time_flexibility_match = (
            llm_params.time_flexibility_minutes == ground_truth.time_flexibility_minutes
        )

        # Compare constraints
        constraints_match = self._compare_constraints(
            llm_params.constraints, ground_truth.constraints
        )

        # Compare preferences using Jaccard similarity on comma-separated values
        preferences_match = self._compare_preferences(
            llm_params.preferences, ground_truth.preferences
        )

        return ExtractionComparison(
            origin_match=origin_match,
            destination_match=destination_match,
            time_flexibility_match=time_flexibility_match,
            constraints_match=constraints_match,
            preferences_match=preferences_match,
        )

    def _compare_constraints(
        self, llm_constraints: Dict[str, Any], gt_constraints: Dict[str, Any]
    ) -> bool:
        """
        Compare constraints dictionaries (order-invariant).
        
        Normalizes and compares constraint values regardless of dictionary key order.
        """
        # Normalize both dictionaries to ensure consistent comparison
        def normalize_constraints(constraints: Dict[str, Any]) -> Dict[str, Any]:
            """Normalize constraints to a canonical form."""
            normalized = {}
            # Normalize transport_mode
            normalized["transport_mode"] = str(constraints.get("transport_mode", "walking")).lower()
            # Normalize boolean constraints
            for key in ["avoid_tolls", "avoid_stairs", "avoid_hills", "avoid_highways"]:
                normalized[key] = bool(constraints.get(key, False))
            return normalized
        
        llm_norm = normalize_constraints(llm_constraints)
        gt_norm = normalize_constraints(gt_constraints)
        
        # Compare normalized dictionaries (order-invariant)
        return llm_norm == gt_norm

    def _compare_preferences(
        self, llm_preferences: str, gt_preferences: str
    ) -> bool:
        """
        Compare LLM preferences string with ground truth preferences.
        
        Uses lemmatization for pluralization and semantic similarity for synonyms.
        
        Args:
            llm_preferences: Comma-separated preferences from LLM extraction
            gt_preferences: Comma-separated preferences from ground truth
            
        Returns:
            True if similarity >= 0.5
        """
        # Parse and normalize tokens
        llm_tokens = [t.strip().lower() for t in llm_preferences.split(",") if t.strip()]
        gt_tokens = [t.strip().lower() for t in gt_preferences.split(",") if t.strip()]
        
        if not llm_tokens and not gt_tokens:
            return True  # Both empty
        if not llm_tokens or not gt_tokens:
            return False  # One empty, one not
        
        # Lemmatize tokens for pluralization handling
        llm_lemmatized = [self._lemmatize_token(t) for t in llm_tokens]
        gt_lemmatized = [self._lemmatize_token(t) for t in gt_tokens]
        
        # Count matches using both exact match and semantic similarity
        matches = 0
        total_gt = len(gt_tokens)
        
        # For each ground truth token, find best match in LLM tokens
        for gt_token, gt_lemma in zip(gt_tokens, gt_lemmatized):
            matched = False
            
            # Try exact match first (fast)
            if gt_token in llm_tokens or gt_lemma in llm_lemmatized:
                matched = True
            else:
                # Try semantic similarity with each LLM token
                for llm_token, llm_lemma in zip(llm_tokens, llm_lemmatized):
                    # Check lemmatized forms
                    if self._semantic_similarity(gt_lemma, llm_lemma, threshold=0.7):
                        matched = True
                        break
                    # Check original forms
                    if self._semantic_similarity(gt_token, llm_token, threshold=0.7):
                        matched = True
                        break
            
            if matched:
                matches += 1
        
        # Match if at least 50% of GT preferences are matched
        match_ratio = matches / total_gt if total_gt > 0 else 0.0
        return match_ratio >= 0.5

    def evaluate_example(
        self,
        example: GroundTruthExample,
        max_routes: int = 10,
    ) -> EvaluationResult:
        """
        Evaluate a single ground truth example.
        
        This method:
        1. Calls LLM extraction on the user prompt
        2. Compares LLM extraction with ground truth
        3. Builds and scores routes using LLM-extracted parameters (with GT waypoints)
        4. Builds and scores routes using ground truth parameters
        5. Compares the two scores
        
        Args:
            example: Ground truth example to evaluate
            max_routes: Maximum number of routes to generate per evaluation
            
        Returns:
            EvaluationResult with comparison metrics and routes
        """
        start_time = time.time()
        example_id = example.example_id or "unknown"

        try:
            self.logger.info(
                "Evaluating example %s: %d waypoints, prompt: %s",
                example_id,
                len(example.waypoint_coords),
                example.user_prompt[:50] + "..." if len(example.user_prompt) > 50 else example.user_prompt,
            )

            # Step 1: Call LLM extraction on the user prompt
            self.logger.info("Step 1: Extracting parameters with LLM")
            llm_params = self.llm_extractor.extract_parameters(
                example.user_prompt, num_tags=5
            )

            # Step 2: Compare LLM extraction with ground truth
            self.logger.info("Step 2: Comparing LLM extraction with ground truth")
            extraction_comparison = self._compare_extraction(llm_params, example)

            # Step 3: Build routes from LLM extraction (using app's full process)
            self.logger.info("Step 3: Building routes from LLM extraction (full app process)")
            
            # 3a) Geocode LLM-extracted origin/destination
            self.logger.info("Step 3a: Geocoding LLM-extracted origin and destination")
            llm_origin_coords = self.geocoder.geocode_address(llm_params.origin)
            llm_dest_coords = self.geocoder.geocode_address(llm_params.destination)
            
            # 3b) Create search zone
            self.logger.info("Step 3b: Creating search zone")
            max_additional_minutes = llm_params.time_flexibility_minutes or 30
            transport_mode = (llm_params.constraints or {}).get("transport_mode", "walking")
            search_zone = self.geocoder.create_search_zone(
                origin=llm_origin_coords,
                destination=llm_dest_coords,
                max_additional_time=int(max_additional_minutes),
                transport_mode=transport_mode,
            )
            
            # 3c) Search for waypoints using LLM-extracted queries
            self.logger.info("Step 3c: Searching for waypoints using LLM queries: %s", llm_params.waypoint_queries)
            found_waypoints = self.waypoint_searcher.search_waypoints(
                search_zone,
                llm_params.waypoint_queries or [],
            )
            self.logger.info("Step 3c: Found %d waypoints", len(found_waypoints))
            
            # 3d) Build routes using found waypoints
            self.logger.info("Step 3d: Building routes from found waypoints")
            llm_routes = self.route_builder.build_routes(
                origin=llm_origin_coords,
                destination=llm_dest_coords,
                waypoints=found_waypoints,
                constraints=llm_params.constraints,
            )
            llm_routes = llm_routes[:max_routes]
            self.logger.info("Step 3d: Built %d candidate routes", len(llm_routes))

            # Score LLM routes
            self.logger.info("Step 3.5: Scoring LLM routes")
            # Use reasonable image limits for evaluation (if CLIP scoring is enabled)
            use_images = os.getenv("ENABLE_SCORING", "false").lower() == "true"
            min_imgs = int(os.getenv("SCORING_MIN_IMAGES", "3" if use_images else "0"))
            max_imgs = int(os.getenv("SCORING_MAX_IMAGES", "6" if use_images else "0"))
            llm_scored = self.route_scorer.score_routes(
                routes=llm_routes,
                user_prompt=example.user_prompt,
                min_images_per_route=min_imgs,
                max_images_per_route=max_imgs,
            )
            llm_best_score = llm_scored[0].overall_score if llm_scored else 0.0
            self.logger.info(
                "LLM routes scored: %d routes, best score=%.3f, best CLIP=%.3f",
                len(llm_scored),
                llm_best_score,
                llm_scored[0].clip_score if llm_scored else 0.0,
            )

            # Step 4: Build ground truth route (single route using ALL provided waypoints)
            self.logger.info("Step 4: Building ground truth route (using all %d waypoints)", len(example.waypoint_coords))
            gt_waypoints = [
                self._coords_to_waypoint(coords, i, source="ground_truth")
                for i, coords in enumerate(example.waypoint_coords)
            ]

            # Build a single definitive route using all waypoints (optimize order for efficiency)
            gt_route = self.route_builder.build_single_route(
                origin=example.origin_coords,
                destination=example.destination_coords,
                waypoints=gt_waypoints,
                constraints=example.constraints,  # Use ground truth constraints
                optimize_order=True,  # Optimize waypoint order for efficiency
            )
            gt_routes = [gt_route]  # Single definitive route

            # Score ground truth routes
            self.logger.info("Step 4.5: Scoring ground truth routes")
            # Use same image limits as LLM routes
            gt_scored = self.route_scorer.score_routes(
                routes=gt_routes,
                user_prompt=example.user_prompt,
                min_images_per_route=min_imgs,
                max_images_per_route=max_imgs,
            )
            gt_best_score = gt_scored[0].overall_score if gt_scored else 0.0
            self.logger.info(
                "GT routes scored: %d routes, best score=%.3f, best CLIP=%.3f",
                len(gt_scored),
                gt_best_score,
                gt_scored[0].clip_score if gt_scored else 0.0,
            )

            # Step 5: Compare scores
            score_comparison = llm_best_score >= gt_best_score

            processing_time = time.time() - start_time

            self.logger.info(
                "Example %s completed: LLM score=%.3f, GT score=%.3f, LLM >= GT: %s",
                example_id,
                llm_best_score,
                gt_best_score,
                score_comparison,
            )

            return EvaluationResult(
                example_id=example_id,
                llm_extracted_params=llm_params,
                extraction_comparison=extraction_comparison,
                llm_route_score=llm_best_score,
                ground_truth_route_score=gt_best_score,
                score_comparison=score_comparison,
                llm_routes=llm_scored,
                ground_truth_routes=gt_scored,
                processing_time_seconds=processing_time,
                num_waypoints_provided=len(example.waypoint_coords),
                ground_truth=example,
            )

        except Exception as e:
            processing_time = time.time() - start_time
            error_msg = str(e)
            self.logger.error("Error evaluating example %s: %s", example_id, error_msg)

            return EvaluationResult(
                example_id=example_id,
                processing_time_seconds=processing_time,
                num_waypoints_provided=len(example.waypoint_coords),
                error=error_msg,
            )

    def run_batch(
        self,
        examples: List[GroundTruthExample],
        max_routes: int = 10,
    ) -> List[EvaluationResult]:
        """
        Run batch evaluation on multiple ground truth examples.
        
        Args:
            examples: List of ground truth examples to evaluate
            max_routes: Maximum number of routes to generate per example
            
        Returns:
            List of EvaluationResult objects, one per example
        """
        self.logger.info("Starting batch evaluation of %d examples", len(examples))

        results: List[EvaluationResult] = []
        total_start_time = time.time()

        for i, example in enumerate(examples):
            self.logger.info("Processing example %d/%d", i + 1, len(examples))
            result = self.evaluate_example(
                example=example,
                max_routes=max_routes,
            )
            results.append(result)

        total_time = time.time() - total_start_time
        successful = sum(1 for r in results if r.error is None)
        score_wins = sum(1 for r in results if r.score_comparison is True)

        self.logger.info(
            "Batch evaluation complete: %d/%d successful, %d/%d LLM routes >= GT routes, total time: %.2fs",
            successful,
            len(examples),
            score_wins,
            successful,
            total_time,
        )

        return results

    def evaluate_scoring_example(
        self,
        example: ScoringGroundTruthExample,
        user_prompt: Optional[str] = None,
    ) -> ScoringEvaluationResult:
        """
        Evaluate a single scoring ground truth example.
        
        This method:
        1. Builds a route for each route input in the example
        2. Scores all routes using the route scorer
        3. Picks the best route (highest score)
        4. Compares with the annotated best route index
        
        Args:
            example: Scoring ground truth example to evaluate
            user_prompt: Optional user prompt for scoring (uses example.user_prompt if not provided)
            
        Returns:
            ScoringEvaluationResult with comparison metrics
        """
        start_time = time.time()
        example_id = example.example_id or "unknown"
        prompt = user_prompt or example.user_prompt or ""

        try:
            self.logger.info(
                "Evaluating scoring example %s: %d route inputs, best route index: %d",
                example_id,
                len(example.route_inputs),
                example.best_route_index,
            )

            # Step 1: Build routes for all route inputs
            self.logger.info("Step 1: Building routes for all inputs")
            routes: List[Route] = []
            for i, route_input in enumerate(example.route_inputs):
                self.logger.info(
                    "  Building route %d/%d: %d waypoints",
                    i + 1,
                    len(example.route_inputs),
                    len(route_input.waypoint_coords),
                )
                
                # Convert waypoint coordinates to Waypoint objects
                waypoints: List[Waypoint] = []
                for j, coord in enumerate(route_input.waypoint_coords):
                    waypoint = Waypoint(
                        name=f"Waypoint {j+1}",
                        coordinates=coord,
                        category="waypoint",
                        relevance_score=5.0,  # Default relevance score
                        metadata={},
                        input_query="",
                    )
                    waypoints.append(waypoint)
                
                # Build single route using all waypoints
                route = self.route_builder.build_single_route(
                    origin=route_input.origin,
                    destination=route_input.destination,
                    waypoints=waypoints,
                    constraints=route_input.constraints,
                    optimize_order=True,
                )
                routes.append(route)

            # Step 2: Score all routes
            self.logger.info("Step 2: Scoring all routes")
            # Determine image limits based on ENABLE_SCORING
            enable_scoring = os.getenv("ENABLE_SCORING", "false").lower() == "true"
            min_images = 3 if enable_scoring else 0
            max_images = 10 if enable_scoring else 0
            
            scored_routes = self.route_scorer.score_routes(
                routes=routes,
                user_prompt=prompt,
                min_images_per_route=min_images,
                max_images_per_route=max_images,
            )

            # Step 3: Pick the best route (highest overall score)
            if not scored_routes:
                raise RuntimeError("No routes were scored successfully")
            
            # Sort by overall score (descending) - best first
            scored_routes_sorted = sorted(
                scored_routes,
                key=lambda sr: sr.overall_score,
                reverse=True,
            )
            best_scored_route = scored_routes_sorted[0]
            
            # Find the index of the best route in the original routes list
            app_chosen_index = routes.index(best_scored_route.route)
            
            # Step 4: Compare with ground truth
            match = app_chosen_index == example.best_route_index
            
            self.logger.info(
                "Scoring evaluation complete: app chose index %d, ground truth index %d, match: %s",
                app_chosen_index,
                example.best_route_index,
                match,
            )

            processing_time = time.time() - start_time
            
            return ScoringEvaluationResult(
                example_id=example_id,
                app_chosen_index=app_chosen_index,
                ground_truth_index=example.best_route_index,
                match=match,
                scored_routes=scored_routes_sorted,
                processing_time_seconds=processing_time,
            )

        except Exception as e:
            self.logger.error("Error evaluating scoring example %s: %s", example_id, str(e), exc_info=True)
            processing_time = time.time() - start_time
            return ScoringEvaluationResult(
                example_id=example_id,
                ground_truth_index=example.best_route_index,
                processing_time_seconds=processing_time,
                error=str(e),
            )

    def run_scoring_batch(
        self,
        examples: List[ScoringGroundTruthExample],
    ) -> List[ScoringEvaluationResult]:
        """
        Run batch evaluation on scoring ground truth examples.
        
        Args:
            examples: List of scoring ground truth examples
            
        Returns:
            List of ScoringEvaluationResult objects
        """
        results: List[ScoringEvaluationResult] = []
        total_time = time.time()
        
        for example in examples:
            result = self.evaluate_scoring_example(example)
            results.append(result)
        
        total_time = time.time() - total_time
        
        # Calculate accuracy
        successful = [r for r in results if r.error is None]
        matches = sum(1 for r in successful if r.match)
        accuracy = matches / len(successful) if successful else 0.0
        
        self.logger.info(
            "Scoring batch evaluation complete: %d/%d successful, %d/%d matches (accuracy: %.1f%%), total time: %.2fs",
            len(successful),
            len(examples),
            matches,
            len(successful),
            accuracy * 100.0,
            total_time,
        )
        
        return results

