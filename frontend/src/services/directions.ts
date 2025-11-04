export interface RouteData {
  origin: string;
  destination: string;
  duration: string;
  distance: string;
  polyline: string;
  bounds: google.maps.LatLngBounds;
  legs: google.maps.DirectionsLeg[];
}

/**
 * Get route directions from Google Maps Directions API
 * @param origin - Starting location
 * @param destination - Ending location
 * @returns Route data including polyline, duration, and distance
 */
export async function getDirections(
  origin: string,
  destination: string
): Promise<RouteData> {
  return new Promise((resolve, reject) => {
    // Use the Google Maps DirectionsService (client-side)
    const directionsService = new google.maps.DirectionsService();

    const request: google.maps.DirectionsRequest = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: false,
      provideRouteAlternatives: false,
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        const route = result.routes[0];
        const leg = route.legs[0];

        const routeData: RouteData = {
          origin: leg.start_address,
          destination: leg.end_address,
          duration: leg.duration?.text || 'Unknown',
          distance: leg.distance?.text || 'Unknown',
          polyline: route.overview_polyline,
          bounds: route.bounds,
          legs: route.legs,
        };

        console.log('Google Directions API Response:', routeData);
        resolve(routeData);
      } else {
        reject(new Error(`Directions request failed: ${status}`));
      }
    });
  });
}

/**
 * Convert backend route data to Google Maps DirectionsResult
 * @param backendRoute - Route data from backend API
 * @returns Google Maps DirectionsResult
 */
export async function convertBackendRouteToDirections(
  backendRoute: any
): Promise<google.maps.DirectionsResult> {
  return new Promise((resolve, reject) => {
    const directionsService = new google.maps.DirectionsService();
    
    const request: google.maps.DirectionsRequest = {
      origin: new google.maps.LatLng(
        backendRoute.coordinates.origin.lat,
        backendRoute.coordinates.origin.lng
      ),
      destination: new google.maps.LatLng(
        backendRoute.coordinates.destination.lat,
        backendRoute.coordinates.destination.lng
      ),
      waypoints: backendRoute.coordinates.waypoints.map((wp: any) => ({
        location: new google.maps.LatLng(wp.lat, wp.lng),
        stopover: true
      })),
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: false,
      provideRouteAlternatives: false,
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        resolve(result);
      } else {
        reject(new Error(`Directions request failed: ${status}`));
      }
    });
  });
}

/**
 * Get multiple route alternatives from Google Maps Directions API
 * @param origin - Starting location
 * @param destination - Ending location
 * @returns Array of route data
 */
export async function getRouteAlternatives(
  origin: string,
  destination: string
): Promise<google.maps.DirectionsResult | null> {
  return new Promise((resolve, reject) => {
    const directionsService = new google.maps.DirectionsService();

    const request: google.maps.DirectionsRequest = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: false,
      provideRouteAlternatives: true, // Request multiple routes
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        console.log('Google Directions API Response (alternatives):', result);
        resolve(result);
      } else {
        reject(new Error(`Directions request failed: ${status}`));
      }
    });
  });
}

