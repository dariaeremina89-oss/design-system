import { useRef, useState, type HTMLAttributes } from 'react';
import { Chips, type ChipsProps } from './Chips';

export interface ChipsOption extends Pick<ChipsProps,'text'|'iconLeft'|'iconRight'|'disabled'> { value:string; }
export interface ChipsGroupProps extends Omit<HTMLAttributes<HTMLDivElement>,'onChange'|'defaultValue'> {
  options:ChipsOption[];
  value?:string[];
  defaultValue?:string[];
  onValueChange?:(value:string[])=>void;
  selectionMode?:'single'|'multiple';
  color?:'base'|'secondary';
  size?:ChipsProps['size'];
  shape?:ChipsProps['shape'];
  disabled?:boolean;
  isLoading?:boolean;
}
export function ChipsGroup({options,value,defaultValue=[],onValueChange,selectionMode='multiple',color='secondary',size='medium',shape='round',disabled=false,isLoading=false,className='',onKeyDown,...props}:ChipsGroupProps) {
  const [local,setLocal]=useState(defaultValue);
  const [focusValue,setFocusValue]=useState<string>();
  const root=useRef<HTMLDivElement>(null);
  const values=(value??local).filter(v=>options.some(o=>o.value===v));
  const selected=selectionMode==='single'?values.slice(0,1):values;
  const available=options.filter(o=>!o.disabled&&!disabled);
  const tabValue=available.some(o=>o.value===focusValue)?focusValue:available.find(o=>selected.includes(o.value))?.value??available[0]?.value;
  return <div {...props} ref={root} role="group" aria-disabled={disabled||undefined} aria-busy={isLoading||undefined} className={`fdoc-chips-group ${className}`} onKeyDown={event=>{
    onKeyDown?.(event);
    if(event.defaultPrevented||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    const buttons=Array.from(root.current?.querySelectorAll<HTMLButtonElement>('.fdoc-chips__main:not(:disabled)')??[]);
    const current=buttons.indexOf(event.target as HTMLButtonElement);
    if(current<0||!buttons.length)return;
    event.preventDefault();
    const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(current+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
    buttons[next].focus();
  }}>
    {options.map(option=><Chips key={option.value} text={option.text} iconLeft={option.iconLeft} iconRight={option.iconRight} color={color} size={size} shape={shape} selected={selected.includes(option.value)} disabled={disabled||option.disabled} state={isLoading?'skeleton':'default'} tabIndex={option.value===tabValue?0:-1} onFocus={()=>setFocusValue(option.value)} onSelectedChange={checked=>{
      const next=selectionMode==='single'?(checked?[option.value]:[]):checked?[...selected,option.value]:selected.filter(v=>v!==option.value);
      if(value===undefined)setLocal(next);
      onValueChange?.(next);
    }}/>) }
  </div>;
}
