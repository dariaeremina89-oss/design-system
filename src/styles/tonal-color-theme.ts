import { createColorTheme } from './color-theme';
import { PRIMARY_CONTRAST_POLICY as policy, selectContrastStep } from './contrast-policy';
import {
  contrastRatio,
  normalizeHex,
  primarySteps,
  relativeLuminance,
  type ColorMode,
  type PrimaryStep,
  type PrimaryTheme,
} from './primary-theme';

export interface PerceptualColor {
  l: number;
  c: number;
  h: number;
}

const TONAL_LIGHTNESS:Record<PrimaryStep,number>={
  25:.98,
  50:.95,
  100:.90,
  200:.82,
  300:.74,
  400:.66,
  500:.58,
  600:.50,
  700:.42,
  800:.34,
  900:.26,
};

const PRIMARY_MAPPING={
  light:{
    default:{base:600,hover:700,pressed:800,disabled:300},
    secondary:{base:25,hover:50,pressed:100,disabled:25},
    tertiary:{base:100,hover:200,pressed:300,disabled:100},
    inverse:{base:900,hover:800,pressed:700,disabled:500},
  },
  dark:{
    default:{base:200,hover:100,pressed:300,disabled:700},
    secondary:{base:900,hover:800,pressed:700,disabled:900},
    tertiary:{base:800,hover:700,pressed:600,disabled:800},
    inverse:{base:50,hover:100,pressed:200,disabled:500},
  },
} as const;

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

export function hexToPerceptual(input:string):PerceptualColor {
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

export function perceptualToHex({l,c,h}:PerceptualColor):string {
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
    chroma=low;
    rgb=rgbAt(chroma);
  }
  return '#'+rgb.map(channel=>Math.round(Math.max(0,Math.min(1,linearToSrgb(channel)))*255).toString(16).padStart(2,'0')).join('');
}

export function createTonalPalette(input:string):Record<PrimaryStep,string> {
  const seed=normalizeHex(input);
  if(!seed) throw new Error('Введите HEX из 3 или 6 символов');
  const source=hexToPerceptual(seed);
  return Object.fromEntries(primarySteps.map(step=>[
    step,
    perceptualToHex({l:TONAL_LIGHTNESS[step],c:source.c,h:source.h}),
  ])) as Record<PrimaryStep,string>;
}

function alphaHex(color:string,opacity:number) {
  return color+Math.round(255*opacity/100).toString(16).padStart(2,'0');
}

function mappingSteps(mode:ColorMode,family:keyof typeof PRIMARY_MAPPING.light) {
  return PRIMARY_MAPPING[mode][family];
}

function roleBackgrounds(theme:PrimaryTheme,family:keyof typeof PRIMARY_MAPPING.light) {
  const steps=mappingSteps(theme.mode,family);
  return [steps.base,steps.hover,steps.pressed].map(step=>theme.palette[step]);
}

function assignStep(theme:PrimaryTheme,token:string,step:number) {
  const reference=`--primary-${step}`;
  theme.references[token]=reference;
  theme.variables[token]=theme.variables[reference];
}

function setBackgroundFamily(theme:PrimaryTheme,family:keyof typeof PRIMARY_MAPPING.light) {
  const steps=mappingSteps(theme.mode,family);
  const prefix=`--background-primary-${family}`;
  assignStep(theme,prefix,steps.base);
  assignStep(theme,`${prefix}-hover`,steps.hover);
  assignStep(theme,`${prefix}-pressed`,steps.pressed);
  assignStep(theme,`${prefix}-disabled`,steps.disabled);
}

function pickContent(theme:PrimaryTheme,preferred:number,backgrounds:string[],minimum:number) {
  const all:Record<number,string>={0:'#ffffff',...theme.palette,1000:'#000000'};
  return selectContrastStep(all,preferred,backgrounds.map(color=>({color,minimum})),contrastRatio);
}

function setContentFamily(
  theme:PrimaryTheme,
  family:'default'|'default-light'|'secondary'|'inverse'|'inverse-light',
  preferredText:number,
  preferredIcon:number,
  surfaces:string[],
) {
  const textStep=pickContent(theme,preferredText,surfaces,policy.text);
  const iconStep=pickContent(theme,preferredIcon,surfaces,policy.icon);
  for(const state of ['', '-hover','-pressed']) {
    assignStep(theme,`--text-primary-${family}${state}`,textStep);
    assignStep(theme,`--icon-primary-${family}${state}`,iconStep);
  }
  const disabledText=pickContent(theme,preferredText,surfaces,policy.disabled);
  const disabledIcon=pickContent(theme,preferredIcon,surfaces,policy.disabled);
  assignStep(theme,`--text-primary-${family}-disabled`,disabledText);
  assignStep(theme,`--icon-primary-${family}-disabled`,disabledIcon);
}

