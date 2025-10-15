import svgPaths from "./svg-sijx7d9tyk";
import imgImage from "figma:asset/3a8b8a7d2dac090ff0ac2aaf5760732acab67c7f.png";
import { imgVector } from "./svg-w6fm0";

function Image() {
  return (
    <div className="absolute h-[1117px] left-0 top-0 w-[1839px]" data-name="Image">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage} />
    </div>
  );
}

function ZoomControls() {
  return (
    <div className="absolute bottom-[19.84%] contents left-1/4 right-1/4 top-[13.22%]" data-name="Zoom Controls">
      <div className="absolute bottom-[19.84%] left-1/4 right-1/4 top-[13.22%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 81">
          <path d={svgPaths.p3c5f0480} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[22.31%_37.89%_62.24%_38.75%]" data-name="PLus">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 19">
          <path d={svgPaths.p3b95da80} fill="var(--fill-0, white)" id="PLus" />
        </svg>
      </div>
      <div className="absolute inset-[62.81%_37.88%_33.88%_38.75%]" data-name="Minus">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 4">
          <path d="M18.6953 4H0V0H18.6953V4Z" fill="var(--fill-0, white)" id="Minus" />
        </svg>
      </div>
      <div className="absolute inset-[47.11%_31.79%_52.07%_32.5%]" data-name="Separator">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29 1">
          <path d="M28.5714 0H0V1H28.5714V0Z" fill="var(--fill-0, white)" id="Separator" />
        </svg>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[120.992px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <ZoomControls />
    </div>
  );
}

function ZoomControls1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[120.992px] items-start left-[1767px] top-[1008.01px] w-[80px]" data-name="ZoomControls">
      <Icon />
    </div>
  );
}

