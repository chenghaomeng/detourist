import svgPaths from "./svg-ulxjbhru2d";
import imgAvatar from "figma:asset/51927857efa4a927b7c81a26d32c8ebf1a637fbb.png";
import imgMapMakerStandard from "figma:asset/d2812f9dca38e71d62376b981a27e81e721e9c11.png";

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="icon">
          <path d={svgPaths.p30673700} fill="var(--fill-0, #1F1F1F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Chips() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[5px] h-[32px] items-center px-[8px] py-0 relative rounded-[100px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.2)] shrink-0" data-name="chips">
      <Icon />
      <p className="font-['Roboto:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#1f1f1f] text-[14px] text-nowrap tracking-[0.14px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Work
      </p>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="icon">
          <path d={svgPaths.p2ef95c00} fill="var(--fill-0, #1F1F1F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Chips1() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[5px] h-[32px] items-center px-[8px] py-0 relative rounded-[100px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.2)] shrink-0" data-name="chips">
      <Icon1 />
      <p className="font-['Roboto:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#1f1f1f] text-[14px] text-nowrap tracking-[0.28px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Gas
      </p>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="icon">
          <path d={svgPaths.p222fe880} fill="var(--fill-0, #1F1F1F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Chips2() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[5px] h-[32px] items-center px-[8px] py-0 relative rounded-[100px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.2)] shrink-0" data-name="chips">
      <Icon2 />
      <p className="font-['Roboto:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#1f1f1f] text-[14px] text-nowrap tracking-[0.42px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Restaurants
      </p>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="icon">
          <path d={svgPaths.p3a0ea80} fill="var(--fill-0, #1F1F1F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Chips3() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[5px] h-[32px] items-center px-[8px] py-0 relative rounded-[100px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.2)] shrink-0" data-name="chips">
      <Icon3 />
      <p className="font-['Roboto:Medium',_sans-serif] font-medium leading-[normal] relative shrink-0 text-[#1f1f1f] text-[14px] text-nowrap tracking-[0.28px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Groceries
      </p>
    </div>
  );
}

function Chips4() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-start left-[12px] top-[127px] w-[381px]" data-name="chips">
      <Chips />
      <Chips1 />
      <Chips2 />
      <Chips3 />
    </div>
  );
}

function GoogleMaps() {
  return (
    <div className="absolute h-[24px] left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-[16.615px]" data-name="google maps">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 24">
        <g clipPath="url(#clip0_3_997)" id="google maps">
          <path d={svgPaths.p28b103a0} fill="var(--fill-0, #34A853)" id="Vector" />
          <path d={svgPaths.pf760780} fill="var(--fill-0, #FBBC04)" id="Vector_2" />
          <path d={svgPaths.p28174380} fill="var(--fill-0, #4285F4)" id="Vector_3" />
          <path d={svgPaths.p4a5d400} fill="var(--fill-0, #1A73E8)" id="Vector_4" />
          <path d={svgPaths.p31e41300} fill="var(--fill-0, #EA4335)" id="Vector_5" />
        </g>
        <defs>
          <clipPath id="clip0_3_997">
            <rect fill="white" height="24" width="16.6154" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Logo() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="logo">
      <GoogleMaps />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon">
          <path d={svgPaths.p2e8e7d80} fill="var(--fill-0, #3B4042)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ButtonIcon() {
  return (
    <div className="box-border content-stretch flex gap-[4px] h-full items-center justify-center p-[8px] relative rounded-[100px] shrink-0 w-[52px]" data-name="button/icon">
      <Icon4 />
    </div>
  );
}

function SearchField() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="search field">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] items-center pl-[12px] pr-0 py-0 relative w-full">
          <p className="basis-0 font-['Roboto:Regular',_sans-serif] font-normal grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[#707579] text-[20px] tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            Search
          </p>
          <div className="flex flex-row items-center self-stretch">
            <ButtonIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div className="relative rounded-[100px] shrink-0 size-[30px]" data-name="avatar">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[100px] size-full" src={imgAvatar} />
    </div>
  );
}

function Avatar1() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[8px] py-[9px] relative shrink-0" data-name="avatar">
      <Avatar />
    </div>
  );
}

