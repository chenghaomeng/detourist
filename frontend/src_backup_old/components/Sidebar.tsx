import { Route, Clock, MapPin, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

export function Sidebar() {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Directions</h2>
        <div className="flex items-center gap-2 mt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Route className="mr-2 h-4 w-4" />
            Directions
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <MapPin className="mr-2 h-4 w-4" />
            Nearby
          </Button>
        </div>
      </div>

      {/* Recent searches */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-600 mb-3">Recent</h3>
        <div className="space-y-2">
          <Card className="p-3 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium">Central Park</p>
                <p className="text-xs text-gray-500">New York, NY</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-3 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium">Golden Gate Bridge</p>
                <p className="text-xs text-gray-500">San Francisco, CA</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Separator />

      {/* Scenic suggestions */}
      <div className="p-4 flex-1">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-medium text-gray-600">Scenic Spots Nearby</h3>
          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 text-xs">
            Scenic
          </Badge>
        </div>
        
        <div className="space-y-3">
          <Card className="p-3 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-start gap-3">
              <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Scenic Overlook Point</p>
                <p className="text-xs text-gray-500 mb-1">Mountain view • 2.3 mi</p>
                <p className="text-xs text-gray-600">Beautiful panoramic views of the valley</p>
              </div>
            </div>
          </Card>

          <Card className="p-3 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-start gap-3">
              <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Riverside Trail</p>
                <p className="text-xs text-gray-500 mb-1">Nature trail • 1.8 mi</p>
                <p className="text-xs text-gray-600">Peaceful walking path along the river</p>
              </div>
            </div>
          </Card>

          <Card className="p-3 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-start gap-3">
              <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Historic Lighthouse</p>
                <p className="text-xs text-gray-500 mb-1">Landmark • 4.1 mi</p>
                <p className="text-xs text-gray-600">Coastal views and maritime history</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}