import { Mountain, Waves, TreePine, Building2, MapPin, Clock } from "lucide-react";
import { useState } from "react";

const semanticSuggestions = [
  {
    icon: Waves,
    text: "path along the ocean",
    description: "Coastal routes with water views",
    color: "text-blue-600"
  },
  {
    icon: Mountain,
    text: "route through mountains",
    description: "Scenic mountain passes and overlooks",
    color: "text-green-600"
  },
  {
    icon: TreePine,
    text: "forest trail to downtown",
    description: "Nature paths connecting to city",
    color: "text-emerald-600"
  },
  {
    icon: Building2,
    text: "historic district walk",
    description: "Routes through historic areas",
    color: "text-amber-600"
  },
];

const recentSearches = [
  "scenic drive to Napa Valley",
  "waterfront path to Golden Gate",
  "quiet neighborhood route home"
];

interface SemanticSearchSuggestionsProps {
  searchValue: string;
  onSuggestionClick: (suggestion: string) => void;
  isVisible: boolean;
}

export function SemanticSearchSuggestions({ 
  searchValue, 
  onSuggestionClick, 
  isVisible 
}: SemanticSearchSuggestionsProps) {
  if (!isVisible) return null;

  const filteredSuggestions = semanticSuggestions.filter(
    suggestion => 
      searchValue === "" || 
      suggestion.text.toLowerCase().includes(searchValue.toLowerCase()) ||
      suggestion.description.toLowerCase().includes(searchValue.toLowerCase())
  );

  const filteredRecents = recentSearches.filter(
    search => 
      searchValue === "" || 
      search.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-96 overflow-y-auto">
      {searchValue === "" && (
        <>
          <div className="p-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Search by experience</h3>
            <div className="space-y-1">
              {semanticSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(suggestion.text)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md text-left"
                >
                  <suggestion.icon className={`h-4 w-4 ${suggestion.color}`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{suggestion.text}</p>
                    <p className="text-xs text-gray-500">{suggestion.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Recent semantic searches</h3>
            <div className="space-y-1">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(search)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md text-left"
                >
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{search}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {searchValue !== "" && (
        <div className="p-3">
          {filteredSuggestions.length > 0 && (
            <>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Suggested experiences</h3>
              <div className="space-y-1 mb-3">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => onSuggestionClick(suggestion.text)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md text-left"
                  >
                    <suggestion.icon className={`h-4 w-4 ${suggestion.color}`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{suggestion.text}</p>
                      <p className="text-xs text-gray-500">{suggestion.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {filteredRecents.length > 0 && (
            <>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Recent searches</h3>
              <div className="space-y-1">
                {filteredRecents.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => onSuggestionClick(search)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md text-left"
                  >
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{search}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {filteredSuggestions.length === 0 && filteredRecents.length === 0 && (
            <div className="flex items-center gap-3 p-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Search for "{searchValue}"</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}