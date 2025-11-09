"""
LLM providers with Ollama (Llama 3.1) support.

Environment variables used:
  - LLM_PROVIDER=ollama            # default
  - OLLAMA_BASE_URL=http://detourist-ollama:11434  # or http://localhost:11434
  - OLLAMA_MODEL=llama3.1:8b-instruct-q4_K_M
"""

from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Optional, List
import requests
import re
import logging
import os


class LLMProvider(ABC):
    """Abstract base class for LLM providers."""

    def __init__(self, model_name: str):
        self.model_name = model_name
        self.logger = logging.getLogger(__name__)

    @abstractmethod
    def is_available(self) -> bool:
        """Return True if the provider can serve requests."""
        ...

    @abstractmethod
    def extract_parameters(self, prompt: str, expect_json: bool = True) -> str:
        """Run the model and return either raw text or a JSON string."""
        ...


class LlamaProvider(LLMProvider):
    """
    Llama 3.1 provider via Ollama.

    Base URL resolution order:
      1) OLLAMA_BASE_URL env
      2) http://localhost:11434
      3) http://host.docker.internal:11434
    """

    def __init__(self, model_name: str = "llama3.1:8b-instruct-q4_K_M"):
        super().__init__(model_name)
        base = os.getenv("OLLAMA_BASE_URL", "").strip().rstrip("/")
        self._candidates: List[str] = []
        if base:
            self._candidates.append(base)
        self._candidates += [
            "http://localhost:11434",
            "http://host.docker.internal:11434",
        ]
        self._generate_url: Optional[str] = None
        self._tags_url: Optional[str] = None

    # ---------- internal ----------

    def _set_urls(self, base: str) -> None:
        base = base.rstrip("/")
        self._generate_url = f"{base}/api/generate"
        self._tags_url = f"{base}/api/tags"

    # ---------- public ------------

    def is_available(self) -> bool:
        for base in self._candidates:
            try:
                self._set_urls(base)
                r = requests.get(self._tags_url, timeout=6)
                if r.status_code != 200:
                    self.logger.warning(f"[LLM] /api/tags non-200 at {base}: {r.status_code}")
                    continue
                data = r.json() if r.content else {"models": []}
                models = [m.get("name", "") for m in data.get("models", [])]
                if self.model_name in models:
                    self.logger.info(f"[LLM] Ollama OK at {base} w/ model {self.model_name}")
                    return True
                else:
                    self.logger.warning(f"[LLM] Model {self.model_name} not listed at {base}. Found: {models}")
            except Exception as e:
                self.logger.warning(f"[LLM] probe failed at {base}: {e}")
        return False

    def extract_parameters(self, prompt: str, expect_json: bool = True) -> str:
        if not self._generate_url:
            if not self.is_available():
                raise Exception("Ollama not available or model missing")

        payload = {
            "model": self.model_name,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.1,
                "top_p": 0.9,
                "num_predict": 700,
            },
        }
        try:
            self.logger.info(f"[LLM] POST {self._generate_url} (model={self.model_name})")
            resp = requests.post(self._generate_url, json=payload, timeout=300)
            resp.raise_for_status()
            result = resp.json()
            text = (result or {}).get("response", "")
            self.logger.info(f"[LLM] rx chars={len(text)}")

            if not expect_json:
                return text.strip()

            # Try codefence JSON first, then greedy
            js = self._extract_json(text)
            if js is not None:
                return js
            # If the model already returned naked JSON:
            t = text.strip()
            if t.startswith("{") and t.endswith("}"):
                return t
            raise Exception("No JSON object found in LLM response")
        except requests.exceptions.Timeout:
            raise Exception("Ollama request timed out (model may still be loading)")
        except requests.exceptions.ConnectionError as e:
            raise Exception(f"Cannot connect to Ollama at {self._generate_url}: {e}")
        except Exception as e:
            self.logger.exception(f"[LLM] call failed: {e}")
            raise

    # ---------- helpers ----------

    def _extract_json(self, text: str) -> Optional[str]:
        m = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, flags=re.DOTALL)
        if m:
            return m.group(1).strip()
        m = re.search(r"(\{.*\})", text, flags=re.DOTALL)
        if m:
            return m.group(1).strip()
        return None


class LLMProviderManager:
    """Manager that selects a provider and offers a single `extract_parameters` API."""

    def __init__(self, api_key: str = ""):
        self.logger = logging.getLogger(__name__)
        choice = os.getenv("LLM_PROVIDER", "ollama").lower()
        model = os.getenv("OLLAMA_MODEL", "llama3.1:8b-instruct-q4_K_M")
        providers: List[LLMProvider] = []
        if choice in ("ollama", "auto"):
            providers.append(LlamaProvider(model))
        self.providers = providers

    def extract_parameters(self, prompt: str, expect_json: bool = True) -> str:
        last_err: Optional[str] = None
        for p in self.providers:
            try:
                if p.is_available():
                    self.logger.info(f"[LLM] using {p.__class__.__name__} ({p.model_name})")
                    return p.extract_parameters(prompt, expect_json=expect_json)
                else:
                    self.logger.warning(f"[LLM] provider {p.__class__.__name__} not available")
            except Exception as e:
                last_err = str(e)
                self.logger.error(f"[LLM] provider {p.__class__.__name__} failed: {last_err}")
                continue
        raise Exception(f"All LLM providers failed{(': ' + last_err) if last_err else ''}")