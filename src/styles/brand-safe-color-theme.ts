import { createColorTheme } from './color-theme';
import { semanticColorTokens } from './token-catalog';
import {
  contrastRatio,
  normalizeHex,
  type ColorMode,
  type PrimaryTheme,
} from './primary-theme';

export interface BrandSafeColor {
  l:number;
  c:number;
  h:number;
}

export interface BrandSafeProfile {
  sourceHex:string;
  darkDefault:string;
  darkHover:string;
  darkPressed:string;
  foreground:'#000000'|'#ffffff';
  interactionOverlay:'#000000'|'#ffffff';
  sourceContrast:number;
  defaultContrast:number;
  hoverContrast:number;
  pressedContrast:number;
  hoverOpacity:number;
  pressedOpacity:number;
  focusBorder:string;
  sourceLightness:number;
  defaultLightness:number;
  deltaLightness:number;
  adjustment:'unchanged'|'lightened'|'darkened';
}

const ORIGINAL:Record<string,string>=Object.fromEntries(semanticColorTokens.map(item=>[item.token,item.value]));
const DARK_SURFACE_MIN=3;
const DARK_SURFACE_MAX=10.5;
const DARK_STATE_MIN=2.5;
const DARK_WHITE_FOREGROUND_MAX_DELTA_L=0.03;

function srgbToLinear(value:number) {
  return value<=0.04045?value/12.92:Math.pow((value+0.055)/1.055,2.4);
}
function linearToSrgb(value:number) {
  return value<=0.0031308?12.92*value:1.055*Math.pow(value,1/2.4)-0.055;
}
function channels(input:string) {
  const hex=normalizeHex(input);
  if(!hex) throw new Error('Введите HEX из 3 или 6 символов');
  return [1,3,5].map(index=>parseInt(hex.slice(index,index+2),16)/255);
}

export function hexToBrandSafeColor(input:string):BrandSafeColor {
  const [r,g,b]=channels(input).map(srgbToLinear);
  const l=0.4122214708*r+0.5363325363*g+0.0514459929*b;
  const m=0.2119034982*r+0.6806995451*g+0.1073969566*b;
  const s=0.0883024619*r+0.2817188376*g+0.6299787005*b;
  const lr=Math.cbrt(l),mr=Math.cbrt(m),sr=Math.cbrt(s);
  const lightness=0.2104542553*lr+0.7936177850*mr-0.0040720468*sr;
  const a=1.9779984951*lr-2.4285922050*mr+0.4505937099*sr;
  const bAxis=0.0259040371*lr+0.7827717662*mr-0.8086757660*sr;
  const chroma=Math.hypot(a,bAxis);
  const hue=chroma<1e-8?0:(Math.atan2(bAxis,a)*180/Math.PI+360)%360;
  return {l:lightness,c:chroma,h:hue};
}

function linearRgb(l:number,a:number,b:number) {
  const lr=l+0.3963377774*a+0.2158037573*b;
  const mr=l-0.1055613458*a-0.0638541728*b;
  const sr=l-0.0894841775*a-1.2914855480*b;
  const ll=lr*lr*lr,mm=mr*mr*mr,ss=sr*sr*sr;
  return [
    4.0767416621*ll-3.3077115913*mm+0.2309699292*ss,
    -1.2684380046*ll+2.6097574011*mm-0.3413193965*ss,
    -0.0041960863*ll-0.7034186147*mm+1.7076147010*ss,
  ];
}
function inGamut(rgb:number[]) { return rgb.every(value=>value>=0&&value<=1); }

export function brandSafeColorToHex({l,c,h}:BrandSafeColor):string {
  const angle=h*Math.PI/180;
  const rgbAt=(chroma:number)=>linearRgb(l,chroma*Math.cos(angle),chroma*Math.sin(angle));
  let chroma=c;
  let rgb=rgbAt(chroma);
  if(!inGamut(rgb)) {
    let low=0,high=c;
    for(let i=0;i<30;i++) {
      const middle=(low+high)/2;
      const candidate=rgbAt(middle);
      if(inGamut(candidate)) low=middle;
      else high=middle;
    }
    rgb=rgbAt(low);
  }
  return '#'+rgb.map(channel=>Math.round(Math.max(0,Math.min(1,linearToSrgb(channel)))*255).toString(16).padStart(2,'0')).join('');
}

function semanticValue(theme:PrimaryTheme,token:string) {
  const value=theme.variables[token]??ORIGINAL[token];
  if(!value) throw new Error(`Unknown semantic color token: ${token}`);
  return value;
}

