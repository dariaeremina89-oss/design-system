import { describe, expect, it } from 'vitest';
import { compositeStateLayer, createBrandSafeColorTheme, getBrandSafeProfile, hexToBrandSafeColor } from './brand-safe-color-theme';
import { createColorTheme } from './color-theme';
import { contrastRatio, DEFAULT_PRIMARY, normalizeHex } from './primary-theme';

const hueDistance=(a:number,b:number)=>{
  const diff=Math.abs(a-b)%360;
  return Math.min(diff,360-diff);
};

describe('Brand-safe Primary experiment',()=>{
  it('keeps Light identical to the current implementation',()=>{
    for(const seed of [DEFAULT_PRIMARY,'#2f26ff','#008567','#8b1245','#f4e5fa','#171329','#ffffff','#000000']) {
      const current=createColorTheme(seed,'light');
      const brandSafe=createBrandSafeColorTheme(seed,'light');
      expect(brandSafe.palette).toEqual(current.palette);
      expect(brandSafe.references).toEqual(current.references);
      for(const [token,value] of Object.entries(current.variables)) expect(brandSafe.variables[token],token).toBe(value);
      expect(brandSafe.variables['--brand-source']).toBe(seed.toLowerCase());
    }
  });

  it('always preserves the entered HEX exactly as Primary 500',()=>{
    for(const seed of [DEFAULT_PRIMARY,'#2f26ff','#008567','#8b1245','#f4e5fa','#171329','#ffffff','#000000']) {
      const normalized=normalizeHex(seed)!;
      for(const mode of ['light','dark'] as const) {
        const theme=createBrandSafeColorTheme(seed,mode);
        expect(theme.palette[500]).toBe(normalized);
        expect(theme.variables['--primary-500']).toBe(normalized);
        expect(theme.variables['--brand-source']).toBe(normalized);
      }
    }
  });

  it('keeps an already suitable Dark brand HEX unchanged',()=>{
    const profile=getBrandSafeProfile('#008567');
    expect(profile.sourceContrast).toBeGreaterThanOrEqual(3);
    expect(profile.sourceContrast).toBeLessThanOrEqual(10.5);
    expect(profile.darkDefault).toBe('#008567');
    expect(profile.adjustment).toBe('unchanged');
    expect(profile.deltaLightness).toBeCloseTo(0,4);
  });

  it('moves only lightness to the nearest Dark boundary when correction is needed',()=>{
    const cases=[
      ['#ffdc00','darkened'],
      ['#2f26ff','lightened'],
      ['#8b1245','lightened'],
      ['#f4e5fa','darkened'],
      ['#171329','lightened'],
    ] as const;
    for(const [seed,expected] of cases) {
      const source=hexToBrandSafeColor(seed);
      const profile=getBrandSafeProfile(seed);
      const result=hexToBrandSafeColor(profile.darkDefault);
      expect(profile.adjustment).toBe(expected);
      expect(profile.defaultContrast).toBeGreaterThanOrEqual(2.98);
      expect(profile.defaultContrast).toBeLessThanOrEqual(10.58);
      if(source.c>.02&&result.c>.01) expect(hueDistance(source.h,result.h)).toBeLessThan(2);
      expect(result.c).toBeLessThanOrEqual(source.c+.004);
    }
  });

  it('builds Hover and Pressed as onPrimary state layers over the same Default',()=>{
    for(const seed of [DEFAULT_PRIMARY,'#2f26ff','#008567','#8b1245','#f4e5fa','#171329']) {
      const profile=getBrandSafeProfile(seed);
      expect(profile.hoverOpacity).toBeGreaterThanOrEqual(0);
      expect(profile.hoverOpacity).toBeLessThanOrEqual(.08);
      expect(profile.pressedOpacity).toBeGreaterThanOrEqual(profile.hoverOpacity);
      expect(profile.pressedOpacity).toBeLessThanOrEqual(.12);
      expect(profile.darkHover).toBe(compositeStateLayer(profile.darkDefault,profile.foreground,profile.hoverOpacity));
      expect(profile.darkPressed).toBe(compositeStateLayer(profile.darkDefault,profile.foreground,profile.pressedOpacity));
    }
  });

  it('keeps Dark Default, Hover and Pressed readable for arbitrary HEX values',()=>{
    const seeds=['#000000','#ffffff','#ff0000','#00ff00','#0000ff','#777777',DEFAULT_PRIMARY,'#2f26ff','#171329','#f4e5fa','#008567','#8b1245'];
    let random=194827;
    for(let i=0;i<220;i++) {
      random=(Math.imul(random,1664525)+1013904223)>>>0;
      seeds.push('#'+(random&0xffffff).toString(16).padStart(6,'0'));
    }

    for(const seed of seeds) {
      const theme=createBrandSafeColorTheme(seed,'dark');
      const profile=getBrandSafeProfile(seed);
      expect(profile.defaultContrast,seed).toBeGreaterThanOrEqual(2.98);
      expect(profile.defaultContrast,seed).toBeLessThanOrEqual(10.58);
      expect(profile.hoverContrast,seed).toBeGreaterThanOrEqual(2.48);
      expect(profile.pressedContrast,seed).toBeGreaterThanOrEqual(2.48);
      expect(profile.hoverOpacity,seed).toBeLessThanOrEqual(.08);
      expect(profile.pressedOpacity,seed).toBeLessThanOrEqual(.12);
      expect(profile.pressedOpacity,seed).toBeGreaterThanOrEqual(profile.hoverOpacity);

      for(const state of ['', '-hover','-pressed']) {
        const bg=theme.variables[`--background-primary-default${state}`];
        const text=theme.variables[`--text-primary-default${state}`];
        const icon=theme.variables[`--icon-primary-default${state}`];
        expect(contrastRatio(text,bg),`${seed} text ${state}`).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(icon,bg),`${seed} icon ${state}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  },15000);

  it('changes only the main Primary state family in Dark',()=>{
    for(const seed of [DEFAULT_PRIMARY,'#2f26ff','#008567','#8b1245']) {
      const current=createColorTheme(seed,'dark');
      const brandSafe=createBrandSafeColorTheme(seed,'dark');
      for(const token of [
        '--background-primary-secondary',
        '--background-primary-secondary-hover',
        '--background-primary-secondary-pressed',
        '--background-primary-tertiary',
        '--background-primary-tertiary-hover',
        '--background-primary-tertiary-pressed',
        '--background-primary-inverse',
        '--background-primary-inverse-hover',
        '--background-primary-inverse-pressed',
        '--text-primary-secondary',
        '--text-primary-inverse',
      ]) {
        expect(brandSafe.variables[token],`${seed} ${token}`).toBe(current.variables[token]);
        expect(brandSafe.references[token],`${seed} ${token}`).toBe(current.references[token]);
      }

      for(const [token,value] of Object.entries(current.variables)) {
        if(token.startsWith('--primary-')||token.includes('-primary-')) continue;
        expect(brandSafe.variables[token],`${seed} ${token}`).toBe(value);
      }
    }
  });
});
