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
  return <div style={{width: 'min(100%, 480px)', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', minWidth: 0, gap: 16, justifyItems: 'center'}}>
    <CarouselViewport id={id} index={current} onIndexChange={change} disabled={args.disabled} loop={args.loop}>
      {Array.from({length: args.count}, (_, i) => <div key={i} style={{boxSizing:'border-box',minHeight:200,padding:32,background:'var(--background-base-secondary)',borderRadius:'var(--radius-large)',display:'grid',alignContent:'center',gap:8}}><Typography variant="h3-heading">Элемент {i + 1}</Typography><Typography>Перетащи карточку или используй навигацию ниже.</Typography></div>)}
    </CarouselViewport>
    <Carousel {...args} controlsId={id} index={current} onIndexChange={change}/>
  </div>;
}
const meta = { title: 'Components/Navigation/Carousel', component: Carousel, tags:['autodocs','ready'], parameters:{layout:'padded',docs:{description:{component:carouselDocs + qualityDocs('Carousel')}}}, args:{count:6,defaultIndex:2,controlsId:'carousel-content',color:'auto',disabled:false,loop:false,isLoading:false}, argTypes:{count:{control:{type:'number',min:0,max:50}},index:{control:'number'},defaultIndex:{control:'number'},color:{control:'radio',options:['auto','secondary','inverse-light']},disabled:{control:'boolean'},loop:{control:'boolean'},isLoading:{control:'boolean'},onIndexChange:{action:'indexChange'}}, render:args=><Demo {...args}/> } satisfies Meta<typeof Carousel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default:Story = {parameters:{storyCheck:'Переключение кнопками и точками, плавное изменение ширины и цвета. Перетаскивание мышью и свайп по карточке.'}};
export const FirstElement:Story = {args:{defaultIndex:0}};
export const LastElement:Story = {args:{defaultIndex:5}};
export const ManyItems:Story = {args:{count:16,defaultIndex:0},parameters:{storyCheck:'Видимая область рассчитана на восемь точек. Стрелки фиксированы; выбранная точка автоматически видна.'}};
export const Narrow:Story = {args:{count:16},decorators:[Story=><div style={{width:160,maxWidth:'100%'}}><Story/></div>]};
export const Disabled:Story = {args:{disabled:true}};
export const Loop:Story = {args:{loop:true,defaultIndex:0},parameters:{storyCheck:'Циклический режим: Previous с первого элемента ведет на последний, Next с последнего — на первый. Клавиатурные стрелки работают так же.'}};
export const OneItem:Story = {args:{count:1,defaultIndex:0},parameters:{storyCheck:'Один элемент контента: навигация скрыта.'}};
export const InverseLight:Story = {args:{color:'inverse-light'}};
function PanelState({color, defaultIndex = 2, disabled = false}: Pick<CarouselProps, 'color' | 'defaultIndex' | 'disabled'>) {
  const [index, setIndex] = useState(defaultIndex);
  const id = useId();
  return <div style={{display:'grid',gap:8,justifyItems:'start',minWidth:0}}>
    <Typography id={id}>Элемент {index + 1} из 6</Typography>
    <Carousel count={6} index={index} onIndexChange={setIndex} controlsId={id} color={color} disabled={disabled}/>
  </div>;
}
export const States:Story = {
  parameters:{storyCheck:'Собранные Carousel в Secondary и Inverse light: обычное состояние, начало, конец и Disabled. Ниже — Skeleton для первичной загрузки.'},
  render:()=> <div style={{display:'grid',gap:32,maxWidth:'100%'}}>
    {(['secondary','inverse-light'] as const).map(color=><section key={color} style={{display:'grid',gap:16,minWidth:0}}>
      <Typography variant="h3-heading">{color === 'secondary' ? 'Secondary' : 'Inverse light'}</Typography>
      <div style={{display:'flex',gap:32,flexWrap:'wrap'}}>
        {[{name:'Default',index:2},{name:'Первый элемент',index:0},{name:'Последний элемент',index:5},{name:'Disabled',index:2,disabled:true}].map(state=><div key={state.name} style={{display:'grid',gap:8,minWidth:0,maxWidth:'100%'}}>
          <Typography>{state.name}</Typography>
          <PanelState color={color} defaultIndex={state.index} disabled={state.disabled}/>
        </div>)}
      </div>
    </section>)}
    <section style={{display:'grid',gap:16,justifyItems:'start',minWidth:0}}>
      <Typography variant="h3-heading">Skeleton</Typography>
      <Carousel count={6} controlsId="carousel-states-loading" isLoading/>
    </section>
  </div>,
};

export const DotStates:Story = {
  parameters:{storyCheck:"Состояния Dot используют один набор токенов независимо от Color Carousel."},
  render:()=> <div style={{display:'grid',gap:16,justifyItems:'start'}}>
    {[false,true].map(selected=><div key={String(selected)} style={{display:'grid',gap:8}}>
      <Typography>{selected ? 'Выбран' : 'Не выбран'}</Typography>
      <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
        {(['default','hover','focused','pressed','disabled'] as const).map(state=><div key={state} style={{display:'grid',gap:8,justifyItems:'center'}}>
          <div className="fdoc-carousel" data-color="secondary" style={{width:48,height:32,justifyContent:'center'}}>
            <CarouselDot state={state} selected={selected} aria-label={`${state}, ${selected ? 'выбран' : 'не выбран'}`}/>
          </div>
          <Typography>{state}</Typography>
        </div>)}
      </div>
    </div>)}
  </div>,
};

export const Skeleton:Story = {args:{isLoading:true},render:args=><Carousel {...args}/>,parameters:{storyCheck:'Первичная загрузка: цельная плашка 168 × 32, radius-full, background-base-skeleton. Кнопок и точек нет.'}};