function SearchBar() {
  return (
    <div className="absolute bg-white box-border content-stretch flex h-[48px] items-center left-1/2 pl-[12px] pr-0 py-0 rounded-[24px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.3)] top-[67px] translate-x-[-50%] w-[369px]" data-name="search bar">
      <Logo />
      <SearchField />
      <Avatar1 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="absolute left-[359px] size-[20px] top-[44px]" data-name="icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="icon">
          <path d={svgPaths.p29ef6f00} fill="var(--fill-0, #707579)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Modal() {
  return (
    <div className="absolute bg-white bottom-0 h-[146px] left-0 overflow-clip rounded-tl-[12px] rounded-tr-[12px] shadow-[0px_-1px_4px_0px_rgba(0,0,0,0.15)] w-[393px]" data-name="modal">
      <div className="absolute flex h-[3px] items-center justify-center left-[168px] top-[8px] w-[56px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="bg-[#dadce0] h-[3px] rounded-[100px] w-[56px]" data-name="Home Indicator" />
        </div>
      </div>
      <p className="absolute font-['Roboto:Regular',_sans-serif] font-normal leading-[normal] left-[20px] text-[#202123] text-[22px] text-nowrap top-[25px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Latest in the area
      </p>
      <Icon5 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon">
          <path d={svgPaths.p15864300} fill="var(--fill-0, #0B57D0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon7() {
  return (
    <div className="bg-[#d3e2fd] box-border content-stretch flex gap-[10px] items-start px-[20px] py-[4px] relative rounded-[100px] shrink-0" data-name="icon">
      <Icon6 />
    </div>
  );
}

function TabTabBarBottom() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center justify-center relative shrink-0" data-name="Tab/ tab bar bottom">
      <Icon7 />
      <div className="flex flex-col font-['Roboto:Medium',_sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0b57d0] text-[11px] text-nowrap tracking-[0.44px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[11px] whitespace-pre">Explore</p>
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon">
          <path d={svgPaths.p1e675d80} fill="var(--fill-0, #5E5E5E)" id="Vector" />
          <path d={svgPaths.peab7800} fill="var(--fill-0, black)" id="Vector_2" />
          <path d={svgPaths.p35fa3800} fill="var(--fill-0, black)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function Icon9() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start px-[20px] py-[4px] relative rounded-[100px] shrink-0" data-name="icon">
      <Icon8 />
    </div>
  );
}

function TabTabBarBottom1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center justify-center relative shrink-0" data-name="Tab/ tab bar bottom">
      <Icon9 />
      <div className="flex flex-col font-['Roboto:Medium',_sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#5e5e5e] text-[11px] text-nowrap tracking-[0.44px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[11px] whitespace-pre">Go</p>
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon">
          <path d={svgPaths.p11871d00} fill="var(--fill-0, #5E5E5E)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon11() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start px-[20px] py-[4px] relative rounded-[100px] shrink-0" data-name="icon">
      <Icon10 />
    </div>
  );
}

function TabTabBarBottom2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center justify-center relative shrink-0" data-name="Tab/ tab bar bottom">
      <Icon11 />
      <div className="flex flex-col font-['Roboto:Medium',_sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#5e5e5e] text-[11px] text-nowrap tracking-[0.44px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[11px] whitespace-pre">Saved</p>
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon">
          <path d={svgPaths.p3c33800} fill="var(--fill-0, #5E5E5E)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon13() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start px-[20px] py-[4px] relative rounded-[100px] shrink-0" data-name="icon">
      <Icon12 />
    </div>
  );
}

function TabTabBarBottom3() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center justify-center relative shrink-0" data-name="Tab/ tab bar bottom">
      <Icon13 />
      <div className="flex flex-col font-['Roboto:Medium',_sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#5e5e5e] text-[11px] text-nowrap tracking-[0.44px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[11px] whitespace-pre">Contribute</p>
      </div>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon">
          <path d={svgPaths.paf1a280} fill="var(--fill-0, #5E5E5E)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon15() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start px-[20px] py-[4px] relative rounded-[100px] shrink-0" data-name="icon">
      <Icon14 />
    </div>
  );
}

function TabTabBarBottom4() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center justify-center relative shrink-0" data-name="Tab/ tab bar bottom">
      <Icon15 />
      <div className="flex flex-col font-['Roboto:Medium',_sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#5e5e5e] text-[11px] text-nowrap tracking-[0.44px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[11px] whitespace-pre">Updates</p>
      </div>
    </div>
  );
}

