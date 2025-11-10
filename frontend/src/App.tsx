import { SemanticSearchBar } from "./components/SemanticSearchBar";
import { SemanticMapView } from "./components/SemanticMapView";
import { NaturalSearchFlow } from "./components/NaturalSearchFlow";
import { LeftSidebar } from "./components/LeftSidebar";
import { useState } from "react";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState(""); // Only updates on submit
  const [isNaturalSearch, setIsNaturalSearch] = useState(true);
  const [isEnhancedMode, setIsEnhancedMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [directionsResult, setDirectionsResult] = useState<google.maps.DirectionsResult | null>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      setSubmittedQuery(query); // Trigger the actual query processing
      setIsSidebarOpen(true);
    }
  };

  const handleNaturalSearchToggle = () => {
    setIsNaturalSearch(!isNaturalSearch);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div 
      className="bg-white relative w-full h-screen overflow-hidden" 
      data-name="Natural Search Maps App"
      style={{ minHeight: '100vh' }}
    >
      {/* Left Sidebar */}
      <LeftSidebar onMenuClick={toggleSidebar} />

      {/* Map View */}
      <SemanticMapView 
        searchQuery={searchQuery} 
        isNaturalSearch={isNaturalSearch}
        directionsResult={directionsResult}
        selectedRouteIndex={selectedRouteIndex}
      />
      
      {/* Search Bar Overlay */}
      <div className={`absolute box-border flex flex-col gap-[10px] items-start py-[28px] top-0 transition-all duration-300 z-10 ${
        isSidebarOpen ? 'left-[534px] w-[calc(100%-534px-24px)] px-[24px]' : 'left-[96px] w-[calc(100%-96px-24px)] px-0'
      }`}>
        <SemanticSearchBar 
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          isNaturalSearch={isNaturalSearch}
          onNaturalSearchToggle={handleNaturalSearchToggle}
          isEnhancedMode={isEnhancedMode}
          onEnhancedModeToggle={() => setIsEnhancedMode(!isEnhancedMode)}
        />
      </div>

      {/* Sidebar Panel */}
      <div className={`absolute bg-white h-full left-[72px] top-0 w-[462px] transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`} data-name="Container">
        <div className="box-border content-stretch flex flex-col h-full items-start overflow-clip pl-0 pr-px py-0 relative rounded-[inherit] w-[462px]">
          {/* Header */}
          <div className="h-[69px] relative shrink-0 w-[461px]" data-name="Container">
            <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-gray-200 border-solid inset-0 pointer-events-none" />
            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[69px] items-center justify-between pb-px pt-0 px-[16px] relative w-[461px]">
              <div className="h-[44px] relative shrink-0 w-[253.875px]" data-name="Container">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[44px] items-start relative w-[253.875px]">
                  <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 1">
                    <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[28px] left-0 not-italic text-[#101828] text-[18px] text-nowrap top-0 tracking-[-0.4395px] whitespace-pre">Natural Search Routing</p>
                  </div>
                  <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
                    <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] text-nowrap top-px whitespace-pre">Describe your drive, not just your destination</p>
                  </div>
                </div>
              </div>
              <button
                onClick={toggleSidebar}
                className="relative rounded-[1.67772e+07px] shrink-0 size-[32px] hover:bg-gray-100 transition-colors"
                data-name="Button"
              >
                <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start pb-0 pt-[8px] px-[8px] relative size-[32px]">
                  <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
                    <div className="absolute inset-1/4" data-name="Vector">
                      <div className="absolute inset-[-8.33%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
                          <path d="M1 9L9 1M1 1L9 9" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[461px]" data-name="Container">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-full items-start overflow-y-auto relative rounded-[inherit] w-[461px]">
              <NaturalSearchFlow 
                searchQuery={submittedQuery}
                isNaturalSearch={isNaturalSearch}
                isEnhancedMode={isEnhancedMode}
                onDirectionsResult={setDirectionsResult}
                onRouteIndexChange={setSelectedRouteIndex}
              />
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-gray-200 border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}