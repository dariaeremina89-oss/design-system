import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from './Divider';
import { componentDocs } from '../../docs/bulk-components';
const meta={title:'Components/Layout/Divider',component:Divider,tags:['autodocs','ready'],parameters:{layout:'padded',docs:{description:{component:componentDocs('Divider')}}},argTypes:{orientation:{control:'radio',options:['horizontal','vertical']},inset:{control:'select',options:[0,16,24]}}} satisfies Meta<typeof Divider>;
export default meta;type Story=StoryObj<typeof meta>;
export const Default:Story={decorators:[Story=><div style={{display:'flex',height:160,width:'100%'}}><Story/></div>]};
export const Insets:Story={render:()=> <div style={{display:'grid',gap:32}}>{([0,16,24] as const).map(inset=><Divider key={inset} inset={inset}/>)}</div>};
export const Vertical:Story={args:{orientation:'vertical'},decorators:Default.decorators};
