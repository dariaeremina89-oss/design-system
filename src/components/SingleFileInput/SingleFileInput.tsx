import type { ChangeEvent, HTMLAttributes } from 'react';
import { Button } from '../Button/Button'; import { ButtonIcon } from '../ButtonIcon/ButtonIcon'; import { Icon } from '../Icon/Icon'; import { Skeleton } from '../Skeleton/Skeleton'; import './SingleFileInput.css';
export type SingleFileInputType='default'|'disabled'|'skeleton'; export type SingleFileInputSize='desktop'|'mobile';
export interface SingleFileInputProps extends Omit<HTMLAttributes<HTMLDivElement>,'onChange'>{type?:SingleFileInputType;size?:SingleFileInputSize;error?:boolean;errorText?:string;accept?:string;buttonText?:string;placeholder?:string;onFileChange?:(file:File|null)=>void}
export function SingleFileInput({type='default',size='desktop',error=false,errorText='Error text',accept,buttonText='Загрузить',placeholder='Выберите файл',onFileChange,className='',...props}:SingleFileInputProps){
 if(type==='skeleton')return <Skeleton className={className} width="100%" height={48} shape="rounded" data-testid="single-file-input-skeleton"/>;
 const disabled=type==='disabled'; const change=(e:ChangeEvent<HTMLInputElement>)=>onFileChange?.(e.target.files?.[0]??null);
 const input=<input type="file" accept={accept} onChange={change}/>;
 return <div {...props} className={`fdoc-single-file-input fdoc-single-file-input--${size} ${error?'fdoc-single-file-input--error':''} ${disabled?'fdoc-single-file-input--disabled':''} ${className}`} data-testid="single-file-input">
  <span className="fdoc-single-file-input__icon"><Icon name={error&&!disabled?'filled/exclamation_circle_filled':'doc-paper'} size={24}/></span>
  <span className="fdoc-single-file-input__content"><span className="fdoc-single-file-input__label">{disabled?'Загрузка файлов недоступна':placeholder}</span>{error&&<span className="fdoc-single-file-input__error">{errorText}</span>}</span>
  {!disabled&&<label className="fdoc-single-file-input__pick">{input}{size==='mobile'?<ButtonIcon aria-label={buttonText} icon="plus" size="small" color="primary" tabIndex={-1}/>:<Button size="small" color="primary" tabIndex={-1}>{buttonText}</Button>}</label>}
 </div>;
}