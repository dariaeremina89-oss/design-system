import type { CSSProperties, HTMLAttributes } from 'react';
import './Divider.css';
export interface DividerProps extends HTMLAttributes<HTMLDivElement> { orientation?: 'horizontal'|'vertical'; inset?: 0|16|24; }
export function Divider({orientation='horizontal',inset=0,className='',style,...props}:DividerProps) {
 return <div {...props} aria-hidden="true" className={`fdoc-divider fdoc-divider--${orientation} ${className}`} style={{'--divider-inset':`var(--space-${inset}, ${inset}px)`,...style} as CSSProperties}><span/></div>;
}
