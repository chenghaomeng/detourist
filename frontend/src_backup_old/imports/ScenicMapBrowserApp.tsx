import svgPaths from "./svg-0zb1magnmf";
import imgImage from "figma:asset/3a8b8a7d2dac090ff0ac2aaf5760732acab67c7f.png";
import { imgVector } from "./svg-p5row";

function Image() {
  return (
    <div className="absolute h-[1117px] left-0 top-0 w-[1143px]" data-name="Image">
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
    <div className="absolute content-stretch flex flex-col h-[120.992px] items-start left-[1071px] top-[1008.01px] w-[80px]" data-name="ZoomControls">
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
      <div className="absolute inset-[26.3%_35.58%_25.92%_4.91%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.025px_-7.891px] mask-size-[20.816px_30px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
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

function Icon2() {
  return (
    <div className="h-[30px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <ClipPathGroup />
    </div>
  );
}

function Pin1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[30px] items-start left-[561.5px] top-[544px] w-[20.906px]" data-name="Pin">
      <Icon2 />
    </div>
  );
}

function SemanticMapView() {
  return (
    <div className="absolute h-[1117px] left-0 overflow-clip top-0 w-[1143px]" data-name="SemanticMapView">
      <Image />
      <ZoomControls1 />
      <Pin1 />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[6px] w-[99.414px]" data-name="Paragraph">
      <p className="absolute font-['Roboto:Medium',_sans-serif] font-medium leading-[20px] left-[50px] text-[#49454f] text-[14px] text-center text-nowrap top-[-0.5px] tracking-[0.1px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Semantic Mode
      </p>
    </div>
  );
}

function TrailingIcon() {
  return (
    <div className="absolute contents inset-[41.67%_29.17%_37.5%_29.17%]" data-name="Trailing icon">
      <div className="absolute inset-[41.67%_29.17%_37.5%_29.17%]" data-name="icon">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 4">
          <path d={svgPaths.pd8d170} fill="var(--fill-0, #49454F)" id="icon" />
        </svg>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="h-[18px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <TrailingIcon />
    </div>
  );
}

function TrailingIcon1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[123.41px] size-[18px] top-[7px]" data-name="TrailingIcon">
      <Icon3 />
    </div>
  );
}

