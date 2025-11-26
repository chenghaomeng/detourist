import svgPaths from "./svg-3gfk02wl5r";
import imgMapMakerStandard from "figma:asset/d2812f9dca38e71d62376b981a27e81e721e9c11.png";

function Icon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon">
          <path d={svgPaths.p3fd9e500} fill="var(--fill-0, #3B4042)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ButtonIcon() {
  return (
    <div className="box-border content-stretch flex gap-[4px] h-full items-center justify-center p-[8px] relative rounded-[100px] shrink-0 w-[48px]" data-name="button/icon">
      <Icon />
    </div>
  );
}

function SearchField() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="search field">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] items-center pl-[12px] pr-0 py-0 relative w-full">
          <p className="basis-0 font-['Roboto:Regular',_sans-serif] font-normal grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[#202123] text-[20px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            Restaurant
          </p>
          <div className="flex flex-row items-center self-stretch">
            <ButtonIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <div className="box-border content-stretch flex h-[48px] items-center pl-[12px] pr-0 py-0 relative rounded-[24px] shrink-0 w-[369px]" data-name="search bar">
      <div aria-hidden="true" className="absolute border border-[#d1d2d6] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <SearchField />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon">
          <path d={svgPaths.p246c1600} fill="var(--fill-0, black)" id="Vector" stroke="var(--stroke-0, black)" strokeWidth="0.5" />
        </g>
      </svg>
    </div>
  );
}

function ButtonIcon1() {
  return (
    <div className="box-border content-stretch flex gap-[4px] items-center justify-center p-[8px] relative rounded-[100px] shrink-0 size-[40px]" data-name="button/icon">
      <Icon1 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="icon">
          <path d={svgPaths.p2c82e500} fill="var(--fill-0, #1F1F1F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Chips() {
  return (
    <div className="box-border content-stretch flex gap-[4px] h-[32px] items-center px-[12px] py-0 relative rounded-[8px] shrink-0" data-name="chips">
      <div aria-hidden="true" className="absolute border border-[#e1e2e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['Roboto:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#1f1f1f] text-[14px] text-nowrap tracking-[0.42px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Sort by
      </p>
      <Icon3 />
    </div>
  );
}

function Chips1() {
  return (
    <div className="box-border content-stretch flex gap-[4px] h-[32px] items-center px-[12px] py-0 relative rounded-[8px] shrink-0" data-name="chips">
      <div aria-hidden="true" className="absolute border border-[#e1e2e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['Roboto:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#1f1f1f] text-[14px] text-nowrap tracking-[0.42px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Open now
      </p>
    </div>
  );
}

function Chips2() {
  return (
    <div className="box-border content-stretch flex gap-[4px] h-[32px] items-center px-[12px] py-0 relative rounded-[8px] shrink-0" data-name="chips">
      <div aria-hidden="true" className="absolute border border-[#e1e2e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['Roboto:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#1f1f1f] text-[14px] text-nowrap tracking-[0.42px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Top rated
      </p>
    </div>
  );
}

function Chips3() {
  return (
    <div className="box-border content-stretch flex gap-[4px] h-[32px] items-center px-[12px] py-0 relative rounded-[8px] shrink-0" data-name="chips">
      <div aria-hidden="true" className="absolute border border-[#e1e2e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['Roboto:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#1f1f1f] text-[14px] text-nowrap tracking-[0.42px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Wheelchair-accessible entrance
      </p>
    </div>
  );
}

function Chips4() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="chips">
      <Chips />
      <Chips1 />
      <Chips2 />
      <Chips3 />
    </div>
  );
}

function Chips5() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="chips">
      <ButtonIcon1 />
      <Chips4 />
    </div>
  );
}

function TopBar() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col gap-[8px] h-[171px] items-start justify-end left-0 pb-[8px] pt-0 px-[12px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.2)] top-0 w-[393px]" data-name="top bar">
      <SearchBar />
      <Chips5 />
    </div>
  );
}

function Modal() {
  return (
    <div className="absolute bg-white bottom-0 h-[82px] left-0 overflow-clip shadow-[0px_-1px_4px_0px_rgba(0,0,0,0.15)] w-[393px]" data-name="modal">
      <p className="absolute font-['Roboto:Medium',_sans-serif] font-medium leading-[normal] left-[16px] text-[#1973e8] text-[14px] text-nowrap top-[16px] tracking-[0.56px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        SHOW LIST
      </p>
    </div>
  );
}