function Vector() {
  return (
    <div className="absolute bottom-[0.03%] contents left-0 right-[0.43%] top-0" data-name="Vector">
      <div className="absolute inset-[18.75%_0.43%_0.03%_27.45%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-5.739px_-5.627px] mask-size-[20.816px_30px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 25">
          <path d={svgPaths.p3c484680} fill="var(--fill-0, #EA4335)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[26.3%_35.58%_25.92%_4.91%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.026px_-7.891px] mask-size-[20.816px_30px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 15">
          <path d={svgPaths.p37e5680} fill="var(--fill-0, #EA4335)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[1.58%_6.03%_56.6%_35.15%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-7.347px_-0.473px] mask-size-[20.816px_30px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
          <path d={svgPaths.p1fd48000} fill="var(--fill-0, #EA4335)" id="Vector" />
        </svg>
      </div>
      <div className="absolute bottom-[73.7%] left-[11.67%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-2.441px_0px] mask-size-[20.816px_30px] right-[35.19%] top-0" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 8">
          <path d={svgPaths.p2d2ab000} fill="var(--fill-0, #EA4335)" id="Vector" />
        </svg>
      </div>
      <div className="absolute bottom-[48.53%] left-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_-3.741px] mask-size-[20.816px_30px] right-[64.87%] top-[12.47%]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 12">
          <path d={svgPaths.p1f8a9100} fill="var(--fill-0, #EA4335)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Pin() {
  return (
    <div className="absolute bottom-[0.03%] contents left-0 right-[0.43%] top-0" data-name="Pin">
      <div className="absolute inset-[21.5%_31.19%_51.83%_30.71%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-6.421px_-6.45px] mask-size-[20.816px_30px]" data-name="Elipse" style={{ maskImage: `url('${imgVector}')` }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <path d={svgPaths.p161ec080} fill="var(--fill-0, #B01D1D)" id="Elipse" />
        </svg>
      </div>
      <Vector />
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute bottom-0 contents left-0 right-[0.43%] top-0" data-name="Clip path group">
      <Pin />
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[30px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <ClipPathGroup />
    </div>
  );
}

function Pin1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[30px] items-start left-[909.5px] top-[544px] w-[20.906px]" data-name="Pin">
      <Icon1 />
    </div>
  );
}

function SemanticMapView() {
  return (
    <div className="absolute h-[1117px] left-0 overflow-clip top-0 w-[1839px]" data-name="SemanticMapView">
      <Image />
      <ZoomControls1 />
      <Pin1 />
    </div>
  );
}

function TextInput() {
  return (
    <div className="relative shrink-0 w-[616px]" data-name="Text Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start justify-center overflow-clip p-[8px] relative rounded-[inherit] w-[616px]">
        <p className="font-['Roboto:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[16px] text-[rgba(73,69,79,0.5)] text-nowrap tracking-[0.5px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          Calm scenic route to Marin County...
        </p>
      </div>
    </div>
  );
}

function Icon2() {
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

function Text() {
  return (
    <div className="basis-0 grow h-[18px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[18px] relative w-full">
        <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[18px] left-0 not-italic text-[#1a73e8] text-[12px] text-nowrap top-px tracking-[0.1px] whitespace-pre">Natural Search</p>
      </div>
    </div>
  );
}

function NaturalSearchToggle() {
  return (
    <div className="bg-[#e8f0fe] h-[26px] relative rounded-[1.67772e+07px] shrink-0 w-[127.164px]" data-name="NaturalSearchToggle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[6px] h-[26px] items-center px-[10px] py-0 relative w-[127.164px]">
        <Icon2 />
        <Text />
      </div>
    </div>
  );
}

function Icon3() {
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

function Button() {
  return (
    <div className="bg-[#1a73e8] relative rounded-[1.67772e+07px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[32px]">
        <Icon3 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="relative shrink-0 w-[648px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-between p-[8px] relative w-[648px]">
        <NaturalSearchToggle />
        <Button />
      </div>
    </div>
  );
}

function SemanticSearchBar() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col items-start justify-center left-[96px] overflow-clip p-[8px] rounded-[20px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3),0px_2px_6px_2px_rgba(0,0,0,0.15)] top-[28px]" data-name="SemanticSearchBar">
      <TextInput />
      <Container />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[28px] left-0 not-italic text-[#101828] text-[18px] text-nowrap top-0 tracking-[-0.4395px] whitespace-pre">Natural Search Routing</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[16px] left-0 not-italic text-[#4a5565] text-[12px] text-nowrap top-px whitespace-pre">Describe your drive, not just your destination</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[44px] relative shrink-0 w-[253.875px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[44px] items-start relative w-[253.875px]">
        <Heading1 />
        <Paragraph />
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d="M1 9L9 1M1 1L9 9" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="relative rounded-[1.67772e+07px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start pb-0 pt-[8px] px-[8px] relative size-[32px]">
        <Icon4 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[69px] relative shrink-0 w-[461px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-gray-200 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[69px] items-center justify-between pb-px pt-0 px-[16px] relative w-[461px]">
        <Container1 />
        <Button1 />
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[28px] left-[206.08px] not-italic text-[#101828] text-[20px] text-center text-nowrap top-0 tracking-[-0.4492px] translate-x-[-50%] whitespace-pre">Natural Search</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[20px] left-[206.98px] not-italic text-[#4a5565] text-[14px] text-center text-nowrap top-[0.5px] tracking-[-0.1504px] translate-x-[-50%] whitespace-pre">Describe what you want to find — not just a place or address.</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[56px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading2 />
      <Paragraph1 />
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#f3f3f5] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex h-[48px] items-center px-[12px] py-[4px] relative w-full">
          <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px] text-nowrap tracking-[-0.1504px] whitespace-pre">Scenic drive through parks to the coast</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] text-nowrap top-px whitespace-pre">{`Try: "Avoid highways, prefer tree-lined streets"`}</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] text-nowrap top-px whitespace-pre">{`Try: "Calm route with mountain views"`}</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] text-nowrap top-px whitespace-pre">{`Try: "Shortest path through downtown"`}</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[56px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph2 />
      <Paragraph3 />
      <Paragraph4 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="absolute left-[119.39px] size-[16px] top-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_16_303)" id="Icon">
          <path d={svgPaths.p23633980} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M13.3333 1.33333V4" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14.6667 2.66667H12" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p22966600} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_16_303">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#1a73e8] h-[40px] opacity-50 relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <Icon5 />
      <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[20px] left-[151.39px] not-italic text-[14px] text-nowrap text-white top-[10.5px] tracking-[-0.1504px] whitespace-pre">Generate Route Ideas</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[176px] items-start relative shrink-0 w-full" data-name="Container">
      <Input />
      <Container4 />
      <Button2 />
    </div>
  );
}

function NaturalSearchFlow() {
  return (
    <div className="h-[304px] relative shrink-0 w-full" data-name="NaturalSearchFlow">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] h-[304px] items-start pb-0 pt-[24px] px-[24px] relative w-full">
          <Container3 />
          <Container5 />
        </div>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[461px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-full items-start overflow-clip relative rounded-[inherit] w-[461px]">
        <NaturalSearchFlow />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute bg-white h-[1107px] left-[-390px] top-0 w-[462px]" data-name="Container">
      <div className="box-border content-stretch flex flex-col h-[1107px] items-start overflow-clip pl-0 pr-px py-0 relative rounded-[inherit] w-[462px]">
        <Container2 />
        <Container6 />
      </div>
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-gray-200 border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon6() {
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

function Button3() {
  return (
    <div className="relative rounded-[1.67772e+07px] shrink-0 size-[48px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[48px]">
        <Icon6 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-full w-0" />
    </div>
  );
}

function Icon7() {
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

function Button4() {
  return (
    <div className="relative rounded-[1.67772e+07px] shrink-0 size-[48px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[48px]">
        <Icon7 />
      </div>
    </div>
  );
}

function LeftSidebar() {
  return (
    <div className="absolute bg-[#f0f4f9] box-border content-stretch flex flex-col h-[1107px] items-center left-0 pl-0 pr-px py-[16px] top-0 w-[72px]" data-name="LeftSidebar">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-gray-200 border-solid inset-0 pointer-events-none" />
      <Button3 />
      <Container8 />
      <Button4 />
    </div>
  );
}

export default function ScenicMapBrowserApp() {
  return (
    <div className="bg-white relative size-full" data-name="Scenic Map Browser App">
      <SemanticMapView />
      <SemanticSearchBar />
      <Container7 />
      <LeftSidebar />
    </div>
  );
}