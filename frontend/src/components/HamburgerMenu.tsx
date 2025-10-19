import svgPaths from "../imports/svg-oeduc838so";

interface HamburgerMenuProps {
  onClick: () => void;
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="var(--fill-0, #49454F)" />
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

export function HamburgerMenu({ onClick }: HamburgerMenuProps) {
  return (
    <button 
      onClick={onClick}
      className="box-border content-stretch flex items-center justify-center relative shrink-0 size-[48px] hover:bg-gray-100 rounded-full transition-colors" 
      data-name="Hamburger-menu"
    >
      <Content />
    </button>
  );
}