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
    const colors=['#000000','#ffffff','#ff0000','#00ff00','#0000ff','#777777','#ffdc00','#2f26ff','#171329','#f4e5fa'];
    let random=321;
    for(let i=0;i<300;i++){random=(Math.imul(random,1664525)+1013904223)>>>0;colors.push('#'+(random&0xffffff).toString(16).padStart(6,'0'));}
    for(const seed of colors) for(const mode of ['light','dark'] as const) {
      const {palette,variables:v}=createColorTheme(seed,mode);
      expect(palette[500]).toBe(seed);expect(v['--background-primary-default']).toBe(seed);
      for(let i=1;i<primarySteps.length;i++) expect(relativeLuminance(palette[primarySteps[i]])).toBeLessThanOrEqual(relativeLuminance(palette[primarySteps[i-1]])+1e-9);
      for(const state of ['', '-hover','-pressed']) {
        expect(contrastRatio(v['--text-primary-default'],v[`--background-primary-default${state}`])).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(v['--icon-primary-default-light'],v[`--background-primary-default${state}`])).toBeGreaterThanOrEqual(3);
        expect(contrastRatio(v[`--text-primary-inverse${state}`],v[`--background-primary-inverse${state}`])).toBeGreaterThanOrEqual(4.5);
        const base=v[`--background-base-default${state}`]??original[`--background-base-default${state}`];
        expect(contrastRatio(v[`--text-primary-secondary${state}`],base)).toBeGreaterThanOrEqual(4.5);
        const inverse=v[`--background-base-inverse${state}`]??original[`--background-base-inverse${state}`];
        expect(contrastRatio(v[`--text-primary-inverse-light${state}`],inverse)).toBeGreaterThanOrEqual(4.5);
      }
      for(const key of Object.keys(v)) expect(key).not.toMatch(/^--(?:neutral|yellow|green|red|purple|orange|client|violet|white|black)-/);
    }
  });
  it('Dark is available with the F.Doc seed and never changes status values when the brand changes',()=>{
    const fdoc=createColorTheme(DEFAULT_PRIMARY,'dark'), client=createColorTheme('#2f26ff','dark');
    expect(fdoc.variables['--background-base-default']).toBe('#18191c');
    for(const [token,value] of Object.entries(fdoc.variables)) {
      if(!token.includes('-primary-'))expect(client.variables[token]).toBe(value);
    }
    for(const role of ['success','error','warning','accent']) for(const state of ['', '-hover','-pressed']) expect(contrastRatio(fdoc.variables[`--text-${role}-default-light`],fdoc.variables[`--background-${role}-secondary${state}`])).toBeGreaterThanOrEqual(4.5);
    expect(primaryThemeCss(fdoc)).toContain('color-scheme: dark');
    expect(primaryThemeCss(fdoc)).toContain('--background-primary-default: var(--primary-500)');
  });
  it('switches modes without losing the seed and reset removes overrides from the whole document',()=>{
    applyColorMode('dark');expect(getPrimarySeed()).toBeNull();expect(getColorMode()).toBe('dark');
    expect(document.documentElement.style.getPropertyValue('--background-primary-default')).toBe(DEFAULT_PRIMARY);
    applyPrimaryTheme('#123abc');applyColorMode('light');expect(getPrimarySeed()).toBe('#123abc');
    expect(document.documentElement.style.getPropertyValue('--background-base-default')).toBe('');
    expect(document.documentElement.style.getPropertyValue('--yellow-500')).toBe('');
    applyPrimaryTheme(null,true,'light');expect(document.documentElement.style.getPropertyValue('--background-primary-default')).toBe('');
    expect(document.documentElement).not.toHaveAttribute('data-custom-theme');
  });
});
