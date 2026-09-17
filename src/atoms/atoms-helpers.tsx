import type { ReactNode } from 'react';
import './atoms.css';

export const cssVar = (token: string) => `var(${token})`;
export const groupName = (token: string, depth: number) => token.slice(2).split('-').slice(0, depth).join('-');

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
        style={{ backgroundColor: cssVar(item.token) }}
      >
        <span>{item.token}</span>
        <code>{item.reference ? `alias → ${item.reference}` : `value · ${item.value}`}</code>
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
