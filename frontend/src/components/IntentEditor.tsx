import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { X } from "lucide-react";

interface IntentChip {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}

interface IntentEditorProps {
  chips: IntentChip[];
  onToggleChip: (chipId: string) => void;
  onClose: () => void;
}

export function IntentEditor({ chips, onToggleChip, onClose }: IntentEditorProps) {
  return (
    <Card className="absolute top-0 left-0 right-0 bottom-0 z-10 bg-white border-t-2 border-[#685CF4] overflow-y-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Adjust Preferences</h3>
            <p className="text-sm text-gray-600">Select which features matter most for your route</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <Separator />

        {/* Preference Chips */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Route Preferences</h4>
          
          <div className="space-y-3">
            {chips.map((chip) => {
              const Icon = chip.icon;
              return (
                <div 
                  key={chip.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onToggleChip(chip.id)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">{chip.label}</span>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors ${
                    chip.active ? 'bg-[#1A73E8]' : 'bg-gray-300'
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      chip.active ? 'translate-x-7 mt-0.5' : 'translate-x-1 mt-0.5'
                    }`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex gap-3">
          <Button 
            onClick={onClose}
            className="flex-1 bg-[#1A73E8] hover:bg-[#1557B0] text-white"
          >
            Apply Changes
          </Button>
        </div>
      </div>
    </Card>
  );
}