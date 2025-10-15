import { Mountain, Waves, TreePine, Clock, Navigation, Star, Fuel } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

const semanticRoutes = [
  {
    id: 1,
    title: "Coastal Highway Route",
    description: "Along the Pacific Coast",
    duration: "45 min",
    distance: "28 mi",
    type: "coastal",
    icon: Waves,
    highlights: ["Ocean views", "Lighthouse stops", "Beach access"],
    difficulty: "Easy",
    scenicScore: 9.2,
    traffic: "Light",
    features: ["scenic", "photo-spots", "rest-areas"]
  },
  {
    id: 2,
    title: "Mountain Pass Trail",
    description: "Through Redwood National Park",
    duration: "1h 15m",
    distance: "35 mi",
    type: "mountain",
    icon: Mountain,
    highlights: ["Towering redwoods", "Valley overlooks", "Wildlife viewing"],
    difficulty: "Moderate",
    scenicScore: 9.5,
    traffic: "Light",
    features: ["scenic", "nature", "hiking-trails"]
  },
  {
    id: 3,
    title: "Urban Forest Connector",
    description: "Via Golden Gate Park",
    duration: "32 min",
    distance: "18 mi",
    type: "forest",
    icon: TreePine,
    highlights: ["Park pathways", "Garden views", "City skyline"],
    difficulty: "Easy",
    scenicScore: 7.8,
    traffic: "Moderate",
    features: ["parks", "gardens", "bike-friendly"]
  }
];

interface RouteResultsProps {
  query: string;
}

export function RouteResults({ query }: RouteResultsProps) {
  const hasSemanticQuery = query.length > 0 && (
    query.includes('ocean') || query.includes('mountain') || query.includes('forest') ||
    query.includes('scenic') || query.includes('path') || query.includes('route')
  );

  if (!hasSemanticQuery) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Routes matching your preferences</h3>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
          Semantic search
        </Badge>
      </div>

      <div className="space-y-3">
        {semanticRoutes.map((route) => (
          <Card key={route.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-green-400">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <route.icon className="h-5 w-5 text-green-600" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900">{route.title}</h4>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs text-gray-600">{route.scenicScore}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{route.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{route.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Navigation className="h-3 w-3" />
                    <span>{route.distance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Fuel className="h-3 w-3" />
                    <span>{route.traffic} traffic</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                  {route.highlights.map((highlight, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {highlight}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {route.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    route.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    route.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {route.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          💡 <strong>Semantic search active:</strong> We're showing routes that match the experience and scenery you described in your search.
        </p>
      </div>
    </div>
  );
}