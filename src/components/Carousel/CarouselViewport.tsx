import { Children, useRef, useState, type HTMLAttributes, type CSSProperties, type PointerEvent } from 'react';
import './CarouselViewport.css';
export interface CarouselViewportProps extends HTMLAttributes<HTMLDivElement> {
  index: number;
  onIndexChange: (index: number) => void;
  disabled?: boolean;
}
/** Необязательная область контента: горизонтальный переход и pointer drag/swipe. */
export function CarouselViewport({ index, onIndexChange, disabled = false, children, className = '', ...props }: CarouselViewportProps) {
  const slides = Children.toArray(children);
  const current = Math.max(0, Math.min(slides.length - 1, index));
  const track = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ id: number; x: number; y: number; time: number; base: number; width: number; active: boolean; lastX: number; lastTime: number; velocity: number } | null>(null);
  const suppressClick = useRef(false);
  const [offset, setOffset] = useState<number | null>(null);
  function finish(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    const g = gesture.current;
    if (!g || event.pointerId !== g.id) return;
    const dx = event.clientX - g.x;
    gesture.current = null;
    setOffset(null);
    if (!cancelled && g.active && !disabled) {
      const velocity = event.timeStamp - g.lastTime < 100 ? g.velocity : 0;
      const delta = Math.abs(dx) >= Math.min(80, g.width * .2) || Math.abs(velocity) > .5 ? (dx < 0 ? 1 : -1) : 0;
      const next = Math.max(0, Math.min(slides.length - 1, current + delta));
      if (next !== current) onIndexChange(next);
    }
    if (event.currentTarget.hasPointerCapture?.(g.id)) event.currentTarget.releasePointerCapture(g.id);
  }
  return <div {...props} className={`fdoc-carousel-viewport ${className}`} role="region" aria-roledescription="карусель" aria-label={props['aria-label'] ?? 'Слайды'} onDragStart={e => e.preventDefault()} onClickCapture={e => { if (suppressClick.current) { e.preventDefault(); e.stopPropagation(); suppressClick.current = false; } }} onPointerDown={event => {
    suppressClick.current = false;
    if (disabled || slides.length < 2 || !event.isPrimary || event.button !== 0 || (event.target as HTMLElement).closest('button,a,input,textarea,select')) return;
    const width = event.currentTarget.clientWidth;
    if (!width) return;
    const transform = getComputedStyle(track.current!).transform;
    const base = transform === 'none' ? -current * width : new DOMMatrixReadOnly(transform).m41;
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, time: event.timeStamp, base, width, active: false, lastX: event.clientX, lastTime: event.timeStamp, velocity: 0 };
  }} onPointerMove={event => {
    const g = gesture.current;
    if (!g || event.pointerId !== g.id) return;
    const dx = event.clientX - g.x, dy = event.clientY - g.y;
    if (!g.active) {
      if (Math.abs(dy) > 6 && Math.abs(dy) > Math.abs(dx)) { gesture.current = null; return; }
      if (Math.abs(dx) < 6) return;
      g.active = true;
      event.currentTarget.setPointerCapture(g.id);
      suppressClick.current = true;
    }
    const dt = event.timeStamp - g.lastTime;
    if (dt > 0) g.velocity = (event.clientX - g.lastX) / dt;
    g.lastX = event.clientX; g.lastTime = event.timeStamp;
    const raw = g.base + dx, min = -(slides.length - 1) * g.width;
    setOffset(raw > 0 ? raw * .2 : raw < min ? min + (raw - min) * .2 : raw);
  }} onPointerUp={event => finish(event)} onPointerCancel={event => finish(event, true)} onLostPointerCapture={event => { if (gesture.current) finish(event, true); }}>
    <div ref={track} className="fdoc-carousel-viewport__track" data-dragging={offset !== null} style={{ transform: offset === null ? `translateX(${-current * 100}%)` : `translateX(${offset}px)` } as CSSProperties}>
      {slides.map((slide, i) => <div key={(slide as {key?: string}).key ?? i} className="fdoc-carousel-viewport__slide" role="group" aria-roledescription="слайд" aria-label={`${i + 1} из ${slides.length}`} aria-hidden={current !== i} inert={current !== i}>{slide}</div>)}
    </div>
    <span className="fdoc-carousel-viewport__status" aria-live="polite" aria-atomic="true">{slides.length ? `Элемент ${current + 1} из ${slides.length}` : 'Нет элементов'}</span>
  </div>;
}
