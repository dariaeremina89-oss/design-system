import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';
import { Button } from '../Button/Button';
import { componentDocs } from '../../docs/bulk-components';
const meta={title:'Components/Overlays/Tooltip',component:Tooltip,tags:['autodocs','ready'],parameters:{layout:'padded',docs:{description:{component:componentDocs('Tooltip')}}},args:{content:'Создать новый документ',children:<Button>Наведи или нажми Tab</Button>},argTypes:{type:{control:'select',options:['string','area','area-max']},placement:{control:'select',options:['top','bottom','left','right','top-start','top-end','bottom-start','bottom-end']}}} satisfies Meta<typeof Tooltip>;
export default meta;type Story=StoryObj<typeof meta>;
export const Default:Story={decorators:[Story=><div style={{padding:80}}><Story/></div>]};
export const AtEdge:Story={args:{placement:'left',type:'area-max',content:'ОченьДлинноеНазваниеБезПробелов'.repeat(5)},decorators:[Story=><div style={{padding:8}}><Story/></div>]};
export const Types:Story={render:args=><div style={{display:'flex',gap:24,padding:80}}>{(['string','area','area-max'] as const).map(type=><Tooltip {...args} type={type} key={type}><Button>{type}</Button></Tooltip>)}</div>};
