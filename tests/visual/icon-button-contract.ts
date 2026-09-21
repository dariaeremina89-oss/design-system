import { expect, type Locator } from '@playwright/test';

// Token contract verified against the design variants. Keep independent of component CSS.
export const schemes = {
  primary: ['primary-default', 'primary-default-light', 'primary-default-light-disabled', 'primary-focused'],
  secondary: ['base-secondary', 'base-default', 'base-default-disabled', 'base-default-focused'],
  tertiary: ['transparent', 'base-default', 'base-default-disabled', 'base-default-focused'],
  neutral: ['transparent', 'base-secondary', 'base-default-light-disabled', 'base-default-focused'],
  base: ['base-default', 'base-default', 'base-default-disabled', 'base-default-focused'],
  inverse: ['base-inverse', 'base-inverse', 'base-inverse-disabled', 'base-inverse-focused'],
  'inverse-primary': ['base-inverse', 'primary-inverse-light', 'base-inverse-disabled', 'base-inverse-focused'],
  'inverse-light': ['base-inverse-light', 'base-inverse', 'base-inverse-disabled', 'base-inverse-focused'],
} as const;

export async function expectColors(button: Locator, color: keyof typeof schemes, state: string) {
  const [background, icon, disabledIcon, focus] = schemes[color];
  const transparent = background === 'transparent';
  const bg = transparent && (state === 'default' || state === 'focused' || state === 'disabled')
    ? 'transparent'
    : `--background-${transparent ? 'base-default' : background}${['hover', 'pressed', 'disabled'].includes(state) ? '-' + state : ''}`;
  const expected = await button.evaluate((element, tokens) => {
    const probe = document.createElement('span');
    element.appendChild(probe);
    const resolve = (token: string) => {
      probe.style.color = token === 'transparent' ? token : `var(${token})`;
      return getComputedStyle(probe).color;
    };
    const result = tokens.map(resolve);
    probe.remove();
    return result;
  }, [bg, `--icon-${state === 'disabled' ? disabledIcon : icon}`, `--border-${focus}`]);
  await expect(button).toHaveCSS('background-color', expected[0]);
  await expect(button).toHaveCSS('color', expected[1]);
  if (state === 'focused') {
    await expect(button).toHaveCSS('outline-width', '4px');
    await expect(button).toHaveCSS('outline-style', 'solid');
    await expect(button).toHaveCSS('outline-color', expected[2]);
  }
}
