import { describe, expect, it } from 'vitest';
import { createColorTheme } from './color-theme';
import { contrastRatio, DEFAULT_PRIMARY } from './primary-theme';
import { primitiveColorTokens, semanticColorTokens } from './token-catalog';
const original:Record<string,string>=Object.fromEntries([...primitiveColorTokens,...semanticColorTokens].map(item=>[item.token,item.value]));
describe('Dark status color semantics',()=>{
  it('remaps status roles for Dark independently of client Primary and keeps active pairs readable',()=>{
    const theme=createColorTheme(DEFAULT_PRIMARY,'dark');
    const get=(token:string)=>theme.variables[token]??original[token];
    for(const role of ['success','error','warning','accent']) {
      expect(theme.references[`--background-${role}-inverse`]).toMatch(/-50$/);
      expect(theme.references[`--background-${role}-secondary`]).toMatch(/-900$/);
      for(const state of ['', '-hover','-pressed']) for(const kind of ['text','icon']) {
        const minimum=kind==='text'?4.5:3;
        for(const variant of ['secondary','inverse']) expect(contrastRatio(get(`--${kind}-${role}-${variant}${state}`),get(`--background-${role}-${variant}${state}`)),`${role} ${kind} ${variant} ${state}`).toBeGreaterThanOrEqual(minimum);
        expect(contrastRatio(get(`--${kind}-${role}-inverse-light${state}`),get(`--background-base-inverse${state}`))).toBeGreaterThanOrEqual(minimum);
      }
    }
    // Error selection controls reuse icon-error-inverse on the solid error fill.
    expect(contrastRatio(get('--icon-error-inverse'),get('--background-error-default'))).toBeGreaterThanOrEqual(3);
  });
  it('keeps Base and status aliases independent of brand and preserves their primitive palettes',()=>{
    const baseline=createColorTheme(DEFAULT_PRIMARY,'dark');
    const nonPrimary=(variables:Record<string,string>)=>Object.fromEntries(Object.entries(variables).filter(([name])=>!name.includes('-primary-')));
    for(const seed of ['#2f26ff','#008567','#8b1245','#f4e5fa','#171329','#000000','#ffffff']) {
      const theme=createColorTheme(seed,'dark');
      expect(nonPrimary(theme.variables)).toEqual(nonPrimary(baseline.variables));
      expect(nonPrimary(theme.references)).toEqual(nonPrimary(baseline.references));
      for(const token of primitiveColorTokens.filter(token=>!token.token.startsWith('--primary-'))) expect(theme.variables).not.toHaveProperty(token.token);
      for(const [token,reference] of Object.entries(nonPrimary(theme.references))) {
        expect(original[reference],reference).toBeDefined();
        expect(theme.variables[token]).toBe(original[reference]);
      }
    }
  });
  it('keeps solid status fills as palette anchors but remaps their content for Dark Base surfaces',()=>{
    const theme=createColorTheme(DEFAULT_PRIMARY,'dark');
    const get=(token:string)=>theme.variables[token]??original[token];
    for(const role of ['success','error','warning','accent']) {
      for(const state of ['', '-hover','-pressed','-disabled']) {
        expect(theme.variables).not.toHaveProperty(`--background-${role}-default${state}`);
      }
      for(const state of ['', '-hover','-pressed']) {
        expect(theme.references[`--text-${role}-default${state}`]).toBeTruthy();
        expect(theme.references[`--icon-${role}-default${state}`]).toBeTruthy();
        expect(contrastRatio(get(`--text-${role}-default${state}`),get('--background-base-default'))).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(get(`--icon-${role}-default${state}`),get('--background-base-default'))).toBeGreaterThanOrEqual(3);
      }
    }
  });
});
