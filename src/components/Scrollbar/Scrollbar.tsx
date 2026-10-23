import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';
import './Scrollbar.css';

export interface ScrollbarProps {
  viewportRef: RefObject<HTMLElement | null>;
  minThumbSize?: number;
  className?: string;
  'data-testid'?: string;
}

type Metrics = { visible: boolean; thumbSize: number; thumbOffset: number };
const EMPTY: Metrics = { visible: false, thumbSize: 0, thumbOffset: 0 };

export function Scrollbar({ viewportRef, minThumbSize = 32, className = '', 'data-testid': testId = 'scrollbar' }: ScrollbarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId:number; startY:number; startScrollTop:number; maxScroll:number; maxTravel:number } | null>(null);
  const [metrics, setMetrics] = useState<Metrics>(EMPTY);

  const measure = useCallback(() => {
    const viewport=viewportRef.current, track=trackRef.current;
    if(!viewport||!track) return;
    const maxScroll=Math.max(0,viewport.scrollHeight-viewport.clientHeight);
    const trackSize=Math.max(0,track.clientHeight-8);
    if(maxScroll<=1||trackSize<=0){setMetrics(current=>current.visible?EMPTY:current);return;}
    const thumbSize=Math.min(trackSize,Math.max(minThumbSize,trackSize*(viewport.clientHeight/viewport.scrollHeight)));
    const maxTravel=Math.max(0,trackSize-thumbSize);
    const thumbOffset=maxScroll>0?(viewport.scrollTop/maxScroll)*maxTravel:0;
    setMetrics(current=>current.visible&&Math.abs(current.thumbSize-thumbSize)<0.5&&Math.abs(current.thumbOffset-thumbOffset)<0.5
      ? current : {visible:true,thumbSize,thumbOffset});
  },[minThumbSize,viewportRef]);

  useLayoutEffect(()=>{
    const viewport=viewportRef.current, track=trackRef.current;
    if(!viewport||!track) return;
    const resize=typeof ResizeObserver==='undefined'?null:new ResizeObserver(measure);
    const observe=()=>{resize?.disconnect();resize?.observe(viewport);resize?.observe(track);for(const child of Array.from(viewport.children)) resize?.observe(child);measure();};
    const mutation=typeof MutationObserver==='undefined'?null:new MutationObserver(observe);
    mutation?.observe(viewport,{childList:true,subtree:true,characterData:true,attributes:true});
    viewport.addEventListener('scroll',measure,{passive:true});window.addEventListener('resize',measure);observe();
    return()=>{resize?.disconnect();mutation?.disconnect();viewport.removeEventListener('scroll',measure);window.removeEventListener('resize',measure);};
  },[measure,viewportRef]);

  const startDrag=(event:ReactPointerEvent<HTMLDivElement>)=>{
    const viewport=viewportRef.current, track=trackRef.current;if(!viewport||!track||!metrics.visible)return;
    event.preventDefault();event.stopPropagation();
    const trackSize=Math.max(0,track.clientHeight-8);
    dragRef.current={pointerId:event.pointerId,startY:event.clientY,startScrollTop:viewport.scrollTop,maxScroll:Math.max(0,viewport.scrollHeight-viewport.clientHeight),maxTravel:Math.max(0,trackSize-metrics.thumbSize)};
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const drag=(event:ReactPointerEvent<HTMLDivElement>)=>{
    const viewport=viewportRef.current,state=dragRef.current;if(!viewport||!state||state.pointerId!==event.pointerId||state.maxTravel<=0)return;
    viewport.scrollTop=state.startScrollTop+((event.clientY-state.startY)/state.maxTravel)*state.maxScroll;
  };
  const stopDrag=(event:ReactPointerEvent<HTMLDivElement>)=>{
    if(dragRef.current?.pointerId!==event.pointerId)return;dragRef.current=null;event.currentTarget.releasePointerCapture?.(event.pointerId);
  };
  const jump=(event:ReactPointerEvent<HTMLDivElement>)=>{
    if((event.target as HTMLElement).closest('.fdoc-scrollbar__thumb'))return;
    const viewport=viewportRef.current,track=trackRef.current;if(!viewport||!track||!metrics.visible)return;
    const rect=track.getBoundingClientRect(),trackSize=Math.max(0,track.clientHeight-8),maxTravel=Math.max(0,trackSize-metrics.thumbSize),maxScroll=Math.max(0,viewport.scrollHeight-viewport.clientHeight);
    if(maxTravel<=0||maxScroll<=0)return;
    const target=Math.min(maxTravel,Math.max(0,event.clientY-rect.top-4-metrics.thumbSize/2));viewport.scrollTop=(target/maxTravel)*maxScroll;
  };

  return <div ref={trackRef} className={`fdoc-scrollbar ${className}`} data-visible={metrics.visible||undefined} data-testid={testId} aria-hidden="true" onPointerDown={jump} hidden={!metrics.visible}>
    <div className="fdoc-scrollbar__thumb" style={{height:`${metrics.thumbSize}px`,transform:`translateY(${metrics.thumbOffset}px)`}}
      onPointerDown={startDrag} onPointerMove={drag} onPointerUp={stopDrag} onPointerCancel={stopDrag}/>
  </div>;
}
