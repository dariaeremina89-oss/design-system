import type { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import { Skeleton } from '../Skeleton/Skeleton';
import './Link.css';
export type LinkColor = 'base' | 'primary' | 'accent' | 'neutral' | 'inverse';
export type LinkSize = 'small' | 'medium' | 'large' | 'giant';
export type LinkState = 'default' | 'hover' | 'pressed' | 'focused' | 'disabled' | 'skeleton';
interface SharedProps {
  children?: ReactNode;
  text?: string;
  color?: LinkColor;
  size?: LinkSize;
  /** fixed: размер компонента; inherit: типографика окружающего абзаца. */
  typography?: 'fixed' | 'inherit';
  state?: LinkState;
  decoration?: 'solid' | 'dashed' | 'dotted' | null;
  iconLeft?: IconName;
  iconRight?: IconName;
  disabled?: boolean;
  'data-testid'?: string;
}
export interface LinkProps extends SharedProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'color' | 'children'> {}
export interface ButtonLinkProps extends SharedProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'children'> {}
const sizes = { small: 16, medium: 20, large: 24, giant: 28 };
function content({children, text, iconLeft, iconRight, size = 'medium'}: SharedProps) {
  return <>{iconLeft && <Icon name={iconLeft} size={sizes[size]} />}<span className="fdoc-link__text">{children ?? text}</span>{iconRight && <Icon name={iconRight} size={sizes[size]} />}</>;
}
export function Link({color='base',size='medium',typography='fixed',state='default',decoration='solid',disabled=false,className='',style,children,text,iconLeft,iconRight,href,tabIndex,onClick,...props}:LinkProps) {
  const inactive=disabled||state==='disabled';
  if(state==='skeleton')return <span className={`fdoc-link-skeleton fdoc-link--${size} ${typography==='inherit'?'fdoc-link--inherit':''} ${className}`} style={style} data-testid={props['data-testid']} aria-hidden="true">{iconLeft&&<Skeleton className="fdoc-link__skeleton-icon" shape="icon" width={typography==='inherit'?'var(--link-icon-size)':sizes[size]} height={typography==='inherit'?'var(--link-icon-size)':sizes[size]}/>}<Skeleton width={typography==='inherit'?'3.5em':56} shape="text" textSize={typography==='inherit'?'inherit':size==='small'?'caption':size==='medium'?'body':'subtitle'}/>{iconRight&&<Skeleton className="fdoc-link__skeleton-icon" shape="icon" width={typography==='inherit'?'var(--link-icon-size)':sizes[size]} height={typography==='inherit'?'var(--link-icon-size)':sizes[size]}/>}</span>;
  return <a {...props} href={inactive?undefined:href} role={inactive?'link':props.role} aria-disabled={inactive||undefined} tabIndex={inactive?-1:tabIndex} onClick={e=>{if(inactive){e.preventDefault();return;}onClick?.(e);}} data-state={inactive?'disabled':state} data-color={color} data-decoration={decoration??'none'} className={`fdoc-link fdoc-link--${size} ${typography==='inherit'?'fdoc-link--inherit':''} ${className}`} style={{'--link-decoration':decoration??'none',...style} as CSSProperties}>{content({children,text,iconLeft,iconRight,size})}</a>;
}
export function ButtonLink({color='base',size='medium',typography='fixed',state='default',decoration='dashed',disabled=false,className='',style,children,text,iconLeft,iconRight,type='button',...props}:ButtonLinkProps) {
  const inactive=disabled||state==='disabled';
  if(state==='skeleton')return <span className={`fdoc-link-skeleton fdoc-link--${size} ${typography==='inherit'?'fdoc-link--inherit':''} ${className}`} style={style} data-testid={props['data-testid']} aria-hidden="true">{iconLeft&&<Skeleton className="fdoc-link__skeleton-icon" shape="icon" width={typography==='inherit'?'var(--link-icon-size)':sizes[size]} height={typography==='inherit'?'var(--link-icon-size)':sizes[size]}/>}<Skeleton width={typography==='inherit'?'3.5em':56} shape="text" textSize={typography==='inherit'?'inherit':size==='small'?'caption':size==='medium'?'body':'subtitle'}/>{iconRight&&<Skeleton className="fdoc-link__skeleton-icon" shape="icon" width={typography==='inherit'?'var(--link-icon-size)':sizes[size]} height={typography==='inherit'?'var(--link-icon-size)':sizes[size]}/>}</span>;
  return <button {...props} type={type} disabled={inactive} data-state={inactive?'disabled':state} data-color={color} data-decoration={decoration??'none'} className={`fdoc-link fdoc-link--${size} ${typography==='inherit'?'fdoc-link--inherit':''} ${className}`} style={{'--link-decoration':decoration??'none',...style} as CSSProperties}>{content({children,text,iconLeft,iconRight,size})}</button>;
}
