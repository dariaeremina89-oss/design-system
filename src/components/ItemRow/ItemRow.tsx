import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import { Checkbox } from '../SelectionControl/SelectionControl';
import { Divider } from '../Divider/Divider';
import { Skeleton } from '../Skeleton/Skeleton';
import { Link, type LinkProps } from '../Link/Link';
import { Search, type SearchProps } from '../Search/Search';
import './ItemRow.css';

export type ItemRowState = 'default'|'hover'|'pressed'|'focused'|'disabled'|'skeleton';
export interface ItemRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  helper?: ReactNode;
  variant?: 'item' | 'header' | 'link' | 'search';
  leadingIcon?: IconName;
  logo?: string;
  trailingIcon?: IconName;
  selection?: 'check' | 'checkbox';
  selectionPosition?: 'left' | 'right';
  selected?: boolean;
  selectionIndeterminate?: boolean;
  divider?: boolean;
  disabled?: boolean;
  state?: ItemRowState;
  href?: string;
  linkProps?: Omit<LinkProps, 'children' | 'href'>;
  searchProps?: SearchProps;
  ref?: Ref<HTMLDivElement>;
}

export function ItemRow({ title, description, helper, variant = 'item', leadingIcon, logo, trailingIcon,
  selection, selectionPosition = 'right', selected = false, selectionIndeterminate = false,
  divider = false, disabled = false, state = 'default', href, linkProps, searchProps,
  className = '', onClick, onKeyDown, role, tabIndex, ref, ...props }: ItemRowProps) {
  const loading = state === 'skeleton';
  const inactive = disabled || state === 'disabled';
  const interactive = variant === 'item' && (!!onClick || !!role);
  const indicator = selection === 'checkbox'
    ? <span className="fdoc-item-row__checkbox" inert aria-hidden="true"><Checkbox checked={selected} indeterminate={selectionIndeterminate} readOnly disabled={inactive} tabIndex={-1} aria-label="Выбор" /></span>
    : selection === 'check' ? <span className="fdoc-item-row__check" data-selected={selected}><Icon name="filled/check_circle_filled" size={24}/></span> : null;
  const slot = (side: 'left' | 'right') => {
    const content = selection && selectionPosition === side ? indicator
      : side === 'left' ? logo ? <img src={logo} alt="" className="fdoc-item-row__logo"/> : leadingIcon && <Icon name={leadingIcon} size={24}/>
      : trailingIcon && <Icon name={trailingIcon} size={24}/>;
    if (!content) return null;
    return <span className="fdoc-item-row__slot" aria-hidden="true">{loading ? <Skeleton shape="icon" width={side === 'left' && logo ? 32 : 24} height={side === 'left' && logo ? 32 : 24}/> : content}</span>;
  };
  return <div {...props} ref={ref} className={`fdoc-item-row ${className}`} data-variant={variant}
    data-state={inactive ? 'disabled' : state} inert={loading || undefined} data-interactive={interactive} aria-hidden={loading || undefined}
    role={loading ? undefined : role ?? (interactive ? 'button' : undefined)} tabIndex={loading || inactive ? undefined : tabIndex ?? (interactive ? 0 : undefined)}
    aria-disabled={inactive || undefined} onClick={inactive || loading ? undefined : onClick}
    onKeyDown={event => { onKeyDown?.(event); if (!event.defaultPrevented && interactive && !inactive && !loading && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); event.currentTarget.click(); } }}>
    <div className="fdoc-item-row__container">
      {variant === 'search' ? <Search {...searchProps} disabled={inactive || searchProps?.disabled} skeleton={loading} />
        : variant === 'link' ? <Link {...linkProps} color="accent" href={href} disabled={inactive} state={loading ? 'skeleton' : state} size="medium">{title}</Link>
        : <>
          <span className="fdoc-item-row__main">{slot('left')}<span className="fdoc-item-row__text">
            <span className="fdoc-item-row__title">{loading ? <Skeleton shape="text" textSize={variant === 'header' ? 'subtitle' : 'body'} width="min(120px, 100%)"/> : title}</span>
            {description != null && <span className="fdoc-item-row__description">{loading ? <Skeleton shape="text" textSize="caption" width="min(160px, 100%)"/> : description}</span>}
          </span></span>
          {helper != null && <span className="fdoc-item-row__helper">{loading ? <Skeleton shape="text" textSize="body" width={64}/> : helper}</span>}
          {slot('right')}
        </>}
    </div>
    {divider && <Divider/>}
  </div>;
}
