import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs,Tab } from './Tabs';
import { componentDocs } from '../../docs/bulk-components';
const meta={title:'Components/Navigation/Tabs',component:Tabs,tags:['autodocs','ready'],parameters:{layout:'padded',docs:{description:{component:componentDocs('Tabs')}}},args:{'aria-label':'Разделы компании',items:[{value:'info',label:'Информация',content:'Данные компании'},{value:'settings',label:'Настройки',content:'Настройки компании'},{value:'employees',label:'Сотрудники',badge:12,content:'Список сотрудников'},{value:'archive',label:'Архив',disabled:true,content:'Архив'}]}} satisfies Meta<typeof Tabs>;
export default meta;type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Overflow:Story={args:{items:Array.from({length:12},(_,i)=>({value:String(i),label:`Раздел ${i+1}`,content:`Содержимое ${i+1}`}))},decorators:[Story=><div style={{maxWidth:480}}><Story/></div>]};
export const Skeleton:Story={args:{isLoading:true}};
export const States:Story={render:()=> <div>{[false,true].map(selected=><div role="tablist" aria-label={selected?'Выбранные':'Невыбранные'} key={String(selected)} style={{display:'flex'}}>{(['default','hover','focused','pressed','disabled','skeleton'] as const).map(state=><Tab key={state} selected={selected} state={state}>{state}</Tab>)}</div>)}</div>};
