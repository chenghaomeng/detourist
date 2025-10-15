import { Mountain, Waves, TreePine, Building2, Navigation, Clock, MapPin, Sparkles } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface SemanticPathPanelProps {
  searchQuery: string;
  isSemanticMode: boolean;
}

const semanticInterpretations = [
  {
    keywords: ['ocean', 'coastal', 'beach', 'waterfront'],
    icon: Waves,
    title: "Coastal Path",
    description: "Route following waterfront and coastal areas",
    features: ["Ocean views", "Beach access", "Scenic overlooks"],
    color: "blue",
    estimated: "35 min",
    distance: "22 mi"
  },
  {
    keywords: ['mountain', 'hills', 'scenic', 'overlook'],
    icon: Mountain,
    title: "Mountain Route",
    description: "Elevated paths with scenic mountain views",
    features: ["Mountain vistas", "Photo spots", "Hiking trails"],
    color: "green",
    estimated: "48 min",
    distance: "31 mi"
  },
  {
    keywords: ['forest', 'park', 'nature', 'trees'],
    icon: TreePine,
    title: "Forest Trail",
    description: "Natural pathways through forested areas",
    features: ["Tree canopy", "Wildlife", "Peaceful routes"],
    color: "emerald",
    estimated: "40 min",
    distance: "26 mi"
  },
  {
    keywords: ['downtown', 'city', 'urban', 'direct'],
    icon: Building2,
    title: "Urban Route",
    description: "Efficient city paths to downtown areas",
    features: ["Direct route", "Urban views", "Landmarks"],
    color: "orange",
    estimated: "25 min",
    distance: "18 mi"
  }
];

function getMatchingInterpretation(query: string) {
  const lowerQuery = query.toLowerCase();
  return semanticInterpretations.find(interpretation =>
    interpretation.keywords.some(keyword => lowerQuery.includes(keyword))
  );
}

export function SemanticPathPanel({ searchQuery, isSemanticMode }: SemanticPathPanelProps) {
  if (!isSemanticMode || !searchQuery) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Semantic Search</h3>
          <p className="text-sm text-gray-600 mb-4">
            Describe your ideal route and let AI find the perfect path
          </p>
          <div className="space-y-2 text-xs text-gray-500">
            <p>Try: "scenic route to downtown"</p>
            <p>Try: "path along the ocean"</p>
            <p>Try: "quiet forest trail home"</p>
          </div>
        </div>
      </div>
    );
  }

  const interpretation = getMatchingInterpretation(searchQuery);

  return (
    <div className="p-4 space-y-4">
      {/* Query interpretation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">Interpreting your search:</p>
            <p className="text-sm text-blue-700 italic">"{searchQuery}"</p>
          </div>
        </div>
      </div>

      {interpretation ? (
        <Card className="p-4 border-l-4 border-l-blue-400">
          <div className="flex items-start gap-3">
            <div className={`p-2 bg-${interpretation.color}-100 rounded-lg`}>
              <interpretation.icon className={`h-5 w-5 text-${interpretation.color}-600`} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-900">{interpretation.title}</h4>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                  AI Generated
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{interpretation.description}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{interpretation.estimated}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Navigation className="h-3 w-3" />
                  <span>{interpretation.distance}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {interpretation.features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>

              <button className="w-full bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Generate Route
              </button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-4 border-dashed border-gray-300">
          <div className="text-center">
            <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900 mb-1">Analyzing your request...</p>
            <p className="text-xs text-gray-600">
              AI is interpreting "{searchQuery}" to find the best route type
            </p>
          </div>
        </Card>
      )}

      {/* Semantic features */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900">How semantic search works:</h4>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>Analyzes natural language descriptions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Matches preferences to route characteristics</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            <span>Generates paths optimized for your desired experience</span>
          </div>
        </div>
      </div>
    </div>
  );
}