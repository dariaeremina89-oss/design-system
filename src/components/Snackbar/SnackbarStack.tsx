import { useEffect, useRef, useState, type HTMLAttributes } from 'react';
import { Snackbar, type SnackbarProps } from './Snackbar';

export interface SnackbarItem extends SnackbarProps { id: string; duration?: number; }
export interface SnackbarStackProps extends HTMLAttributes<HTMLDivElement> {
  items: readonly SnackbarItem[];
  onDismiss: (id: string) => void;
  /** Миллисекунды. Таймер приостанавливается на hover, focus и скрытой вкладке. */
  duration?: number;
  position?: 'container' | 'viewport';
}
function TimedSnackbar({ item, duration, onDismiss }: { item: SnackbarItem; duration: number; onDismiss: (id: string) => void }) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [hidden, setHidden] = useState(() => typeof document !== 'undefined' && document.hidden);
  const remaining = useRef(duration);
  const dismiss = useRef(onDismiss);
  dismiss.current = onDismiss;
  useEffect(() => {
    const update = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  useEffect(() => { remaining.current = duration; }, [duration]);
  useEffect(() => {
    if (hover || focus || hidden) return;
    const started = Date.now();
    const timer = setTimeout(() => dismiss.current(item.id), Math.max(0, remaining.current));
    return () => { clearTimeout(timer); remaining.current -= Date.now() - started; };
  }, [hover, focus, hidden, duration, item.id]);
  const { id, duration: _duration, onClose, ...props } = item;
  return <div className="fdoc-snackbar-stack__item" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    onFocusCapture={() => setFocus(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocus(false); }}
    onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); dismiss.current(id); } }}>
    <Snackbar {...props} onClose={onClose ? () => { onClose(); dismiss.current(id); } : undefined} />
  </div>;
}
/** Отдельный управляемый стек для страницы, модального окна или оверлея. */
export function SnackbarStack({ items, onDismiss, duration = 5000, position = 'container', className = '', ...props }: SnackbarStackProps) {
  return <div {...props} className={`fdoc-snackbar-stack ${className}`} data-position={position} data-testid="snackbar-stack">
    {items.map(item => <TimedSnackbar key={item.id} item={item} duration={item.duration ?? duration} onDismiss={onDismiss} />)}
  </div>;
}