function nearestDarkDefault(seed:string,surface:string) {
  const source=hexToBrandSafeColor(seed);
  const sourceContrast=contrastRatio(seed,surface);
  if(sourceContrast>=DARK_SURFACE_MIN&&sourceContrast<=DARK_SURFACE_MAX) {
    return {hex:seed,color:source};
  }

  const target=sourceContrast<DARK_SURFACE_MIN?DARK_SURFACE_MIN:DARK_SURFACE_MAX;
  let low=sourceContrast<DARK_SURFACE_MIN?source.l:0;
  let high=sourceContrast<DARK_SURFACE_MIN?1:source.l;

  for(let i=0;i<34;i++) {
    const middle=(low+high)/2;
    const hex=brandSafeColorToHex({l:middle,c:source.c,h:source.h});
    const ratio=contrastRatio(hex,surface);
    if(ratio>=target) high=middle;
    else low=middle;
  }

  const finalLightness=sourceContrast<DARK_SURFACE_MIN?high:low;
  const hex=brandSafeColorToHex({l:finalLightness,c:source.c,h:source.h});
  return {hex,color:hexToBrandSafeColor(hex)};
}

function resolveDarkDefaultAndForeground(seed:string,surface:string) {
  const adjusted=nearestDarkDefault(seed,surface);
  if(contrastRatio(adjusted.hex,'#ffffff')>=4.5) {
    return {...adjusted,foreground:'#ffffff' as const};
  }

  let low=0;
  let high=adjusted.color.l;
  for(let i=0;i<34;i++) {
    const middle=(low+high)/2;
    const hex=brandSafeColorToHex({l:middle,c:adjusted.color.c,h:adjusted.color.h});
    if(contrastRatio(hex,'#ffffff')>=4.5) low=middle;
    else high=middle;
  }

  const whiteHex=brandSafeColorToHex({l:low,c:adjusted.color.c,h:adjusted.color.h});
  const whiteColor=hexToBrandSafeColor(whiteHex);
  const whiteDelta=adjusted.color.l-whiteColor.l;
  const whiteSurfaceContrast=contrastRatio(whiteHex,surface);
  if(
    whiteDelta<=DARK_WHITE_FOREGROUND_MAX_DELTA_L
    && whiteSurfaceContrast>=DARK_SURFACE_MIN
    && whiteSurfaceContrast<=DARK_SURFACE_MAX
  ) {
    return {hex:whiteHex,color:whiteColor,foreground:'#ffffff' as const};
  }

  return {...adjusted,foreground:'#000000' as const};
}

export function compositeStateLayer(background:string,foreground:'#000000'|'#ffffff',opacity:number) {
  const bg=channels(background).map(value=>Math.round(value*255));
  const fg=channels(foreground).map(value=>Math.round(value*255));
  return '#'+bg.map((channel,index)=>
    Math.round(channel*(1-opacity)+fg[index]*opacity).toString(16).padStart(2,'0')
  ).join('');
}

function maximumSafeLayerOpacity(
  defaultHex:string,
  overlay:'#000000'|'#ffffff',
  foreground:'#000000'|'#ffffff',
  surface:string,
) {
  const safe=(opacity:number)=>{
    const color=compositeStateLayer(defaultHex,overlay,opacity);
    return contrastRatio(color,foreground)>=4.5&&contrastRatio(color,surface)>=DARK_STATE_MIN;
  };
  if(safe(.12)) return .12;
  let low=0,high=.12;
  for(let i=0;i<30;i++) {
    const middle=(low+high)/2;
    if(safe(middle)) low=middle;
    else high=middle;
  }
  return low;
}

function interactionStates(defaultHex:string,surface:string,foreground:'#000000'|'#ffffff') {
  const candidates=(['#000000','#ffffff'] as const).map(overlay=>{
    const maximumOpacity=maximumSafeLayerOpacity(defaultHex,overlay,foreground,surface);
    const pressedOpacity=Math.min(.12,maximumOpacity);
    const hoverOpacity=pressedOpacity>=.08?.08:pressedOpacity*(2/3);
    const hover=compositeStateLayer(defaultHex,overlay,hoverOpacity);
    const pressed=compositeStateLayer(defaultHex,overlay,pressedOpacity);
    return {
      overlay,
      maximumOpacity,
      hoverOpacity,
      pressedOpacity,
      hover,
      pressed,
      pressedDifference:contrastRatio(defaultHex,pressed),
    };
  });

  candidates.sort((a,b)=>
    Number(b.maximumOpacity>=.12)-Number(a.maximumOpacity>=.12)
    || b.maximumOpacity-a.maximumOpacity
    || b.pressedDifference-a.pressedDifference
  );

  const selected=candidates[0];
  return {
    foreground,
    interactionOverlay:selected.overlay,
    hover:selected.hover,
    pressed:selected.pressed,
    hoverOpacity:selected.hoverOpacity,
    pressedOpacity:selected.pressedOpacity,
  };
}

