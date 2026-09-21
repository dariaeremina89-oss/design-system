import { useEffect,useRef,useState } from 'react';
import { Link } from '../Link/Link';
import { Icon } from '../Icon/Icon';
import { Skeleton } from '../Skeleton/Skeleton';
import './Breadcrumbs.css';
export interface BreadcrumbItem { label:string; href?:string; }
export interface BreadcrumbsProps { items:BreadcrumbItem[]; 'aria-label'?:string; isLoading?:boolean; className?:string; }
export function Breadcrumbs({items,'aria-label':label='Навигационная цепочка',isLoading=false,className=''}:BreadcrumbsProps) {
 const ref=useRef<HTMLElement>(null);const [mobile,setMobile]=useState(false);
 useEffect(()=>{const media=window.matchMedia('(max-width:600px)');const update=()=>setMobile(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
 if(items.length<2)return null;const collapsed=mobile&&items.length>3;const visible=collapsed?items.slice(-2):items;
 return <nav ref={ref} aria-label={label} aria-busy={isLoading||undefined} className={`fdoc-breadcrumbs ${className}`}><ul>{collapsed&&<li className="fdoc-breadcrumbs__ellipsis"><span aria-label="Пропущены уровни навигации"><span aria-hidden="true">…</span></span><Icon name="arrow-chevron-right" size={16}/></li>}{visible.map((item,i)=><li key={`${item.href??''}-${i}`} data-current={i===visible.length-1}>{isLoading?<Skeleton width={64} height={8}/>:i===visible.length-1?<span className="fdoc-breadcrumbs__current" aria-current="page" title={item.label}>{item.label}</span>:<Link href={item.href} color="neutral" size="small" decoration={null} title={item.label}>{item.label}</Link>}{i<visible.length-1&&<Icon name="arrow-chevron-right" size={16}/>}</li>)}</ul></nav>;
}
export const Breadcrumb=Breadcrumbs;
