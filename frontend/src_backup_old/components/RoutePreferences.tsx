import { Settings2, Mountain, Waves, TreePine, Building2, Clock, Fuel, Navigation } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { useState } from "react";

export function RoutePreferences() {
  const [preferences, setPreferences] = useState({
    prioritizeScenery: true,
    avoidHighways: false,
    includeParks: true,
    allowTolls: false,
    scenicImportance: [75]
  });

  const scenicTypes = [
    { icon: Waves, label: "Coastal", active: true, color: "blue" },
    { icon: Mountain, label: "Mountain", active: true, color: "green" },
    { icon: TreePine, label: "Forest", active: false, color: "emerald" },
    { icon: Building2, label: "Historic", active: false, color: "amber" }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Settings2 className="h-4 w-4 text-gray-600" />
        <h3 className="font-medium text-gray-900">Route Preferences</h3>
        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 text-xs">
          Smart routing
        </Badge>
      </div>

      {/* Scenic Types */}
      <Card className="p-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Preferred scenery</h4>
        <div className="grid grid-cols-2 gap-2">
          {scenicTypes.map((type, index) => (
            <button
              key={index}
              className={`flex items-center gap-2 p-2 rounded-lg border text-sm transition-colors ${
                type.active 
                  ? `bg-${type.color}-50 border-${type.color}-200 text-${type.color}-700` 
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <type.icon className="h-4 w-4" />
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Route Options */}
      <Card className="p-3">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Route options</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mountain className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-700">Prioritize scenic routes</span>
            </div>
            <Switch 
              checked={preferences.prioritizeScenery}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, prioritizeScenery: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-700">Avoid highways</span>
            </div>
            <Switch 
              checked={preferences.avoidHighways}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, avoidHighways: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TreePine className="h-4 w-4 text-emerald-600" />
              <span className="text-sm text-gray-700">Include parks & trails</span>
            </div>
            <Switch 
              checked={preferences.includeParks}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, includeParks: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fuel className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-gray-700">Allow toll roads</span>
            </div>
            <Switch 
              checked={preferences.allowTolls}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, allowTolls: checked }))
              }
            />
          </div>
        </div>
      </Card>

      {/* Scenic Importance Slider */}
      <Card className="p-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Scenic importance</h4>
        <div className="space-y-2">
          <Slider
            value={preferences.scenicImportance}
            onValueChange={(value) => 
              setPreferences(prev => ({ ...prev, scenicImportance: value }))
            }
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Fast route</span>
            <span className="font-medium text-green-600">{preferences.scenicImportance[0]}% scenic</span>
            <span>Most scenic</span>
          </div>
        </div>
      </Card>

      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm text-green-800">
          🌟 Your preferences will influence route suggestions and semantic search results.
        </p>
      </div>
    </div>
  );
}