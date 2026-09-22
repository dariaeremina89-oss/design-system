import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown } from './Dropdown';
import { Button } from '../Button/Button';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { documentActions } from './menu-examples';
import { selectionDocs } from '../../docs/selection-components';
const meta={title:'Components/Selection/Dropdown',component:Dropdown,tags:['autodocs','ready'],parameters:{layout:'padded',docs:{description:{component:selectionDocs('Dropdown')}}},args:{items:documentActions,children:<Button>Действия</Button>},argTypes:{placement:{control:'select',options:['auto','top','bottom']},matchWidth:{control:'boolean'},searchable:{control:'boolean'},closeOnSelect:{control:'boolean'}}} satisfies Meta<typeof Dropdown>;
export default meta;type Story=StoryObj<typeof meta>;
export const Default:Story={render:function Demo(args){const [result,setResult]=useState('');return <><Dropdown {...args} onAction={item=>setResult(String(item.title))}/><p role="status">{result&&`Действие: ${result}`}</p><Button color="secondary">Следующая кнопка</Button></>;}};
export const IconTrigger:Story={args:{children:<ButtonIcon icon="more-horisontal" aria-label="Действия с документом"/>}};
export const Searchable:Story={args:{searchable:true}};
export const AtEdge:Story={decorators:[Story=><div style={{height:'calc(100vh - 48px)',display:'flex',alignItems:'flex-end',justifyContent:'flex-end'}}><Story/></div>]};
export const Disabled:Story={args:{children:<Button disabled>Действия</Button>}};

export const WithConfirmation:Story={render:function Demo(args){const [open,setOpen]=useState(false);const [checked,setChecked]=useState<string[]>([]);const [result,setResult]=useState('');const labels=['Черновики','Отправленные','Подписанные'];return <><Dropdown {...args} open={open} onOpenChange={setOpen} closeOnSelect={false} searchable items={labels.map((title,i)=>({id:String(i),title,selection:'checkbox',selectionPosition:'left',selected:checked.includes(String(i))}))} onAction={item=>setChecked(values=>values.includes(item.id)?values.filter(id=>id!==item.id):[...values,item.id])} footer={<><Button size="small" color="tertiary" onClick={()=>setOpen(false)}>Отменить</Button><Button size="small" onClick={()=>{setResult(checked.map(id=>labels[Number(id)]).join(', '));setOpen(false);}}>Применить</Button></>}><Button>Фильтры</Button></Dropdown><p role="status">{result}</p></>;}};
