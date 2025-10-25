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
  geometry: any;
  features: string[];
  links: { google?: string; apple?: string; };
  why: string;
  distance_m: number;
  duration_s: number;
}

export interface BackendRouteResponse {
  routes: BackendRoute[];
  processing_time_seconds: number;
  metadata: {
    total_routes_generated: number;
    waypoints_found: number;
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

