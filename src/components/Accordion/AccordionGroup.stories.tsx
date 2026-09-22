import type { Meta, StoryObj } from '@storybook/react-vite';
import { AccordionGroup } from './Accordion';
import { componentDocs } from '../../docs/bulk-components';
const meta={title:'Components/Navigation/AccordionGroup',component:AccordionGroup,tags:['autodocs','ready'],parameters:{layout:'padded',docs:{description:{component:componentDocs('AccordionGroup')}}},argTypes:{gap:{control:{type:'number',min:0},description:'Расстояние между Accordion в пикселях'}},args:{gap:0,groupDivider:true,items:[{value:'first',title:'Первый раздел',children:'Содержимое первого раздела'},{value:'second',title:'Второй раздел',children:'Содержимое второго раздела'},{value:'third',title:'Третий раздел',children:'Содержимое третьего раздела'}]}} satisfies Meta<typeof AccordionGroup>;
export default meta;type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Multiple:Story={args:{multiple:true,defaultValue:['first','second']}};
export const WithGap:Story={args:{gap:24,groupDivider:false}};
