import { useEffect, useId, useImperativeHandle, useRef, useState, type InputHTMLAttributes, type ReactNode, type Ref } from 'react';
import { Skeleton } from '../Skeleton/Skeleton';
import './SelectionControl.css';
export type SelectionState='default'|'hover'|'focused'|'pressed'|'disabled'|'skeleton';
export interface SelectionControlProps extends Omit<InputHTMLAttributes<HTMLInputElement>,'size'|'type'|'children'> {
 label?:ReactNode; description?:ReactNode; error?:boolean; errorText?:ReactNode; state?:SelectionState; indeterminate?:boolean; ref?:Ref<HTMLInputElement>; 'data-testid'?:string;
}
interface Props extends SelectionControlProps { kind:'checkbox'|'radio'|'switch'; }
export function SelectionControl({kind,label,description,error=false,errorText,state='default',indeterminate=false,disabled=false,id:providedId,className='',ref,onKeyDown,onChange,'aria-describedby':describedBy,...props}:Props) {
 const [mixed,setMixed]=useState(indeterminate);
 const uid=useId();const id=providedId??uid;const input=useRef<HTMLInputElement>(null);useImperativeHandle(ref,()=>input.current!,[state]);
 useEffect(()=>{setMixed(indeterminate);if(input.current)input.current.indeterminate=kind==='checkbox'&&indeterminate;},[indeterminate,kind,state]);
 const inactive=disabled||state==='disabled';const invalid=error||!!errorText;const hint=errorText??description;
 const visual=<span className="fdoc-control" data-kind={kind} data-error={invalid} data-state={inactive?'disabled':state}>
 {state==='skeleton'?<Skeleton width={kind==='switch'?36:20} height={20} shape={kind==='checkbox'?'rounded':'circle'}/>:<><input {...props} id={id} ref={input} type={kind==='radio'?'radio':'checkbox'} role={kind==='switch'?'switch':undefined} disabled={inactive} aria-invalid={invalid||undefined} aria-checked={kind==='checkbox'&&mixed?'mixed':undefined} aria-labelledby={props['aria-labelledby']??(label!=null?`${id}-label`:undefined)} onChange={e=>{setMixed(false);onChange?.(e);}} aria-describedby={[describedBy,hint?`${id}-hint`:null].filter(Boolean).join(' ')||undefined} onKeyDown={e=>{onKeyDown?.(e);if(!e.defaultPrevented&&kind==='switch'&&e.key==='Enter'){e.preventDefault();e.currentTarget.click();}}}/><span className="fdoc-control__shape" aria-hidden="true"><span className="fdoc-control__mark"/></span><span className="fdoc-control__ripple" aria-hidden="true"/></>}
 </span>;
 const text=label!=null&&<span className="fdoc-control__text"><span className="fdoc-control__label" id={`${id}-label`}>{state==='skeleton'?<Skeleton width={120} shape="text" textSize="subtitle"/>:label}</span>{hint&&<span id={`${id}-hint`} className="fdoc-control__description" data-error={!!errorText}>{state==='skeleton'?<Skeleton width={160} shape="text" textSize="caption"/>:hint}</span>}</span>;
 if(state==='skeleton')return <span className={`fdoc-control-row ${className}`} data-kind={kind} aria-hidden="true">{kind==='switch'?<>{text}{visual}</>:<>{visual}{text}</>}</span>;
 return <label className={`fdoc-control-row ${className}`} data-kind={kind} data-disabled={inactive} data-state={state} htmlFor={id}>{kind==='switch'?<>{text}{visual}</>:<>{visual}{text}</>}</label>;
}
export function Checkbox(props:SelectionControlProps){return <SelectionControl {...props} kind="checkbox"/>;}
export function Radio(props:Omit<SelectionControlProps,'indeterminate'>){return <SelectionControl {...props} kind="radio"/>;}
export function Switch(props:Omit<SelectionControlProps,'indeterminate'>){return <SelectionControl {...props} kind="switch"/>;}
export const CheckboxControl=Checkbox; export const CheckboxOption=Checkbox;
export const RadioControl=Radio; export const RadioOption=Radio;
export const SwitchControl=Switch; export const SwitchOption=Switch;
