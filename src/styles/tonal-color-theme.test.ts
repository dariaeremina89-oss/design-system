import { describe, expect, it } from 'vitest';
import { createColorTheme } from './color-theme';
import {
  createTonalColorTheme,
  createTonalPalette,
  getTonalProfile,
  hexToPerceptual,
  tonalLightness,
  tonalPrimaryMapping,
} from './tonal-color-theme';
import { contrastRatio, DEFAULT_PRIMARY, primarySteps } from './primary-theme';

const hueDistance=(a:number,b:number)=>{
  const diff=Math.abs(a-b)%360;
  return Math.min(diff,360-diff);
};

describe('experimental shared tonal branding theme',()=>{
  it('builds one perceptual palette shared by Light and Dark',()=>{
    for(const seed of [DEFAULT_PRIMARY,'#2f26ff','#008567','#8b1245','#f4e5fa','#171329','#ffffff','#000000']) {
      const light=createTonalColorTheme(seed,'light');
      const dark=createTonalColorTheme(seed,'dark');
      expect(light.palette).toEqual(dark.palette);
      expect(light.variables['--brand-source']).toBe(seed.toLowerCase());
      expect(dark.variables['--brand-source']).toBe(seed.toLowerCase());
      for(const step of primarySteps) {
        expect(hexToPerceptual(light.palette[step]).l).toBeCloseTo(tonalLightness[step],2);
      }
    }
  });

  it('uses fixed semantic background mappings in every brand',()=>{
    const seeds=[DEFAULT_PRIMARY,'#2f26ff','#008567','#8b1245','#f4e5fa','#171329'];
    for(const seed of seeds) {
      for(const mode of ['light','dark'] as const) {
        const theme=createTonalColorTheme(seed,mode);
        for(const family of ['default','secondary','tertiary','inverse'] as const) {
          const mapping=tonalPrimaryMapping[mode][family];
          const prefix=`--background-primary-${family}`;
          expect(theme.references[prefix]).toBe(`--primary-${mapping.base}`);
          expect(theme.references[`${prefix}-hover`]).toBe(`--primary-${mapping.hover}`);
          expect(theme.references[`${prefix}-pressed`]).toBe(`--primary-${mapping.pressed}`);
          expect(theme.references[`${prefix}-disabled`]).toBe(`--primary-${mapping.disabled}`);
        }
      }
    }
  });

  it('preserves brand hue while keeping step lightness predictable across hues',()=>{
    for(const seed of [DEFAULT_PRIMARY,'#2f26ff','#008567','#8b1245','#f4e5fa','#171329','#ff0000','#00ff00','#0000ff']) {
      const source=hexToPerceptual(seed);
      const palette=createTonalPalette(seed);
      for(const step of primarySteps) {
        const tone=hexToPerceptual(palette[step]);
        expect(tone.l).toBeCloseTo(tonalLightness[step],2);
        if(source.c>.02&&tone.c>.01) expect(hueDistance(tone.h,source.h)).toBeLessThan(2);
        expect(tone.c).toBeLessThanOrEqual(source.c+.003);
      }
    }
  });

  it('keeps text and icons readable without changing fixed background mappings',()=>{
    const seeds=['#000000','#ffffff','#ff0000','#00ff00','#0000ff','#777777',DEFAULT_PRIMARY,'#2f26ff','#171329','#f4e5fa','#008567','#8b1245'];
    let random=741852;
    for(let i=0;i<180;i++) {
      random=(Math.imul(random,1664525)+1013904223)>>>0;
      seeds.push('#'+(random&0xffffff).toString(16).padStart(6,'0'));
    }

    for(const seed of seeds) {
      for(const mode of ['light','dark'] as const) {
        const theme=createTonalColorTheme(seed,mode);
        const mapping=tonalPrimaryMapping[mode].default;
        expect(theme.references['--background-primary-default']).toBe(`--primary-${mapping.base}`);
        expect(theme.references['--background-primary-default-hover']).toBe(`--primary-${mapping.hover}`);
        expect(theme.references['--background-primary-default-pressed']).toBe(`--primary-${mapping.pressed}`);

        for(const state of ['', '-hover','-pressed']) {
          const bg=theme.variables[`--background-primary-default${state}`];
          expect(contrastRatio(theme.variables[`--text-primary-default${state}`],bg),`${mode} ${seed} text ${state}`).toBeGreaterThanOrEqual(4.5);
          expect(contrastRatio(theme.variables[`--icon-primary-default${state}`],bg),`${mode} ${seed} icon ${state}`).toBeGreaterThanOrEqual(3);
        }
      }
    }
  },15000);

  it('changes only Primary strategy while Base and status semantics stay equal to the current implementation',()=>{
    for(const seed of [DEFAULT_PRIMARY,'#2f26ff','#008567','#8b1245']) {
      for(const mode of ['light','dark'] as const) {
        const current=createColorTheme(seed,mode);
        const tonal=createTonalColorTheme(seed,mode);
        for(const [token,tokenValue] of Object.entries(current.variables)) {
          if(token.startsWith('--primary-')||token.includes('-primary-')) continue;
          expect(tonal.variables[token],`${mode} ${token}`).toBe(tokenValue);
        }
      }
    }
  });

  it('keeps Brand Source independent from the closest tonal step',()=>{
    for(const seed of [DEFAULT_PRIMARY,'#2f26ff','#171329','#f4e5fa']) {
      const profile=getTonalProfile(seed);
      expect(profile.closestStep).toBeTypeOf('number');
      expect(primarySteps).toContain(profile.closestStep);
      expect(profile.closestColor).toBe(profile.palette[profile.closestStep]);
    }
  });
});
