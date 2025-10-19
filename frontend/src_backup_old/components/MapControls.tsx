import { Plus, Minus, Layers, Navigation, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export function MapControls() {
  return (
    <div className="flex flex-col gap-2">
      {/* Zoom Controls */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <Button variant="ghost" size="sm" className="w-10 h-10 rounded-none border-b">
          <Plus className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="w-10 h-10 rounded-none">
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      {/* Layer Controls */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-2">
        <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
          <Layers className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation Controls */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-2">
        <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
          <Navigation className="h-4 w-4" />
        </Button>
      </div>

      {/* More Options */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-2">
        <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}