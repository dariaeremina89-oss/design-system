import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from './Breadcrumbs';
import { componentDocs } from '../../docs/bulk-components';
const meta={title:'Components/Navigation/Breadcrumbs',component:Breadcrumbs,tags:['autodocs','ready'],parameters:{layout:'padded',docs:{description:{component:componentDocs('Breadcrumbs')}}},args:{items:[{label:'Документы',href:'#documents'},{label:'Шаблоны',href:'#templates'},{label:'Создание шаблона'}]}} satisfies Meta<typeof Breadcrumbs>;
export default meta;type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Deep:Story={args:{items:[{label:'Главная',href:'#home'},{label:'Компания',href:'#company'},{label:'Документы',href:'#documents'},{label:'Договоры на оказание услуг',href:'#contracts'},{label:'Договор с длинным названием без ручного сокращения'}]}};
export const Skeleton:Story={args:{isLoading:true}};
