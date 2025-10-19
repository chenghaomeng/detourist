import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { RotateCcw, Save } from "lucide-react";

interface IntentEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: RoutePreferences) => void;
}

interface RoutePreferences {
  scenic: number;
  duration: number;
  quiet: number;
  elevation: number;
  safety: number;
  maxDetour: number;
  maxGrade: number;
  maxUnpaved: number;
  avoidHighways: boolean;
  avoidTolls: boolean;
  avoidFerries: boolean;
  preferBikeLanes: boolean;
  naturalRewrite: string;
}

const defaultPreferences: RoutePreferences = {
  scenic: 0.8,
  duration: 0.4,
  quiet: 0.7,
  elevation: 0.5,
  safety: 0.9,
  maxDetour: 20,
  maxGrade: 8,
  maxUnpaved: 2,
  avoidHighways: true,
  avoidTolls: false,
  avoidFerries: false,
  preferBikeLanes: false,
  naturalRewrite: ""
};

export function IntentEditor({ isOpen, onClose, onSave }: IntentEditorProps) {
  const [preferences, setPreferences] = useState<RoutePreferences>(defaultPreferences);

  if (!isOpen) return null;

  const updatePreference = <K extends keyof RoutePreferences>(
    key: K, 
    value: RoutePreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(preferences);
    onClose();
  };

  const handleReset = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <Card className="absolute top-0 left-0 right-0 bottom-0 z-10 bg-white border-t-2 border-[#685CF4] overflow-y-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Refine Route Preferences</h3>
            <p className="text-sm text-gray-600">Adjust the priorities for your route</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        <Separator />

        {/* Priority Sliders */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Route Priorities</h4>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="scenic">Scenic Views</Label>
                <span className="text-sm text-gray-500">{Math.round(preferences.scenic * 100)}%</span>
              </div>
              <Slider
                id="scenic"
                value={[preferences.scenic]}
                onValueChange={([value]) => updatePreference('scenic', value)}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="duration">Speed Priority</Label>
                <span className="text-sm text-gray-500">{Math.round(preferences.duration * 100)}%</span>
              </div>
              <Slider
                id="duration"
                value={[preferences.duration]}
                onValueChange={([value]) => updatePreference('duration', value)}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="quiet">Quiet Streets</Label>
                <span className="text-sm text-gray-500">{Math.round(preferences.quiet * 100)}%</span>
              </div>
              <Slider
                id="quiet"
                value={[preferences.quiet]}
                onValueChange={([value]) => updatePreference('quiet', value)}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="elevation">Elevation Changes</Label>
                <span className="text-sm text-gray-500">{Math.round(preferences.elevation * 100)}%</span>
              </div>
              <Slider
                id="elevation"
                value={[preferences.elevation]}
                onValueChange={([value]) => updatePreference('elevation', value)}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="safety">Safety Priority</Label>
                <span className="text-sm text-gray-500">{Math.round(preferences.safety * 100)}%</span>
              </div>
              <Slider
                id="safety"
                value={[preferences.safety]}
                onValueChange={([value]) => updatePreference('safety', value)}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Numeric Constraints */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Route Constraints</h4>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="maxDetour">Max Detour (%)</Label>
              <Input
                id="maxDetour"
                type="number"
                value={preferences.maxDetour}
                onChange={(e) => updatePreference('maxDetour', Number(e.target.value))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="maxGrade">Max Grade (%)</Label>
              <Input
                id="maxGrade"
                type="number"
                value={preferences.maxGrade}
                onChange={(e) => updatePreference('maxGrade', Number(e.target.value))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="maxUnpaved">Max Unpaved (miles)</Label>
              <Input
                id="maxUnpaved"
                type="number"
                value={preferences.maxUnpaved}
                onChange={(e) => updatePreference('maxUnpaved', Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Avoid/Prefer Toggles */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Route Features</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="avoidHighways">Avoid Highways</Label>
              <Switch
                id="avoidHighways"
                checked={preferences.avoidHighways}
                onCheckedChange={(checked) => updatePreference('avoidHighways', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="avoidTolls">Avoid Tolls</Label>
              <Switch
                id="avoidTolls"
                checked={preferences.avoidTolls}
                onCheckedChange={(checked) => updatePreference('avoidTolls', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="avoidFerries">Avoid Ferries</Label>
              <Switch
                id="avoidFerries"
                checked={preferences.avoidFerries}
                onCheckedChange={(checked) => updatePreference('avoidFerries', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="preferBikeLanes">Prefer Bike Lanes</Label>
              <Switch
                id="preferBikeLanes"
                checked={preferences.preferBikeLanes}
                onCheckedChange={(checked) => updatePreference('preferBikeLanes', checked)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Natural Language Rewrite */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Describe Changes</h4>
          <Textarea
            placeholder="Not quite right? Describe the change you'd like..."
            value={preferences.naturalRewrite}
            onChange={(e) => updatePreference('naturalRewrite', e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex gap-3">
          <Button 
            onClick={handleSave}
            className="flex-1 bg-[#685CF4] hover:bg-[#5B50E8] text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
}