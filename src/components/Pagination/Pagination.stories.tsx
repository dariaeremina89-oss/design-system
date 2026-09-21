import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Pagination,type PaginationProps,ButtonPagination } from './Pagination';
import { componentDocs } from '../../docs/bulk-components';
function Example(args:PaginationProps){const [page,setPage]=useState(args.page);return <Pagination {...args} page={page} onChangePage={setPage}/>;}
const meta={title:'Components/Navigation/Pagination',component:Pagination,tags:['autodocs','ready'],parameters:{layout:'padded',docs:{description:{component:componentDocs('Pagination')}}},args:{totalElements:400,size:10,page:1},argTypes:{direction:{control:'radio',options:['horizontal','vertical']},color:{control:'radio',options:['base','inverse']}}} satisfies Meta<typeof Pagination>;
export default meta;type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Interactive:Story={render:args=><Example {...args}/>};
export const Vertical:Story={args:{direction:'vertical',page:25}};
export const OnePage:Story={args:{totalElements:7}};
export const FewPages:Story={args:{totalElements:30}};
export const LongNumbers:Story={args:{totalElements:99999990,page:999998,size:10},decorators:[Story=><div style={{width:280}}><Story/></div>]};
export const Skeleton:Story={args:{isLoading:true}};
export const States:Story={render:()=> <div style={{display:'grid',gap:16}}>{(['primary','secondary','base','inverse'] as const).map(color=><div key={color} style={{display:'flex',gap:16}}>{(['default','hover','focused','pressed','disabled','skeleton'] as const).map(state=><ButtonPagination key={state} color={color} state={state}>123</ButtonPagination>)}</div>)}</div>};
