import { useId, useState, type ReactNode } from 'react';
import { Checkbox, Radio, Switch, type SelectionControlProps } from './SelectionControl';
import './SelectionGroup.css';
export interface SelectionOption { value:string; label:ReactNode; description?:ReactNode; errorText?:ReactNode; disabled?:boolean; }
interface BaseProps { label:ReactNode; description?:ReactNode; errorText?:ReactNode; options:SelectionOption[]; name?:string; disabled?:boolean; direction?:'column'|'row'; state?:SelectionControlProps['state']; className?:string; }
export interface CheckboxGroupProps extends BaseProps { value?:string[]; defaultValue?:string[]; onValueChange?:(value:string[])=>void; }
export interface RadioGroupProps extends BaseProps { value?:string; defaultValue?:string; onValueChange?:(value:string)=>void; }
export type SwitchGroupProps=CheckboxGroupProps;
function SelectionGroup({kind,label,description,errorText,options,name,disabled=false,direction='column',state='default',className='',value,defaultValue,onValueChange}:BaseProps&{kind:'checkbox'|'radio'|'switch';value?:string[];defaultValue?:string[];onValueChange?:(value:string[])=>void}) {
 const id=useId();const [local,setLocal]=useState(defaultValue??[]);const selected=value??local;const Control=kind==='radio'?Radio:kind==='switch'?Switch:Checkbox;
 return <fieldset disabled={disabled||state==='disabled'} className={`fdoc-selection-group ${className}`} role={kind==='radio'?'radiogroup':undefined} aria-describedby={[description?`${id}-description`:null,errorText?`${id}-error`:null].filter(Boolean).join(' ')||undefined} aria-invalid={!!errorText||undefined}>
 <legend>{label}</legend>{description&&<div className="fdoc-selection-group__description" id={`${id}-description`}>{description}</div>}
 <div className="fdoc-selection-group__options" data-direction={direction}>{options.map(o=><Control key={o.value} name={name??id} value={o.value} checked={selected.includes(o.value)} label={o.label} description={o.description} errorText={o.errorText} disabled={disabled||o.disabled} state={state} onChange={e=>{const next=kind==='radio'?[o.value]:e.target.checked?[...selected,o.value]:selected.filter(v=>v!==o.value);if(value===undefined)setLocal(next);onValueChange?.(next);}}/>)}</div>
 {errorText&&<div className="fdoc-selection-group__error" id={`${id}-error`}>{errorText}</div>}
 </fieldset>;
}
export function CheckboxGroup(props:CheckboxGroupProps){return <SelectionGroup {...props} kind="checkbox"/>;}
export function SwitchGroup(props:SwitchGroupProps){return <SelectionGroup {...props} kind="switch"/>;}
export function RadioGroup({value,defaultValue,onValueChange,...props}:RadioGroupProps){return <SelectionGroup {...props} kind="radio" value={value===undefined?undefined:[value]} defaultValue={defaultValue===undefined?undefined:[defaultValue]} onValueChange={v=>onValueChange?.(v[0])}/>;}