function HomeIndicatorIPhonePortraitLight() {
  return (
    <div className="absolute bottom-0 h-[21px] left-1/2 translate-x-[-50%] w-[393px]" data-name="Home Indicator/iPhone/Portrait/Light">
      <div className="absolute bottom-[8px] flex h-[5px] items-center justify-center left-1/2 translate-x-[-50%] w-[139px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="bg-black h-[5px] rounded-[100px] w-[139px]" data-name="Home Indicator" />
        </div>
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon">
          <path d={svgPaths.pe9918a0} fill="var(--fill-0, #3B4042)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ButtonIcon2() {
  return (
    <div className="absolute bg-white box-border content-stretch flex gap-[4px] items-center justify-center left-[337px] p-[8px] rounded-[100px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3)] size-[40px] top-[187px]" data-name="button/icon">
      <Icon7 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon">
          <path d={svgPaths.p1dfe1900} fill="var(--fill-0, #3B4042)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ButtonIcon3() {
  return (
    <div className="absolute bg-white box-border content-stretch flex gap-[4px] items-center justify-center left-[321px] p-[8px] rounded-[100px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3)] size-[56px] top-[698px]" data-name="button/icon">
      <Icon8 />
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-white box-border content-stretch flex gap-[4px] h-[40px] items-center justify-center left-[calc(50%-0.5px)] px-[24px] py-[8px] rounded-[100px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3)] top-[187px] translate-x-[-50%]" data-name="button">
      <p className="font-['Roboto:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#1973e8] text-[14px] text-nowrap tracking-[0.28px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Search this area
      </p>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="icon">
          <rect fill="var(--fill-0, #EA4234)" height="18" rx="9" width="18" />
          <path d={svgPaths.p3f48b140} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function IconWithValue() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-center left-[3px] top-[2px]" data-name="icon with value">
      <Icon10 />
      <p className="font-['Roboto:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#3b4042] text-[12px] text-nowrap tracking-[-0.24px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        3,5
      </p>
    </div>
  );
}

function Points() {
  return (
    <div className="h-[33px] relative shrink-0 w-[49.5px]" data-name="Points">
      <div className="absolute h-[33px] left-0 top-0 w-[49.5px]">
        <div className="absolute inset-[-1.52%_-1.01%_1.53%_-1.01%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 51 34">
            <path d={svgPaths.p1b50ab72} fill="var(--fill-0, white)" id="Vector 1" stroke="var(--stroke-0, #9AA0A6)" />
          </svg>
        </div>
      </div>
      <IconWithValue />
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 text-[#3b4042] text-nowrap whitespace-pre" data-name="Label">
      <p className="font-['Roboto:Medium',_sans-serif] font-medium leading-[16px] relative shrink-0 text-[12px] tracking-[0.96px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Omer Yusel
      </p>
      <p className="font-['Roboto:Regular',_sans-serif] font-normal leading-[18px] relative shrink-0 text-[10px] tracking-[0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Закрито назавжди
      </p>
    </div>
  );
}

function Points1() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-start left-[145px] top-[358px]" data-name="Points">
      <Points />
      <Label />
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="icon">
          <rect fill="var(--fill-0, #EA4234)" height="18" rx="9" width="18" />
          <path d={svgPaths.p3f48b140} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function IconWithValue1() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-center left-[3px] top-[2px]" data-name="icon with value">
      <Icon11 />
      <p className="font-['Roboto:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#3b4042] text-[12px] text-nowrap tracking-[-0.24px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        3,6
      </p>
    </div>
  );
}

function Points2() {
  return (
    <div className="h-[33px] relative shrink-0 w-[49.5px]" data-name="Points">
      <div className="absolute h-[33px] left-0 top-0 w-[49.5px]">
        <div className="absolute inset-[-1.52%_-1.01%_1.53%_-1.01%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 51 34">
            <path d={svgPaths.p1b50ab72} fill="var(--fill-0, white)" id="Vector 1" stroke="var(--stroke-0, #9AA0A6)" />
          </svg>
        </div>
      </div>
      <IconWithValue1 />
    </div>
  );
}

function Label1() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[4px] items-start justify-center pb-0 pt-[5px] px-0 relative shrink-0" data-name="Label">
      <div className="flex flex-col font-['Roboto:Medium',_sans-serif] font-medium justify-end leading-[0] relative shrink-0 text-[#3b4042] text-[12px] text-nowrap tracking-[0.6px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] whitespace-pre">La Bonne</p>
      </div>
    </div>
  );
}

