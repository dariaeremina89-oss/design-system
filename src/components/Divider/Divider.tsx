import type { CSSProperties, HTMLAttributes } from 'react';
import './Divider.css';
export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal'|'vertical';
  /** Дополнительный отступ от границ контента родителя, в px. По умолчанию 0. */
  inset?: number;
}
export function Divider({orientation='horizontal',inset=0,className='',style,...props}:DividerProps) {
 const extraInset=Number.isFinite(inset)?Math.max(0,inset):0;
 return <div {...props} aria-hidden="true" className={`fdoc-divider fdoc-divider--${orientation} ${className}`} style={{'--divider-inset':`${extraInset}px`,...style} as CSSProperties}><span/></div>;
}
