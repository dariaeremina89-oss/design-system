import { useId,useState,type ReactNode } from 'react';
import { ButtonIconDecoration } from '../ButtonIcon/ButtonIcon';
import { Divider } from '../Divider/Divider';
import './Accordion.css';
export interface AccordionProps { title:ReactNode; description?:ReactNode; headerContent?:ReactNode; children:ReactNode; size?:'medium'|'large'; state?:'default'|'hover'|'focused'|'pressed'|'disabled'; disabled?:boolean; expanded?:boolean; defaultExpanded?:boolean; onExpandedChange?:(expanded:boolean)=>void; contentDivider?:boolean; headingLevel?:2|3|4|5|6; className?:string; }
export function Accordion({title,description,headerContent,children,size='medium',state='default',disabled=false,expanded,defaultExpanded=false,onExpandedChange,contentDivider=false,headingLevel=3,className=''}:AccordionProps) {
 const id=useId();const [local,setLocal]=useState(defaultExpanded);const open=expanded??local;const inactive=disabled||state==='disabled';const Heading=`h${headingLevel}` as 'h3';
 return <section className={`fdoc-accordion ${className}`} data-size={size} data-disabled={inactive}>
 <Heading className="fdoc-accordion__heading"><button type="button" id={`${id}-trigger`} className="fdoc-accordion__trigger" disabled={inactive} data-state={inactive?'disabled':state} aria-expanded={open} aria-controls={`${id}-panel`} onClick={()=>{if(expanded===undefined)setLocal(!open);onExpandedChange?.(!open);}}><span className="fdoc-accordion__header-content">{headerContent??<><span className="fdoc-accordion__title">{title}</span>{description&&<span className="fdoc-accordion__description">{description}</span>}</>}</span><ButtonIconDecoration className="fdoc-accordion__chevron" icon={open?'arrow-chevron-up':'arrow-chevron-down'}/></button></Heading>
 <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-trigger`} hidden={!open}>{contentDivider&&<Divider/>}<div className="fdoc-accordion__content" data-divider={contentDivider}>{children}</div></div>
 </section>;
}
export interface AccordionGroupItem extends Omit<AccordionProps,'expanded'|'defaultExpanded'|'onExpandedChange'> { value:string; }
export interface AccordionGroupProps { items:AccordionGroupItem[]; multiple?:boolean; value?:string[]; defaultValue?:string[]; onValueChange?:(value:string[])=>void; gap?:number; groupDivider?:boolean; }
export function AccordionGroup({items,multiple=false,value,defaultValue=[],onValueChange,gap=0,groupDivider=false}:AccordionGroupProps) {
 const resolvedGap=Number.isFinite(gap)?Math.max(0,gap):0;
 const [local,setLocal]=useState(defaultValue);const active=value??local;const selected=multiple?active:active.slice(0,1);
 return <div className="fdoc-accordion-group" style={{gap:resolvedGap}}>{items.map(({value:key,...props},i)=><div key={key}>{i>0&&groupDivider&&resolvedGap===0&&<Divider/>}<Accordion {...props} expanded={selected.includes(key)} onExpandedChange={open=>{const next=open?(multiple?[...selected,key]:[key]):selected.filter(v=>v!==key);if(value===undefined)setLocal(next);onValueChange?.(next);}}/></div>)}</div>;
}
