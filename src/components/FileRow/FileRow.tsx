import { useState, type DragEvent, type HTMLAttributes, type ReactNode } from 'react';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { Icon, type IconName } from '../Icon/Icon';
import { Link } from '../Link/Link';
import { Menu, type MenuItem } from '../Menu/Menu';
import { ProgressIndicator } from '../ProgressIndicator/ProgressIndicator';
import { Skeleton } from '../Skeleton/Skeleton';
import { Tooltip } from '../Tooltip/Tooltip';
import './FileRow.css';

export type FileRowType = 'loading' | 'uploaded' | 'uploaded-preview' | 'disabled' | 'template' | 'template-edit' | 'skeleton';
export interface FileRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onDragStart' | 'onDragEnd'> {
  type?: FileRowType; fileName?: string; weight?: string; error?: boolean; errorText?: string;
  draggable?: boolean; leadingIcon?: IconName; leadingView?: ReactNode; trailingView?: ReactNode;
  deletable?: boolean; onDelete?: () => void; preview?: ReactNode; onTemplateEdit?: () => void;
  menuItems?: MenuItem[]; menuAriaLabel?: string; onMenuAction?: (item: MenuItem) => void;
  onDragStart?: (event: DragEvent<HTMLDivElement>) => void; onDragEnd?: (event: DragEvent<HTMLDivElement>) => void;
}
export function FileRow({type='uploaded',fileName='File name.png',weight='2,7 МБ',error=false,errorText='Error text',draggable=false,leadingIcon,leadingView,trailingView,deletable=true,onDelete,preview,onTemplateEdit,menuItems,menuAriaLabel='Действия с файлом',onMenuAction,onDragStart,onDragEnd,className='',...props}:FileRowProps){
  const [menuOpen,setMenuOpen]=useState(false);
  if(type==='skeleton') return <Skeleton className={className} width="100%" height={48} shape="rounded" data-testid="file-row-skeleton"/>;
  const disabled=type==='disabled', loading=type==='loading', template=type==='template'||type==='template-edit', previewed=type==='uploaded-preview';
  const defaultLeadingIcon:IconName=type==='template-edit'?'pencil-paper':'doc-paper';
  const icon:IconName=error?'filled/exclamation_circle_filled':(leadingIcon??defaultLeadingIcon);
  const hasMenu=!!menuItems?.length;
  return <div {...props} draggable={draggable&&!disabled} onDragStart={onDragStart} onDragEnd={onDragEnd} className={`fdoc-file-row fdoc-file-row--${type} ${error?'fdoc-file-row--error':''} ${draggable?'fdoc-file-row--draggable':''} ${className}`} data-testid="file-row">
    {draggable&&<ButtonIcon aria-label="Изменить порядок" icon="drag-dot" size="xsmall" iconSize={24} color="neutral" disabled={disabled} className="fdoc-file-row__drag"/>}
    {previewed?<span className="fdoc-file-row__preview">{preview??<span className="fdoc-file-row__preview-placeholder"/>}</span>:<span className="fdoc-file-row__leading">{leadingView??(loading?<ProgressIndicator type="circular" mode="indeterminate" size={20} variant="secondary"/>:<Icon name={icon} size={24}/>)}</span>}
    <div className="fdoc-file-row__content"><div className="fdoc-file-row__line"><span className="fdoc-file-row__name">{fileName}</span><span className="fdoc-file-row__meta">
      {type==='template'&&<span>Шаблон</span>}
      {type==='template-edit'&&<Link href="#" size="medium" color="accent" decoration={null} onClick={e=>{e.preventDefault();if(!disabled)onTemplateEdit?.();}}>Заполнить</Link>}
      {!template&&weight&&<span>{weight}</span>}
      {trailingView??(hasMenu?<span className="fdoc-file-row__menu-wrap"><ButtonIcon aria-label={menuAriaLabel} icon="dots-vertical" size="xsmall" iconSize={16} color="neutral" state={menuOpen?'hover':'default'} aria-expanded={menuOpen} onClick={()=>setMenuOpen(v=>!v)}/>{menuOpen&&<div className="fdoc-file-row__menu"><Menu items={menuItems!} onAction={item=>{item.onAction?.();onMenuAction?.(item);setMenuOpen(false);}}/></div>}</span>:deletable&&<Tooltip content="Удалить" placement="bottom"><ButtonIcon aria-label="Удалить файл" icon="filled/cross_circle_filled" size="xsmall" iconSize={16} color="neutral" state={disabled?'disabled':'default'} onClick={onDelete}/></Tooltip>)}
    </span></div>{error&&<span className="fdoc-file-row__error">{errorText}</span>}</div>
  </div>;
}