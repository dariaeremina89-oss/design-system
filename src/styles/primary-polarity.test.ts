import { describe, expect, it } from 'vitest';
import { contrastRatio, createPrimaryTheme } from './primary-theme';

describe('Primary foreground polarity', () => {
  it('uses the stronger contrast side for green independently of page mode', () => {
    for (const mode of ['light', 'dark'] as const) {
      const theme = createPrimaryTheme('#008567', mode);
      expect(theme.lightForeground).toBe(true);
      expect(theme.variables['--text-primary-default']).toBe('#ffffff');
      expect(theme.references['--background-primary-default-hover']).toBe('--primary-600');
      expect(theme.references['--background-primary-default-pressed']).toBe('--primary-700');
      for (const state of ['', '-hover', '-pressed']) {
        expect(contrastRatio(theme.variables['--text-primary-default'], theme.variables[`--background-primary-default${state}`])).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
  it('keeps light brands on the dark side and dark brands on the light side', () => {
    for (const seed of ['#ffdc00', '#ffffff', '#00ff00', '#171329', '#000000', '#777777']) {
      const theme = createPrimaryTheme(seed);
      expect(theme.lightForeground).toBe(contrastRatio(seed, '#ffffff') > contrastRatio(seed, '#000000'));
    }
  });
});