function StateLayer1() {
  return (
    <div className="absolute bg-[#e8f5e8] h-[32px] left-0 overflow-clip rounded-[8px] top-0 w-[149.414px]" data-name="StateLayer1">
      <Paragraph />
      <TrailingIcon1 />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[32px] left-0 rounded-[8px] top-0 w-[149.414px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#4caf50] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function FilterChip() {
  return (
    <div className="absolute h-[32px] left-[20px] rounded-[8px] top-[8px] w-[149.414px]" data-name="FilterChip">
      <StateLayer1 />
      <Container />
    </div>
  );
}

function TextInput() {
  return (
    <div className="absolute content-stretch flex h-[19px] items-center left-[179.41px] overflow-clip top-[14.5px] w-[608px]" data-name="Text Input">
      <p className="font-['Roboto:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[16px] text-[rgba(73,69,79,0.5)] text-nowrap tracking-[0.5px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        test
      </p>
    </div>
  );
}

function Content1() {
  return (
    <div className="absolute h-[48px] left-[4px] top-[4px] w-[648px]" data-name="Content1">
      <FilterChip />
      <TextInput />
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute contents inset-[12.5%]" data-name="Icon">
      <div className="absolute inset-[12.5%]" data-name="icon">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
          <path d={svgPaths.p35a97c00} fill="var(--fill-0, #49454F)" id="icon" />
        </svg>
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Icon4 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[8px] size-[24px] top-[8px]" data-name="Icon1">
      <Icon5 />
    </div>
  );
}

function Content2() {
  return (
    <div className="absolute left-[608px] overflow-clip rounded-[100px] size-[40px] top-[8px]" data-name="Content2">
      <Icon1 />
    </div>
  );
}

function StateLayer3() {
  return (
    <div className="absolute bg-white h-[56px] left-[486px] overflow-clip rounded-[28px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3),0px_2px_6px_2px_rgba(0,0,0,0.15)] top-[28px] w-[656px]" data-name="StateLayer3">
      <Content1 />
      <Content2 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[28px] left-0 not-italic text-[#101828] text-[18px] text-nowrap top-0 tracking-[-0.4395px] whitespace-pre">Detourist</p>
    </div>
  );
}

function Paragraph1() {
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
        <Paragraph1 />
      </div>
    </div>
  );
}

function Icon6() {
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

function Button() {
  return (
    <div className="relative rounded-[1.67772e+07px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start pb-0 pt-[8px] px-[8px] relative size-[32px]">
        <Icon6 />
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
        <Button />
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="absolute bg-[#f3f3f5] h-[36px] left-0 rounded-[8px] top-0 w-[366px]" data-name="Input">
      <div className="box-border content-stretch flex h-[36px] items-center overflow-clip pl-[32px] pr-[12px] py-[4px] relative rounded-[inherit] w-[366px]">
        <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px] text-nowrap tracking-[-0.1504px] whitespace-pre">Forest Hills, SF</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute left-[12px] size-[12px] top-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p2023d200} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p2d617c80} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="[grid-area:1_/_1] relative shrink-0" data-name="Container">
      <Input />
      <Icon7 />
    </div>
  );
}

function Input1() {
  return (
    <div className="absolute bg-[#f3f3f5] h-[36px] left-0 rounded-[8px] top-0 w-[366px]" data-name="Input">
      <div className="box-border content-stretch flex h-[36px] items-center overflow-clip pl-[32px] pr-[12px] py-[4px] relative rounded-[inherit] w-[366px]">
        <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px] text-nowrap tracking-[-0.1504px] whitespace-pre">Golden Gate Bridge, SF</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon8() {
  return (
    <div className="absolute left-[12px] size-[12px] top-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p13a89200} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Container4() {
  return (
    <div className="[grid-area:2_/_1] relative shrink-0" data-name="Container">
      <Input1 />
      <Icon8 />
    </div>
  );
}

function Container5() {
  return (
    <div className="gap-[12px] grid grid-cols-[repeat(1,_minmax(0px,_1fr))] grid-rows-[repeat(2,_minmax(0px,_1fr))] h-[84px] relative shrink-0 w-full" data-name="Container">
      <Container3 />
      <Container4 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute left-[9px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p36c7f800} id="Vector" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Badge() {
  return (
    <div className="absolute bg-[#eceef2] h-[26px] left-0 rounded-[8px] top-0 w-[76.727px]" data-name="Badge">
      <div className="h-[26px] overflow-clip relative rounded-[inherit] w-[76.727px]">
        <Icon9 />
        <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[16px] left-[29px] not-italic text-[#030213] text-[12px] text-nowrap top-[6px] whitespace-pre">Scenic</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute left-[9px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p1569d9f0} id="Vector" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3.5 8V11" id="Vector_2" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.5 9.5V11" id="Vector_3" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p1679bb80} id="Vector_4" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Badge1() {
  return (
    <div className="absolute bg-[#eceef2] h-[26px] left-[80.73px] rounded-[8px] top-0 w-[69.148px]" data-name="Badge">
      <div className="h-[26px] overflow-clip relative rounded-[inherit] w-[69.148px]">
        <Icon10 />
        <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[16px] left-[29px] not-italic text-[#030213] text-[12px] text-nowrap top-[6px] whitespace-pre">Quiet</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-[9px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p1af70600} id="Vector" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p32d1c800} id="Vector_2" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4.5 8.5H7.5" id="Vector_3" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p3757b880} id="Vector_4" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Badge2() {
  return (
    <div className="absolute bg-[#eceef2] h-[26px] left-[153.88px] rounded-[8px] top-0 w-[128.68px]" data-name="Badge">
      <div className="h-[26px] overflow-clip relative rounded-[inherit] w-[128.68px]">
        <Icon11 />
        <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[16px] left-[29px] not-italic text-[#030213] text-[12px] text-nowrap top-[6px] whitespace-pre">Avoid Highways</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[54px] relative shrink-0 w-full" data-name="Container">
      <Badge />
      <Badge1 />
      <Badge2 />
    </div>
  );
}

function Badge3() {
  return (
    <div className="h-[22px] relative rounded-[8px] shrink-0 w-[108.617px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[108.617px]">
        <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-950 text-nowrap whitespace-pre">Need to adjust?</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex h-[28px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Badge3 />
    </div>
  );
}

function Container8() {
  return (
    <div className="bg-gray-50 relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] items-start pb-0 pt-[16px] px-[16px] relative w-full">
          <Container5 />
          <Container6 />
          <Container7 />
        </div>
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="bg-blue-100 h-[24px] relative rounded-[4px] shrink-0 w-[100.664px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[100.664px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[16px] left-[8px] not-italic text-[#1447e6] text-[12px] text-nowrap top-[5px] whitespace-pre">Recommended</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[24px] relative rounded-[4px] shrink-0 w-[85.438px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[85.438px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[16px] left-[8px] not-italic text-[#4a5565] text-[12px] text-nowrap top-[5px] whitespace-pre">Most Scenic</p>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[24px] relative rounded-[4px] shrink-0 w-[57.016px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[57.016px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[16px] left-[8px] not-italic text-[#4a5565] text-[12px] text-nowrap top-[5px] whitespace-pre">Fastest</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-start relative shrink-0 w-full" data-name="Container">
      <Text />
      <Text1 />
      <Text2 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[24px] left-0 not-italic text-[#101828] text-[16px] text-nowrap top-[-0.5px] tracking-[-0.3125px] whitespace-pre">Most Scenic</p>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_11_2325)" id="Icon">
          <path d={svgPaths.p13588700} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_11_2325">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[69.453px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[69.453px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.5px] tracking-[-0.1504px] w-[70px]">Score 0.87</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex gap-[4px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon12 />
      <Text3 />
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[44px] relative shrink-0 w-[90.953px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[44px] items-start relative w-[90.953px]">
        <Heading3 />
        <Container10 />
      </div>
    </div>
  );
}

function Badge4() {
  return (
    <div className="h-[22px] relative rounded-[8px] shrink-0 w-[50.914px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[50.914px]">
        <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-950 text-nowrap whitespace-pre">+18%</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function NaturalSearchFlow() {
  return (
    <div className="absolute content-stretch flex h-[44px] items-start justify-between left-[17px] top-[17px] w-[364px]" data-name="NaturalSearchFlow">
      <Container11 />
      <Badge4 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_11_2331)" id="Icon">
          <path d="M6 3V6L8 7" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p3e7757b0} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_11_2331">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-full">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">42 min</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[20px] relative shrink-0 w-[60.305px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[20px] items-center relative w-[60.305px]">
        <Icon13 />
        <Text4 />
      </div>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p33aba000} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p1ec96820} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.pd38a270} id="Vector_3" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text5() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-full">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">28.3 mi</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[20px] relative shrink-0 w-[63.961px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[20px] items-center relative w-[63.961px]">
        <Icon14 />
        <Text5 />
      </div>
    </div>
  );
}

function NaturalSearchFlow1() {
  return (
    <div className="absolute content-stretch flex gap-[16px] h-[20px] items-center left-[17px] top-[93px] w-[364px]" data-name="NaturalSearchFlow">
      <Container12 />
      <Container13 />
    </div>
  );
}

function NaturalSearchFlow2() {
  return (
    <div className="absolute h-[20px] left-[17px] top-[149px] w-[364px]" data-name="NaturalSearchFlow">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">Beautiful route through parks and along the waterfront</p>
    </div>
  );
}

function Badge5() {
  return (
    <div className="absolute bg-[#eceef2] h-[22px] left-0 rounded-[8px] top-0 w-[138.578px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[138.578px]">
        <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-nowrap whitespace-pre">via Golden Gate Park</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge6() {
  return (
    <div className="absolute bg-[#eceef2] h-[22px] left-[142.58px] rounded-[8px] top-0 w-[95.617px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[95.617px]">
        <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-nowrap whitespace-pre">coastal views</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge7() {
  return (
    <div className="absolute bg-[#eceef2] h-[22px] left-[242.19px] rounded-[8px] top-0 w-[74.836px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[74.836px]">
        <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-nowrap whitespace-pre">tree-lined</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function NaturalSearchFlow3() {
  return (
    <div className="absolute h-[22px] left-[17px] top-[205px] w-[364px]" data-name="NaturalSearchFlow">
      <Badge5 />
      <Badge6 />
      <Badge7 />
    </div>
  );
}

function Icon15() {
  return (
    <div className="absolute left-[67.05px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1658d2c0} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="basis-0 bg-white grow h-[32px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[32px] relative w-full">
        <Icon15 />
        <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[20px] left-[93.05px] not-italic text-[14px] text-neutral-950 text-nowrap top-[6.5px] tracking-[-0.1504px] whitespace-pre">Preview</p>
      </div>
    </div>
  );
}

function Icon16() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_11_2320)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10.6667V8" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333H8.00667" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_11_2320">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-[143.812px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[32px] relative w-[143.812px]">
        <Icon16 />
        <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[20px] left-[37px] not-italic text-[14px] text-neutral-950 text-nowrap top-[6.5px] tracking-[-0.1504px] whitespace-pre">Why this route</p>
      </div>
    </div>
  );
}

function NaturalSearchFlow4() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[32px] items-start left-[17px] top-[263px] w-[364px]" data-name="NaturalSearchFlow">
      <Button1 />
      <Button2 />
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white h-[312px] relative rounded-[14px] shrink-0 w-full" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <NaturalSearchFlow />
      <NaturalSearchFlow1 />
      <NaturalSearchFlow2 />
      <NaturalSearchFlow3 />
      <NaturalSearchFlow4 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[24px] left-0 not-italic text-[#101828] text-[16px] text-nowrap top-[-0.5px] tracking-[-0.3125px] whitespace-pre">Balanced Route</p>
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_11_2317)" id="Icon">
          <path d={svgPaths.p32e38300} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_11_2317">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[68.695px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[68.695px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.5px] tracking-[-0.1504px] w-[69px]">Score 0.74</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex gap-[4px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon17 />
      <Text6 />
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[44px] relative shrink-0 w-[115.922px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[44px] items-start relative w-[115.922px]">
        <Heading4 />
        <Container14 />
      </div>
    </div>
  );
}

function Badge8() {
  return (
    <div className="h-[22px] relative rounded-[8px] shrink-0 w-[45.156px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[45.156px]">
        <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-950 text-nowrap whitespace-pre">+8%</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function NaturalSearchFlow5() {
  return (
    <div className="absolute content-stretch flex h-[44px] items-start justify-between left-[17px] top-[17px] w-[364px]" data-name="NaturalSearchFlow">
      <Container15 />
      <Badge8 />
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_11_2331)" id="Icon">
          <path d="M6 3V6L8 7" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p3e7757b0} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_11_2331">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text7() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-full">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">35 min</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[20px] relative shrink-0 w-[60.281px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[20px] items-center relative w-[60.281px]">
        <Icon18 />
        <Text7 />
      </div>
    </div>
  );
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p33aba000} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p1ec96820} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.pd38a270} id="Vector_3" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-full">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">24.1 mi</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[20px] relative shrink-0 w-[61.547px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[20px] items-center relative w-[61.547px]">
        <Icon19 />
        <Text8 />
      </div>
    </div>
  );
}

function NaturalSearchFlow6() {
  return (
    <div className="absolute content-stretch flex gap-[16px] h-[20px] items-center left-[17px] top-[93px] w-[364px]" data-name="NaturalSearchFlow">
      <Container16 />
      <Container17 />
    </div>
  );
}

function NaturalSearchFlow7() {
  return (
    <div className="absolute h-[20px] left-[17px] top-[149px] w-[364px]" data-name="NaturalSearchFlow">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">Good compromise between speed and scenery</p>
    </div>
  );
}

function Badge9() {
  return (
    <div className="absolute bg-[#eceef2] h-[22px] left-0 rounded-[8px] top-0 w-[106.367px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[106.367px]">
        <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-nowrap whitespace-pre">some highways</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge10() {
  return (
    <div className="absolute bg-[#eceef2] h-[22px] left-[110.37px] rounded-[8px] top-0 w-[109.234px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[109.234px]">
        <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-nowrap whitespace-pre">moderate views</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge11() {
  return (
    <div className="absolute bg-[#eceef2] h-[22px] left-[223.6px] rounded-[8px] top-0 w-[65.836px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[65.836px]">
        <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-nowrap whitespace-pre">efficient</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function NaturalSearchFlow8() {
  return (
    <div className="absolute h-[22px] left-[17px] top-[205px] w-[364px]" data-name="NaturalSearchFlow">
      <Badge9 />
      <Badge10 />
      <Badge11 />
    </div>
  );
}

function Icon20() {
  return (
    <div className="absolute left-[67.05px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1658d2c0} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="basis-0 bg-white grow h-[32px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[32px] relative w-full">
        <Icon20 />
        <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[20px] left-[93.05px] not-italic text-[14px] text-neutral-950 text-nowrap top-[6.5px] tracking-[-0.1504px] whitespace-pre">Preview</p>
      </div>
    </div>
  );
}

function Icon21() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_11_2320)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10.6667V8" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333H8.00667" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_11_2320">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-[143.812px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[32px] relative w-[143.812px]">
        <Icon21 />
        <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[20px] left-[37px] not-italic text-[14px] text-neutral-950 text-nowrap top-[6.5px] tracking-[-0.1504px] whitespace-pre">Why this route</p>
      </div>
    </div>
  );
}

function NaturalSearchFlow9() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[32px] items-start left-[17px] top-[263px] w-[364px]" data-name="NaturalSearchFlow">
      <Button3 />
      <Button4 />
    </div>
  );
}

function Card1() {
  return (
    <div className="bg-white h-[312px] relative rounded-[14px] shrink-0 w-full" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <NaturalSearchFlow5 />
      <NaturalSearchFlow6 />
      <NaturalSearchFlow7 />
      <NaturalSearchFlow8 />
      <NaturalSearchFlow9 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[24px] left-0 not-italic text-[#101828] text-[16px] text-nowrap top-[-0.5px] tracking-[-0.3125px] whitespace-pre">Fastest Route</p>
    </div>
  );
}

function Icon22() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_11_2317)" id="Icon">
          <path d={svgPaths.p32e38300} fill="var(--fill-0, #FDC700)" id="Vector" stroke="var(--stroke-0, #FDC700)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_11_2317">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[20px] relative shrink-0 w-[67.875px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[67.875px]">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[0.5px] tracking-[-0.1504px] w-[68px]">Score 0.61</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex gap-[4px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon22 />
      <Text9 />
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[44px] relative shrink-0 w-[101.453px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[44px] items-start relative w-[101.453px]">
        <Heading5 />
        <Container18 />
      </div>
    </div>
  );
}

function Badge12() {
  return (
    <div className="h-[22px] relative rounded-[8px] shrink-0 w-[37.32px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[37.32px]">
        <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-950 text-nowrap whitespace-pre">0%</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function NaturalSearchFlow10() {
  return (
    <div className="absolute content-stretch flex h-[44px] items-start justify-between left-[17px] top-[17px] w-[364px]" data-name="NaturalSearchFlow">
      <Container19 />
      <Badge12 />
    </div>
  );
}

function Icon23() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_11_2331)" id="Icon">
          <path d="M6 3V6L8 7" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p3e7757b0} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_11_2331">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text10() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-full">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">29 min</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[20px] relative shrink-0 w-[60.211px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[20px] items-center relative w-[60.211px]">
        <Icon23 />
        <Text10 />
      </div>
    </div>
  );
}

function Icon24() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p33aba000} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p1ec96820} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.pd38a270} id="Vector_3" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text11() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-full">
        <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">22.8 mi</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[20px] relative shrink-0 w-[63.844px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[20px] items-center relative w-[63.844px]">
        <Icon24 />
        <Text11 />
      </div>
    </div>
  );
}

function NaturalSearchFlow11() {
  return (
    <div className="absolute content-stretch flex gap-[16px] h-[20px] items-center left-[17px] top-[93px] w-[364px]" data-name="NaturalSearchFlow">
      <Container20 />
      <Container21 />
    </div>
  );
}

function NaturalSearchFlow12() {
  return (
    <div className="absolute h-[20px] left-[17px] top-[149px] w-[364px]" data-name="NaturalSearchFlow">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px] whitespace-pre">Most direct path with highway segments</p>
    </div>
  );
}

function Badge13() {
  return (
    <div className="absolute bg-[#eceef2] h-[22px] left-0 rounded-[8px] top-0 w-[71.773px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[71.773px]">
        <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-nowrap whitespace-pre">highways</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge14() {
  return (
    <div className="absolute bg-[#eceef2] h-[22px] left-[75.77px] rounded-[8px] top-0 w-[51.719px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[51.719px]">
        <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-nowrap whitespace-pre">direct</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge15() {
  return (
    <div className="absolute bg-[#eceef2] h-[22px] left-[131.49px] rounded-[8px] top-0 w-[98.078px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit] w-[98.078px]">
        <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#030213] text-[12px] text-nowrap whitespace-pre">minimal stops</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function NaturalSearchFlow13() {
  return (
    <div className="absolute h-[22px] left-[17px] top-[205px] w-[364px]" data-name="NaturalSearchFlow">
      <Badge13 />
      <Badge14 />
      <Badge15 />
    </div>
  );
}

function Icon25() {
  return (
    <div className="absolute left-[67.05px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1658d2c0} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="basis-0 bg-white grow h-[32px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[32px] relative w-full">
        <Icon25 />
        <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[20px] left-[93.05px] not-italic text-[14px] text-neutral-950 text-nowrap top-[6.5px] tracking-[-0.1504px] whitespace-pre">Preview</p>
      </div>
    </div>
  );
}

function Icon26() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_11_2320)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10.6667V8" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333H8.00667" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_11_2320">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-[143.812px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[32px] relative w-[143.812px]">
        <Icon26 />
        <p className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[20px] left-[37px] not-italic text-[14px] text-neutral-950 text-nowrap top-[6.5px] tracking-[-0.1504px] whitespace-pre">Why this route</p>
      </div>
    </div>
  );
}

function NaturalSearchFlow14() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[32px] items-start left-[17px] top-[263px] w-[364px]" data-name="NaturalSearchFlow">
      <Button5 />
      <Button6 />
    </div>
  );
}

