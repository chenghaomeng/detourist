import svgPaths from "../imports/svg-sijx7d9tyk";
import { useState } from "react";

interface SemanticSearchBarProps {
  onSearchChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  isNaturalSearch: boolean;
  onNaturalSearchToggle: () => void;
  isEnhancedMode: boolean;
  onEnhancedModeToggle: () => void;
}

function SparkleIcon() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_16_313)" id="Icon">
          <path d={svgPaths.p1eb12f80} fill="var(--fill-0, #1A73E8)" id="Vector" stroke="var(--stroke-0, #1A73E8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <g id="Vector_2">
            <path d="M11.6667 1.16667V3.5Z" fill="var(--fill-0, #1A73E8)" />
            <path d="M11.6667 1.16667V3.5" stroke="var(--stroke-0, #1A73E8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </g>
          <g id="Vector_3">
            <path d="M12.8333 2.33333H10.5Z" fill="var(--fill-0, #1A73E8)" />
            <path d="M12.8333 2.33333H10.5" stroke="var(--stroke-0, #1A73E8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </g>
          <path d={svgPaths.p291dcf00} fill="var(--fill-0, #1A73E8)" id="Vector_4" stroke="var(--stroke-0, #1A73E8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_16_313">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function SearchIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M14 14L11.1066 11.1067" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p107a080} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function NaturalSearchToggle({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
  const [animKey, setAnimKey] = useState(0);

  const handleClick = () => {
    setAnimKey(prev => prev + 1);
    onClick();
  };

  return (
    <button 
      className={`relative h-[26px] rounded-[1.67772e+07px] shrink-0 cursor-pointer transition-all duration-200 overflow-hidden ${
        isActive 
          ? 'bg-[#1a73e8] w-auto' 
          : 'bg-[#e8f0fe] hover:bg-[#d2e3fc] w-[34px]'
      }`}
      onClick={handleClick}
      data-name="NaturalSearchToggle"
      aria-label={isActive ? "Natural Search Active" : "Natural Search Inactive"}
    >
      <div className={`bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[6px] h-[26px] items-center py-0 relative ${
        isActive ? 'px-[10px]' : 'px-[10px] justify-center'
      }`}>
        <div className={isActive ? 'animate-[spring-spin_0.8s_cubic-bezier(0.34,1.56,0.64,1)]' : ''} key={isActive ? animKey : undefined}>
          {isActive ? (
            <div className="relative shrink-0 size-[14px]" data-name="Icon">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
                <g clipPath="url(#clip0_16_313_active)" id="Icon">
                  <path d={svgPaths.p1eb12f80} fill="white" id="Vector" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                  <g id="Vector_2">
                    <path d="M11.6667 1.16667V3.5Z" fill="white" />
                    <path d="M11.6667 1.16667V3.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                  </g>
                  <g id="Vector_3">
                    <path d="M12.8333 2.33333H10.5Z" fill="white" />
                    <path d="M12.8333 2.33333H10.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                  </g>
                  <path d={svgPaths.p291dcf00} fill="white" id="Vector_4" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                </g>
                <defs>
                  <clipPath id="clip0_16_313_active">
                    <rect fill="white" height="14" width="14" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          ) : (
            <SparkleIcon />
          )}
        </div>
        
        {/* Text only shows when active */}
        {isActive && (
          <div className="h-[18px] relative shrink-0" data-name="Text">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative">
              <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[18px] not-italic text-[12px] text-nowrap tracking-[0.1px] whitespace-pre text-white">
                Natural Search
              </p>
            </div>
          </div>
        )}
      </div>
    </button>
  );
}

function TextInput({ searchValue, onSearchChange, onKeyDown, isNaturalSearch }: {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isNaturalSearch: boolean;
}) {
  return (
    <div className="relative shrink-0 w-[616px]" data-name="Text Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start justify-center overflow-clip p-[8px] relative rounded-[inherit] w-[616px]">
        <input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={isNaturalSearch ? "Calm scenic route to Marin County..." : "Search Google Maps"}
          className="font-['Roboto:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[16px] text-[#49454f] placeholder:text-[rgba(73,69,79,0.5)] text-nowrap tracking-[0.5px] whitespace-pre bg-transparent border-0 outline-none w-full"
          style={{ fontVariationSettings: "'wdth' 100" }}
        />
      </div>
    </div>
  );
}

function SearchButton({ onClick }: { onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="bg-[#1a73e8] hover:bg-[#1557B0] relative rounded-[1.67772e+07px] shrink-0 size-[32px] transition-colors"
      data-name="Button"
    >
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[32px]">
        <SearchIcon />
      </div>
    </button>
  );
}

