import axios from 'axios';

const getApiUrl = () => {
  if (import.meta.env.DEV) {
    return '/api';  // Proxy in vite.config.ts
  }
  return import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
};

const apiClient = axios.create({
  baseURL: getApiUrl(),
  timeout: 300000,
  headers: { 'Content-Type': 'application/json' },
});

export interface BackendRouteRequest {
  user_prompt: string;
  origin?: { text?: string; lat?: number; lon?: number; };
  destination?: { text?: string; lat?: number; lon?: number; };
  time?: { max_duration_min?: number; departure_time_utc?: string; };
  max_results?: number;
}

export interface BackendRoute {
  id: string;
  score: number;
  scores: {
    clip: number;
    efficiency: number;
    preference: number;
    images_used: number;
  };
  distance_m: number;
  duration_s: number;
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
  waypoints: Array<{
    name: string;
    category: string;
    relevance_score: number;
    input_query: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  }>;
  segments: Array<{
    distance_m: number;
    duration_s: number;
    instructions: string[];
    polyline: string;
    start: {
      latitude: number;
      longitude: number;
    };
    end: {
      latitude: number;
      longitude: number;
    };
  }>;
  features: string[];
  why: string;
  links: {
    google: string;
    apple: string;
  };
  coordinates: {
    origin: {
      lat: number;
      lng: number;
    };
    destination: {
      lat: number;
      lng: number;
    };
    waypoints: Array<{
      lat: number;
      lng: number;
      name: string;
    }>;
  };
}

export interface BackendRouteResponse {
  routes: BackendRoute[];
  processing_time_seconds: number;
  metadata: {
    total_routes_generated: number;
    waypoints_found: number;
    origin_text?: string;
    destination_text?: string;
    timings?: Record<string, number>;
  };
}

export async function generateRoutesFromBackend(
  request: BackendRouteRequest
): Promise<BackendRouteResponse> {
  const response = await apiClient.post<BackendRouteResponse>(
    '/generate-routes',
    request
  );
  return response.data;
}

export async function healthCheck() {
  const response = await apiClient.get('/health');
  return response.data;
}

