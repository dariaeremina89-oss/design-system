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

export interface OklchColor {
  l: number;
  c: number;
  h: number;
}

const DARK_PRIMARY_MIN_L = 0.62;
const DARK_PRIMARY_MAX_L = 0.78;

function srgbToLinear(value:number) {
  return value<=0.04045?value/12.92:Math.pow((value+0.055)/1.055,2.4);
}
function linearToSrgb(value:number) {
  return value<=0.0031308?12.92*value:1.055*Math.pow(value,1/2.4)-0.055;
}
function hexChannels(input:string) {
  const hex=normalizeHex(input);
  if(!hex) throw new Error('Введите HEX из 3 или 6 символов');
  return [1,3,5].map(index=>parseInt(hex.slice(index,index+2),16)/255);
}

export function hexToOklch(input:string):OklchColor {
  const [r,g,b]=hexChannels(input).map(srgbToLinear);
  const l=0.4122214708*r+0.5363325363*g+0.0514459929*b;
  const m=0.2119034982*r+0.6806995451*g+0.1073969566*b;
  const s=0.0883024619*r+0.2817188376*g+0.6299787005*b;
  const lRoot=Math.cbrt(l),mRoot=Math.cbrt(m),sRoot=Math.cbrt(s);
  const lightness=0.2104542553*lRoot+0.7936177850*mRoot-0.0040720468*sRoot;
  const a=1.9779984951*lRoot-2.4285922050*mRoot+0.4505937099*sRoot;
  const bAxis=0.0259040371*lRoot+0.7827717662*mRoot-0.8086757660*sRoot;
  const chroma=Math.hypot(a,bAxis);
  const hue=chroma<1e-8?0:(Math.atan2(bAxis,a)*180/Math.PI+360)%360;
  return {l:lightness,c:chroma,h:hue};
}

function oklabToLinearRgb(l:number,a:number,b:number) {
  const lRoot=l+0.3963377774*a+0.2158037573*b;
  const mRoot=l-0.1055613458*a-0.0638541728*b;
  const sRoot=l-0.0894841775*a-1.2914855480*b;
  const ll=lRoot*lRoot*lRoot,mm=mRoot*mRoot*mRoot,ss=sRoot*sRoot*sRoot;
  return [
    4.0767416621*ll-3.3077115913*mm+0.2309699292*ss,
    -1.2684380046*ll+2.6097574011*mm-0.3413193965*ss,
    -0.0041960863*ll-0.7034186147*mm+1.7076147010*ss,
  ];
}

function inGamut(values:number[]) {
  return values.every(value=>value>=0&&value<=1);
}

export function oklchToHex({l,c,h}:OklchColor):string {
  const angle=h*Math.PI/180;
  const rgbAt=(chroma:number)=>oklabToLinearRgb(l,chroma*Math.cos(angle),chroma*Math.sin(angle));
  let chroma=c;
  let linear=rgbAt(chroma);
  if(!inGamut(linear)) {
    let low=0,high=c;
    for(let iteration=0;iteration<28;iteration++) {
      const middle=(low+high)/2;
      const candidate=rgbAt(middle);
      if(inGamut(candidate)) low=middle;
      else high=middle;
    }
    chroma=low;
    linear=rgbAt(chroma);
  }
  return '#'+linear.map(channel=>{
    const encoded=Math.max(0,Math.min(1,linearToSrgb(channel)));
    return Math.round(encoded*255).toString(16).padStart(2,'0');
  }).join('');
}

const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));

export function createOklchDarkPalette(input:string):Record<PrimaryStep,string> {
  const seed=normalizeHex(input);
  if(!seed) throw new Error('Введите HEX из 3 или 6 символов');
  const source=hexToOklch(seed);
  const baseL=clamp(source.l,DARK_PRIMARY_MIN_L,DARK_PRIMARY_MAX_L);
  const targets:Record<PrimaryStep,number>={
    25:Math.min(.98,baseL+.30),
    50:Math.min(.94,baseL+.24),
    100:Math.min(.90,baseL+.20),
    200:Math.min(.86,baseL+.16),
    300:Math.min(.82,baseL+.10),
    400:Math.min(.80,baseL+.05),
    500:baseL,
    600:Math.max(.60,baseL-.03),
    700:Math.max(.48,baseL-.10),
    800:Math.min(.46,baseL-.18),
    900:Math.min(.36,baseL-.28),
  };
  return Object.fromEntries(primarySteps.map(step=>[
    step,
    oklchToHex({l:targets[step],c:source.c,h:source.h}),
  ])) as Record<PrimaryStep,string>;
}

function alphaHex(color:string,opacity:number) {
  return color+Math.round(255*opacity/100).toString(16).padStart(2,'0');
}

/**
 * Experimental branding strategy.
 * Light is intentionally identical to the current generator.
 * Dark builds a separate perceptual Primary ramp in OKLCH:
 * - brand hue is preserved;
 * - chroma is kept as high as the sRGB gamut permits;
 * - Dark 500 lightness is clamped to 0.62–0.78;
 * - Default / Hover / Pressed always map to 500 / 400 / 600.
 */
