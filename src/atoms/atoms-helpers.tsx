import type { ReactNode } from 'react';
import './atoms.css';

export const cssVar = (token: string) => `var(${token})`;
export const groupName = (token: string, depth: number) => token.slice(2).split('-').slice(0, depth).join('-');

const parseHex = (value: string) => {
  const hex = value.replace('#', '');
  if (![6, 8].includes(hex.length)) return null;
  const number = Number.parseInt(hex.slice(0, 6), 16);
  if (Number.isNaN(number)) return null;
  return {
    r: (number >> 16) / 255,
    g: ((number >> 8) & 255) / 255,
    b: (number & 255) / 255,
    a: hex.length === 8 ? Number.parseInt(hex.slice(6), 16) / 255 : 1,
  };
};

const luminance = (channel: number) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);

const contrastRatio = (background: { r: number; g: number; b: number }, text: { r: number; g: number; b: number }) => {
  const backgroundLuminance = 0.2126 * luminance(background.r) + 0.7152 * luminance(background.g) + 0.0722 * luminance(background.b);
  const textLuminance = 0.2126 * luminance(text.r) + 0.7152 * luminance(text.g) + 0.0722 * luminance(text.b);
  const lighter = Math.max(backgroundLuminance, textLuminance);
  const darker = Math.min(backgroundLuminance, textLuminance);
  return (lighter + 0.05) / (darker + 0.05);
};

export const readableTextToken = (backgroundValue: string) => {
  const background = parseHex(backgroundValue);
  if (!background) return '--text-base-default';

  const composited = {
    r: background.r * background.a + (1 - background.a),
    g: background.g * background.a + (1 - background.a),
    b: background.b * background.a + (1 - background.a),
  };
  const dark = { r: 24 / 255, g: 25 / 255, b: 28 / 255 };
  const light = { r: 1, g: 1, b: 1 };

  return contrastRatio(composited, light) > contrastRatio(composited, dark)
    ? '--text-base-white'
    : '--text-base-default';
};

export const TokenList = ({ tokens }: { tokens: readonly { token: string; value: string | number; reference?: string }[] }) => (
  <div className="fdoc-atoms__tokens">
    {tokens.map((item) => (
      <div key={item.token} className="fdoc-atoms__token">
        <span className="fdoc-atoms__label">{item.token}</span>
        <code>{item.reference ? `alias → ${item.reference}` : `value · ${String(item.value)}`}</code>
      </div>
    ))}
  </div>
);

export const ColorGrid = ({ tokens }: { tokens: readonly { token: string; value: string; reference?: string }[] }) => (
  <div className="fdoc-atoms__swatches">
    {tokens.map((item) => (
      <div
        key={item.token}
        className={`fdoc-atoms__swatch${item.token.startsWith('--transparent-') ? ' fdoc-atoms__swatch--transparent' : ''}`}
        style={{ backgroundColor: cssVar(item.token), color: cssVar(readableTextToken(item.value)) }}
      >
        <span>{item.token}</span>
        <code>{item.reference ? `alias → ${item.reference}` : `value · ${item.value}`}</code>
        <code>text → {readableTextToken(item.value)}</code>
      </div>
    ))}
  </div>
);

export const Page = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="fdoc-atoms">
    <h1>{title}</h1>
    {children}
  </div>
);
