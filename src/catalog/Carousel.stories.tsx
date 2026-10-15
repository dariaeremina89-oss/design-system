import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useState } from 'react';
import { Carousel, CarouselDot, type CarouselProps } from '../components/Carousel/Carousel';
import { CarouselViewport } from '../components/Carousel/CarouselViewport';
import { Typography } from '../components/Typography/Typography';
import { qualityDocs } from '../docs/quality';
import { carouselDocs } from '../docs/carousel';
function Demo(args: CarouselProps) {
  const [index, setIndex] = useState(args.defaultIndex ?? 0);
  const id = useId();
  const current = args.index ?? Math.min(index, Math.max(0, args.count - 1));
  const change = (next: number) => { setIndex(next); args.onIndexChange?.(next); };
  return <div style={{width: 'min(100%, 480px)', display: 'grid', gap: 16, justifyItems: 'center'}}>
    <CarouselViewport id={id} index={current} onIndexChange={change} disabled={args.disabled}>
      {Array.from({length: args.count}, (_, i) => <div key={i} style={{boxSizing:'border-box',minHeight:200,padding:32,background:'var(--background-base-secondary)',borderRadius:'var(--radius-large)',display:'grid',alignContent:'center',gap:8}}><Typography variant="h3-heading">Элемент {i + 1}</Typography><Typography>Перетащи карточку или используй навигацию ниже.</Typography></div>)}
    </CarouselViewport>
    <Carousel {...args} controlsId={id} index={current} onIndexChange={change}/>
  </div>;
}
const meta = { title: 'Components/Navigation/Carousel', component: Carousel, tags:['autodocs','ready'], parameters:{layout:'padded',docs:{description:{component:carouselDocs + qualityDocs('Carousel')}}}, args:{count:6,defaultIndex:2,controlsId:'carousel-content',color:'auto',disabled:false}, argTypes:{count:{control:{type:'number',min:0,max:50}},index:{control:'number'},defaultIndex:{control:'number'},color:{control:'radio',options:['auto','secondary','inverse-light']},disabled:{control:'boolean'},onIndexChange:{action:'indexChange'}}, render:args=><Demo {...args}/> } satisfies Meta<typeof Carousel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default:Story = {parameters:{storyCheck:'Переключение кнопками и точками, плавное изменение ширины и цвета. Перетаскивание мышью и свайп по карточке.'}};
export const FirstElement:Story = {args:{defaultIndex:0}};
export const LastElement:Story = {args:{defaultIndex:5}};
export const ManyItems:Story = {args:{count:16,defaultIndex:0},parameters:{storyCheck:'Видимая область рассчитана на восемь точек. Стрелки фиксированы; выбранная точка автоматически видна.'}};
export const Narrow:Story = {args:{count:16},decorators:[Story=><div style={{width:160,maxWidth:'100%'}}><Story/></div>]};
export const Disabled:Story = {args:{disabled:true}};
export const OneItem:Story = {args:{count:1,defaultIndex:0},parameters:{storyCheck:'Один элемент контента: навигация скрыта.'}};
export const InverseLight:Story = {args:{color:'inverse-light'}};
export const States:Story = {render:()=> <div style={{display:'grid',gap:16}}>{(['secondary','inverse-light'] as const).map(color=><div key={color} style={{display:'grid',gap:8}}><Typography>{color}</Typography>{[false,true].map(selected=><div key={String(selected)} className="fdoc-carousel" data-color={color} style={{gap:24,padding:16,flexWrap:'wrap'}}>{(['default','hover','focused','pressed','disabled'] as const).map(state=><div key={state} style={{display:'grid',gap:16,justifyItems:'center'}}><CarouselDot state={state} selected={selected} aria-label={`${state}, ${selected ? 'выбран' : 'не выбран'}`}/><Typography>{state}</Typography></div>)}</div>)}</div>)}</div>};