function Points3() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-start left-[144px] top-[391px]" data-name="Points">
      <Points2 />
      <Label1 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="icon">
          <rect fill="var(--fill-0, #EA4234)" height="18" rx="9" width="18" />
          <path d={svgPaths.p3f48b140} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function IconWithValue2() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-center left-[3px] top-[2px]" data-name="icon with value">
      <Icon12 />
      <p className="font-['Roboto:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#3b4042] text-[12px] text-nowrap tracking-[-0.24px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        4.3
      </p>
    </div>
  );
}

function Points4() {
  return (
    <div className="h-[33px] relative shrink-0 w-[49.5px]" data-name="Points">
      <div className="absolute h-[33px] left-0 top-0 w-[49.5px]">
        <div className="absolute inset-[-1.52%_-1.01%_1.53%_-1.01%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 51 34">
            <path d={svgPaths.p1b50ab72} fill="var(--fill-0, white)" id="Vector 1" stroke="var(--stroke-0, #9AA0A6)" />
          </svg>
        </div>
      </div>
      <IconWithValue2 />
    </div>
  );
}

function Label2() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[4px] items-start justify-center pb-0 pt-[5px] px-0 relative shrink-0" data-name="Label">
      <div className="flex flex-col font-['Roboto:Medium',_sans-serif] font-medium justify-end leading-[0] relative shrink-0 text-[#3b4042] text-[12px] text-nowrap tracking-[0.6px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] whitespace-pre">Pizzeria Capricciosa</p>
      </div>
    </div>
  );
}

function Points5() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-start left-[143px] top-[598px]" data-name="Points">
      <Points4 />
      <Label2 />
    </div>
  );
}

