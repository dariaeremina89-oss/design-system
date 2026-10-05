import { describe, expect, it } from 'vitest';
import { contrastRatio, createPrimaryTheme, relativeLuminance } from './primary-theme';

describe('Primary foreground polarity', () => {
  it('chooses foreground polarity from the semantic Primary Default fill in each mode', () => {
    for (const mode of ['light', 'dark'] as const) {
      const theme = createPrimaryTheme('#008567', mode);
      const fill=theme.variables['--background-primary-default'];
      const content=theme.variables['--text-primary-default'];
      expect(theme.lightForeground).toBe(relativeLuminance(content)>relativeLuminance(fill));
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