export function createOklchColorTheme(input:string,mode:ColorMode='light'):PrimaryTheme {
  const seed=normalizeHex(input);
  if(!seed) throw new Error('Введите HEX из 3 или 6 символов');
  if(mode==='light') return createColorTheme(seed,'light');

  // Reuse the production Dark Base/status semantics; only Primary is replaced.
  const theme=createColorTheme(seed,'dark');
  const palette=createOklchDarkPalette(seed);
  theme.palette=palette;

  theme.variables['--primary-0']='#ffffff';
  theme.variables['--primary-1000']='#000000';
  for(const step of primarySteps) theme.variables[`--primary-${step}`]=palette[step];
  for(const opacity of [4,8,16,24,32,40,48]) {
    theme.variables[`--primary-transparent-${String(opacity).padStart(2,'0')}`]=alphaHex(palette[500],opacity);
  }

  // First re-resolve any existing Primary semantic aliases against the OKLCH ramp.
  for(const [token,reference] of Object.entries(theme.references)) {
    if(/^--primary-(?:0|25|50|100|200|300|400|500|600|700|800|900|1000)$/.test(reference)) {
      theme.variables[token]=theme.variables[reference];
    }
  }

  const allSteps:Record<number,string>={0:'#ffffff',...palette,1000:'#000000'};
  const assign=(token:string,step:number)=>{
    const reference=`--primary-${step}`;
    theme.references[token]=reference;
    theme.variables[token]=theme.variables[reference];
  };
  const pick=(preferred:number,backgrounds:string[],minimum:number)=>
    selectContrastStep(allSteps,preferred,backgrounds.map(color=>({color,minimum})),contrastRatio);

  // Predictable component states: same semantic step numbers for every brand.
  assign('--background-primary-default',500);
  assign('--background-primary-default-hover',400);
  assign('--background-primary-default-pressed',600);
  assign('--background-primary-default-disabled',700);

  for(const [state,step] of Object.entries({'':900,'-hover':800,'-pressed':900,'-disabled':900})) {
    assign(`--background-primary-secondary${state}`,step);
  }
  for(const [state,step] of Object.entries({'':800,'-hover':900,'-pressed':800,'-disabled':900})) {
    assign(`--background-primary-tertiary${state}`,step);
  }
  for(const [state,step] of Object.entries({'':50,'-hover':100,'-pressed':200,'-disabled':200})) {
    assign(`--background-primary-inverse${state}`,step);
  }

  const defaultSurfaces=[palette[400],palette[500],palette[600]];
  const secondarySurfaces=[
    theme.variables['--background-base-default'],
    theme.variables['--background-base-secondary'],
    theme.variables['--background-base-tertiary'],
    palette[900],palette[800],
  ];
  const inverseSurfaces=[
    theme.variables['--background-base-inverse'],
    theme.variables['--background-base-inverse-light'],
    palette[50],palette[100],palette[200],
  ];

  const defaultText=pick(1000,defaultSurfaces,policy.text);
  const defaultIcon=pick(1000,defaultSurfaces,policy.icon);
  const secondaryText=pick(400,secondarySurfaces,policy.text);
  const secondaryIcon=pick(400,secondarySurfaces,policy.icon);
  const inverseText=pick(900,inverseSurfaces,policy.text);
  const inverseIcon=pick(900,inverseSurfaces,policy.icon);

  for(const state of ['', '-hover','-pressed']) {
    assign(`--text-primary-default${state}`,defaultText);
    assign(`--text-primary-default-light${state}`,defaultText);
    assign(`--icon-primary-default${state}`,defaultIcon);
    assign(`--icon-primary-default-light${state}`,defaultIcon);

    assign(`--text-primary-secondary${state}`,secondaryText);
    assign(`--icon-primary-secondary${state}`,secondaryIcon);

    assign(`--text-primary-inverse${state}`,inverseText);
    assign(`--text-primary-inverse-light${state}`,inverseText);
    assign(`--icon-primary-inverse${state}`,inverseIcon);
    assign(`--icon-primary-inverse-light${state}`,inverseIcon);
  }

  const disabledOnDark=pick(600,[theme.variables['--background-base-default']],policy.disabled);
  const disabledOnLight=pick(700,[theme.variables['--background-base-inverse']],policy.disabled);
  for(const kind of ['text','icon']) {
    assign(`--${kind}-primary-default-disabled`,disabledOnDark);
    assign(`--${kind}-primary-default-light-disabled`,disabledOnDark);
    assign(`--${kind}-primary-secondary-disabled`,disabledOnDark);
    assign(`--${kind}-primary-inverse-disabled`,disabledOnLight);
    assign(`--${kind}-primary-inverse-light-disabled`,disabledOnLight);
  }

  assign('--border-primary-default',500);
  assign('--border-primary-hover',400);
  assign('--border-primary-pressed',600);
  assign('--border-primary-disabled',700);

  for(const [state,opacity] of Object.entries({hover:8,focused:16,pressed:24})) {
    const primitive=`--primary-oklch-interaction-${String(opacity).padStart(2,'0')}`;
    theme.variables[primitive]=alphaHex(theme.variables[`--primary-${secondaryIcon}`],opacity);
    theme.references[`--transparent-background-primary-${state}`]=primitive;
    theme.variables[`--transparent-background-primary-${state}`]=theme.variables[primitive];
  }
  theme.references['--border-primary-focused']='--primary-oklch-interaction-16';
  theme.variables['--border-primary-focused']=theme.variables['--primary-oklch-interaction-16'];

  theme.lightForeground=relativeLuminance(theme.variables[`--primary-${defaultText}`])>relativeLuminance(palette[500]);
  return theme;
}

export function getOklchDarkBrandProfile(input:string) {
  const seed=normalizeHex(input);
  if(!seed) throw new Error('Введите HEX из 3 или 6 символов');
  const source=hexToOklch(seed);
  const palette=createOklchDarkPalette(seed);
  const dark500=hexToOklch(palette[500]);
  return {
    source,
    dark500,
    sourceHex:seed,
    dark500Hex:palette[500],
    lightnessWasAdjusted:Math.abs(source.l-dark500.l)>0.0005,
  };
}
