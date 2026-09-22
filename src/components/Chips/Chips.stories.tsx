import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chips, type ChipsColor, type ChipsState } from './Chips';
import { iconNames } from '../Icon/Icon';
import { chipsDocs } from '../../docs/chips';

const colors:ChipsColor[]=['secondary','base','primary','success','accent','warning','error','inverse'];
const states:ChipsState[]=['default','hover','pressed','focused','disabled','skeleton'];
const meta={title:'Components/Selection/Chips',component:Chips,tags:['autodocs','ready'],parameters:{layout:'padded',docs:{description:{component:chipsDocs}}},args:{text:'Chips',color:'secondary',size:'medium',shape:'round',state:'default'},argTypes:{color:{control:'select',options:colors},size:{control:'radio',options:['small','medium']},shape:{control:'radio',options:['round','square']},state:{control:'select',options:states},iconLeft:{control:'select',options:[undefined,...iconNames]},iconRight:{control:'select',options:[undefined,...iconNames]},selected:{control:'boolean'},defaultSelected:{control:'boolean'},interactive:{control:'boolean'},onClick:{control:false},onSelectedChange:{control:false},onRemove:{control:false}}} satisfies Meta<typeof Chips>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const States:Story={args:{interactive:true,iconLeft:'check_circle',iconRight:'cross_circle'},render:args=><div style={{overflowX:'auto',padding:8}}><table style={{borderSpacing:'24px 16px'}}><thead><tr><th scope="col">Color</th>{states.map(state=><th scope="col" key={state}>{state}</th>)}</tr></thead><tbody>{colors.map(color=><tr key={color}><th scope="row">{color}</th>{states.map(state=><td key={state} style={{padding:8,background:color==='base'?'var(--background-base-secondary)':'var(--background-base-default)'}}><Chips {...args} color={color} state={state} data-testid={`chips-${color}-${state}`}/></td>)}</tr>)}</tbody></table></div>};
export const SizesAndShapes:Story={args:{iconLeft:'check_circle',iconRight:'cross_circle'},render:args=><div style={{display:'grid',gap:24,justifyItems:'start'}}>{(['small','medium'] as const).flatMap(size=>(['round','square'] as const).map(shape=><Chips {...args} key={size+shape} size={size} shape={shape} data-testid={`chips-${size}-${shape}`}/>))}</div>};
export const IconSlots:Story={render:args=><div style={{display:'flex',flexWrap:'wrap',gap:16}}><Chips {...args}/><Chips {...args} iconLeft="check_circle"/><Chips {...args} iconRight="cross_circle"/><Chips {...args} iconLeft="check_circle" iconRight="cross_circle"/></div>};
export const Selected:Story={args:{defaultSelected:true,iconLeft:'check_circle',text:'Подписанные'}};
export const OnBackgrounds:Story={render:args=><div style={{display:'grid',gap:24}}>{(['secondary','base'] as const).map(color=><section key={color} style={{background:color==='base'?'var(--background-base-secondary)':'var(--background-base-default)',padding:24,display:'flex',flexWrap:'wrap',gap:16}}><Chips {...args} text="Не выбрано" color={color} defaultSelected={false}/><Chips {...args} text="Выбрано" color={color} defaultSelected/></section>)}</div>};
export const StatusLabels:Story={render:args=><div style={{display:'flex',flexWrap:'wrap',gap:16}}>{([['success','Подписан'],['warning','Ожидает подписи'],['error','Отклонен'],['accent','На согласовании']] as const).map(([color,text])=><Chips {...args} key={color} text={text} color={color} interactive={false}/>)}</div>};
export const Disabled:Story={args:{defaultSelected:true,disabled:true,iconLeft:'check_circle'}};
function RemovableExample(args:React.ComponentProps<typeof Chips>){const [visible,setVisible]=useState(true);return <div style={{display:'flex',alignItems:'center',gap:16}}>{visible?<Chips {...args} text="Договоры" defaultSelected onRemove={()=>setVisible(false)}/>:<button type="button" onClick={()=>setVisible(true)}>Вернуть Chips</button>}</div>;}
export const Removable:Story={render:args=><RemovableExample {...args}/>};
export const LongText:Story={render:args=><div style={{width:220,maxWidth:'100%',display:'grid',gap:16}}><Chips {...args} text="Документы, ожидающие подписи клиента" iconLeft="check_circle" iconRight="cross_circle"/><Chips {...args} text={'Сверхдлинноезначениебезпробелов'.repeat(3)} iconRight="cross_circle"/></div>};
export const Skeleton:Story={args:{state:'skeleton'},render:args=><div style={{display:'flex',flexWrap:'wrap',gap:16}}>{(['small','medium'] as const).flatMap(size=>(['round','square'] as const).map(shape=><Chips {...args} key={size+shape} size={size} shape={shape}/>))}</div>};
