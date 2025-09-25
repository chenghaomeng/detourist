// Type definitions for the frontend

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface Waypoint {
  name: string
  coordinates: Coordinates
  category: string
  relevance_score: number
  metadata: Record<string, any>
}

export interface RouteSegment {
  start: Coordinates
  end: Coordinates
  distance_meters: number
  duration_seconds: number
  instructions: string[]
  polyline: string
}

export interface Route {
  origin: Coordinates
  destination: Coordinates
  waypoints: Waypoint[]
  segments: RouteSegment[]
  total_distance_meters: number
  total_duration_seconds: number
  constraints_applied: Record<string, boolean>
}

export interface RouteScore {
  route: Route
  clip_score: number
  efficiency_score: number
  preference_match_score: number
  overall_score: number
  image_scores: number[]
}
