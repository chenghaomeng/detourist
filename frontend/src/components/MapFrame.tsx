import React, { useEffect, useRef } from 'react';
import { cn } from './ui/utils';

interface Waypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'scenic' | 'avoid' | 'regular';
}

interface MapFrameProps {
  waypoints?: Waypoint[];
  className?: string;
  showRoute?: boolean;
  showAvoidArea?: boolean;
}

// Leaflet CSS is loaded via CDN in a script tag below
declare global {
  interface Window {
    L: any;
  }
}

export function MapFrame({ waypoints = [], className, showRoute = true, showAvoidArea = false }: MapFrameProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const routeLayerRef = useRef<any>(null);

  useEffect(() => {
    // Load Leaflet if not already loaded
    if (!window.L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && window.L) {
      updateMapContent();
    }
  }, [waypoints, showRoute, showAvoidArea]);

  const initializeMap = () => {
    if (!mapRef.current || !window.L || mapInstanceRef.current) return;

    // Initialize map centered on San Francisco to Big Sur area
    const map = window.L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([37.0, -121.8], 8);

    // Add custom zoom control
    window.L.control.zoom({
      position: 'topright'
    }).addTo(map);

    // Add tile layer (OpenStreetMap)
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    updateMapContent();
  };

  const updateMapContent = () => {
    if (!mapInstanceRef.current || !window.L) return;

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];

    // Clear existing route
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (waypoints.length === 0) return;

    // Add waypoint markers
    waypoints.forEach((waypoint) => {
      const color = waypoint.type === 'scenic' ? '#2563eb' : 
                   waypoint.type === 'avoid' ? '#dc2626' : '#6b7280';
      
      const marker = window.L.circleMarker([waypoint.lat, waypoint.lng], {
        radius: 8,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(map);

      marker.bindPopup(`<div class="font-medium text-sm">${waypoint.name}</div>`);
      markersRef.current.push(marker);
    });

    // Show route if enabled
    if (showRoute && waypoints.length > 1) {
      // Create a simple route line connecting waypoints
      const routeCoords = waypoints.map(wp => [wp.lat, wp.lng]);
      
      // Main route line
      const routeLine = window.L.polyline(routeCoords, {
        color: '#1a1d23',
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1
      }).addTo(map);

      // Scenic segments overlay
      const scenicWaypoints = waypoints.filter(wp => wp.type === 'scenic');
      if (scenicWaypoints.length > 1) {
        const scenicCoords = scenicWaypoints.map(wp => [wp.lat, wp.lng]);
        window.L.polyline(scenicCoords, {
          color: '#2563eb',
          weight: 6,
          opacity: 0.7,
          smoothFactor: 1
        }).addTo(map);
      }

      routeLayerRef.current = routeLine;
    }

    // Fit map to show all waypoints
    if (waypoints.length > 0) {
      const group = new window.L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  };

  return (
    <div className={cn(
      "relative w-full rounded-lg overflow-hidden bg-accent border border-border",
      className
    )}>
      <div 
        ref={mapRef} 
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />
      
      {/* Loading state */}
      {!window.L && (
        <div className="absolute inset-0 flex items-center justify-center bg-accent">
          <div className="text-muted-foreground">Loading map...</div>
        </div>
      )}
    </div>
  );
}