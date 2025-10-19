import { useState } from "react";

export function MapView() {
  const [isScenic] = useState(false);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
      {/* Placeholder map with grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
          {Array.from({ length: 400 }).map((_, i) => (
            <div key={i} className="border border-gray-300" />
          ))}
        </div>
      </div>

      {/* Map features overlay */}
      <div className="absolute inset-0">
        {/* Roads */}
        <div className="absolute top-1/3 left-0 w-full h-1 bg-gray-400 transform rotate-12"></div>
        <div className="absolute top-2/3 left-0 w-full h-2 bg-gray-500 transform -rotate-6"></div>
        <div className="absolute left-1/4 top-0 w-1 h-full bg-gray-400 transform rotate-12"></div>
        
        {/* Parks/Green areas */}
        <div className="absolute top-1/4 right-1/4 w-32 h-24 bg-green-200 rounded-full opacity-60"></div>
        <div className="absolute bottom-1/3 left-1/3 w-24 h-20 bg-green-200 rounded-lg opacity-60"></div>
        
        {/* Water bodies */}
        <div className="absolute bottom-1/4 right-1/3 w-28 h-16 bg-blue-200 rounded-full opacity-60"></div>
        
        {/* Buildings */}
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-gray-600 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-600 transform translate-x-2 -translate-y-2"></div>
        <div className="absolute top-1/2 left-1/2 w-4 h-2 bg-gray-600 transform -translate-x-4 translate-y-1"></div>
      </div>

      {/* Scenic mode overlay indicators */}
      {isScenic && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
          <div className="absolute top-2/3 right-1/2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      )}

      {/* Center crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-4 h-4 border-2 border-red-500 rounded-full bg-red-500 opacity-70"></div>
      </div>
    </div>
  );
}