/**
 * Experimental Material-like strategy:
 * 1) the client HEX is a brand source, not Primary/500;
 * 2) one perceptual tonal palette is generated and shared by Light/Dark;
 * 3) semantic roles use fixed tone mappings per theme;
 * 4) contrast is a guard for content/borders, not the generator of the palette.
 */
export function createTonalColorTheme(input:string,mode:ColorMode='light'):PrimaryTheme {
  const seed=normalizeHex(input);
  if(!seed) throw new Error('Введите HEX из 3 или 6 символов');

  // Reuse the current Base/status implementation so this page compares only Primary strategy.
  const theme=createColorTheme(seed,mode);
  const palette=createTonalPalette(seed);
  theme.palette=palette;

  theme.variables['--brand-source']=seed;
  theme.variables['--primary-0']='#ffffff';
  theme.variables['--primary-1000']='#000000';
  for(const step of primarySteps) theme.variables[`--primary-${step}`]=palette[step];
  for(const opacity of [4,8,16,24,32,40,48]) {
    theme.variables[`--primary-transparent-${String(opacity).padStart(2,'0')}`]=alphaHex(palette[500],opacity);
  }

  for(const family of ['default','secondary','tertiary','inverse'] as const) setBackgroundFamily(theme,family);

  const defaultSurfaces=roleBackgrounds(theme,'default');
  const secondarySurfaces=[
    theme.variables['--background-base-default'],
    theme.variables['--background-base-secondary'],
    ...roleBackgrounds(theme,'secondary'),
    ...roleBackgrounds(theme,'tertiary'),
  ];
  const inverseSurfaces=[
    theme.variables['--background-base-inverse'],
    theme.variables['--background-base-inverse-light'],
    ...roleBackgrounds(theme,'inverse'),
  ];

  if(mode==='light') {
    setContentFamily(theme,'default',25,50,defaultSurfaces);
    setContentFamily(theme,'default-light',100,100,defaultSurfaces);
    setContentFamily(theme,'secondary',600,600,secondarySurfaces);
    setContentFamily(theme,'inverse',100,100,inverseSurfaces);
    setContentFamily(theme,'inverse-light',200,200,inverseSurfaces);
  } else {
    setContentFamily(theme,'default',900,900,defaultSurfaces);
    setContentFamily(theme,'default-light',800,800,defaultSurfaces);
    setContentFamily(theme,'secondary',200,200,secondarySurfaces);
    setContentFamily(theme,'inverse',800,800,inverseSurfaces);
    setContentFamily(theme,'inverse-light',700,700,inverseSurfaces);
  }

  const borderPreferred=mode==='light'
    ? {default:600,hover:700,pressed:800,disabled:300}
    : {default:200,hover:100,pressed:300,disabled:700};
  const borderSurfaces=[
    theme.variables['--background-base-default'],
    theme.variables['--background-base-secondary'],
  ];
  for(const [state,preferred] of Object.entries(borderPreferred)) {
    const minimum=state==='disabled'?policy.disabled:policy.icon;
    const step=pickContent(theme,preferred,borderSurfaces,minimum);
    assignStep(theme,`--border-primary-${state}`,step);
  }

  for(const [state,opacity] of Object.entries({hover:8,focused:16,pressed:24})) {
    const token=`--primary-tonal-transparent-${String(opacity).padStart(2,'0')}`;
    const source=theme.variables[`--primary-${mode==='light'?600:200}`];
    theme.variables[token]=alphaHex(source,opacity);
    theme.references[`--transparent-background-primary-${state}`]=token;
    theme.variables[`--transparent-background-primary-${state}`]=theme.variables[token];
  }
  theme.references['--border-primary-focused']='--primary-tonal-transparent-16';
  theme.variables['--border-primary-focused']=theme.variables['--primary-tonal-transparent-16'];

  const content=theme.variables['--text-primary-default'];
  const fill=theme.variables['--background-primary-default'];
  theme.lightForeground=relativeLuminance(content)>relativeLuminance(fill);
  return theme;
}

export function getTonalProfile(input:string) {
  const source=hexToPerceptual(input);
  const palette=createTonalPalette(input);
  const closest=primarySteps.reduce((best,step)=>{
    const distance=Math.abs(hexToPerceptual(palette[step]).l-source.l);
    return distance<best.distance?{step,distance}:{...best};
  },{step:500 as PrimaryStep,distance:Number.POSITIVE_INFINITY});
  return {
    source,
    closestStep:closest.step,
    closestColor:palette[closest.step],
    palette,
  };
}

export const tonalPrimaryMapping=PRIMARY_MAPPING;
export const tonalLightness=TONAL_LIGHTNESS;
