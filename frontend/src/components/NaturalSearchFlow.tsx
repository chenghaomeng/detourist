import svgPaths from "../imports/svg-sijx7d9tyk";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { IntentEditor } from "./IntentEditor";
import { extractRouteFromQuery } from "../services/openai";
import { getRouteAlternatives, convertBackendRouteToDirections } from "../services/directions";
import { generateRoutesFromBackend, BackendRoute } from "../services/backend-api";
import {
  MapPin,
  Navigation,
  Clock,
  Route,
  Mountain,
  Trees,
  Car,
  Star,
  Sparkles,
  ChevronRight,
  RotateCcw,
  Award,
  Settings,
  Play,
  Share,
  Heart,
} from "lucide-react";

function SparkleIcon() {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 size-[16px] top-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_16_303)" id="Icon">
          <path d={svgPaths.p23633980} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M13.3333 1.33333V4" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14.6667 2.66667H12" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p22966600} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_16_303">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

type FlowStep =
  | "search"
  | "processing"
  | "thinking"
  | "routes"
  | "detail"
  | "navigation";

interface RouteOption {
  id: string;
  title: string;
  score: number;
  duration: string;
  distance: string;
  detour: string;
  tags: string[];
  description: string;
  waypoints: string[];
  mapLinks?: {
    google?: string;
    apple?: string;
  };
  scoreBreakdown: {
    scenic: number;
    safety: number;
    duration: number;
    quiet: number;
  };
  backendData?: {
    rawScore: number;
    waypointCount: number;
    features: string[];
    coordinates: {
      origin: { lat: number; lng: number; };
      destination: { lat: number; lng: number; };
      waypoints: Array<{ lat: number; lng: number; name: string; }>;
    };
  };
}

interface NaturalSearchFlowProps {
  searchQuery: string;
  isNaturalSearch: boolean;
  isEnhancedMode: boolean;
  onDirectionsResult: (result: google.maps.DirectionsResult | null) => void;
  onRouteIndexChange: (index: number) => void;
}

const routeOptions: RouteOption[] = [
  {
    id: "1",
    title: "Most Scenic",
    score: 0.87,
    duration: "42 min",
    distance: "28.3 mi",
    detour: "+18%",
    tags: [
      "via Golden Gate Park",
      "coastal views",
      "tree-lined",
    ],
    description:
      "Beautiful route through parks and along the waterfront",
    waypoints: [
      "Golden Gate Park",
      "Ocean Beach",
      "Lands End",
      "Presidio",
    ],
    scoreBreakdown: {
      scenic: 0.92,
      safety: 0.85,
      duration: 0.75,
      quiet: 0.88,
    },
  },
  {
    id: "2",
    title: "Balanced Route",
    score: 0.74,
    duration: "35 min",
    distance: "24.1 mi",
    detour: "+8%",
    tags: ["some highways", "moderate views", "efficient"],
    description: "Good compromise between speed and scenery",
    waypoints: [
      "19th Avenue",
      "Park Presidio",
      "Golden Gate Bridge",
    ],
    scoreBreakdown: {
      scenic: 0.68,
      safety: 0.82,
      duration: 0.91,
      quiet: 0.55,
    },
  },
  {
    id: "3",
    title: "Fastest Route",
    score: 0.61,
    duration: "29 min",
    distance: "22.8 mi",
    detour: "0%",
    tags: ["highways", "direct", "minimal stops"],
    description: "Most direct path with highway segments",
    waypoints: ["US-101 N", "I-80 W", "Richmond Bridge"],
    scoreBreakdown: {
      scenic: 0.35,
      safety: 0.78,
      duration: 0.95,
      quiet: 0.35,
    },
  },
];

const intentChips = [
  {
    id: "scenic",
    label: "Scenic",
    icon: Mountain,
    active: true,
  },
  { id: "quiet", label: "Quiet", icon: Trees, active: true },
  {
    id: "avoid-highways",
    label: "Avoid Highways",
    icon: Car,
    active: true,
  },
  {
    id: "coastal",
    label: "Coastal",
    icon: Navigation,
    active: false,
  },
  {
    id: "historic",
    label: "Historic",
    icon: Award,
    active: false,
  },
  {
    id: "short-detour",
    label: "Short Detour",
    icon: Route,
    active: false,
  },
];

