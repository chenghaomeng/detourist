import svgPaths from "../imports/svg-oeduc838so";
import imgMapImage from "figma:asset/3a8b8a7d2dac090ff0ac2aaf5760732acab67c7f.png";

interface SemanticMapViewProps {
  searchQuery: string;
  isNaturalSearch: boolean;
}

function ZoomControls() {
  return (
    <div className="absolute bottom-[12px] h-[81px] right-[12px] w-[40px]" data-name="Zoom Controls">
      <div className="absolute inset-[-19.75%_-50%_-29.63%_-50%]" style={{ "--fill-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80 121">
          <g filter="url(#filter0_d_4_1561)" id="Zoom Controls">
            <path d={svgPaths.p1b69600} fill="var(--fill-0, white)" shapeRendering="crispEdges" />
            <path d={svgPaths.p35309c00} fill="var(--fill-0, #666666)" id="PLus" />
            <path d={svgPaths.pbc7b800} fill="var(--fill-0, #666666)" id="Minus" />
            <rect fill="var(--fill-0, #E6E6E6)" height="1" id="Separator" width="28.5714" x="26" y="57" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="121" id="filter0_d_4_1561" width="80" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="10" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4_1561" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_4_1561" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Pin() {
  return (
    <div className="absolute h-[30px] left-[calc(50%+0.455px)] top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%] w-[20.909px]" data-name="Pin">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 30">
        <g clipPath="url(#clip0_4_1554)" id="Pin">
          <path d={svgPaths.p14228980} fill="var(--fill-0, #B01D1D)" id="Elipse" />
          <g id="Vector">
            <path d={svgPaths.p3ddb3100} fill="var(--fill-0, #EA4335)" />
            <path d={svgPaths.p3270cb80} fill="var(--fill-0, #EA4335)" />
            <path d={svgPaths.p237ca900} fill="var(--fill-0, #EA4335)" />
            <path d={svgPaths.p25b39100} fill="var(--fill-0, #EA4335)" />
            <path d={svgPaths.p3904b100} fill="var(--fill-0, #EA4335)" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_4_1554">
            <rect fill="white" height="30" width="20.9091" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function getSemanticPath(query: string): { path: string; color: string; description: string } | null {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('ocean') || lowerQuery.includes('coastal') || lowerQuery.includes('beach')) {
    return {
      path: "M 100 200 Q 250 180 400 220 T 700 240 Q 850 250 1000 280",
      color: "#1976d2",
      description: "Coastal route with ocean views"
    };
  }
  
  if (lowerQuery.includes('mountain') || lowerQuery.includes('hills') || lowerQuery.includes('scenic')) {
    return {
      path: "M 150 350 Q 300 250 450 300 T 750 320 Q 900 330 1050 300",
      color: "#388e3c",
      description: "Scenic mountain route"
    };
  }
  
  if (lowerQuery.includes('forest') || lowerQuery.includes('park') || lowerQuery.includes('nature')) {
    return {
      path: "M 80 450 Q 200 400 350 440 T 600 460 Q 750 470 900 450",
      color: "#689f38",
      description: "Forest trail route"
    };
  }
  
  if (lowerQuery.includes('downtown') || lowerQuery.includes('city') || lowerQuery.includes('urban')) {
    return {
      path: "M 200 300 L 400 320 L 600 300 L 800 310 L 1000 300",
      color: "#f57c00",
      description: "Direct urban route"
    };
  }
  
  return null;
}

export function SemanticMapView({ searchQuery, isNaturalSearch }: SemanticMapViewProps) {
  const semanticPath = isNaturalSearch && searchQuery ? getSemanticPath(searchQuery) : null;

  return (
    <div className="absolute h-full left-0 overflow-clip top-0 w-full" data-name="Google Maps Widget">
      <div className="absolute inset-0" data-name="Map Image">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgMapImage} />
      </div>
      
      {/* Semantic route overlay */}
      {semanticPath && (
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1266 1117">
            <path
              d={semanticPath.path}
              stroke={semanticPath.color}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-lg"
              style={{
                filter: `drop-shadow(0 2px 4px ${semanticPath.color}40)`
              }}
            />
            {/* Route markers */}
            <circle cx="100" cy="200" r="8" fill={semanticPath.color} className="drop-shadow-sm" />
            <circle cx="1000" cy="280" r="8" fill={semanticPath.color} className="drop-shadow-sm" />
          </svg>
          
          {/* Route info card */}
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-w-xs">
            <div className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: semanticPath.color }}
              />
              <span className="text-sm font-medium text-gray-900">Natural Search Route</span>
            </div>
            <p className="text-xs text-gray-600 mb-2">{semanticPath.description}</p>
            <div className="flex items-center gap-1">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">AI-Generated</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Optimized</span>
            </div>
          </div>
        </div>
      )}
      

      
      <ZoomControls />
      <Pin />
    </div>
  );
}