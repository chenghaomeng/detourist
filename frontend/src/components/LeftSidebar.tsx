import svgPaths from "../imports/svg-sijx7d9tyk";

interface LeftSidebarProps {
  onMenuClick: () => void;
}

function HamburgerIcon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M3.33333 4.16667H16.6667" id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M3.33333 10H16.6667" id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M3.33333 15.8333H16.6667" id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function SettingsIcon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1f78d2b0} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

export function LeftSidebar({ onMenuClick }: LeftSidebarProps) {
  return (
    <div className="absolute bg-[#f0f4f9] flex flex-col h-full items-center left-0 top-0 w-[72px] py-4 z-20 border-r border-gray-200" data-name="LeftSidebar">
      {/* Hamburger Menu Button */}
      <button 
        onClick={onMenuClick}
        className="flex items-center justify-center rounded-full shrink-0 size-12 hover:bg-white/50 transition-colors"
        data-name="Button"
        aria-label="Menu"
      >
        <HamburgerIcon />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Settings Button */}
      <button 
        className="flex items-center justify-center rounded-full shrink-0 size-12 hover:bg-white/50 transition-colors"
        data-name="Button"
        aria-label="Settings"
      >
        <SettingsIcon />
      </button>
    </div>
  );
}