function EnhancedModeToggle({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
  const [animKey, setAnimKey] = useState(0);

  const handleClick = () => {
    setAnimKey(prev => prev + 1);
    onClick();
  };

  return (
    <button 
      className={`relative h-[26px] rounded-[1.67772e+07px] shrink-0 cursor-pointer transition-all duration-200 overflow-hidden ${
        isActive 
          ? '!bg-green-600 w-auto' 
          : '!bg-green-100 hover:!bg-green-200 w-[34px]'
      }`}
      style={{
        backgroundColor: isActive ? '#16a34a' : '#dcfce7'
      }}
      onClick={handleClick}
      data-name="EnhancedModeToggle"
      aria-label={isActive ? "Enhanced Mode Active" : "Enhanced Mode Inactive"}
      title={isActive ? "Enhanced Mode: AI-powered scenic routes" : "Quick Mode: Fast standard routes"}
    >
      <div className={`bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[6px] h-[26px] items-center py-0 relative ${
        isActive ? 'px-[10px]' : 'px-[10px] justify-center'
      }`}>
        <div className={isActive ? 'animate-[spring-spin_0.8s_cubic-bezier(0.34,1.56,0.64,1)]' : ''} key={isActive ? animKey : undefined}>
          {isActive ? (
            <div className="relative shrink-0 size-[14px]" data-name="Icon">
              <svg className="block size-full" fill="none" viewBox="0 0 14 14">
                <path d="M7 1.75C4.38 1.75 2.25 3.88 2.25 6.5C2.25 7.5 2.55 8.43 3.06 9.21L2.25 11.75L4.79 10.94C5.57 11.45 6.5 11.75 7.5 11.75C10.12 11.75 12.25 9.62 12.25 7C12.25 4.38 10.12 2.25 7.5 2.25" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <circle cx="5.5" cy="6.5" r="0.5" fill="white"/>
                <circle cx="7" cy="6.5" r="0.5" fill="white"/>
                <circle cx="8.5" cy="6.5" r="0.5" fill="white"/>
              </svg>
            </div>
          ) : (
            <div className="relative shrink-0 size-[14px]" data-name="Icon">
              <svg className="block size-full" fill="none" viewBox="0 0 14 14">
                <path d="M7.5 1.75L3.5 7.5H7L6.5 12.25L10.5 6.5H7L7.5 1.75Z" stroke="rgb(34, 197, 94)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
          )}
        </div>
        
        {isActive && (
          <div className="h-[18px] relative shrink-0" data-name="Text">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative">
              <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[18px] not-italic text-[12px] text-nowrap tracking-[0.1px] whitespace-pre text-white">
                Enhanced
              </p>
            </div>
          </div>
        )}
      </div>
    </button>
  );
}

function Container({ isNaturalSearch, onNaturalSearchToggle, isEnhancedMode, onEnhancedModeToggle, onSearchSubmit }: {
  isNaturalSearch: boolean;
  onNaturalSearchToggle: () => void;
  isEnhancedMode: boolean;
  onEnhancedModeToggle: () => void;
  onSearchSubmit: () => void;
}) {
  return (
    <div className="relative shrink-0 w-[648px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-between p-[8px] relative w-[648px]">
        <div className="flex items-center gap-2">
          <NaturalSearchToggle isActive={isNaturalSearch} onClick={onNaturalSearchToggle} />
          {isNaturalSearch && (
            <EnhancedModeToggle isActive={isEnhancedMode} onClick={onEnhancedModeToggle} />
          )}
        </div>
        <SearchButton onClick={onSearchSubmit} />
      </div>
    </div>
  );
}



export function SemanticSearchBar({ onSearchChange, onSearchSubmit, isNaturalSearch, onNaturalSearchToggle, isEnhancedMode, onEnhancedModeToggle }: SemanticSearchBarProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearchChange(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearchSubmit(searchValue);
    }
  };

  const handleSearchSubmit = () => {
    onSearchSubmit(searchValue);
  };

  return (
    <div className="bg-white box-border content-stretch flex flex-col items-start justify-center overflow-clip p-[8px] rounded-[20px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3),0px_2px_6px_2px_rgba(0,0,0,0.15)]" data-name="SemanticSearchBar">
      <TextInput 
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        isNaturalSearch={isNaturalSearch}
      />
      <Container 
        isNaturalSearch={isNaturalSearch}
        onNaturalSearchToggle={onNaturalSearchToggle}
        isEnhancedMode={isEnhancedMode}
        onEnhancedModeToggle={onEnhancedModeToggle}
        onSearchSubmit={handleSearchSubmit}
      />
    </div>
  );
}