function Location() {
  return (
    <div className="h-[79px] relative w-[69px]" data-name="location">
      <div className="absolute bottom-[-0.38%] left-0 right-0 top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 69 80">
          <g id="location">
            <path d={svgPaths.p361f1200} fill="url(#paint0_linear_3_1388)" id="Vector 2" />
            <circle cx="35" cy="51" fill="var(--fill-0, #255AFF)" fillOpacity="0.1" id="blur" r="28.15" stroke="var(--stroke-0, #95BCE1)" strokeWidth="0.3" />
            <circle cx="35" cy="51" fill="var(--fill-0, #255AFF)" id="point" r="8" stroke="var(--stroke-0, white)" strokeWidth="4" />
          </g>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_1388" x1="35" x2="35" y1="2" y2="50">
              <stop stopColor="#255AFF" stopOpacity="0" />
              <stop offset="1" stopColor="#255AFF" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Component941() {
  return (
    <div className="absolute h-[14px] left-0 top-0 w-[35px]" data-name="9:41">
      <div className="absolute flex flex-col font-['SF_Pro:Semibold',_sans-serif] font-[590] inset-0 justify-center leading-[0] overflow-ellipsis overflow-hidden text-[17px] text-black text-center text-nowrap tracking-[-0.5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[14px] whitespace-pre">9:41</p>
      </div>
    </div>
  );
}

function Time() {
  return (
    <div className="h-[14px] relative shrink-0 w-[35px]" data-name="Time">
      <Component941 />
    </div>
  );
}

function Location1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Location">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Location">
          <path d={svgPaths.p3d5bc280} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Left() {
  return (
    <div className="basis-0 grow h-[60px] min-h-px min-w-px relative shrink-0" data-name="Left">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[4px] h-[60px] items-center justify-center px-[42px] py-[12px] relative w-full">
          <Time />
          <Location1 />
        </div>
      </div>
    </div>
  );
}

function Lens() {
  return (
    <div className="absolute left-[98px] size-[12px] top-[12px]" data-name="Lens">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Lens">
          <circle cx="6" cy="6" fill="var(--fill-0, #0E101F)" id="Ellipse 1" r="6" />
          <circle cx="6" cy="6" fill="var(--fill-0, #01031A)" id="Ellipse 2" r="4.90909" />
          <g filter="url(#filter0_f_3_951)" id="Ellipse 3">
            <ellipse cx="6" cy="3.27273" fill="var(--fill-0, white)" fillOpacity="0.1" rx="2.72727" ry="1.09091" />
          </g>
          <g filter="url(#filter1_f_3_951)" id="Ellipse 4">
            <ellipse cx="6" cy="8.18182" fill="var(--fill-0, white)" fillOpacity="0.1" rx="2.72727" ry="1.63636" />
          </g>
        </g>
        <defs>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="4.18182" id="filter0_f_3_951" width="7.45455" x="2.27273" y="1.18182">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_3_951" stdDeviation="0.5" />
          </filter>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="5.27273" id="filter1_f_3_951" width="7.45455" x="2.27273" y="5.54545">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_3_951" stdDeviation="0.5" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

function DynamicIsland() {
  return (
    <div className="bg-black h-[36px] overflow-clip relative rounded-[32px] shrink-0 w-[122px]" data-name="Dynamic Island">
      <Lens />
    </div>
  );
}

function Signal() {
  return (
    <div className="absolute bottom-[3.57%] left-0 right-[-2.78%] top-[7.14%]" data-name="Signal">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 13">
        <g id="Signal">
          <path d={svgPaths.p32b81f0} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.pa041880} fill="var(--fill-0, black)" id="Vector_2" />
          <path d={svgPaths.p29615c00} fill="var(--fill-0, black)" id="Vector_3" opacity="0.2" />
          <path d={svgPaths.pdcf4a00} fill="var(--fill-0, black)" id="Vector_4" opacity="0.2" />
        </g>
      </svg>
    </div>
  );
}

function Network() {
  return (
    <div className="h-[14px] relative shrink-0 w-[18px]" data-name="Network">
      <Signal />
    </div>
  );
}

function Data() {
  return (
    <div className="h-[14px] relative shrink-0 w-[18px]" data-name="Data">
      <div className="absolute bottom-0 left-[-3.5%] right-[-3.5%] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 14">
          <g id="Data">
            <path d={svgPaths.p18446bb0} fill="var(--fill-0, black)" id="Vector" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Battery() {
  return (
    <div className="h-[14px] relative shrink-0 w-[27px]" data-name="Battery">
      <div className="absolute inset-0" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 14">
          <g id="Vector" opacity="0.3">
            <path d={svgPaths.p33066e00} fill="var(--fill-0, black)" />
            <path d={svgPaths.p241a6080} fill="var(--fill-0, black)" />
          </g>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-[63.41%] top-0" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 14">
          <path d={svgPaths.p14c441c0} fill="var(--fill-0, #F7CE45)" id="Vector" />
        </svg>
      </div>
      <div className="absolute flex flex-col font-['SF_Pro:Bold',_sans-serif] font-bold justify-center leading-[0] left-[13px] text-[11px] text-black text-center text-nowrap top-[7px] tracking-[-0.5px] translate-x-[-50%] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[14px] whitespace-pre">32</p>
      </div>
    </div>
  );
}

function Right() {
  return (
    <div className="basis-0 grow h-[60px] min-h-px min-w-px relative shrink-0" data-name="Right">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[10px] h-[60px] items-center justify-center px-[28px] py-[12px] relative w-full">
          <Network />
          <Data />
          <Battery />
        </div>
      </div>
    </div>
  );
}

function StatusBarIPhone15Pro() {
  return (
    <div className="absolute content-stretch flex h-[60px] items-center justify-center left-0 top-0 w-[393px]" data-name="Status bar/iPhone 15/Pro">
      <Left />
      <DynamicIsland />
      <Right />
    </div>
  );
}

export default function RestaurantsSearch() {
  return (
    <div className="bg-white overflow-clip relative rounded-[40px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.3)] size-full" data-name="restaurants (search)">
      <div className="absolute h-[852px] left-0 top-0 w-[393px]" data-name="🌎 Map Maker:  (Standard)">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgMapMakerStandard} />
      </div>
      <TopBar />
      <Modal />
      <HomeIndicatorIPhonePortraitLight />
      <ButtonIcon2 />
      <ButtonIcon3 />
      <Button />
      <Points1 />
      <Points3 />
      <Points5 />
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.08715575188398361)+(var(--transform-inner-height)*0.9961948394775391)))] items-center justify-center left-[96.02px] top-[570.82px] w-[calc(1px*((var(--transform-inner-height)*0.08715575188398361)+(var(--transform-inner-width)*0.9961948394775391)))]" style={{ "--transform-inner-width": "69", "--transform-inner-height": "79" } as React.CSSProperties}>
        <div className="flex-none rotate-[355deg]">
          <Location />
        </div>
      </div>
      <StatusBarIPhone15Pro />
    </div>
  );
}