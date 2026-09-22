import { semanticColorTokens } from './token-catalog';
import { PRIMARY_CONTRAST_POLICY as policy, selectContrastStep } from './contrast-policy';

export const DEFAULT_PRIMARY = '#ffdc00';
export const primarySteps = [25,50,100,200,300,400,500,600,700,800,900] as const;
export type PrimaryStep = typeof primarySteps[number];
export type ColorMode = 'light' | 'dark';
export interface PrimaryTheme {
  mode: ColorMode;
  seed: string;
  palette: Record<PrimaryStep,string>;
  variables: Record<string,string>;
  references: Record<string,string>;
  lightForeground: boolean;
}
export function normalizeHex(value: string): string | null {
  const hex=value.trim().replace(/^#/,'');
  if (/^[\da-f]{3}$/i.test(hex)) return '#'+hex.split('').map(c=>c+c).join('').toLowerCase();
  return /^[\da-f]{6}$/i.test(hex)?'#'+hex.toLowerCase():null;
}
function rgb(hex:string) { return [1,3,5].map(index=>parseInt(hex.slice(index,index+2),16)); }
/** Existing F.Doc ramp: interpolate encoded sRGB channels toward white or black. */
function mix(hex:string, target:number, amount:number) {
  return '#'+rgb(hex).map(channel=>Math.round(channel+(target-channel)*amount).toString(16).padStart(2,'0')).join('');
}
export function relativeLuminance(hex:string):number {
  const normalized=normalizeHex(hex); if(!normalized) throw new Error('Expected an opaque HEX color');
  const [r,g,b]=rgb(normalized).map(value=>{const channel=value/255;return channel<=0.04045?channel/12.92:((channel+0.055)/1.055)**2.4;});
  return .2126*r+.7152*g+.0722*b;
}
/** WCAG 2 contrast, evaluated on unrounded values of final 8-bit sRGB colors. */
export function contrastRatio(first:string,second:string):number {
  const a=relativeLuminance(first),b=relativeLuminance(second);
  return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
}
export function createPrimaryTheme(input:string,mode:ColorMode='light'):PrimaryTheme {
  const seed=normalizeHex(input); if(!seed) throw new Error('Введите HEX из 3 или 6 символов');
  const amounts:Record<PrimaryStep,number>={25:.96,50:.80,100:.72,200:.56,300:.32,400:.16,500:0,600:.16,700:.32,800:.56,900:.72};
  const palette=Object.fromEntries(primarySteps.map(step=>[step,mix(seed,step<500?255:0,amounts[step])])) as Record<PrimaryStep,string>;
  const variables:Record<string,string>={'--primary-0':'#ffffff','--primary-1000':'#000000'};
  const references:Record<string,string>={};
  for(const step of primarySteps) variables[`--primary-${step}`]=palette[step];
  for(const opacity of [4,8,16,24,32,40,48]) variables[`--primary-transparent-${String(opacity).padStart(2,'0')}`]=seed+Math.round(255*opacity/100).toString(16).padStart(2,'0');
  // Preserve every existing semantic name; only Primary values are overridden.
  for(const item of semanticColorTokens) {
    if(!item.token.includes('-primary-') || !item.reference) continue;
    const reference=item.reference.replace('--yellow-','--primary-');
    if(variables[reference]) { references[item.token]=reference; variables[item.token]=variables[reference]; }
  }
  const value=(step:number)=>variables[`--primary-${step}`];
  const allSteps:Record<number,string>={0:'#ffffff',...palette,1000:'#000000'};
  const pick=(backgrounds:string[],minimum:number,preferred:number,accept?:(color:string)=>boolean)=>selectContrastStep(allSteps,preferred,backgrounds.map(color=>({color,minimum})),contrastRatio,accept);
  const assign=(token:string,step:number)=>{references[token]=`--primary-${step}`;variables[token]=value(step);};
  // A stable foreground across Default/Hover/Pressed avoids color flicker.
  const main=pick([seed],policy.text,policy.onFill);
  const lightForeground=relativeLuminance(value(main))>relativeLuminance(seed);
  const hover=lightForeground?600:400,pressed=lightForeground?700:300;
  assign('--background-primary-default-hover',hover); assign('--background-primary-default-pressed',pressed);
  const activeBackgrounds=[seed,palette[hover],palette[pressed]];
  const mainIcon=pick(activeBackgrounds,policy.icon,policy.onFillIcon,color=>(relativeLuminance(color)>relativeLuminance(seed))===lightForeground);
  const [inverseDefault,inverseHover,nominalInversePressed]=policy.inverseBackground[mode];
  const inverseText=pick([palette[inverseDefault],palette[inverseHover]],policy.text,policy.inverseContent[mode]);
  const inversePressed=pick([value(inverseText)],policy.text,nominalInversePressed);
  assign('--background-primary-inverse',inverseDefault);
  assign('--background-primary-inverse-hover',inverseHover);
  assign('--background-primary-inverse-pressed',inversePressed);
  const lightSurfaces=mode==='dark'?['#18191c','#25272c','#3a3d43',palette[900],palette[800]]:['#ffffff','#f8f8f9','#cfd1d3',palette[100],palette[200]];
  const darkSurfaces=mode==='dark'?['#ffffff','#dddee0','#cfd1d3']:['#25272c','#3a3d43','#474b53'];
  for(const kind of ['text','icon']) {
    const minimum=policy[kind as 'text'|'icon'];
    const onLight=pick(lightSurfaces,minimum,policy.onSurface);
    const onDark=pick(darkSurfaces,minimum,policy.onInverseSurface);
    const onInverse=pick([palette[inverseDefault],palette[inverseHover],value(inversePressed)],minimum,policy.inverseContent[mode]);
    const disabled=pick([palette[100]],policy.disabled,policy.disabledContent);
    for(const state of ['', '-hover','-pressed']) {
      assign(`--${kind}-primary-default${state}`,main);
      assign(`--${kind}-primary-default-light${state}`,kind==='text'?main:mainIcon);
      assign(`--${kind}-primary-secondary${state}`,onLight);
      assign(`--${kind}-primary-inverse${state}`,onInverse);
      assign(`--${kind}-primary-inverse-light${state}`,onDark);
    }
    assign(`--${kind}-primary-default-disabled`,disabled);
    assign(`--${kind}-primary-default-light-disabled`,disabled);
    assign(`--${kind}-primary-secondary-disabled`,pick(lightSurfaces,policy.disabled,policy.disabledContent));
    assign(`--${kind}-primary-inverse-disabled`,pick([seed],policy.disabled,policy.disabledContent));
    assign(`--${kind}-primary-inverse-light-disabled`,pick([mode==='dark'?'#b4b6ba':'#70747c'],policy.disabled,policy.disabledContent));
  }
  if(mode==='dark') {
    const safePressed=selectContrastStep(allSteps,policy.secondaryBackground.dark[2],[{color:variables['--text-primary-secondary'],minimum:policy.text},{color:variables['--icon-primary-secondary'],minimum:policy.icon}],contrastRatio);
    for(const [state,step] of Object.entries({'':900,'-hover':800,'-pressed':safePressed,'-disabled':900})) assign(`--background-primary-secondary${state}`,step);
    for(const [state,step] of Object.entries({'':800,'-hover':900,'-pressed':800,'-disabled':900})) assign(`--background-primary-tertiary${state}`,step);
  }
  assign('--border-primary-focused',pick(lightSurfaces,policy.icon,policy.onSurface));
  // Interaction overlays must be visible on the current surface even for white/black seeds.
  for(const [state,opacity] of Object.entries({hover:8,focused:16,pressed:24})) {
    const reference=`--primary-interaction-transparent-${String(opacity).padStart(2,'0')}`;
    variables[reference]=variables['--icon-primary-secondary']+Math.round(255*opacity/100).toString(16).padStart(2,'0');
    references[`--transparent-background-primary-${state}`]=reference;
    variables[`--transparent-background-primary-${state}`]=variables[reference];
  }
  return {seed,palette,variables,references,lightForeground,mode};
}

/** Apply to :root so portal menus and all component stories share the same theme. */
export function primaryThemeCss(theme:PrimaryTheme):string {
  return ':root {\n  color-scheme: '+theme.mode+';\n'+Object.entries(theme.variables).map(([name,value])=>`  ${name}: ${theme.references[name]?`var(${theme.references[name]})`:value};`).join('\n')+'\n}\n\n/* Keep the selected Switch thumb contrasting. */\n.fdoc-control[data-kind="switch"] input:checked:not(:disabled) + .fdoc-control__shape .fdoc-control__mark { background: var(--icon-primary-default); }';
}
