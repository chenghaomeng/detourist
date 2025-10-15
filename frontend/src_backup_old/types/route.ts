export interface RoutePreferences {
  origin: string;
  destination: string;
  scenic: boolean;
  avoid?: string;
  calm: boolean;
  avoidHighways: boolean;
  avoidTolls: boolean;
}

export interface RouteSegment {
  id: string;
  title: string;
  badges: Array<{
    type: 'scenic' | 'avoid' | 'calm' | 'faster' | 'slower';
    label: string;
  }>;
  why: string;
  meta?: string;
}

export interface Waypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'scenic' | 'avoid' | 'regular';
}

export interface RouteResult {
  segments: RouteSegment[];
  waypoints: Waypoint[];
  eta: string;
  distance?: string;
  comparison: string;
  hasScenic: boolean;
  hasConflict: boolean;
}

export type AppScreen = 'prompt' | 'processing' | 'results' | 'handoff' | 'no-scenic' | 'conflict';