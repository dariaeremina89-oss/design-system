import { useId, useState, type HTMLAttributes, type ReactNode } from 'react';
import { Button, type ButtonProps } from '../Button/Button';
import { Skeleton } from '../Skeleton/Skeleton';
import './ButtonToggle.css';
export interface ButtonToggleOption { value:string; label:ReactNode; disabled?:boolean; iconLeft?:ButtonProps['iconLeft']; }
export interface ButtonToggleProps extends Omit<HTMLAttributes<HTMLDivElement>,'onChange'|'defaultValue'> { options:ButtonToggleOption[]; value?:string; defaultValue?:string; onValueChange?:(value:string)=>void; size?:'small'|'medium'; color?:'primary'|'base'|'inverse'; disabled?:boolean; isLoading?:boolean; name?:string; }
export function ButtonToggle({options,value,defaultValue,onValueChange,size='medium',color='primary',disabled=false,isLoading=false,name,className='',...props}:ButtonToggleProps) {
 const [local,setLocal]=useState(defaultValue);const id=useId();const items=options;const active=items.some(o=>o.value===(value??local))?(value??local):items.find(o=>!o.disabled)?.value;
 function select(next:string){if(next===active)return;if(value===undefined)setLocal(next);onValueChange?.(next);}
 if(isLoading)return <div className={`fdoc-button-toggle ${className}`} data-color="skeleton" aria-hidden="true">{items.map((o,i)=><span key={o.value} className="fdoc-button-toggle__segment" data-separator={i>0&&items[i-1]?.value!==active&&o.value!==active}>{o.value===active?<Skeleton width={79} height={size==='small'?32:40}/>:<span style={{width:79,height:size==='small'?32:40}}/>}</span>)}</div>;
 return <div {...props} role="radiogroup" aria-disabled={disabled||undefined} aria-busy={isLoading||undefined} data-color={color} className={`fdoc-button-toggle ${className}`}>
 {name&&!isLoading&&<input type="hidden" name={name} value={active??''} disabled={disabled}/>}
 {items.map((o,i)=><span className="fdoc-button-toggle__segment" key={o.value} data-separator={i>0&&items[i-1]?.value!==active&&o.value!==active}>
 <Button id={`${id}-${i}`} text={typeof o.label==='string'?o.label:undefined} size={size} color={o.value===active?(color==='base'?'secondary':color):(color==='base'?'base':'secondary')} iconLeft={o.iconLeft} state={isLoading?'skeleton':'default'} skeletonWidth={79} disabled={disabled||o.disabled} role="radio" aria-checked={o.value===active} tabIndex={o.value===active?0:-1} onClick={()=>select(o.value)} onKeyDown={e=>{let delta=e.key==='ArrowRight'||e.key==='ArrowDown'?1:e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:0;if(!delta&&e.key!=='Home'&&e.key!=='End')return;e.preventDefault();const available=items.filter(x=>!x.disabled);if(!available.length)return;const index=available.findIndex(x=>x.value===o.value);const next=e.key==='Home'?available[0]:e.key==='End'?available.at(-1)!:available[(index+delta+available.length)%available.length];select(next.value);document.getElementById(`${id}-${items.indexOf(next)}`)?.focus();}}>{o.label}</Button>
 </span>)}
 </div>;
}
