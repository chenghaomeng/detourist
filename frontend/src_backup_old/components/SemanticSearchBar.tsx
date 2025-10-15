import svgPaths from "../imports/svg-oeduc838so";
import { useState, useRef, useEffect } from "react";

interface SemanticSearchBarProps {
  onSearchChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  isSemanticMode: boolean;
  onSemanticModeToggle: () => void;
}

function TrailingIcon() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Trailing icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Trailing icon">
          <path d={svgPaths.p1e934100} fill="var(--fill-0, #49454F)" id="icon" />
        </g>
      </svg>
    </div>
  );
}

function StateLayer1({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
  return (
    <div 
      className="box-border content-stretch flex gap-[8px] h-[32px] items-center justify-center pl-[16px] pr-[8px] py-[6px] relative shrink-0 cursor-pointer" 
      data-name="state-layer"
      onClick={onClick}
    >
      <div className="flex flex-col font-['Roboto:Medium',_sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#49454f] text-[14px] text-center text-nowrap tracking-[0.1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] whitespace-pre">Semantic Mode</p>
      </div>
      <TrailingIcon />
    </div>
  );
}

function FilterChip({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
  return (
    <div className="h-[32px] relative rounded-[8px] shrink-0" data-name="Filter chip">
      <div className={`content-stretch flex h-[32px] items-center justify-center overflow-clip relative rounded-[inherit] ${isActive ? 'bg-[#e8f5e8]' : ''}`}>
        <StateLayer1 isActive={isActive} onClick={onClick} />
      </div>
      <div aria-hidden="true" className={`absolute border ${isActive ? 'border-[#4caf50]' : 'border-[#cac4d0]'} border-solid inset-0 pointer-events-none rounded-[8px]`} />
    </div>
  );
}

function Content1({ searchValue, onSearchChange, onKeyDown, isSemanticMode, onSemanticModeToggle }: { 
  searchValue: string; 
  onSearchChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isSemanticMode: boolean;
  onSemanticModeToggle: () => void;
}) {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px mr-[-16px] relative shrink-0" data-name="Content">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center px-[20px] py-0 relative size-full">
          <FilterChip isActive={isSemanticMode} onClick={onSemanticModeToggle} />
          <input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={isSemanticMode ? "Calm scenic route to Marin County..." : "Search Google Maps"}
            className="flex flex-col font-['Roboto:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#49454f] text-[16px] tracking-[0.5px] bg-transparent border-0 outline-none w-full"
            style={{ fontVariationSettings: "'wdth' 100" }}
          />
        </div>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p32dc8f00} fill="var(--fill-0, #49454F)" id="icon" />
        </g>
      </svg>
    </div>
  );
}

function StateLayer() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-center relative shrink-0 w-full" data-name="State-layer">
      <Icon />
    </div>
  );
}

function Content() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[100px] shrink-0 w-[40px]" data-name="Content">
      <StateLayer />
    </div>
  );
}

function LeadingIcon() {
  return null;
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.pc423380} fill="var(--fill-0, #49454F)" id="icon" />
        </g>
      </svg>
    </div>
  );
}

function StateLayer2() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-center relative shrink-0 w-full" data-name="State-layer">
      <Icon1 />
    </div>
  );
}

function Content2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[100px] shrink-0 w-[40px]" data-name="Content">
      <StateLayer2 />
    </div>
  );
}

function Component1stTrailingIcon() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[48px]" data-name="1st trailing-icon">
      <Content2 />
    </div>
  );
}

function TrailingElements() {
  return (
    <div className="absolute content-stretch flex items-center justify-end right-[4px] top-1/2 translate-y-[-50%]" data-name="Trailing-Elements">
      <Component1stTrailingIcon />
    </div>
  );
}

function StateLayer3({ searchValue, onSearchChange, onKeyDown, isSemanticMode, onSemanticModeToggle }: {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isSemanticMode: boolean;
  onSemanticModeToggle: () => void;
}) {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="state-layer">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center pl-[4px] pr-[20px] py-[4px] relative size-full">
          <LeadingIcon />
          <Content1 
            searchValue={searchValue} 
            onSearchChange={onSearchChange}
            onKeyDown={onKeyDown}
            isSemanticMode={isSemanticMode}
            onSemanticModeToggle={onSemanticModeToggle}
          />
          <TrailingElements />
        </div>
      </div>
    </div>
  );
}

export function SemanticSearchBar({ onSearchChange, onSearchSubmit, isSemanticMode, onSemanticModeToggle }: SemanticSearchBarProps) {
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

  return (
    <div className="bg-white box-border content-stretch flex gap-[4px] h-[56px] items-center max-w-[720px] overflow-clip relative rounded-[28px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3),0px_2px_6px_2px_rgba(0,0,0,0.15)] shrink-0 w-[656px]" data-name="Search bar">
      <StateLayer3 
        searchValue={searchValue} 
        onSearchChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        isSemanticMode={isSemanticMode}
        onSemanticModeToggle={onSemanticModeToggle}
      />
    </div>
  );
}