function Card2() {
  return (
    <div className="bg-white h-[312px] relative rounded-[14px] shrink-0 w-full" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <NaturalSearchFlow10 />
      <NaturalSearchFlow11 />
      <NaturalSearchFlow12 />
      <NaturalSearchFlow13 />
      <NaturalSearchFlow14 />
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[960px] items-start relative shrink-0 w-full" data-name="Container">
      <Card />
      <Card1 />
      <Card2 />
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[1000px] items-start relative shrink-0 w-full" data-name="Container">
      <Container9 />
      <Container22 />
    </div>
  );
}

function NaturalSearchFlow15() {
  return (
    <div className="h-[1246px] relative shrink-0 w-full" data-name="NaturalSearchFlow">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] h-[1246px] items-start pb-0 pt-[24px] px-[24px] relative w-full">
          <Container8 />
          <Container23 />
        </div>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[461px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-full items-start overflow-clip pl-0 pr-[15px] py-0 relative rounded-[inherit] w-[461px]">
        <NaturalSearchFlow15 />
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute bg-white h-[798px] left-0 top-0 w-[462px]" data-name="Container">
      <div className="box-border content-stretch flex flex-col h-[798px] items-start overflow-clip pl-0 pr-px py-0 relative rounded-[inherit] w-[462px]">
        <Container2 />
        <Container24 />
      </div>
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-gray-200 border-solid inset-0 pointer-events-none" />
    </div>
  );
}

export default function ScenicMapBrowserApp() {
  return (
    <div className="bg-white relative size-full" data-name="Scenic Map Browser App">
      <SemanticMapView />
      <StateLayer3 />
      <Container25 />
    </div>
  );
}