import { primitiveColorTokens, semanticColorTokens } from './token-catalog';
import { contrastRatio, createPrimaryTheme, DEFAULT_PRIMARY, type ColorMode } from './primary-theme';
import { PRIMARY_CONTRAST_POLICY as policy, selectContrastStep } from './contrast-policy';

/** Dark remaps semantic aliases to existing primitives; it never regenerates a status palette. */
export function createColorTheme(seed:string=DEFAULT_PRIMARY,mode:ColorMode='light') {
  const theme=createPrimaryTheme(seed,mode);
  if(mode==='light') return theme;
  const primitives:Record<string,string>=Object.fromEntries(primitiveColorTokens.map(item=>[item.token,item.value]));
  const set=(token:string,reference:string)=>{theme.references[token]=reference;theme.variables[token]=primitives[reference];};
  const background:Record<string,string>={
    default:'neutral-900',secondary:'neutral-800',tertiary:'neutral-700',inverse:'white-1000','inverse-light':'neutral-50',skeleton:'white-100-16',
    'default-hover':'neutral-800','default-pressed':'neutral-700','default-disabled':'neutral-900',
    'secondary-hover':'neutral-700','secondary-pressed':'neutral-700','secondary-disabled':'neutral-800',
    'tertiary-hover':'neutral-600','tertiary-pressed':'neutral-500','tertiary-disabled':'neutral-800',
    'inverse-hover':'neutral-50','inverse-pressed':'neutral-100','inverse-disabled':'neutral-200',
  };
  for(const [name,reference] of Object.entries(background)) set(`--background-base-${name}`,`--${reference}`);
  for(const kind of ['text','icon']) {
    const roles:Record<string,string>={default:'white-1000','default-light':'neutral-100',secondary:'neutral-200',inverse:'neutral-900','inverse-secondary':'neutral-600'};
    for(const [role,reference] of Object.entries(roles)) for(const state of ['', '-hover','-pressed']) set(`--${kind}-base-${role}${state}`,`--${reference}`);
    for(const role of Object.keys(roles)) set(`--${kind}-base-${role}-disabled`,'--neutral-500');
  }
  for(const family of ['default','secondary','tertiary','light','inverse']) {
    const inverse=family==='inverse';
    set(`--border-base-${family}`,inverse?'--neutral-400':family==='light'?'--white-50-08':family==='default'?'--neutral-300':'--neutral-600');
    set(`--border-base-${family}-hover`,inverse?'--neutral-600':'--neutral-200');
    set(`--border-base-${family}-pressed`,inverse?'--neutral-800':'--neutral-100');
    set(`--border-base-${family}-focused`,inverse?'--neutral-400':'--neutral-200');
    set(`--border-base-${family}-disabled`,inverse?'--neutral-300':'--neutral-700');
  }
  for(const [state,reference] of Object.entries({hover:'white-50-08',focused:'white-100-16',pressed:'white-200-24'})) set(`--transparent-background-base-${state}`,`--${reference}`);
  for(const item of semanticColorTokens) {
    if(!/^--transparent-(text|icon)-/.test(item.token)||!item.reference) continue;
    const reference=item.reference.startsWith('--black-')?item.reference.replace('--black-','--white-'):item.reference.replace('--white-','--black-');
    if(primitives[reference]) set(item.token,reference);
  }
  for(const [role,palette] of Object.entries({success:'green',error:'red',warning:'orange',accent:'purple'})) {
    const color=(step:number)=>primitives[`--${palette}-${step}`];
    const surfaces=['#18191c','#25272c','#3a3d43',color(900),color(800)];
    const steps=Object.fromEntries([25,50,100,200,300,400,500,600,700,800,900].map(step=>[step,color(step)]));
    const foreground=selectContrastStep(steps,policy.onSurface,surfaces.map(background=>({color:background,minimum:policy.text})),contrastRatio);
    const pressed=selectContrastStep(steps,policy.secondaryBackground.dark[2],[{color:color(foreground),minimum:policy.text}],contrastRatio);
    for(const [state,step] of Object.entries({'':900,'-hover':800,'-pressed':pressed,'-disabled':900})) {
      set(`--background-${role}-secondary${state}`,`--${palette}-${step}`);
      set(`--background-${role}-tertiary${state}`,`--${palette}-${step}`);
    }
    for(const kind of ['text','icon']) for(const family of ['secondary','default-light']) {
      for(const state of ['', '-hover','-pressed']) set(`--${kind}-${role}-${family}${state}`,`--${palette}-${foreground}`);
      set(`--${kind}-${role}-${family}-disabled`,`--${palette}-500`);
    }
    for(const state of ['default','hover','pressed','focused']) set(`--border-${role}-${state}`,`--${palette}-${foreground}`);
    set(`--border-${role}-disabled`,`--${palette}-700`);
  }
  return theme;
}
