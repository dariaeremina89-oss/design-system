import { useState, type ButtonHTMLAttributes, type CSSProperties } from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { Skeleton } from '../Skeleton/Skeleton';
import './Chips.css';

export type ChipsColor = 'secondary' | 'base' | 'primary' | 'success' | 'accent' | 'warning' | 'error' | 'inverse';
export type ChipsSize = 'small' | 'medium';
export type ChipsShape = 'round' | 'square';
export type ChipsState = 'default' | 'hover' | 'pressed' | 'focused' | 'disabled' | 'skeleton';
export interface ChipsProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'children'> {
  /** Однострочный текст. */
  text: string;
  color?: ChipsColor;
  size?: ChipsSize;
  shape?: ChipsShape;
  state?: ChipsState;
  iconLeft?: IconName;
  iconRight?: IconName;
  /** Включает выбор. Выбранный Chips всегда использует Primary. */
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /** Без действия и выбора компонент является информационной меткой. */
  interactive?: boolean;
  /** Отдельное действие справа, не переключает выбор. */
  onRemove?: () => void;
  removeLabel?: string;
  skeletonWidth?: CSSProperties['width'];
  'data-testid'?: string;
}

export function Chips({text,color='secondary',size='medium',shape='round',state='default',iconLeft,iconRight,selected,defaultSelected,onSelectedChange,interactive,onRemove,removeLabel,skeletonWidth,disabled=false,className='',style,onClick,type='button','data-testid':testId='chips',...props}:ChipsProps) {
  const [localSelected,setLocalSelected]=useState(defaultSelected??false);
  const selectable=selected!==undefined||defaultSelected!==undefined||onSelectedChange!==undefined;
  const checked=selected??localSelected;
  const isDisabled=disabled||state==='disabled';
  const isInteractive=selectable||Boolean(interactive??onClick);
  const resolvedColor=selectable?(checked?'primary':color==='base'?'base':'secondary'):color;
  const classes=`fdoc-chips fdoc-chips--${size} fdoc-chips--${shape} ${className}`;
  if(state==='skeleton')return <Skeleton className={`${classes} fdoc-chips--skeleton`} width={skeletonWidth??(size==='small'?57:65)} height={size==='small'?24:32} style={style} data-testid={testId}/>;
  const content=<>{iconLeft&&<Icon name={iconLeft} size={16}/>}<span className="fdoc-chips__text">{text}</span>{iconRight&&!onRemove&&<Icon name={iconRight} size={16}/>}</>;
  return <span className={classes} style={style} data-color={resolvedColor} data-state={isDisabled?'disabled':state} data-interactive={isInteractive} data-testid={testId}>
    {isInteractive?<button {...props} type={type} className="fdoc-chips__main" disabled={isDisabled} aria-pressed={selectable?checked:undefined} onClick={event=>{
      onClick?.(event);
      if(!event.defaultPrevented&&selectable){if(selected===undefined)setLocalSelected(!checked);onSelectedChange?.(!checked);}
    }}>{content}</button>:<span className="fdoc-chips__main" aria-label={props['aria-label']} aria-describedby={props['aria-describedby']} aria-disabled={isDisabled||undefined}>{content}</span>}
    {onRemove&&<ButtonIcon className="fdoc-chips__remove" size="xxsmall" color="neutral" icon={iconRight??'cross_circle'} disabled={isDisabled} aria-label={removeLabel??`Удалить: ${text}`} onClick={event=>{event.stopPropagation();onRemove();}}/>}
  </span>;
}