export function NaturalSearchFlow({
  searchQuery,
  isNaturalSearch,
  isEnhancedMode,
  onDirectionsResult,
  onRouteIndexChange,
}: NaturalSearchFlowProps) {
  const [currentStep, setCurrentStep] =
    useState<FlowStep>("search");
  const [selectedRoute, setSelectedRoute] = useState<
    string | null
  >(null);
  const [startLocation, setStartLocation] = useState(
    "Current Location",
  );
  const [destination, setDestination] = useState("");
  const [activeChips, setActiveChips] = useState(intentChips);
  const [processingText, setProcessingText] = useState("");
  const [showIntentEditor, setShowIntentEditor] =
    useState(false);
  const [error, setError] = useState<string | null>(null);
  const [directionsData, setDirectionsData] = useState<google.maps.DirectionsResult | null>(null);
  const [previousQuery, setPreviousQuery] = useState("");
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [backendRoutes, setBackendRoutes] = useState<BackendRoute[]>([]);
  const [isLoadingEnhanced, setIsLoadingEnhanced] = useState(false);
  const [expandedWaypoints, setExpandedWaypoints] = useState<Set<number>>(new Set());

  // Detect new query and reset flow
  useEffect(() => {
    if (searchQuery && searchQuery !== previousQuery && currentStep !== "search") {
      // User entered a new query, reset everything
      setCurrentStep("search");
      setDirectionsData(null);
      onDirectionsResult(null);
      setError(null);
      setSelectedRoute(null);
      setSelectedRouteIndex(0);
      onRouteIndexChange(0);
      setPreviousQuery(searchQuery);
    }
  }, [searchQuery, previousQuery, currentStep, onDirectionsResult, onRouteIndexChange]);

  // Auto-progress through processing when search is submitted
  useEffect(() => {
    if (searchQuery && currentStep === "search") {
      setPreviousQuery(searchQuery);
      setCurrentStep("processing");
      setProcessingText("Processing request with AI...");
      setError(null);

      // Process query based on mode
      const processQuery = async () => {
        try {
          if (isEnhancedMode) {
            // ENHANCED MODE: Use full backend pipeline
            setProcessingText("Analyzing with AI (this may take 10-30 seconds)...");
            setIsLoadingEnhanced(true);
            
            console.log('Calling backend API with query:', searchQuery);
            const backendResponse = await generateRoutesFromBackend({
              user_prompt: searchQuery,
              max_results: 3
            });
            
            console.log('Backend response received:', {
              routeCount: backendResponse.routes?.length || 0,
              hasMetadata: !!backendResponse.metadata,
              processingTime: backendResponse.processing_time_seconds
            });
            
            if (!backendResponse.routes || backendResponse.routes.length === 0) {
              const waypointsFound = backendResponse.metadata?.waypoints_found || 0;
              if (waypointsFound === 0) {
                throw new Error('No scenic waypoints found. Try adding preferences like "scenic", "parks", "quiet", or "coastal" to your search.');
              }
              throw new Error('Backend returned no routes. Try a different query.');
            }
            
            setBackendRoutes(backendResponse.routes);
            
            // Convert backend routes to Google Maps directions for map display
            if (backendResponse.routes.length > 0) {
              try {
                const directionsResult = await convertBackendRouteToDirections(backendResponse.routes[0]);
                setDirectionsData(directionsResult);
                onDirectionsResult(directionsResult);
              } catch (error) {
                console.error("Failed to convert backend route to directions:", error);
              }
            }
            
            // Extract origin/dest from backend metadata
            console.log('Backend metadata:', {
              origin_text: backendResponse.metadata?.origin_text,
              destination_text: backendResponse.metadata?.destination_text
            });
            
            if (backendResponse.metadata?.origin_text && backendResponse.metadata?.destination_text) {
              console.log('Using metadata text for locations');
              setStartLocation(backendResponse.metadata.origin_text);
              setDestination(backendResponse.metadata.destination_text);
            } else if (backendResponse.routes && backendResponse.routes[0]) {
              // Try to extract location names from the original query
              console.log('Metadata text not available, trying to extract from query');
              const query = searchQuery.toLowerCase();
              
              // Try to parse "from X to Y" pattern
              const fromMatch = query.match(/from\s+([^to]+?)(?:\s+to\s+|\s+san\s+francisco)/i);
              const toMatch = query.match(/to\s+([^,\s]+(?:\s+[^,\s]+)*?)(?:\s+san\s+francisco|$)/i);
              
              if (fromMatch && toMatch) {
                setStartLocation(fromMatch[1].trim());
                setDestination(toMatch[1].trim());
              } else {
                // Final fallback: use "Origin" and "Destination" instead of coordinates
                setStartLocation('Origin');
                setDestination('Destination');
              }
            }
            
            setProcessingText(
              `Found ${backendResponse.routes.length} AI-curated routes! ` +
              `(${backendResponse.metadata.waypoints_found} scenic waypoints discovered)`
            );
            
            setIsLoadingEnhanced(false);
            setTimeout(() => {
              setCurrentStep("thinking");
            }, 1000);
            
          } else {
            // QUICK MODE: Current OpenAI + Google Maps flow
            setProcessingText("Understanding your request...");
            const extraction = await extractRouteFromQuery(searchQuery);
            
            setStartLocation(extraction.origin);
            setDestination(extraction.destination);
            
            setProcessingText(`Finding routes from ${extraction.origin} to ${extraction.destination}...`);
            
            // Step 2: Get route directions from Google Maps
            const directions = await getRouteAlternatives(
              extraction.origin,
              extraction.destination
            );
            
            if (directions) {
              setDirectionsData(directions);
              onDirectionsResult(directions);
              setProcessingText("Routes found! Analyzing options...");
              
              // Move to thinking step
              setTimeout(() => {
                setCurrentStep("thinking");
              }, 1000);
            } else {
              setError("No routes found");
              setCurrentStep("search");
            }
          }
          
        } catch (err) {
          console.error("Error processing query:", err);
          setError(err instanceof Error ? err.message : "Failed to process request");
          setProcessingText("Error processing request. Please try again.");
          setIsLoadingEnhanced(false);
          setTimeout(() => {
            setCurrentStep("search");
          }, 3000);
        }
      };

      processQuery();
    }
  }, [searchQuery, currentStep, onDirectionsResult]);

  const toggleChip = (chipId: string) => {
    setActiveChips((chips) =>
      chips.map((chip) =>
        chip.id === chipId
          ? { ...chip, active: !chip.active }
          : chip,
      ),
    );
  };

  const toggleWaypointExpansion = (index: number) => {
    setExpandedWaypoints(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleRouteSelect = async (routeId: string) => {
    // routeId is 1-indexed from backend, convert to 0-indexed for array access
    const arrayIndex = parseInt(routeId) - 1;
    setSelectedRoute(routeId);
    setSelectedRouteIndex(arrayIndex);
    onRouteIndexChange(arrayIndex);
    setCurrentStep("detail");
    
    // Convert selected backend route to Google Maps directions for map display
    if (isEnhancedMode && backendRoutes.length > 0) {
      if (backendRoutes[arrayIndex]) {
        try {
          const directionsResult = await convertBackendRouteToDirections(backendRoutes[arrayIndex]);
          setDirectionsData(directionsResult);
          onDirectionsResult(directionsResult);
        } catch (error) {
          console.error("Failed to convert selected backend route to directions:", error);
        }
      }
    }
  };

  // Handle manual route regeneration when user edits origin/destination
  const handleRegenerateRoutes = async () => {
    if (!startLocation.trim() || !destination.trim()) {
      setError("Please enter both starting point and destination");
      return;
    }

    setIsRegenerating(true);
    setError(null);

    try {
      // Get new route directions from Google Maps
      const directions = await getRouteAlternatives(
        startLocation,
        destination
      );

      if (directions) {
        setDirectionsData(directions);
        onDirectionsResult(directions);
        setSelectedRouteIndex(0);
        onRouteIndexChange(0);
      } else {
        setError("No routes found between these locations");
      }
    } catch (err) {
      console.error("Error regenerating routes:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to generate routes";
      
      // Provide more helpful error messages
      if (errorMessage.includes("NOT_FOUND")) {
        setError("Location not found. Please use more specific addresses (e.g., 'Blue Bottle Coffee, Ferry Building, San Francisco, CA' instead of just 'blue bottle coffee')");
      } else if (errorMessage.includes("ZERO_RESULTS")) {
        setError("No routes found between these locations. Try different addresses.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsRegenerating(false);
    }
  };

  // Convert backend routes to UI format
  const convertBackendRoutesToUI = (): RouteOption[] => {
    if (!backendRoutes || !backendRoutes.length) return [];
    
    // Calculate shortest route distance for detour calculation
    const shortestDistance = Math.min(...backendRoutes.map(r => r.distance_m || 0));
    
    return backendRoutes.map((route, index) => {
      // Calculate detour percentage
      const detourPct = ((route.distance_m - shortestDistance) / shortestDistance * 100).toFixed(0);
      const detourText = detourPct === "0" ? "0%" : `+${detourPct}%`;
      
      // Parse waypoint names from backend (with safety check)
      const waypointNames = (route.waypoints || []).map(wp => wp.name);
      
      // Convert OSM tags to user-friendly labels (with safety check)
      const friendlyFeatures = (route.features || []).map(tag => {
        const [key, value] = tag.split('=');
        switch(key) {
          case 'leisure': return value === 'park' ? 'Parks' : value;
          case 'tourism': return value === 'attraction' ? 'Attractions' : value;
          case 'amenity': return value === 'cafe' ? 'Cafes' : value;
          case 'natural': return 'Natural areas';
          default: return tag; // Use the tag as-is if not recognized
        }
      });
      
      // Create descriptive title based on route characteristics
      const createRouteTitle = () => {
        if (waypointNames.length === 0) {
          return index === 0 ? "Direct Route" : `Alternative ${index + 1}`;
        }
        
        // Use a more intelligent naming based on score and waypoints
        if (index === 0) {
          return "Most Scenic";
        } else if (index === 1) {
          return "Balanced Route";
        } else {
          return `Alternative ${index + 1}`;
        }
      };
      
      return {
        id: route.id || String(index + 1),
        title: createRouteTitle(),
        score: route.score || 0,
        duration: `${Math.round((route.duration_s || 0) / 60)} min`,
        distance: `${((route.distance_m || 0) / 1609).toFixed(1)} mi`,
        detour: detourText,
        tags: friendlyFeatures,
        description: route.why || "AI-generated scenic route",
        waypoints: waypointNames,
        mapLinks: route.links || {},
        // Use actual backend scoring data (with safety checks)
        scoreBreakdown: {
          scenic: Math.min(route.scores?.clip || 0, 1.0),
          safety: Math.min(route.scores?.preference || 0, 1.0),
          duration: Math.min(route.scores?.efficiency || 0, 1.0),
          quiet: Math.min((route.scores?.clip || 0) * 0.8, 1.0),
        },
        // Add backend-specific data
        backendData: {
          rawScore: route.score || 0,
          waypointCount: (route.waypoints || []).length,
          features: route.features || [],
          coordinates: route.coordinates || {
            origin: { lat: 0, lng: 0 },
            destination: { lat: 0, lng: 0 },
            waypoints: []
          }
        }
      };
    });
  };

  // Convert Google Directions routes to RouteOption format
  const convertDirectionsToRoutes = (): RouteOption[] => {
    console.log('convertDirectionsToRoutes called:', {
      isEnhancedMode,
      backendRoutesCount: backendRoutes?.length || 0,
      hasDirectionsData: !!directionsData
    });
    
    // Use backend routes if in enhanced mode
    if (isEnhancedMode && backendRoutes.length > 0) {
      console.log('Using backend routes:', backendRoutes.length);
      return convertBackendRoutesToUI();
    }
    
    console.log('Falling back to mock/directions data');
    if (!directionsData?.routes) return routeOptions; // Fallback to mock data

    return directionsData.routes.map((route, index) => {
      const leg = route.legs[0];
      return {
        id: index.toString(),
        title: index === 0 ? "Recommended Route" : `Alternative ${index}`,
        score: 0.85 - (index * 0.1), // Simple scoring for now
        duration: leg.duration?.text || "Unknown",
        distance: leg.distance?.text || "Unknown",
        detour: index === 0 ? "0%" : "+5%", // Simplified
        tags: route.summary ? [route.summary] : ["via highways"],
        description: `Route via ${route.summary || 'main roads'}`,
        waypoints: route.legs.flatMap(l => l.via_waypoints?.map((w: google.maps.LatLng) => w.toString() || '') || []),
        scoreBreakdown: {
          scenic: 0.8,
          safety: 0.85,
          duration: 0.9 - (index * 0.1),
          quiet: 0.7,
        },
      };
    });
  };

  const renderSearchEntry = () => (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          Natural Search
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Describe what you want to find — not just a place or
          address.
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Input
            placeholder="Scenic drive through parks to the coast"
            className="h-12 text-base"
            value={searchQuery}
            readOnly
          />
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p className="font-medium text-orange-600">
            💡 Tip: Include preferences like "scenic", "parks", "quiet", "coastal" for better results
          </p>
          <p>
            Try: "Scenic route with parks from union square to chinatown"
          </p>
          <p>Try: "Quiet route avoiding highways to golden gate bridge"</p>
          <p>Try: "Coastal drive with ocean views to marin"</p>
        </div>

        <Button
          className="w-full bg-[#1A73E8] hover:bg-[#1557B0] text-white"
          size="lg"
          onClick={() =>
            searchQuery && setCurrentStep("processing")
          }
          disabled={!searchQuery}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Route Ideas
        </Button>
      </div>
    </div>
  );

  const renderProcessingBanner = () => (
    <div className="p-6">
      <div className={`border rounded-lg p-4 ${error ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
        <div className="flex items-start gap-3">
          {!error && (
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <h3 className={`font-medium ${error ? 'text-red-900' : 'text-blue-900'}`}>
              {error ? 'Error' : 'Processing with AI'}
            </h3>
            <p className={`text-sm mt-1 ${error ? 'text-red-700' : 'text-blue-700'}`}>
              {error || processingText}
            </p>
            {!error && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 bg-blue-200 rounded-full h-1">
                  <div className="bg-blue-600 h-1 rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Handle thinking step timer
  useEffect(() => {
    if (currentStep === "thinking") {
      const timer = setTimeout(() => {
        setCurrentStep("routes");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const renderThinkingStep = () => {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1A73E8] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Analyzing Your Request
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Understanding your preferences and finding the best
            routes...
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">
              What I understood:
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Origin: {startLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Destination: {destination}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>
                  Preferences: {activeChips
                    .filter(chip => chip.active)
                    .map(chip => chip.label)
                    .join(', ') || 'None specified'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span>Calculating optimal routes...</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1A73E8]/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#1A73E8]" />
              <span className="font-medium text-[#1A73E8]">
                AI Route Intelligence
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Analyzing thousands of route combinations to find
              paths that match your scenic and quiet street
              preferences while avoiding major highways.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderRoutesWithConfirmation = () => (
    <div className="p-4 space-y-4">
      {/* Material 3 - Location inputs with subtle background */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1A73E8]"></div>
              </div>
              <input
                type="text"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                className="flex-1 text-sm bg-transparent border-0 focus:outline-none text-gray-900 placeholder-gray-500"
                placeholder="Choose starting point"
                disabled={isRegenerating}
              />
            </div>
            <div className="ml-2 border-l-2 border-gray-300 h-4"></div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#EA4335]" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="flex-1 text-sm bg-transparent border-0 focus:outline-none text-gray-900 placeholder-gray-500"
                placeholder="Choose destination"
                disabled={isRegenerating}
              />
            </div>
          </div>
          
          {/* Helpful hint */}
          <div className="px-1">
            <p className="text-xs text-gray-500">
              💡 Tip: Use specific addresses or landmarks with city names
            </p>
          </div>
          
          {/* Update Routes Button */}
          <button
            onClick={handleRegenerateRoutes}
            disabled={isRegenerating || !startLocation.trim() || !destination.trim()}
            className="w-full bg-[#1A73E8] hover:bg-[#1557B0] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isRegenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating Routes...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Update Routes</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Material 3 - Chips for preferences */}
      <div className="flex flex-wrap gap-2">
        {activeChips.filter(chip => chip.active).map((chip) => {
          const Icon = chip.icon;
          return (
            <div
              key={chip.id}
              className="inline-flex items-center gap-1.5 bg-[#E8F0FE] text-[#1A73E8] rounded-full px-3 py-1.5 text-xs font-medium"
            >
              <Icon className="w-3 h-3" />
              {chip.label}
            </div>
          );
        })}
        <button
          onClick={() => setShowIntentEditor(true)}
          className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 rounded-full px-3 py-1.5 text-xs font-medium hover:bg-gray-200 transition-colors"
        >
          <Settings className="w-3 h-3" />
          Adjust
        </button>
      </div>

      {/* Material 3 - Filter tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        <button className="px-4 py-2 text-sm font-medium text-[#1A73E8] border-b-2 border-[#1A73E8]">
          Recommended
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
          Most scenic
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
          Fastest
        </button>
      </div>

      {/* Material 3 - Route cards */}
      <div className="space-y-2">
        {convertDirectionsToRoutes().map((route) => (
          <div
            key={route.id}
            onClick={() => handleRouteSelect(route.id)}
            className={`bg-white border rounded-lg p-4 transition-shadow cursor-pointer ${
              selectedRoute === route.id
                ? 'border-blue-500 border-2 shadow-lg'
                : 'border-gray-200 hover:shadow-md'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">
                  {route.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{route.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Route className="w-4 h-4" />
                    <span>{route.distance}</span>
                  </div>
                  {route.backendData && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>Score: {route.backendData.rawScore.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {route.detour !== "0%" && (
                  <span className="text-xs text-gray-500">
                    {route.detour} longer
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* AI Route Description - Show the "why" prominently */}
            <div className="mb-3">
              <p className="text-sm text-gray-600 font-medium">
                {route.description}
              </p>
              {route.backendData && route.backendData.waypointCount > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {route.backendData.waypointCount} waypoint{route.backendData.waypointCount !== 1 ? 's' : ''} included
                </p>
              )}
            </div>

            {/* Features/Tags as Material 3 chips */}
            <div className="flex flex-wrap gap-1.5">
              {(route.tags || []).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-50 text-blue-700 rounded px-2 py-0.5 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Score indicator */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Match score
                </span>
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.round((route.score > 1 ? route.score / 100 : route.score) * 5)
                            ? "fill-[#FBBC04] text-[#FBBC04]"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-gray-700 ml-1">
                    {(route.score > 1 ? route.score / 10 : route.score * 10).toFixed(1)}/10
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Material 3 - Bottom action */}
      <div className="pt-2">
        <button className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Show more options
        </button>
      </div>
    </div>
  );

  const renderRouteDetail = () => {
    const routes = convertDirectionsToRoutes();
    const route = routes.find(r => r.id === selectedRoute);
    if (!route) return null;

    return (
      <div className="flex flex-col h-full">
        {/* Header with back button */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setCurrentStep('routes')}
            className="flex items-center gap-2 text-[#1A73E8] hover:bg-blue-50 rounded-lg px-2 py-1 -ml-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm font-medium">Back to routes</span>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Route title and stats */}
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              {route.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{route.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Route className="w-4 h-4" />
                <span>{route.distance}</span>
              </div>
              {route.detour !== "0%" && (
                <span className="text-xs bg-gray-100 text-gray-700 rounded px-2 py-1">
                  {route.detour} longer
                </span>
              )}
            </div>
          </div>

          <Separator />

          {/* Why this route? - Clean description only */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Why this route?
            </h3>
            <p className="text-sm text-gray-600">
              {route.backendData && route.backendData.waypointCount > 0 ? 
                `This route takes you through ${route.backendData.waypointCount} scenic stop${route.backendData.waypointCount !== 1 ? 's' : ''} including ${(route.backendData.features || []).map(f => f.includes('leisure=park') ? 'parks' : f.includes('tourism=attraction') ? 'attractions' : f).join(', ')}.` :
                route.description?.replace('Route via ', 'This route passes through ').replace('leisure=park', 'parks').replace('way ', 'park area ') || 'AI-generated scenic route'
              }
            </p>
          </div>

          {/* Key waypoints - Minimal display */}
          {route.waypoints && route.waypoints.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">
                Key waypoints ({route.waypoints.length})
              </h3>
              <div className="space-y-2">
                {route.waypoints.map((waypoint, index) => {
                  const formatWaypointName = (name: string) => {
                    // If the name is already user-friendly (doesn't contain OSM tags), use it as-is
                    if (!name.includes('=') && !name.includes('way ') && !name.includes('node ')) {
                      return name;
                    }
                    
                    // Fallback for OSM-style names
                    if (name.includes('leisure=park')) {
                      return 'Park';
                    } else if (name.includes('tourism=attraction')) {
                      return 'Attraction';
                    } else if (name.includes('way ') || name.includes('node ')) {
                      return 'Scenic Area';
                    } else {
                      return name;
                    }
                  };
                  
                  const isExpanded = expandedWaypoints.has(index);
                  
                  return (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg"
                    >
                      <button
                        onClick={() => toggleWaypointExpansion(index)}
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {formatWaypointName(waypoint)}
                          </span>
                        </div>
                        <ChevronRight 
                          className={`w-4 h-4 text-gray-400 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`} 
                        />
                      </button>
                      
                      {isExpanded && (
                        <div className="px-3 pb-3 border-t border-gray-100">
                          <div className="pt-3 space-y-2">
                            <div className="text-xs text-gray-500">
                              {waypoint}
                            </div>
                            {route.backendData && route.backendData.coordinates?.waypoints?.[index] && (
                              <div className="text-xs text-gray-400">
                                📍 {route.backendData.coordinates.waypoints[index].lat.toFixed(4)}, {route.backendData.coordinates.waypoints[index].lng.toFixed(4)}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Map Links */}
          {route.mapLinks && (route.mapLinks.google || route.mapLinks.apple) && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">
                Open in Maps
              </h3>
              <div className="flex gap-2">
                {route.mapLinks.google && (
                  <a
                    href={route.mapLinks.google}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    Google Maps
                  </a>
                )}
                {route.mapLinks.apple && (
                  <a
                    href={route.mapLinks.apple}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Apple Maps
                  </a>
                )}
              </div>
            </div>
          )}

          {/* AI Score - Single display at bottom */}
          {route.backendData && route.backendData.rawScore !== undefined && (
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-green-600" />
                <span className="text-lg font-bold text-green-900">
                  AI Score: {route.backendData.rawScore.toFixed(1)}/100
                </span>
              </div>
              <p className="text-sm text-green-700">
                Based on waypoint relevance, route efficiency, and scenic value
              </p>
            </div>
          )}

          {/* Tags */}
          {route.tags && route.tags.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Features
              </h3>
              <div className="flex flex-wrap gap-2">
                {route.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center bg-[#E8F0FE] text-[#1A73E8] rounded-full px-3 py-1.5 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fixed bottom actions - Material 3 style */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            className="w-full bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-lg px-4 py-3 font-medium transition-colors"
            onClick={() => setCurrentStep("navigation")}
          >
            <div className="flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              Start navigation
            </div>
          </button>
          <div className="flex gap-2">
            <button className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium transition-colors">
              <div className="flex items-center justify-center gap-2">
                <Share className="w-4 h-4" />
                Share
              </div>
            </button>
            <button className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium transition-colors">
              <div className="flex items-center justify-center gap-2">
                <Heart className="w-4 h-4" />
                Save
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderNavigation = () => (
    <div className="p-6 text-center space-y-4">
      <div className="w-16 h-16 bg-[#1A73E8] rounded-full flex items-center justify-center mx-auto">
        <Play className="w-8 h-8 text-white" />
      </div>
      <div>
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          Navigation Started
        </h2>
        <p className="text-sm text-gray-600">
          Follow the route on the map. Turn-by-turn directions
          will guide you.
        </p>
      </div>
      <Button
        variant="outline"
        onClick={() => setCurrentStep("detail")}
        className="w-full"
      >
        View Route Details
      </Button>
    </div>
  );

  return (
    <>
      {currentStep === "search" && renderSearchEntry()}
      {currentStep === "processing" && renderProcessingBanner()}
      {currentStep === "thinking" && renderThinkingStep()}
      {currentStep === "routes" && renderRoutesWithConfirmation()}
      {currentStep === "detail" && renderRouteDetail()}
      {currentStep === "navigation" && renderNavigation()}

      {showIntentEditor && (
        <IntentEditor
          chips={activeChips}
          onToggleChip={toggleChip}
          onClose={() => setShowIntentEditor(false)}
        />
      )}
    </>
  );
}
