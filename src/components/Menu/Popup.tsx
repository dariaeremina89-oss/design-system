import { useEffect, useLayoutEffect, useRef, useState, type HTMLAttributes, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import './Menu.css';

export interface PopupProps extends Pick<HTMLAttributes<HTMLDivElement>, 'onPointerEnter' | 'onPointerLeave' | 'onFocusCapture'> {
  anchor: RefObject<HTMLElement | null>;
  children: ReactNode;
  onDismiss: (reason: 'outside' | 'escape') => void;
  placement?: 'auto' | 'top' | 'bottom';
  matchWidth?: boolean;
  gap?: number;
  maxHeight?: number;
}

/** Общий слой позиционирования: портал, flip, ограничения экрана и внешние взаимодействия. */
export function Popup({ anchor, children, onDismiss, placement = 'auto', matchWidth = false, gap = 0, maxHeight = 304, ...events }: PopupProps) {
  const popup = useRef<HTMLDivElement>(null);
  const dismiss = useRef(onDismiss);
  useLayoutEffect(() => { dismiss.current = onDismiss; });
  const [position, setPosition] = useState({ left: 0, top: 0, width: undefined as number | undefined, maxHeight, ready: false, side: 'bottom' });
  useLayoutEffect(() => {
    const update = () => {
      const a = anchor.current?.getBoundingClientRect(); const p = popup.current;
      if (!a || !p) return;
      const viewportWidth = document.documentElement.clientWidth, viewportHeight = window.innerHeight, edge = 8;
      const below = Math.max(0, viewportHeight - a.bottom - gap - edge), above = Math.max(0, a.top - gap - edge);
      const list = p.querySelector<HTMLElement>('.fdoc-menu__list');
      const fixed = Array.from(p.querySelectorAll<HTMLElement>('.fdoc-menu__search,.fdoc-menu__footer')).reduce((sum, element) => sum + element.offsetHeight, 16);
      const wanted = Math.min(maxHeight, list ? list.scrollHeight + fixed : p.scrollHeight);
      let side = placement === 'top' ? 'top' : 'bottom';
      if (side === 'bottom' && below < wanted && above > below) side = 'top';
      else if (side === 'top' && above < wanted && below > above) side = 'bottom';
      const height = Math.min(maxHeight, side === 'top' ? above : below);
      const width = matchWidth ? Math.min(a.width, viewportWidth - edge * 2) : undefined;
      const actualWidth = width ?? p.getBoundingClientRect().width;
      const actualHeight = Math.min(p.getBoundingClientRect().height, height);
      const next = { left: Math.max(edge, Math.min(a.left, viewportWidth - actualWidth - edge)),
        top: side === 'top' ? Math.max(edge, a.top - gap - actualHeight) : a.bottom + gap,
        width, maxHeight: height, ready: true, side };
      setPosition(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };
    update();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    if (anchor.current) observer?.observe(anchor.current);
    if (popup.current) observer?.observe(popup.current);
    window.addEventListener('resize', update); window.addEventListener('scroll', update, true);
    return () => { observer?.disconnect(); window.removeEventListener('resize', update); window.removeEventListener('scroll', update, true); };
  }, [anchor, placement, matchWidth, gap, maxHeight]);
  useEffect(() => {
    const outside = (event: Event) => {
      const target = event.target as Node;
      if (!popup.current?.contains(target) && !anchor.current?.contains(target)) dismiss.current('outside');
    };
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape' && !event.defaultPrevented) { event.preventDefault(); dismiss.current('escape'); } };
    document.addEventListener('pointerdown', outside); document.addEventListener('focusin', outside); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('focusin', outside); document.removeEventListener('keydown', key); };
  }, [anchor]);
  return createPortal(<div {...events} className="fdoc-popup" ref={popup} data-placement={position.side}
    style={{ left: position.left, top: position.top, width: position.width, maxHeight: position.maxHeight, visibility: position.ready ? 'visible' : 'hidden' }}>{children}</div>, document.body);
}
