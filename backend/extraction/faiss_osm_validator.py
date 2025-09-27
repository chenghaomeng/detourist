"""
FAISS-based OSM Tag Search System

This module uses FAISS vector search to find semantically similar OSM tags
based on user prompts, then passes candidates to LLM for selection.
"""

import sqlite3
import logging
import requests
import time
import numpy as np
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from datetime import datetime

# FAISS imports (will be installed when dependencies are available)
try:
    import faiss
    FAISS_AVAILABLE = True
except ImportError:
    FAISS_AVAILABLE = False
    print("Warning: FAISS not available. Install with: pip install faiss-cpu")

# Sentence transformers for embeddings
try:
    from sentence_transformers import SentenceTransformer
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    print("Warning: SentenceTransformers not available. Install with: pip install sentence-transformers")


@dataclass
class OSMTag:
    """Represents an OSM tag with metadata and embeddings."""
    key: str
    value: str
    description: str
    count_all: int
    count_nodes: int
    count_ways: int
    count_relations: int
    wiki_description: Optional[str] = None
    embedding: Optional[np.ndarray] = None
    tag_id: int = 0


@dataclass
class TagSearchResult:
    """Result of a vector search operation."""
    query: str
    tags: List[OSMTag]
    search_method: str
    confidence: float
    query_embedding: Optional[np.ndarray] = None


