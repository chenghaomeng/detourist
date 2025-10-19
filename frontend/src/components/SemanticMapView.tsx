import { useLoadScript, GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import { useMemo, useEffect, useState } from 'react';

interface SemanticMapViewProps {
  searchQuery: string;
  isNaturalSearch: boolean;
  directionsResult?: google.maps.DirectionsResult | null;
  selectedRouteIndex?: number;
}

const libraries: ("places" | "drawing" | "geometry")[] = ["places"];

export function SemanticMapView({ searchQuery, isNaturalSearch, directionsResult, selectedRouteIndex }: SemanticMapViewProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const center = useMemo(() => ({ lat: 37.7749, lng: -122.4194 }), []); // San Francisco

  const mapOptions = useMemo<google.maps.MapOptions>(() => ({
    disableDefaultUI: false,
    clickableIcons: true,
    scrollwheel: true,
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
  }), []);

  // Fit bounds to route when directions are available
  useEffect(() => {
    if (map && directionsResult?.routes?.[0]?.bounds) {
      map.fitBounds(directionsResult.routes[0].bounds);
    }
  }, [map, directionsResult]);

  if (loadError) {
    return (
      <div className="absolute h-full left-0 overflow-clip top-0 w-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-md">
          <p className="font-semibold text-red-600 text-lg mb-2">Error loading maps</p>
          <p className="text-sm text-gray-600">Please check your API key configuration</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="absolute h-full left-0 overflow-clip top-0 w-full flex items-center justify-center bg-gray-100">
        <div className="text-gray-600 text-lg">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="absolute h-full left-0 overflow-clip top-0 w-full" data-name="Google Maps Widget">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={12}
        options={mapOptions}
        onLoad={setMap}
      >
        {directionsResult && (
          <DirectionsRenderer
            directions={directionsResult}
            routeIndex={selectedRouteIndex || 0}
            options={{
              polylineOptions: {
                strokeColor: '#4285F4',
                strokeWeight: 5,
                strokeOpacity: 0.8,
              },
              suppressMarkers: false,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}