function TabBarBottom() {
  return (
    <div className="absolute bg-[#f2f6fc] bottom-0 box-border content-stretch flex h-[90px] items-start justify-between left-0 pb-[36px] pt-[2px] px-[8px] shadow-[0px_-2px_2px_0px_rgba(0,0,0,0.1)] w-[393px]" data-name="Tab bar bottom">
      <TabTabBarBottom />
      <TabTabBarBottom1 />
      <TabTabBarBottom2 />
      <TabTabBarBottom3 />
      <TabTabBarBottom4 />
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

function Icon16() {
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

function ButtonIcon1() {
  return (
    <div className="absolute bg-white box-border content-stretch flex gap-[4px] items-center justify-center left-[321px] p-[8px] rounded-[100px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3)] size-[56px] top-[561px]" data-name="button/icon">
      <Icon16 />
    </div>
  );
}

function Icon17() {
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
    <div className="absolute bg-white box-border content-stretch flex gap-[4px] items-center justify-center left-[337px] p-[8px] rounded-[100px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3)] size-[40px] top-[175px]" data-name="button/icon">
      <Icon17 />
    </div>
  );
}

function IconArrowSign() {
  return (
    <div className="relative size-[14.142px]" data-name="icon/arrow sign">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="icon/arrow sign">
          <rect fill="var(--fill-0, white)" height="14.1421" rx="1" width="14.1421" />
          <path d={svgPaths.pf4041b2} fill="var(--fill-0, #1973E8)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon">
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.7071067690849304)+(var(--transform-inner-height)*0.7071067690849304)))] items-center justify-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-[calc(1px*((var(--transform-inner-height)*0.7071068286895752)+(var(--transform-inner-width)*0.7071068286895752)))]" style={{ "--transform-inner-width": "14.140625", "--transform-inner-height": "14.140625" } as React.CSSProperties}>
        <div className="flex-none rotate-[315deg]">
          <IconArrowSign />
        </div>
      </div>
    </div>
  );
}

function ButtonIcon3() {
  return (
    <div className="absolute bg-[#1973e8] box-border content-stretch flex gap-[4px] items-center justify-center left-[321px] p-[8px] rounded-[100px] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.3)] size-[56px] top-[633px]" data-name="button/icon">
      <Icon18 />
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

function Location() {
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
          <Location />
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

function Location1() {
  return (
    <div className="h-[79px] relative w-[69px]" data-name="location">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 69 79">
        <g id="location">
          <path d={svgPaths.p22205480} fill="url(#paint0_linear_3_969)" id="Vector 2" />
          <circle cx="35.0524" cy="49.0014" fill="var(--fill-0, #255AFF)" fillOpacity="0.1" id="blur" r="23.15" stroke="var(--stroke-0, #95BCE1)" strokeWidth="0.3" />
          <circle cx="35.0522" cy="49.0014" fill="var(--fill-0, #255AFF)" id="point" r="9" stroke="var(--stroke-0, white)" strokeWidth="2" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_969" x1="32.7983" x2="33.636" y1="3.27228" y2="51.265">
            <stop stopColor="#255AFF" stopOpacity="0" />
            <stop offset="1" stopColor="#255AFF" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-white overflow-clip relative rounded-[40px] size-full" data-name="home">
      <div className="absolute h-[852px] left-0 top-0 w-[393px]" data-name="🌎 Map Maker:  (Standard)">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgMapMakerStandard} />
      </div>
      <Chips4 />
      <SearchBar />
      <Modal />
      <TabBarBottom />
      <HomeIndicatorIPhonePortraitLight />
      <ButtonIcon1 />
      <ButtonIcon2 />
      <ButtonIcon3 />
      <StatusBarIPhone15Pro />
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.08715575188398361)+(var(--transform-inner-height)*0.9961948394775391)))] items-center justify-center left-[157.02px] top-[314.82px] w-[calc(1px*((var(--transform-inner-height)*0.08715575188398361)+(var(--transform-inner-width)*0.9961948394775391)))]" style={{ "--transform-inner-width": "69", "--transform-inner-height": "79" } as React.CSSProperties}>
        <div className="flex-none rotate-[355deg]">
          <Location1 />
        </div>
      </div>
    </div>
  );
}