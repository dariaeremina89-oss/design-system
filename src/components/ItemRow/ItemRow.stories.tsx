import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ItemRow } from './ItemRow';
import { selectionDocs } from '../../docs/selection-components';
const meta={title:'Components/Selection/ItemRow',component:ItemRow,tags:['autodocs','ready'],parameters:{layout:'padded',docs:{description:{component:selectionDocs('ItemRow')}}},args:{title:'Название пункта',onClick:()=>{}},decorators:[Story=><div style={{width:'100%',maxWidth:456}}><Story/></div>],argTypes:{variant:{control:'select',options:['item','header','link','search']},state:{control:'select',options:['default','hover','pressed','focused','disabled','skeleton']},selection:{control:'select',options:[undefined,'check','checkbox']},selectionPosition:{control:'radio',options:['left','right']}}} satisfies Meta<typeof ItemRow>;
export default meta;type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Anatomy:Story={name:'Состав',args:{description:'Описание выбранного действия',helper:'PDF',leadingIcon:'copy',trailingIcon:'arrow-chevron-right',divider:true}};
export const States:Story={name:'Состояния',render:args=><div style={{display:'grid',gap:12}}>{(['default','hover','pressed','focused','disabled','skeleton'] as const).map(state=><ItemRow {...args} key={state} state={state} title={state} description="Описание" leadingIcon="copy" helper="PDF"/>)}</div>};
export const Variants:Story={name:'Варианты',render:args=><><ItemRow {...args} variant="header" title="Заголовок группы"/><ItemRow {...args} description="Дополнительное описание"/><ItemRow variant="link" title="Подробнее" href="#details"/><ItemRow variant="search" searchProps={{'aria-label':'Поиск по списку'}}/></>};
export const Selection:Story={name:'Выбор',render:function Demo(args){const [selected,setSelected]=useState(false);return <ItemRow {...args} selection="checkbox" selectionPosition="left" selected={selected} role="checkbox" aria-checked={selected} onClick={()=>setSelected(!selected)}/>;}};
export const Skeleton:Story={name:'Скелетоны по типографике',render:args=><><ItemRow {...args} state="skeleton" variant="header"/><ItemRow {...args} state="skeleton" description="Описание" helper="Helper" leadingIcon="copy"/><ItemRow {...args} state="skeleton" variant="link"/><ItemRow {...args} state="skeleton" variant="search"/></>};
export const LongContent:Story={args:{title:'ОченьДлинноеНазваниеБезПробелов'.repeat(4),description:'Описание '.repeat(15),helper:'Дополнение',leadingIcon:'copy',trailingIcon:'arrow-chevron-right'}};

export const SelectedMarks:Story={name:'Отметки выбора',render:args=><><ItemRow {...args} title="Выбранный пункт" selection="check" selected/><ItemRow {...args} title="Отметка слева" selection="check" selectionPosition="left" selected/><ItemRow {...args} title="Недоступный выбранный пункт" selection="check" selected disabled/></>};
