import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
  type TouchEvent as ReactTouchEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { Scrollbar } from '../Scrollbar/Scrollbar';
import { PortalContainer } from '../Dialog/PortalContainer';
import './BottomSheet.css';

export type BottomSheetCloseReason = 'scrim' | 'escape' | 'swipe';
export type BottomSheetAlign = 'left' | 'center';

export interface BottomSheetProps {
  /** Управляемое состояние открытия. */
  open: boolean;
  /** Запрос закрытия; родитель устанавливает open=false. */
  onClose: (reason: BottomSheetCloseReason) => void;
  /** Произвольный Content. */
  children?: ReactNode;
  /** Готовые Button 48 Large; блок остается закрепленным снизу. */
  footer?: ReactNode;
  /** Показывает модальный Scrim. Без Scrim фон остается интерактивным. */
  scrim?: boolean;
  /** Выравнивание содержимого Content. */
  align?: BottomSheetAlign;
  closeOnScrim?: boolean;
  closeOnEscape?: boolean;
  swipeToClose?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'data-testid'?: string;
}

type SwipeState = {
  pointerId?: number;
  startY: number;
  lastY: number;
  startedAt: number;
  content: HTMLElement | null;
};

let modalLocks = 0;
let previousOverflow = '';

function focusable(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(
    'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
  )).filter(node =>
    node.tabIndex >= 0 &&
    !node.matches(':disabled') &&
    !node.closest('[inert]') &&
    getComputedStyle(node).visibility !== 'hidden'
  );
}

export function BottomSheet({
  open,
  onClose,
  children,
  footer,
  scrim = true,
  align = 'left',
  closeOnScrim = true,
  closeOnEscape = true,
  swipeToClose = true,
  initialFocusRef,
  className = '',
  style,
  'aria-label': ariaLabel,
  'aria-labelledby': labelledBy,
  'aria-describedby': describedBy,
  'data-testid': testId = 'bottom-sheet',
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const swipe = useRef<SwipeState | null>(null);
  const [portal, setPortal] = useState<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!open || !scrim) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    if (modalLocks++ === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    const sheet = sheetRef.current;
    if (sheet) {
      const target = initialFocusRef?.current ?? focusable(sheet)[0] ?? sheet;
      target.focus();
    }
    return () => {
      if (--modalLocks === 0) document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open, scrim, initialFocusRef]);

  if (!open || typeof document === 'undefined') return null;

  const updateDrag = (currentY: number) => {
    const state = swipe.current;
    const sheet = sheetRef.current;
    if (!state || !sheet || (state.content && state.content.scrollTop > 0)) return;
    state.lastY = currentY;
    const delta = Math.max(0, currentY - state.startY);
    if (delta <= 0) return;
    sheet.style.transition = 'none';
    sheet.style.transform = 'translateY(' + delta + 'px)';
  };

  const finishDrag = () => {
    const state = swipe.current;
    const sheet = sheetRef.current;
    swipe.current = null;
    if (!state || !sheet) return;
    const delta = Math.max(0, state.lastY - state.startY);
    const duration = Math.max(1, performance.now() - state.startedAt);
    const threshold = Math.min(96, Math.max(48, sheet.getBoundingClientRect().height * 0.2));
    const shouldClose = swipeToClose && (delta >= threshold || delta / duration >= 0.7);
    sheet.style.transition = 'transform 160ms ease';
    sheet.style.transform = '';
    window.setTimeout(() => {
      if (sheet.isConnected) sheet.style.transition = '';
    }, 160);
    if (shouldClose) onClose('swipe');
  };

  const begin = (clientY: number, content: HTMLElement | null, pointerId?: number) => {
    if (!swipeToClose) return;
    swipe.current = { pointerId, startY: clientY, lastY: clientY, startedAt: performance.now(), content };
  };

  return createPortal(
    <div className="fdoc-bottom-sheet-layer" data-scrim={scrim || undefined} data-testid={testId + '-layer'}>
      {scrim && <div className="fdoc-bottom-sheet__scrim" data-testid={testId + '-scrim'} onClick={() => {
        if (closeOnScrim) onClose('scrim');
      }} />}
      <PortalContainer.Provider value={portal}>
        <div
          ref={sheetRef}
          role="dialog"
          aria-modal={scrim || undefined}
          aria-label={labelledBy ? undefined : (ariaLabel ?? 'Дополнительная информация')}
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          tabIndex={-1}
          className={'fdoc-bottom-sheet ' + className}
          data-align={align}
          data-testid={testId}
          style={style}
          onKeyDown={event => {
            if (event.key === 'Escape' && closeOnEscape && !event.defaultPrevented) {
              event.preventDefault();
              onClose('escape');
              return;
            }
            if (!scrim || event.key !== 'Tab' || event.defaultPrevented) return;
            const controls = focusable(event.currentTarget);
            const first = controls[0];
            const last = controls.at(-1);
            const active = document.activeElement;
            if (!first) {
              event.preventDefault();
              event.currentTarget.focus();
            } else if (event.shiftKey && (active === first || !controls.includes(active as HTMLElement))) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && active === last) {
              event.preventDefault();
              first.focus();
            }
          }}
          onPointerDown={(event: ReactPointerEvent<HTMLDivElement>) => {
            if (event.pointerType !== 'mouse') return;
            const content = (event.target as HTMLElement).closest('.fdoc-bottom-sheet__content') as HTMLElement | null;
            begin(event.clientY, content, event.pointerId);
            event.currentTarget.setPointerCapture?.(event.pointerId);
          }}
          onPointerMove={(event: ReactPointerEvent<HTMLDivElement>) => {
            if (event.pointerType !== 'mouse' || swipe.current?.pointerId !== event.pointerId) return;
            event.preventDefault();
            updateDrag(event.clientY);
          }}
          onPointerUp={(event: ReactPointerEvent<HTMLDivElement>) => {
            if (event.pointerType !== 'mouse' || swipe.current?.pointerId !== event.pointerId) return;
            event.currentTarget.releasePointerCapture?.(event.pointerId);
            finishDrag();
          }}
          onPointerCancel={() => finishDrag()}
          onTouchStart={(event: ReactTouchEvent<HTMLDivElement>) => {
            const point = event.touches[0];
            if (!point) return;
            const content = (event.target as HTMLElement).closest('.fdoc-bottom-sheet__content') as HTMLElement | null;
            begin(point.clientY, content);
          }}
          onTouchMove={(event: ReactTouchEvent<HTMLDivElement>) => {
            const point = event.touches[0];
            if (point) updateDrag(point.clientY);
          }}
          onTouchEnd={() => finishDrag()}
          onTouchCancel={() => finishDrag()}
        >
          <div className="fdoc-bottom-sheet__handle" data-testid={testId + '-handle'} aria-hidden="true">
            <span className="fdoc-bottom-sheet__handle-bar" />
          </div>
          <div className="fdoc-bottom-sheet__content-region">
            <div
              ref={contentRef}
              className="fdoc-bottom-sheet__content fdoc-scrollbar-viewport"
              data-has-footer={Boolean(footer) || undefined}
              data-testid={testId + '-content'}
            >
              {children}
            </div>
            <Scrollbar viewportRef={contentRef} data-testid={testId + '-scrollbar'} />
          </div>
          {footer && <footer className="fdoc-bottom-sheet__footer" data-testid={testId + '-footer'}>{footer}</footer>}
          <div ref={setPortal} className="fdoc-bottom-sheet__portals" />
        </div>
      </PortalContainer.Provider>
    </div>,
    document.body,
  );
}
