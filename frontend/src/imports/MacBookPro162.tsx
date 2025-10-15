import svgPaths from "./svg-oeduc838so";
import imgImage from "figma:asset/d2bf39cdb9c258620130aea342cc76afc137f25c.png";
import imgMapImage from "figma:asset/3a8b8a7d2dac090ff0ac2aaf5760732acab67c7f.png";

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

function Satelite() {
  return (
    <div className="absolute bottom-[12px] left-[12px] rounded-[4px] size-[40px]" data-name="Satelite">
      <div className="overflow-clip relative rounded-[inherit] size-[40px]">
        <div className="absolute h-[49px] left-1/2 top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%] w-[124px]" data-name="Image">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage} />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[4px]" />
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

function GoogleMapsWidget() {
  return (
    <div className="absolute h-[1117px] left-[462px] overflow-clip top-0 w-[1266px]" data-name="Google Maps Widget">
      <div className="absolute inset-[-11.67%_-11%]" data-name="Map Image">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgMapImage} />
      </div>
      <ZoomControls />
      <Satelite />
      <Pin />
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
  return (
    <div className="box-border content-stretch flex items-center justify-center mr-[-16px] relative shrink-0 size-[48px]" data-name="Leading-icon">
      <Content />
    </div>
  );
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

function StateLayer1() {
  return (
    <div className="box-border content-stretch flex gap-[8px] h-[32px] items-center justify-center pl-[16px] pr-[8px] py-[6px] relative shrink-0" data-name="state-layer">
      <div className="flex flex-col font-['Roboto:Medium',_sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#49454f] text-[14px] text-center text-nowrap tracking-[0.1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] whitespace-pre">Semantic Mode</p>
      </div>
      <TrailingIcon />
    </div>
  );
}

function FilterChip() {
  return (
    <div className="h-[32px] relative rounded-[8px] shrink-0" data-name="Filter chip">
      <div className="content-stretch flex h-[32px] items-center justify-center overflow-clip relative rounded-[inherit]">
        <StateLayer1 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#cac4d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Content1() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px mr-[-16px] relative shrink-0" data-name="Content">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center px-[20px] py-0 relative size-full">
          <FilterChip />
          <div className="flex flex-col font-['Roboto:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#49454f] text-[16px] text-nowrap tracking-[0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[24px] whitespace-pre">Hinted search text</p>
          </div>
        </div>
      </div>
    </div>
  );
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

function StateLayer3() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="state-layer">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center pl-[4px] pr-[20px] py-[4px] relative size-full">
          <LeadingIcon />
          <Content1 />
          <TrailingElements />
        </div>
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[4px] h-[56px] items-center max-w-[720px] overflow-clip relative rounded-[28px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3),0px_2px_6px_2px_rgba(0,0,0,0.15)] shrink-0 w-[656px]" data-name="Search bar">
      <StateLayer3 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[10px] h-[1117px] items-start left-[462px] px-[24px] py-[28px] top-0 w-[1266px]">
      <SearchBar />
    </div>
  );
}

export default function MacBookPro162() {
  return (
    <div className="bg-white relative size-full" data-name="MacBook Pro 16' - 2">
      <GoogleMapsWidget />
      <Frame1 />
    </div>
  );
}