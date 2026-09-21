import { useLayoutEffect,useRef,useState } from 'react';
import { Button,type ButtonProps } from '../Button/Button';
import { Skeleton } from '../Skeleton/Skeleton';
import './Pagination.css';
export type ButtonPaginationProps=Omit<ButtonProps,'size'|'color'>&{color?:'primary'|'secondary'|'base'|'inverse'};
export function ButtonPagination({className='',...props}:ButtonPaginationProps){return <Button {...props} size="small" className={`fdoc-button-pagination ${className}`}/>;}
export interface PaginationProps { totalElements:number; size:number; page:number; onChangePage?:(page:number)=>void; direction?:'horizontal'|'vertical'; color?:'base'|'inverse'; showCounter?:boolean; isLoading?:boolean; className?:string; }
export function paginationPages(total:number,page:number,max:number):(number|'ellipsis')[] {
 if(total<=max)return Array.from({length:total},(_,i)=>i+1);
 let values:number[];
 if(page<=max-2)values=[...Array.from({length:max-1},(_,i)=>i+1),total];
 else if(page>=total-max+3)values=[1,...Array.from({length:max-1},(_,i)=>total-max+2+i)];
 else {const count=Math.max(1,max-3),start=page-Math.floor(count/2);values=[1,...Array.from({length:count},(_,i)=>start+i),total];}
 const result:(number|'ellipsis')[]=[];[...new Set(values)].sort((a,b)=>a-b).forEach((v,i,a)=>{if(i&&v-a[i-1]>1)result.push('ellipsis');result.push(v);});return result;
}
export function Pagination({totalElements,size,page,onChangePage,direction='horizontal',color='base',showCounter=true,isLoading=false,className=''}:PaginationProps) {
 const total=Number.isFinite(totalElements)?Math.max(0,Math.floor(totalElements)):0;const perPage=Number.isFinite(size)&&size>0?Math.floor(size):1;const pages=Math.ceil(total/perPage);const current=Math.max(1,Math.min(pages||1,Math.floor(page)||1));const root=useRef<HTMLElement>(null);const probe=useRef<HTMLSpanElement>(null);const [width,setWidth]=useState(Infinity);const [buttonWidth,setButtonWidth]=useState(32);
 useLayoutEffect(()=>{const update=()=>{if(root.current)setWidth(root.current.clientWidth);if(probe.current)setButtonWidth(Math.max(32,probe.current.getBoundingClientRect().width+8));};update();const observer=new ResizeObserver(update);if(root.current)observer.observe(root.current);if(probe.current)observer.observe(probe.current);return()=>observer.disconnect();},[pages]);
 const vertical=direction==='vertical'||width<600;let max=vertical?4:6;let visible=paginationPages(pages,current,max);while(pages>4&&max>3&&visible.length*(buttonWidth+4)+(pages>=5?72:0)>width){visible=paginationPages(pages,current,--max);}
 if(!total||pages<=1&&!showCounter)return null;
 return <nav ref={root} aria-label="Постраничная навигация" aria-busy={isLoading||undefined} className={`fdoc-pagination ${className}`} data-direction={vertical?'vertical':'horizontal'} data-color={color}>
 <span className="fdoc-pagination__measure" ref={probe} aria-hidden="true">{pages}</span>
 {showCounter&&<div className="fdoc-pagination__counter">{isLoading?<Skeleton width={120} height={10}/>:`${(current-1)*perPage+1}—${Math.min(current*perPage,total)} из ${total}`}</div>}
 {pages>1&&<div className="fdoc-pagination__pages">{pages>=5&&(isLoading?<Skeleton width={32} height={32}/>:<ButtonPagination iconLeft="arrow-chevron-left" color={color} disabled={current===1} aria-label="Предыдущая страница" onClick={()=>onChangePage?.(current-1)}/>)}{visible.map((n,i)=>n==='ellipsis'?<span key={`ellipsis-${i}`} className="fdoc-pagination__ellipsis" aria-hidden="true">{isLoading?<Skeleton width={16} height={8}/>: '…'}</span>:isLoading?<Skeleton key={n} width={buttonWidth} height={32}/>:<ButtonPagination key={n} color={n===current?'primary':color} aria-label={`Страница ${n}`} aria-current={n===current?'page':undefined} onClick={()=>{if(n!==current)onChangePage?.(n);}}>{n}</ButtonPagination>)}{pages>=5&&(isLoading?<Skeleton width={32} height={32}/>:<ButtonPagination iconLeft="arrow-chevron-right" color={color} disabled={current===pages} aria-label="Следующая страница" onClick={()=>onChangePage?.(current+1)}/>)}</div>}
 </nav>;
}
