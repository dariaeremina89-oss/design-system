import { useId, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { Typography } from '../Typography/Typography';
import { PortalContainer } from './PortalContainer';
import './Dialog.css';

export interface DialogProps {
  /** Управляемое состояние открытия. */
  open: boolean;
  /** Запрос закрытия; родитель устанавливает open=false. */
  onClose: (reason: 'close-button' | 'escape' | 'backdrop') => void;
  /** Обязательное название диалога, остается доступным при скрытом заголовке. */
  title: string;
  children?: ReactNode;
  /** Готовые Button и другие действия. */
  footer?: ReactNode;
  size?: 'small' | 'medium' | 'large';
  /** Basic, Image, Module и Module + Scroll из Figma. */
  variant?: 'basic' | 'image' | 'module' | 'scroll';
  image?: ReactNode;
  footerAlign?: 'left' | 'center' | 'edges';
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  closeLabel?: string;
  initialFocusRef?: RefObject<HTMLElement | null>;
  'aria-describedby'?: string;
  'data-testid'?: string;
}
let locks = 0;
let previousOverflow = '';

/** Modal top layer provides focus containment and makes the background inert. */
export function Dialog({ open, onClose, title, children, footer, size = 'small', variant = 'basic', image,
  footerAlign = 'left', closeOnEscape = true, closeOnBackdrop = true, closeLabel = 'Закрыть диалог',
  initialFocusRef, 'aria-describedby': describedBy, 'data-testid': testId = 'dialog' }: DialogProps) {
  const titleId = useId();
  const ref = useRef<HTMLDialogElement>(null);
  const [portal, setPortal] = useState<HTMLDivElement | null>(null);
  const pointerOutside = useRef(false);
  const initialFocus = useRef(initialFocusRef);
  initialFocus.current = initialFocusRef;
  useLayoutEffect(() => {
    if (!open || !ref.current) return;
    const node = ref.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    node.showModal();
    if (locks++ === 0) { previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; }
    return () => {
      node.close();
      if (--locks === 0) document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open]);
  useLayoutEffect(() => {
    if (open && portal) (initialFocus.current?.current ?? ref.current?.querySelector<HTMLElement>('[data-dialog-title]'))?.focus();
  }, [open, portal]);
  if (!open || typeof document === 'undefined') return null;
  const outside = (x: number, y: number) => {
    const box = ref.current!.getBoundingClientRect();
    return x < box.left || x > box.right || y < box.top || y > box.bottom;
  };
  return createPortal(<dialog ref={ref} className="fdoc-dialog" data-size={size} data-variant={variant}
    data-testid={testId} aria-modal="true" aria-labelledby={titleId} aria-describedby={describedBy}
    onKeyDown={event => {
      if (event.key !== 'Tab' || event.defaultPrevented || (event.target as Element).closest('dialog') !== event.currentTarget) return;
      const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button, input, select, textarea, a[href], [tabindex]'))
        .filter(node => node.tabIndex >= 0 && !node.matches(':disabled') && !node.closest('[inert]') && node.getClientRects().length > 0 && getComputedStyle(node).visibility !== 'hidden');
      const first = controls[0], last = controls.at(-1), active = document.activeElement;
      if (!first) { event.preventDefault(); event.currentTarget.querySelector<HTMLElement>('[data-dialog-title]')?.focus(); }
      else if (event.shiftKey && (active === first || !controls.includes(active as HTMLElement))) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && active === last) { event.preventDefault(); first.focus(); }
    }}
    onCancel={event => { event.preventDefault(); event.stopPropagation(); if (event.target === event.currentTarget && closeOnEscape) onClose('escape'); }}
    onPointerDown={event => { pointerOutside.current = event.target === event.currentTarget && outside(event.clientX, event.clientY); }}
    onClick={event => { if (closeOnBackdrop && pointerOutside.current && event.target === event.currentTarget && outside(event.clientX, event.clientY)) onClose('backdrop'); pointerOutside.current = false; }}>
    <PortalContainer.Provider value={portal}>
      {portal && <div className="fdoc-dialog__layout">
        <header className="fdoc-dialog__header" data-testid={`${testId}-header`}>
          <Typography as="h2" variant="h3-heading" id={titleId} tabIndex={-1} data-dialog-title="" className="fdoc-dialog__title">{title}</Typography>
          <ButtonIcon icon="cross" size="medium" color="neutral" aria-label={closeLabel} data-testid={`${testId}-close`} onClick={() => onClose('close-button')} />
        </header>
        <div className="fdoc-dialog__content" data-testid={`${testId}-content`}>
          {variant === 'image' && image && <div className="fdoc-dialog__image">{image}</div>}
          {variant === 'image' && <Typography as="h3" variant="h3-heading" aria-hidden="true">{title}</Typography>}
          {children}
        </div>
        {footer && <footer className="fdoc-dialog__footer" data-align={footerAlign} data-testid={`${testId}-footer`}>{footer}</footer>}
      </div>}
      <div ref={setPortal} className="fdoc-dialog__portals" />
    </PortalContainer.Provider>
  </dialog>, document.body);
}
