import { describe, expect, it } from 'vitest';
import { createColorTheme } from './color-theme';
import {
  createOklchColorTheme,
  createOklchDarkPalette,
  getOklchDarkBrandProfile,
  hexToOklch,
} from './oklch-color-theme';
import { contrastRatio, DEFAULT_PRIMARY } from './primary-theme';

const hueDistance=(a:number,b:number)=>{
  const diff=Math.abs(a-b)%360;
  return Math.min(diff,360-diff);
};

describe('experimental OKLCH branding theme',()=>{
  it('keeps Light identical to the current generator',()=>{
    for(const seed of [DEFAULT_PRIMARY,'#2f26ff','#008567','#8b1245','#f4e5fa','#171329','#ffffff','#000000']) {
      const current=createColorTheme(seed,'light');
      const oklch=createOklchColorTheme(seed,'light');
      expect(oklch.palette).toEqual(current.palette);
      expect(oklch.variables).toEqual(current.variables);
      expect(oklch.references).toEqual(current.references);
    }
  });

  it('uses fixed semantic Primary steps in Dark',()=>{
    for(const seed of [DEFAULT_PRIMARY,'#2f26ff','#008567','#8b1245','#f4e5fa','#171329']) {
      const theme=createOklchColorTheme(seed,'dark');
      expect(theme.references['--background-primary-default']).toBe('--primary-500');
      expect(theme.references['--background-primary-default-hover']).toBe('--primary-400');
      expect(theme.references['--background-primary-default-pressed']).toBe('--primary-600');
      expect(theme.variables['--background-primary-default']).toBe(theme.palette[500]);
      expect(theme.variables['--background-primary-default-hover']).toBe(theme.palette[400]);
      expect(theme.variables['--background-primary-default-pressed']).toBe(theme.palette[600]);
    }
  });

  it('preserves hue while adapting Dark lightness and gamut-mapping chroma',()=>{
    for(const seed of [DEFAULT_PRIMARY,'#2f26ff','#008567','#8b1245','#f4e5fa','#171329']) {
      const profile=getOklchDarkBrandProfile(seed);
      expect(profile.dark500.l).toBeGreaterThanOrEqual(.615);
      expect(profile.dark500.l).toBeLessThanOrEqual(.785);
      expect(profile.dark500.c).toBeLessThanOrEqual(profile.source.c+.002);
      if(profile.source.c>.02) expect(hueDistance(profile.dark500.h,profile.source.h)).toBeLessThan(2);
    }
  });

  it('keeps Default, Hover and Pressed readable for arbitrary brand HEX values',()=>{
    const seeds=['#000000','#ffffff','#ff0000','#00ff00','#0000ff','#777777',DEFAULT_PRIMARY,'#2f26ff','#171329','#f4e5fa','#008567','#8b1245'];
    let random=90210;
    for(let i=0;i<160;i++) {
      random=(Math.imul(random,1664525)+1013904223)>>>0;
      seeds.push('#'+(random&0xffffff).toString(16).padStart(6,'0'));
    }

    for(const seed of seeds) {
      const theme=createOklchColorTheme(seed,'dark');
      for(const state of ['', '-hover','-pressed']) {
        const background=theme.variables[`--background-primary-default${state}`];
        expect(contrastRatio(theme.variables[`--text-primary-default${state}`],background),`${seed} text ${state}`).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(theme.variables[`--icon-primary-default${state}`],background),`${seed} icon ${state}`).toBeGreaterThanOrEqual(3);
      }
      expect(contrastRatio(theme.variables['--background-primary-default'],theme.variables['--background-base-default'])).toBeGreaterThanOrEqual(3);
    }
  },15000);

  it('changes only Primary strategy and leaves Dark Base/status semantics identical',()=>{
    for(const seed of [DEFAULT_PRIMARY,'#2f26ff','#008567','#8b1245']) {
      const current=createColorTheme(seed,'dark');
      const oklch=createOklchColorTheme(seed,'dark');
      for(const [token,value] of Object.entries(current.variables)) {
        if(token.startsWith('--primary-')||token.includes('-primary-')) continue;
        expect(oklch.variables[token],token).toBe(value);
      }
    }
  });

  it('produces recognizable Dark anchors for the comparison presets',()=>{
    const expected:Record<string,string>={
      '#ffdc00':'#d4b700',
      '#2f26ff':'#5777ff',
      '#008567':'#2d9b7c',
      '#8b1245':'#cf577d',
      '#f4e5fa':'#c0b1c5',
      '#171329':'#85829f',
    };
    for(const [seed,dark500] of Object.entries(expected)) {
      expect(createOklchDarkPalette(seed)[500]).toBe(dark500);
      expect(hexToOklch(dark500).l).toBeGreaterThanOrEqual(.615);
    }
  });
});