class FAISSOSMTagDatabase:
    """FAISS-based OSM tag database with vector search capabilities."""
    
    def __init__(self, db_path: str = "osm_tags_faiss.db", embedding_model: str = "all-MiniLM-L6-v2", include_descriptions_in_faiss_index: bool = True):
        """Initialize the FAISS OSM tag database."""
        self.db_path = db_path
        self.embedding_model_name = embedding_model
        self.include_descriptions_in_faiss_index = include_descriptions_in_faiss_index
        self.logger = logging.getLogger(__name__)
        
        # Initialize embedding model
        if TRANSFORMERS_AVAILABLE:
            self.embedding_model = SentenceTransformer(embedding_model)
            self.embedding_dim = self.embedding_model.get_sentence_embedding_dimension()
        else:
            self.embedding_model = None
            self.embedding_dim = 384  # Default for all-MiniLM-L6-v2
        
        # Initialize FAISS index
        if FAISS_AVAILABLE:
            self.faiss_index = faiss.IndexFlatIP(self.embedding_dim)  # Inner product for cosine similarity
        else:
            self.faiss_index = None
        
        # OSM tag keys we're interested in
        self.relevant_keys = [
            "natural", "waterway", "amenity", "leisure", 
            "surface", "tourism", "landuse", "water",
        ]
        
        # Taginfo API base URL
        self.taginfo_base_url = "https://taginfo.openstreetmap.org/api/4"
        
        self._init_database()
    
    def _init_database(self):
        """Initialize the SQLite database for OSM tags with embeddings."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS osm_tags (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                key TEXT NOT NULL,
                value TEXT NOT NULL,
                description TEXT,
                count_all INTEGER DEFAULT 0,
                count_nodes INTEGER DEFAULT 0,
                count_ways INTEGER DEFAULT 0,
                count_relations INTEGER DEFAULT 0,
                wiki_description TEXT,
                embedding BLOB,
                search_text TEXT,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(key, value)
            )
        ''')
        
        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_key_value ON osm_tags(key, value)
        ''')
        
        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_search_text ON osm_tags(search_text)
        ''')
        
        conn.commit()
        conn.close()
    
    def build_database_from_taginfo(self, force_rebuild: bool = False):
        """
        Build the OSM tag database by fetching from taginfo API.
        This should be run during application startup or as a scheduled job.
        """
        self.logger.info("Building OSM tag database with FAISS index...")
        
        if force_rebuild:
            self._clear_database()
        
        # Fetch real OSM tags from taginfo API
        self._fetch_tags_from_taginfo()
        
        # Build FAISS index
        self._build_faiss_index()
        
        self.logger.info("FAISS OSM tag database build complete")
    
    def _fetch_tags_from_taginfo(self):
        """Fetch real OSM tags from taginfo API."""
        
        self.logger.info("Fetching OSM tags from taginfo API...")
        
        for key in self.relevant_keys:
            self.logger.info(f"Fetching tags for key: {key}")
            try:
                url = f"{self.taginfo_base_url}/tags/list"
                params = {"key": key}
                
                response = requests.get(url, params=params, timeout=30)
                response.raise_for_status()
                
                data = response.json()
                tags = data.get("data", [])
                
                self.logger.info(f"Found {len(tags)} tags for key '{key}'")
                
                # Store tags in database
                self._store_tags(tags)
                
                # Be respectful to the API
                time.sleep(0.5)
                
            except requests.exceptions.RequestException as e:
                self.logger.error(f"Failed to fetch tags for key '{key}': {str(e)}")
                continue
            except Exception as e:
                self.logger.error(f"Unexpected error fetching tags for key '{key}': {str(e)}")
                continue
    
    def _store_tags(self, tags: List[Dict]):
        """Store tags in the database."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        for tag in tags:
            # Extract wiki description
            wiki_description = None
            if "wiki" in tag and "en" in tag["wiki"]:
                wiki_description = tag["wiki"]["en"].get("description")
            
            # Create search text for embedding (using only value, not key=value)
            if self.include_descriptions_in_faiss_index:
                search_text = f"{tag['value']} {tag.get('description', '')} {wiki_description or ''}"
            else:
                search_text = f"{tag['value']}"
            
            cursor.execute('''
                INSERT OR REPLACE INTO osm_tags 
                (key, value, description, count_all, count_nodes, count_ways, count_relations, wiki_description, search_text)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                tag["key"],
                tag["value"],
                tag.get("description", ""),
                tag.get("count_all", 0),
                tag.get("count_nodes", 0),
                tag.get("count_ways", 0),
                tag.get("count_relations", 0),
                wiki_description,
                search_text
            ))
        
        conn.commit()
        conn.close()
    
    def _build_faiss_index(self):
        """Build FAISS index from database embeddings."""
        if not FAISS_AVAILABLE or not self.embedding_model:
            self.logger.warning("FAISS or embedding model not available, skipping index build")
            return
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, search_text FROM osm_tags")
        rows = cursor.fetchall()
        
        if not rows:
            self.logger.warning("No tags found in database")
            conn.close()
            return
        
        # Generate embeddings
        search_texts = [row[1] for row in rows]
        embeddings = self.embedding_model.encode(search_texts)
        
        # Normalize embeddings for cosine similarity
        embeddings = embeddings / np.linalg.norm(embeddings, axis=1, keepdims=True)
        
        # Add to FAISS index
        self.faiss_index.add(embeddings.astype('float32'))
        
        # Store embeddings in database
        cursor.execute("DELETE FROM osm_tags WHERE embedding IS NOT NULL")  # Clear old embeddings
        
        for i, (tag_id, _) in enumerate(rows):
            embedding_blob = embeddings[i].astype('float32').tobytes()
            cursor.execute('''
                UPDATE osm_tags SET embedding = ? WHERE id = ?
            ''', (embedding_blob, tag_id))
        
        conn.commit()
        conn.close()
        
        self.logger.info(f"Built FAISS index with {len(rows)} tags")
    
    def _clear_database(self):
        """Clear all data from the database."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM osm_tags")
        conn.commit()
        conn.close()
        
        if self.faiss_index:
            self.faiss_index.reset()
    
    def vector_search(self, query: str, top_k: int = 10) -> TagSearchResult:
        """
        Search for OSM tags using vector similarity.
        
        Args:
            query: User prompt or search query
            top_k: Number of top results to return
            
        Returns:
            TagSearchResult with most similar tags
        """
        if not FAISS_AVAILABLE or not self.embedding_model or not self.faiss_index:
            return self._fallback_text_search(query, top_k)
        
        # Generate query embedding
        query_embedding = self.embedding_model.encode([query])
        query_embedding = query_embedding / np.linalg.norm(query_embedding, axis=1, keepdims=True)
        
        # Search FAISS index
        scores, indices = self.faiss_index.search(query_embedding.astype('float32'), top_k)
        
        # Retrieve tags from database
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        tags = []
        for score, idx in zip(scores[0], indices[0]):
            if idx == -1:  # FAISS returns -1 for empty results
                continue
                
            cursor.execute('''
                SELECT id, key, value, description, count_all, count_nodes, count_ways, count_relations, wiki_description
                FROM osm_tags WHERE id = ?
            ''', (int(idx) + 1,))  # FAISS indices are 0-based, DB IDs are 1-based
            
            row = cursor.fetchone()
            if row:
                tag = OSMTag(
                    tag_id=row[0],
                    key=row[1],
                    value=row[2],
                    description=row[3],
                    count_all=row[4],
                    count_nodes=row[5],
                    count_ways=row[6],
                    count_relations=row[7],
                    wiki_description=row[8],
                    embedding=None  # Don't load embeddings for results
                )
                tags.append(tag)
        
        conn.close()
        
        return TagSearchResult(
            query=query,
            tags=tags,
            search_method="faiss_vector_search",
            confidence=float(scores[0][0]) if scores[0][0] > 0 else 0.0,
            query_embedding=query_embedding[0]
        )
    
    def _fallback_text_search(self, query: str, top_k: int) -> TagSearchResult:
        """Fallback to text search when FAISS is not available."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        search_query = '''
            SELECT id, key, value, description, count_all, count_nodes, count_ways, count_relations, wiki_description
            FROM osm_tags
            WHERE search_text LIKE ?
            ORDER BY count_all DESC
            LIMIT ?
        '''
        
        search_term = f"%{query}%"
        cursor.execute(search_query, (search_term, top_k))
        
        results = cursor.fetchall()
        conn.close()
        
        tags = []
        for row in results:
            tag = OSMTag(
                tag_id=row[0],
                key=row[1],
                value=row[2],
                description=row[3],
                count_all=row[4],
                count_nodes=row[5],
                count_ways=row[6],
                count_relations=row[7],
                wiki_description=row[8]
            )
            tags.append(tag)
        
        return TagSearchResult(
            query=query,
            tags=tags,
            search_method="fallback_text_search",
            confidence=0.5
        )
    
    def get_database_stats(self) -> Dict[str, Any]:
        """Get statistics about the database."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM osm_tags")
        total_tags = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(DISTINCT key) FROM osm_tags")
        unique_keys = cursor.fetchone()[0]
        
        cursor.execute("SELECT key, COUNT(*) as count FROM osm_tags GROUP BY key ORDER BY count DESC LIMIT 10")
        top_keys = cursor.fetchall()
        
        conn.close()
        
        return {
            "total_tags": total_tags,
            "unique_keys": unique_keys,
            "top_keys": top_keys,
            "faiss_available": FAISS_AVAILABLE,
            "transformers_available": TRANSFORMERS_AVAILABLE,
            "index_size": self.faiss_index.ntotal if self.faiss_index else 0,
            "last_updated": datetime.now().isoformat()
        }


class FAISSOSMTagValidator:
    """FAISS-based OSM tag validator that uses vector search."""
    
    def __init__(self, db_path: str = "osm_tags_faiss.db", include_descriptions_in_faiss_index: bool = True):
        """Initialize the validator with FAISS OSM tag database."""
        self.db = FAISSOSMTagDatabase(db_path, include_descriptions_in_faiss_index=include_descriptions_in_faiss_index)
        self.logger = logging.getLogger(__name__)
    
    def get_candidate_tags(self, user_prompt: str, top_k: int = 15) -> List[OSMTag]:
        """
        Get candidate OSM tags using vector search on the user prompt.
        
        Args:
            user_prompt: Original user prompt
            top_k: Number of candidate tags to return
            
        Returns:
            List of candidate OSMTag objects
        """
        # Build database if it doesn't exist or is empty
        if not self._is_database_populated():
            self.logger.info("Building OSM tag database on first use...")
            self.db.build_database_from_taginfo()
        
        search_result = self.db.vector_search(user_prompt, top_k)
        return search_result.tags
    
    def _is_database_populated(self) -> bool:
        """Check if the database has any tags."""
        import sqlite3
        conn = sqlite3.connect(self.db.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM osm_tags")
        count = cursor.fetchone()[0]
        conn.close()
        return count > 0
    
    def enhance_waypoint_queries(self, user_prompt: str, llm_queries: List[str] = None) -> List[str]:
        """
        Enhanced version that uses vector search on the full user prompt.
        
        Args:
            user_prompt: Original user prompt
            llm_queries: Queries generated by LLM (may be ignored in favor of vector search)
            
        Returns:
            Enhanced list of OSM tags
        """
        # Get candidate tags using vector search
        candidate_tags = self.get_candidate_tags(user_prompt, top_k=10)
        
        # Convert to tag strings
        enhanced_queries = []
        for tag in candidate_tags:
            tag_string = f"{tag.key}={tag.value}"
            enhanced_queries.append(tag_string)
        
        return enhanced_queries
