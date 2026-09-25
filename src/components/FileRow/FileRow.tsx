import type { HTMLAttributes, ReactNode } from 'react';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { Icon, type IconName } from '../Icon/Icon';
import { Link } from '../Link/Link';
import { ProgressIndicator } from '../ProgressIndicator/ProgressIndicator';
import { Skeleton } from '../Skeleton/Skeleton';
import './FileRow.css';

export type FileRowType = 'loading' | 'uploaded' | 'uploaded-preview' | 'disabled' | 'template' | 'template-edit' | 'skeleton';
export interface FileRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  type?: FileRowType; fileName?: string; weight?: string; error?: boolean; errorText?: string;
  draggable?: boolean; leadingIcon?: IconName; leadingView?: ReactNode; trailingView?: ReactNode;
  deletable?: boolean; onDelete?: () => void; preview?: ReactNode; onTemplateEdit?: () => void;
}
export function FileRow({type='uploaded',fileName='File name.png',weight='2,7 МБ',error=false,errorText='Error text',draggable=false,leadingIcon='doc-paper',leadingView,trailingView,deletable=true,onDelete,preview,onTemplateEdit,className='',...props}:FileRowProps){
 if(type==='skeleton') return <Skeleton className={className} width="100%" height={48} shape="rounded" data-testid="file-row-skeleton"/>;
 const disabled=type==='disabled'; const loading=type==='loading'; const template=type==='template'||type==='template-edit'; const previewed=type==='uploaded-preview';
 const icon=error?'filled/exclamation_circle_filled':leadingIcon;
 return <div {...props} className={`fdoc-file-row fdoc-file-row--${type} ${error?'fdoc-file-row--error':''} ${className}`} data-testid="file-row">
   {draggable&&!disabled&&<span className="fdoc-file-row__drag"><Icon name="drag-dot" size={24}/></span>}
   {previewed&&preview?<span className="fdoc-file-row__preview">{preview}</span>:<span className="fdoc-file-row__leading">{leadingView??(loading?<ProgressIndicator type="circular" mode="indeterminate" size={20} variant="secondary"/>:<Icon name={icon} size={24}/>)}</span>}
   <div className="fdoc-file-row__content"><div className="fdoc-file-row__line"><span className="fdoc-file-row__name">{fileName}</span><span className="fdoc-file-row__meta">
     {template&&type==='template'&&<span>Шаблон</span>}
     {type==='template-edit'&&<Link href="#" size="medium" color="accent" decoration={null} onClick={e=>{e.preventDefault();onTemplateEdit?.();}}>Заполнить</Link>}
     {!template&&weight&&<span>{weight}</span>}
     {trailingView??(deletable&&!disabled&&<ButtonIcon aria-label="Удалить файл" icon="filled/cross_circle_filled" size="xsmall" iconSize={16} color="neutral" onClick={onDelete}/>)}
   </span></div>{error&&<span className="fdoc-file-row__error">{errorText}</span>}</div>
 </div>;
}