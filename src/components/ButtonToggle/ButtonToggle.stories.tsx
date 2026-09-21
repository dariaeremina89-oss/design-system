import type { Meta, StoryObj } from '@storybook/react-vite';
import { ButtonToggle } from './ButtonToggle';
import { componentDocs } from '../../docs/bulk-components';
const meta={title:'Components/Actions/ButtonToggle',component:ButtonToggle,tags:['autodocs','ready'],parameters:{layout:'padded',docs:{description:{component:componentDocs('ButtonToggle')}}},args:{'aria-label':'Период отчета',options:[{value:'day',label:'День'},{value:'week',label:'Неделя'},{value:'month',label:'Месяц'}]},argTypes:{color:{control:'select',options:['primary','base','inverse']},size:{control:'radio',options:['small','medium']}}} satisfies Meta<typeof ButtonToggle>;
export default meta;type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Disabled:Story={args:{disabled:true}};
export const Skeleton:Story={args:{isLoading:true}};
export const Variants:Story={render:args=><div style={{display:'grid',gap:24}}>{(['primary','base','inverse'] as const).flatMap(color=>(['small','medium'] as const).map(size=><div key={color+size}><ButtonToggle {...args} color={color} size={size}/></div>))}</div>};
