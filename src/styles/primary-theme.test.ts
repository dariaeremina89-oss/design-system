import { describe, expect, it, afterEach } from 'vitest';
import { contrastRatio, createPrimaryTheme, DEFAULT_PRIMARY, normalizeHex, primarySteps, relativeLuminance, primaryThemeCss } from './primary-theme';
import { createColorTheme } from './color-theme';
import { applyColorMode, applyPrimaryTheme, getPrimarySeed, getColorMode } from './primary-theme-store';
import { primitiveColorTokens, semanticColorTokens } from './token-catalog';

afterEach(()=>applyPrimaryTheme(null,true,'light'));
const original:Record<string,string>=Object.fromEntries([...primitiveColorTokens,...semanticColorTokens].map(item=>[item.token,item.value]));
describe('Primary color theme',()=>{
  it('accepts only opaque HEX and expands short forms',()=>{
    expect(normalizeHex(' A0f ')).toBe('#aa00ff');
    for(const invalid of ['','#12','#abcd','#11223344','red','rgb(0,0,0)','<style>']) expect(normalizeHex(invalid)).toBeNull();
    expect(()=>createPrimaryTheme('#12')).toThrow();
    expect(contrastRatio('#000','#fff')).toBe(21);
  });
  it('reproduces the existing F.Doc primitive ramp exactly and preserves all semantic names',()=>{
    const theme=createPrimaryTheme(DEFAULT_PRIMARY);
    for(const step of primarySteps) expect(theme.palette[step]).toBe(original[`--yellow-${step}`]);
    const primary=semanticColorTokens.filter(item=>item.token.includes('-primary-')).map(item=>item.token);
    expect(Object.keys(theme.variables).filter(key=>!key.startsWith('--primary-')).sort()).toEqual(primary.sort());
    for(const [token,reference] of Object.entries(theme.references)) expect(theme.variables[token]).toBe(theme.variables[reference]);
  });
  it('keeps the seed exact and contrast safe across saturated, pale, dark and intermediate colors in both modes',()=>{
    const colors=['#000000','#ffffff','#ff0000','#00ff00','#0000ff','#777777','#ffdc00','#2f26ff','#171329','#f4e5fa','#008567','#8b1245'];
    let random=321;
    for(let i=0;i<300;i++){random=(Math.imul(random,1664525)+1013904223)>>>0;colors.push('#'+(random&0xffffff).toString(16).padStart(6,'0'));}
    for(const seed of colors) for(const mode of ['light','dark'] as const) {
      const theme=createColorTheme(seed,mode);
      const {palette,variables:v}=theme;
      expect(palette[500]).toBe(seed);
      if(mode==='light') expect(v['--background-primary-default']).toBe(seed);
      else {
        expect(contrastRatio(v['--background-primary-default'],'#18191c')).toBeGreaterThanOrEqual(3);
        const reference=theme.references['--background-primary-default'];
        expect(reference).toMatch(/^--primary-/);
        expect(v['--background-primary-default']).toBe(v[reference]);
      }
      for(let i=1;i<primarySteps.length;i++) expect(relativeLuminance(palette[primarySteps[i]])).toBeLessThanOrEqual(relativeLuminance(palette[primarySteps[i-1]])+1e-9);
      for(const state of ['', '-hover','-pressed']) {
        expect(contrastRatio(v['--text-primary-default'],v[`--background-primary-default${state}`])).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(v['--icon-primary-default-light'],v[`--background-primary-default${state}`])).toBeGreaterThanOrEqual(3);
        expect(contrastRatio(v[`--text-primary-inverse${state}`],v[`--background-primary-inverse${state}`])).toBeGreaterThanOrEqual(4.5);
        for(const role of ['secondary','tertiary']) {
          expect(contrastRatio(v[`--text-primary-secondary${state}`],v[`--background-primary-${role}${state}`])).toBeGreaterThanOrEqual(4.5);
          expect(contrastRatio(v[`--icon-primary-secondary${state}`],v[`--background-primary-${role}${state}`])).toBeGreaterThanOrEqual(3);
        }
        const base=v[`--background-base-default${state}`]??original[`--background-base-default${state}`];
        expect(contrastRatio(v[`--text-primary-secondary${state}`],base)).toBeGreaterThanOrEqual(4.5);
        const inverse=v[`--background-base-inverse${state}`]??original[`--background-base-inverse${state}`];
        expect(contrastRatio(v[`--text-primary-inverse-light${state}`],inverse)).toBeGreaterThanOrEqual(4.5);
      }
      for(const key of Object.keys(v)) expect(key).not.toMatch(/^--(?:neutral|yellow|green|red|purple|orange|client|violet|white|black)-/);
    }
  });
  it('keeps Primary 500 as the brand anchor but adapts the semantic Default fill in Dark',()=>{
    const cases=[
      ['#f4e5fa',700],
      ['#171329',200],
      ['#ffdc00',700],
      ['#2f26ff',300],
      ['#008567',500],
      ['#8b1245',300],
    ] as const;
    for(const [seed,expectedStep] of cases) {
      const light=createColorTheme(seed,'light');
      const dark=createColorTheme(seed,'dark');
      expect(light.palette[500]).toBe(seed);
      expect(dark.palette[500]).toBe(seed);
      expect(light.references['--background-primary-default']).toBe('--primary-500');
      expect(dark.references['--background-primary-default']).toBe(`--primary-${expectedStep}`);
      expect(contrastRatio(dark.variables['--background-primary-default'],'#18191c')).toBeGreaterThanOrEqual(3);
      for(const state of ['', '-hover','-pressed']) {
        expect(contrastRatio(dark.variables['--text-primary-default'],dark.variables[`--background-primary-default${state}`])).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(dark.variables['--icon-primary-default-light'],dark.variables[`--background-primary-default${state}`])).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it('shares every primitive across modes while remapping semantic surfaces',()=>{
    for(const seed of [DEFAULT_PRIMARY,'#2f26ff','#008567','#8b1245','#f4e5fa','#171329']) {
      const light=createColorTheme(seed,'light'),dark=createColorTheme(seed,'dark');
      expect(dark.palette).toEqual(light.palette);
      expect(dark.references['--background-primary-secondary']).toBe('--primary-900');
      expect(light.references['--background-primary-secondary']).toBe('--primary-25');
      expect(dark.references['--background-primary-inverse']).toBe('--primary-50');
      expect(light.references['--background-primary-inverse']).toBe('--primary-900');
      applyPrimaryTheme(seed,true,'light');
      applyColorMode('dark');
      for(const step of primarySteps) {
        expect(document.documentElement.style.getPropertyValue(`--primary-${step}`)).toBe(dark.palette[step]);
        expect(primaryThemeCss(dark)).toContain(`--primary-${step}: ${dark.palette[step]};`);
      }
      applyColorMode('light');
      for(const step of primarySteps) expect(document.documentElement.style.getPropertyValue(`--primary-${step}`)).toBe(light.palette[step]);
      expect(getPrimarySeed()).toBe(seed);
    }
  });
  it('Dark remaps every component-facing Base and status semantic family that depends on the surface',()=>{
    const dark=createColorTheme(DEFAULT_PRIMARY,'dark');
    const originalReferences=Object.fromEntries(semanticColorTokens.map(item=>[item.token,item.reference]));

    const baseTokens=[
      '--background-base-default','--background-base-secondary','--background-base-tertiary',
      '--background-base-inverse','--background-base-inverse-light',
      '--background-base-inverse-light-hover','--background-base-inverse-light-pressed','--background-base-inverse-light-disabled',
      '--text-base-default','--text-base-default-hover','--text-base-default-pressed',
      '--text-base-default-light','--text-base-secondary','--text-base-inverse','--text-base-inverse-secondary',
      '--icon-base-default','--icon-base-default-light','--icon-base-secondary','--icon-base-inverse','--icon-base-inverse-secondary',
      '--border-base-default','--border-base-secondary','--border-base-tertiary','--border-base-light','--border-base-inverse',
    ];
    for(const token of baseTokens) {
      expect(dark.references[token],token).toBeTruthy();
      expect(dark.references[token],token).not.toBe(originalReferences[token]);
    }

    for(const role of ['success','error','warning','accent']) {
      for(const token of [
        `--background-${role}-secondary`,`--background-${role}-tertiary`,`--background-${role}-inverse`,
        `--text-${role}-default`,`--text-${role}-default-light`,`--text-${role}-secondary`,`--text-${role}-inverse`,`--text-${role}-inverse-light`,
        `--icon-${role}-default`,`--icon-${role}-default-light`,`--icon-${role}-secondary`,`--icon-${role}-inverse`,`--icon-${role}-inverse-light`,
      ]) {
        expect(dark.references[token],token).toBeTruthy();
        expect(dark.references[token],token).not.toBe(originalReferences[token]);
      }
      for(const token of [`--border-${role}-default`,`--border-${role}-hover`,`--border-${role}-pressed`]) {
        expect(dark.references[token],token).toBeTruthy();
      }
      // Solid status fills are semantic anchors just like Primary 500.
      expect(dark.variables[`--background-${role}-default`]??original[`--background-${role}-default`]).toBe(original[`--background-${role}-default`]);
    }
    expect(dark.variables['--background-primary-default']).toBe(DEFAULT_PRIMARY);
  });

  it('Dark is available with the F.Doc seed and never changes status values when the brand changes',()=>{
    const fdoc=createColorTheme(DEFAULT_PRIMARY,'dark'), client=createColorTheme('#2f26ff','dark');
    expect(fdoc.variables['--background-base-default']).toBe('#18191c');
    for(const [token,value] of Object.entries(fdoc.variables)) {
      if(!token.includes('-primary-'))expect(client.variables[token]).toBe(value);
    }
    for(const role of ['success','error','warning','accent']) for(const state of ['', '-hover','-pressed']) expect(contrastRatio(fdoc.variables[`--text-${role}-default-light`],fdoc.variables[`--background-${role}-secondary${state}`])).toBeGreaterThanOrEqual(4.5);
    expect(primaryThemeCss(fdoc)).toContain('color-scheme: dark');
    expect(fdoc.references['--background-primary-default']).toMatch(/^--primary-/);
    expect(primaryThemeCss(fdoc)).toContain(`--background-primary-default: var(${fdoc.references['--background-primary-default']})`);
  });
  it('preserves 16 percent alpha for focus halos and in exported references',()=>{
    for(const mode of ['light','dark'] as const) for(const seed of [DEFAULT_PRIMARY,'#2f26ff','#000000','#ffffff']) {
      const theme=createColorTheme(seed,mode);
      for(const role of ['primary','base-default','base-secondary','base-tertiary','base-light','base-inverse','success','error','warning','accent']) {
        const token=`--border-${role}-focused`;
        const color=theme.variables[token]??original[token];
        expect(color,`${mode}: ${token}`).toMatch(/^#[0-9a-f]{6}29$/i);
        if(theme.references[token]) expect(primaryThemeCss(theme)).toContain(`${token}: var(${theme.references[token]})`);
      }
    }
  });
  it('switches modes without losing the seed and reset removes overrides from the whole document',()=>{
    applyColorMode('dark');expect(getPrimarySeed()).toBeNull();expect(getColorMode()).toBe('dark');
    expect(document.documentElement.style.getPropertyValue('--primary-500')).toBe(DEFAULT_PRIMARY);
    expect(document.documentElement.style.getPropertyValue('--background-primary-default')).not.toBe('');
    applyPrimaryTheme('#123abc');applyColorMode('light');expect(getPrimarySeed()).toBe('#123abc');
    expect(document.documentElement.style.getPropertyValue('--background-base-default')).toBe('');
    expect(document.documentElement.style.getPropertyValue('--yellow-500')).toBe('');
    applyPrimaryTheme(null,true,'light');expect(document.documentElement.style.getPropertyValue('--background-primary-default')).toBe('');
    expect(document.documentElement).not.toHaveAttribute('data-custom-theme');
  });
});
