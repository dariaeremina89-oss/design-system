import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Search } from './Search';
import { selectionDocs } from '../../docs/selection-components';
const meta = { title:'Components/Inputs/Search', component:Search, tags:['autodocs','ready'],
 parameters:{layout:'padded',docs:{description:{component:selectionDocs('Search')}}},
 args:{label:'Поиск документов',placeholder:'Название или номер',caption:'Нажмите Enter или «Найти»'},
 decorators:[Story=><div style={{width:'100%',maxWidth:456}}><Story/></div>],
 argTypes:{disabled:{control:'boolean'},skeleton:{control:'boolean'},clearable:{control:'boolean'},buttonText:{control:'text'}},
} satisfies Meta<typeof Search>;
export default meta;type Story=StoryObj<typeof meta>;
export const Default:Story={render:function Demo(args){const [result,setResult]=useState('');return <><Search {...args} onSearch={setResult}/><p role="status">{result&&`Поиск: ${result}`}</p></>;}};
export const States:Story={name:'Состояния',render:args=><div style={{display:'grid',gap:24}}><Search {...args}/><Search {...args} defaultValue="Договор"/><Search {...args} error="Введите не менее трех символов"/><Search {...args} disabled defaultValue="Договор"/><Search {...args} disabled error="Поиск недоступен"/><Search {...args} skeleton/></div>};
export const WithDescription:Story={args:{description:'По всем доступным документам',counter:true,maxLength:100,required:true}};
export const Focused:Story={name:'Фокус с клавиатуры',args:{autoFocus:true}};
export const Skeleton:Story={args:{skeleton:true,description:'Описание',counter:'0 / 100'}};
