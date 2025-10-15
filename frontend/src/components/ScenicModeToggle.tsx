import { Mountain, Map } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";

export function ScenicModeToggle() {
  const [isScenic, setIsScenic] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Mountain className="h-5 w-5 text-green-600" />
          <span className="font-medium">Scenic Mode</span>
          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
            New
          </Badge>
        </div>
        <Button
          variant={isScenic ? "default" : "outline"}
          size="sm"
          onClick={() => setIsScenic(!isScenic)}
          className={isScenic ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {isScenic ? (
            <>
              <Mountain className="mr-2 h-4 w-4" />
              Scenic
            </>
          ) : (
            <>
              <Map className="mr-2 h-4 w-4" />
              Standard
            </>
          )}
        </Button>
      </div>
      {isScenic && (
        <p className="text-sm text-gray-600 mt-2">
          Prioritizing scenic routes with beautiful landscapes and points of interest
        </p>
      )}
    </div>
  );
}