export function getBrandSafeProfile(input:string):BrandSafeProfile {
  const seed=normalizeHex(input);
  if(!seed) throw new Error('Введите HEX из 3 или 6 символов');
  const baseTheme=createColorTheme(seed,'dark');
  const surface=semanticValue(baseTheme,'--background-base-default');
  const source=hexToBrandSafeColor(seed);
  const adjusted=resolveDarkDefaultAndForeground(seed,surface);
  const states=interactionStates(adjusted.hex,surface,adjusted.foreground);
  const focusBorder=semanticValue(baseTheme,'--border-primary-focused');
  const delta=adjusted.color.l-source.l;
  return {
    sourceHex:seed,
    darkDefault:adjusted.hex,
    darkHover:states.hover,
    darkPressed:states.pressed,
    foreground:states.foreground,
    interactionOverlay:states.interactionOverlay,
    sourceContrast:contrastRatio(seed,surface),
    defaultContrast:contrastRatio(adjusted.hex,surface),
    hoverContrast:contrastRatio(states.hover,surface),
    pressedContrast:contrastRatio(states.pressed,surface),
    hoverOpacity:states.hoverOpacity,
    pressedOpacity:states.pressedOpacity,
    focusBorder,
    sourceLightness:source.l,
    defaultLightness:adjusted.color.l,
    deltaLightness:delta,
    adjustment:Math.abs(delta)<0.0005?'unchanged':delta>0?'lightened':'darkened',
  };
}

function assignCustom(theme:PrimaryTheme,token:string,reference:string,value:string) {
  theme.variables[reference]=value;
  theme.references[token]=reference;
  theme.variables[token]=value;
}

/**
 * Brand-safe experiment:
 * - Light is identical to the current implementation;
 * - the entered HEX remains exact Primary/500;
 * - Dark Default first keeps the HEX inside the 3:1–10.5:1 Base contrast band;
 * - white onPrimary is preferred when it needs no more than 0.03 OKLCH L
 *   of additional darkening; otherwise black onPrimary is used;
 * - all Default corrections change only OKLCH lightness;
 * - hue is preserved and chroma is reduced only when sRGB gamut requires it;
 * - Hover/Pressed use a separate black/white interaction overlay over Default;
 * - text color is selected only from Default readability;
 * - the overlay that best preserves 8% / 12% and remains most visible wins;
 * - layer opacity is reduced only when the target would break contrast;
 * - Focus keeps the Default fill and uses the existing focus outline token.
 */
export function createBrandSafeColorTheme(input:string,mode:ColorMode='light'):PrimaryTheme {
  const seed=normalizeHex(input);
  if(!seed) throw new Error('Введите HEX из 3 или 6 символов');
  const theme=createColorTheme(seed,mode);
  theme.variables['--brand-source']=seed;
  if(mode==='light') return theme;

  const profile=getBrandSafeProfile(seed);
  assignCustom(theme,'--background-primary-default','--primary-brand-safe-default',profile.darkDefault);
  assignCustom(theme,'--background-primary-default-hover','--primary-brand-safe-hover',profile.darkHover);
  assignCustom(theme,'--background-primary-default-pressed','--primary-brand-safe-pressed',profile.darkPressed);

  theme.variables['--primary-brand-safe-on-default']=profile.foreground;
  for(const kind of ['text','icon'] as const) {
    for(const family of ['default','default-light'] as const) {
      for(const state of ['', '-hover','-pressed']) {
        const token=`--${kind}-primary-${family}${state}`;
        theme.references[token]='--primary-brand-safe-on-default';
        theme.variables[token]=profile.foreground;
      }
    }
  }

  assignCustom(theme,'--border-primary-default','--primary-brand-safe-default',profile.darkDefault);
  assignCustom(theme,'--border-primary-hover','--primary-brand-safe-hover',profile.darkHover);
  assignCustom(theme,'--border-primary-pressed','--primary-brand-safe-pressed',profile.darkPressed);

  theme.lightForeground=profile.foreground==='#ffffff';
  return theme;
}

export const brandSafeDarkSurfaceRange={min:DARK_SURFACE_MIN,max:DARK_SURFACE_MAX};
export const brandSafeDarkStateMinimum=DARK_STATE_MIN;
