"""
Simplified LLM Provider implementations with extensible architecture.

This module provides a unified interface for LLM providers:
1. Llama 3.1 8b q4_K_M - Local Ollama (no API key required)
2. Extensible for future providers (OpenAI, Anthropic, etc.) that require API keys

The LLMProviderManager handles fallback between providers automatically.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import requests
import json
import re
import logging
import os


class LLMProvider(ABC):
    """Abstract base class for LLM providers."""
    
    def __init__(self, model_name: str):
        self.model_name = model_name
        self.logger = logging.getLogger(__name__)
    
    @abstractmethod
    def extract_parameters(self, prompt: str) -> str:
        """Extract parameters using the LLM provider."""
        pass
    
    @abstractmethod
    def is_available(self) -> bool:
        """Check if the provider is available."""
        pass


class LlamaProvider(LLMProvider):
    """Llama 3.1 provider using Ollama (no API key required)."""
    
    def __init__(self, model_name: str = "llama3.1:8b-instruct-q4_K_M"):
        super().__init__(model_name)
        self.ollama_url = "http://ollama:11434/api/generate"  # Docker service name
        self.fallback_urls = [
            "http://localhost:11434/api/generate",  # Local development
            "http://host.docker.internal:11434/api/generate",  # Docker Desktop
        ]
    
    def is_available(self) -> bool:
        """Check if Ollama is running and model is available."""
        for url in [self.ollama_url] + self.fallback_urls:
            try:
                # Check if Ollama is running
                response = requests.get(f"{url.replace('/api/generate', '/api/tags')}", timeout=10)
                if response.status_code == 200:
                    # Check if our model is available
                    models = response.json().get("models", [])
                    model_names = [model.get("name", "") for model in models]
                    if self.model_name in model_names:
                        self.ollama_url = url
                        return True  # Model is available, don't test generation
            except Exception as e:
                self.logger.debug(f"Ollama check failed for {url}: {str(e)}")
                continue
        return False
    
    def extract_parameters(self, prompt: str) -> str:
        """Extract parameters using Llama 3.1."""
        payload = {
            "model": self.model_name,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.1,
                "top_p": 0.9,
                "num_predict": 500,  # Reduced from 1000
            }
        }
        
        try:
            self.logger.info(f"Making request to Ollama with model {self.model_name}")
            response = requests.post(
                self.ollama_url,
                json=payload,
                timeout=300  # 5 minutes timeout
            )
            response.raise_for_status()
            
            result = response.json()
            response_text = result.get("response", "")
            self.logger.info(f"Successfully received response from Ollama (length: {len(response_text)})")
            
            # Extract JSON from the response (remove markdown formatting)
            cleaned_response = self._extract_json_from_response(response_text)
            return cleaned_response
            
        except requests.exceptions.Timeout:
            self.logger.error(f"Ollama request timed out after 300 seconds. Model may still be loading.")
            raise Exception("Ollama request timed out - model may still be loading into memory")
        except requests.exceptions.ConnectionError:
            self.logger.error(f"Failed to connect to Ollama at {self.ollama_url}")
            raise Exception("Cannot connect to Ollama service")
        except Exception as e:
            self.logger.error(f"Ollama request failed: {str(e)}")
            raise
    
    def _extract_json_from_response(self, response_text: str) -> str:
        """Extract JSON from LLM response, handling markdown formatting."""
        
        # Try to find JSON in markdown code blocks first
        json_pattern = r'```(?:json)?\s*(\{.*?\})\s*```'
        match = re.search(json_pattern, response_text, re.DOTALL)
        if match:
            return match.group(1).strip()
        
        # Try to find JSON without markdown
        json_pattern = r'(\{.*?\})'
        match = re.search(json_pattern, response_text, re.DOTALL)
        if match:
            return match.group(1).strip()
        
        # If no JSON found, return the original response
        self.logger.warning("No JSON found in LLM response, returning original text")
        return response_text


class LLMProviderManager:
    """Manager for LLM providers with fallback support."""
    
    def __init__(self, api_key: str = ""):
        self.logger = logging.getLogger(__name__)
        self.api_key = api_key  # For future LLM providers that need API keys
        
        # Use q4_K_M quantized Llama 3.1 8b for optimal balance of speed and accuracy
        self.providers = [
            LlamaProvider("llama3.1:8b-instruct-q4_K_M"),
            # Future providers that need API keys can be added here:
            # OpenAIProvider(self.api_key) if self.api_key else None,
            # AnthropicProvider(self.api_key) if self.api_key else None,
        ]
        # Filter out None providers
        self.providers = [p for p in self.providers if p is not None]
    
    def extract_parameters(self, prompt: str) -> str:
        """
        Extract parameters using available LLM providers with fallback.
        
        Args:
            prompt: The extraction prompt
            
        Returns:
            Extracted parameters as JSON string
            
        Raises:
            Exception: If all providers fail
        """
        for provider in self.providers:
            try:
                if provider.is_available():
                    self.logger.info(f"Trying provider: {provider.__class__.__name__} ({provider.model_name})")
                    result = provider.extract_parameters(prompt)
                    self.logger.info(f"Successfully extracted parameters using {provider.__class__.__name__}")
                    return result
                else:
                    self.logger.warning(f"Provider {provider.__class__.__name__} ({provider.model_name}) is not available")
            except Exception as e:
                self.logger.error(f"Provider {provider.__class__.__name__} failed: {str(e)}")
                continue
        
        # All providers failed
        raise Exception("All LLM providers failed")
    
    def get_available_providers(self) -> list:
        """Get list of available providers."""
        available = []
        for provider in self.providers:
            if provider.is_available():
                available.append(f"{provider.__class__.__name__} ({provider.model_name})")
        return available