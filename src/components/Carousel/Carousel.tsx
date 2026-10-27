import { useEffect, useRef, useState, type Ref, type ButtonHTMLAttributes, type HTMLAttributes } from 'react';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { Skeleton } from '../Skeleton/Skeleton';
import './Carousel.css';

export type CarouselColor = 'auto' | 'secondary' | 'inverse-light';
export type CarouselDotState = 'default' | 'hover' | 'focused' | 'pressed' | 'disabled';
export interface CarouselDotProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
  selected?: boolean;
  state?: CarouselDotState;
}
export function CarouselDot({ selected = false, state = 'default', disabled, className = '', ...props }: CarouselDotProps) {
  return <button {...props} type="button" className={`fdoc-carousel__dot ${className}`} data-selected={selected} data-state={state} disabled={disabled || state === 'disabled'} aria-current={selected ? 'true' : undefined} />;
}
export interface CarouselProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'color'> {
  /** Количество элементов. При count < 2 навигация скрыта. */
  count: number;
  /** Текущий индекс, начиная с 0. */
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** ID связанной области контента. */
  controlsId: string;
  color?: CarouselColor;
  disabled?: boolean;
  /** Циклическое переключение между первым и последним элементом. */
  loop?: boolean;
  /** Скелетон панели при первичной загрузке. */
  isLoading?: boolean;
}
export function Carousel({ count, index, defaultIndex = 0, onIndexChange, controlsId, color = 'auto', disabled = false, loop = false, isLoading = false, className = '', ...props }: CarouselProps) {
  const total = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  const clamp = (n: number) => Math.max(0, Math.min(total - 1, Number.isFinite(n) ? Math.floor(n) : 0));
  const wrap = (n: number) => {
    if (total <= 0) return 0;
    const value = Number.isFinite(n) ? Math.floor(n) : 0;
    return ((value % total) + total) % total;
  };
  const resolveIndex = (n: number) => loop ? wrap(n) : clamp(n);
  const [localIndex, setLocalIndex] = useState(defaultIndex);
  const current = resolveIndex(index ?? localIndex);
  const [focusIndex, setFocusIndex] = useState(current);
  const dots = useRef<Array<HTMLButtonElement | null>>([]);
  const viewport = useRef<HTMLDivElement>(null);
  function reveal(i: number) {
    const dot = dots.current[i], container = viewport.current;
    if (!dot || !container) return;
    const d = dot.getBoundingClientRect(), v = container.getBoundingClientRect();
    if (d.left < v.left) container.scrollLeft += d.left - v.left;
    else if (d.right > v.right) container.scrollLeft += d.right - v.right;
  }
  useEffect(() => {
    setLocalIndex(n => resolveIndex(n));
    setFocusIndex(current);
    reveal(current);
    const resize = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => reveal(current)) : null;
    if (viewport.current) resize?.observe(viewport.current);
    return () => resize?.disconnect();
  }, [current, total, isLoading]);
  function select(next: number) {
    next = resolveIndex(next);
    if (disabled || next === current) return;
    if (index === undefined) setLocalIndex(next);
    onIndexChange?.(next);
  }
  if (isLoading) return <Skeleton {...props} className={className} width={168} height="var(--elements-32)" style={{minWidth: 0, maxWidth: '100%', borderRadius: 'var(--radius-full)', ...props.style}} />;
  if (total < 2) return null;
  return <nav {...props} aria-label={props['aria-label'] ?? 'Навигация по элементам'} aria-controls={controlsId} className={`fdoc-carousel ${className}`} data-color={color} data-testid="carousel">
    <ButtonIcon className="fdoc-carousel__arrow" size="small" color={color === 'inverse-light' ? 'inverse-light' : 'neutral'} icon="arrow-chevron-left" aria-label="Предыдущий элемент" aria-controls={controlsId} disabled={disabled || (!loop && current === 0)} onClick={() => select(current - 1)} />
    <div className="fdoc-carousel__indicators" ref={viewport} role="group" aria-label="Выбор элемента" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocusIndex(current); }}>
      {Array.from({ length: total }, (_, i) => <CarouselDot key={i} ref={element => { dots.current[i] = element; }} selected={current === i} disabled={disabled} tabIndex={resolveIndex(focusIndex) === i ? 0 : -1} aria-label={`Перейти к элементу ${i + 1} из ${total}`} aria-controls={controlsId} onClick={() => select(i)} onFocus={() => { setFocusIndex(i); reveal(i); }} onTransitionEnd={() => { if (i === current) reveal(current); }} onKeyDown={event => {
        const target = event.key === 'ArrowRight' ? resolveIndex(i + 1) : event.key === 'ArrowLeft' ? resolveIndex(i - 1) : event.key === 'Home' ? 0 : event.key === 'End' ? total - 1 : null;
        if (target === null) return;
        event.preventDefault();
        select(target);
        setFocusIndex(target);
        queueMicrotask(() => dots.current[target]?.focus());
      }} />)}
    </div>
    <ButtonIcon className="fdoc-carousel__arrow" size="small" color={color === 'inverse-light' ? 'inverse-light' : 'neutral'} icon="arrow-chevron-right" aria-label="Следующий элемент" aria-controls={controlsId} disabled={disabled || (!loop && current === total - 1)} onClick={() => select(current + 1)} />
  </nav>;
}
