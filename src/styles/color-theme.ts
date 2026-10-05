import { primitiveColorTokens } from './token-catalog';
import { contrastRatio, createPrimaryTheme, DEFAULT_PRIMARY, type ColorMode } from './primary-theme';
import { PRIMARY_CONTRAST_POLICY as policy, selectContrastStep } from './contrast-policy';

/**
 * Dark keeps primitive palettes intact and remaps semantic roles to primitives
 * that are appropriate for dark surfaces.
 */
export function createColorTheme(seed:string=DEFAULT_PRIMARY,mode:ColorMode='light') {
  const theme=createPrimaryTheme(seed,mode);
  if(mode==='light') return theme;

  const primitives:Record<string,string>=Object.fromEntries(primitiveColorTokens.map(item=>[item.token,item.value]));
  const set=(token:string,reference:string)=>{
    const value=primitives[reference]??theme.variables[reference];
    if(!value) throw new Error(`Unknown color reference: ${reference}`);
    theme.references[token]=reference;
    theme.variables[token]=value;
  };

  // Base surfaces. Normal roles become dark; inverse roles become light.
  const background:Record<string,string>={
    default:'neutral-900',
    'default-hover':'neutral-800',
    'default-pressed':'neutral-700',
    'default-disabled':'neutral-900',

    secondary:'neutral-800',
    'secondary-hover':'neutral-700',
    'secondary-pressed':'neutral-600',
    'secondary-disabled':'neutral-800',

    tertiary:'neutral-700',
    'tertiary-hover':'neutral-600',
    'tertiary-pressed':'neutral-500',
    'tertiary-disabled':'neutral-800',

    inverse:'white-1000',
    'inverse-hover':'neutral-50',
    'inverse-pressed':'neutral-100',
    'inverse-disabled':'neutral-200',

    'inverse-light':'neutral-50',
    'inverse-light-hover':'neutral-100',
    'inverse-light-pressed':'neutral-200',
    'inverse-light-disabled':'neutral-300',

    skeleton:'white-100-16',
  };
  for(const [name,reference] of Object.entries(background)) set(`--background-base-${name}`,`--${reference}`);

  // Base text/icon roles keep their semantic hierarchy in Dark instead of
  // collapsing Hover/Pressed to one value.
  const baseContent:Record<string,Record<string,string>>={
    default:{
      '':'white-1000',
      '-hover':'neutral-50',
      '-pressed':'neutral-100',
      '-disabled':'neutral-500',
    },
    'default-light':{
      '':'neutral-100',
      '-hover':'neutral-200',
      '-pressed':'neutral-300',
      '-disabled':'neutral-500',
    },
    secondary:{
      '':'neutral-200',
      '-hover':'neutral-100',
      '-pressed':'neutral-50',
      '-disabled':'neutral-500',
    },
    inverse:{
      '':'neutral-900',
      '-hover':'neutral-800',
      '-pressed':'neutral-700',
      '-disabled':'neutral-500',
    },
    'inverse-secondary':{
      '':'neutral-600',
      '-hover':'neutral-700',
      '-pressed':'neutral-800',
      '-disabled':'neutral-500',
    },
  };
  for(const kind of ['text','icon']) {
    for(const [role,states] of Object.entries(baseContent)) {
      for(const [state,reference] of Object.entries(states)) set(`--${kind}-base-${role}${state}`,`--${reference}`);
    }
  }

  const baseBorders:Record<string,Record<string,string>>={
    default:{
      '':'neutral-300',
      '-hover':'neutral-200',
      '-focused':'white-100-16',
      '-pressed':'neutral-100',
      '-disabled':'neutral-700',
    },
    secondary:{
      '':'neutral-600',
      '-hover':'neutral-500',
      '-focused':'white-100-16',
      '-pressed':'neutral-400',
      '-disabled':'neutral-800',
    },
    tertiary:{
      '':'neutral-800',
      '-hover':'neutral-700',
      '-focused':'white-100-16',
      '-pressed':'neutral-600',
      '-disabled':'neutral-800',
    },
    light:{
      '':'white-50-08',
      '-hover':'white-100-16',
      '-focused':'white-100-16',
      '-pressed':'white-200-24',
      '-disabled':'white-50-08',
    },
    inverse:{
      '':'neutral-400',
      '-hover':'neutral-600',
      '-focused':'neutral-transparent-16',
      '-pressed':'neutral-800',
      '-disabled':'neutral-300',
    },
  };
  for(const [family,states] of Object.entries(baseBorders)) {
    for(const [state,reference] of Object.entries(states)) set(`--border-base-${family}${state}`,`--${reference}`);
  }

  for(const [state,reference] of Object.entries({
    hover:'white-50-08',
    focused:'white-100-16',
    pressed:'white-200-24',
  })) set(`--transparent-background-base-${state}`,`--${reference}`);

  // Transparent content changes polarity together with the surface.
  for(const item of primitiveColorTokens) {
    void item;
  }
  // These semantic aliases are generated from their Light references by
  // swapping black and white while keeping the same opacity.
  // The source list is intentionally explicit so literal white/black tokens
  // themselves remain literal and are not theme-dependent.
  const transparentFamilies=[
    'default','default-light','secondary','inverse','inverse-light',
  ];
  const transparentStates=['','-hover','-pressed','-disabled'];
  const opacityByRole:Record<string,string[]>={
    default:['900-80','800-72','700-64','600-56'],
    'default-light':['700-64','600-56','500-48','400-40'],
    secondary:['500-48','400-40','300-32','200-24'],
    inverse:['50-08','100-16','200-24','500-48'],
    'inverse-light':['200-24','300-32','400-40','700-64'],
  };
  for(const kind of ['text','icon']) {
    for(const role of transparentFamilies) {
      const refs=opacityByRole[role];
      for(let i=0;i<transparentStates.length;i++) {
        const state=transparentStates[i];
        const lightSide=!role.startsWith('inverse');
        set(`--transparent-${kind}-${role}${state}`,`--${lightSide?'white':'black'}-${refs[i]}`);
      }
    }
  }

  const neutral=(step:number)=>primitives[`--neutral-${step}`];
  const baseDarkSurfaces=[neutral(900),neutral(800),neutral(700)];
  const baseInverseSurfaces=[primitives['--white-1000'],neutral(50),neutral(100)];

  for(const [role,palette] of Object.entries({success:'green',error:'red',warning:'orange',accent:'purple'})) {
    const color=(step:number)=>primitives[`--${palette}-${step}`];
    const steps=Object.fromEntries([25,50,100,200,300,400,500,600,700,800,900].map(step=>[step,color(step)]));
    const pick=(preferred:number,surfaces:string[],minimum:number)=>
      selectContrastStep(steps,preferred,surfaces.map(background=>({color:background,minimum})),contrastRatio);

    // Solid Default status fills are intentionally brand-independent and stay
    // on the same palette steps. Surface roles around them are theme-dependent.
    const secondarySteps={'':900,'-hover':800,'-pressed':700,'-disabled':900} as const;
    const tertiarySteps={'':700,'-hover':800,'-pressed':900,'-disabled':800} as const;
    const inverseSteps={'':50,'-hover':100,'-pressed':200,'-disabled':200} as const;

    for(const [state,step] of Object.entries(secondarySteps)) set(`--background-${role}-secondary${state}`,`--${palette}-${step}`);
    for(const [state,step] of Object.entries(tertiarySteps)) set(`--background-${role}-tertiary${state}`,`--${palette}-${step}`);
    for(const [state,step] of Object.entries(inverseSteps)) set(`--background-${role}-inverse${state}`,`--${palette}-${step}`);

    const statusDarkSurfaces=[
      ...baseDarkSurfaces,
      ...Object.values(secondarySteps).slice(0,3).map(step=>color(step)),
      ...Object.values(tertiarySteps).slice(0,3).map(step=>color(step)),
    ];
    const statusInverseSurfaces=[
      ...baseInverseSurfaces,
      ...Object.values(inverseSteps).slice(0,3).map(step=>color(step)),
    ];

    const contentPreferences={
      default:[50,100,200],
      'default-light':[200,300,400],
      secondary:[500,400,300],
      inverse:[900,800,700],
      'inverse-light':[800,700,600],
    } as const;

    for(const kind of ['text','icon'] as const) {
      const minimum=policy[kind];
      for(const [family,preferences] of Object.entries(contentPreferences)) {
        const surfaces=family==='default'
          ? baseDarkSurfaces
          : family==='inverse'
            ? statusInverseSurfaces
            : family==='inverse-light'
              ? baseInverseSurfaces
              : statusDarkSurfaces;

        for(const [index,state] of ['', '-hover','-pressed'].entries()) {
          const pairs=[...surfaces];
          if(role==='error'&&kind==='icon'&&family==='inverse') pairs.push(color(500));
          const step=pick(preferences[index],pairs,minimum);
          set(`--${kind}-${role}-${family}${state}`,`--${palette}-${step}`);
        }

        const disabledPreferred=family.startsWith('inverse')?600:500;
        const disabledStep=pick(disabledPreferred,surfaces,policy.disabled);
        set(`--${kind}-${role}-${family}-disabled`,`--${palette}-${disabledStep}`);
      }
    }

    // Borders are semantic content on dark Base surfaces, so their opaque
    // states also follow Dark contrast rather than retaining Light aliases.
    for(const [state,preferred] of Object.entries({'':500,'-hover':400,'-pressed':300})) {
      const step=pick(preferred,baseDarkSurfaces,policy.icon);
      set(`--border-${role}-${state||'default'}`,`--${palette}-${step}`);
    }
    set(`--border-${role}-focused`,`--${palette}-transparent-16`);
    const disabledBorder=pick(600,baseDarkSurfaces,policy.disabled);
    set(`--border-${role}-disabled`,`--${palette}-${disabledBorder}`);
  }

  return theme;
}
