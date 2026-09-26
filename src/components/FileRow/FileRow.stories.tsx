import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileRow } from './FileRow';
const menuItems=[{id:'rename',title:'Переименовать',leftIcon:'pencil' as const},{id:'delete',title:'Удалить',leftIcon:'trash' as const}];
const meta={title:'Components/Elements/FileRow',component:FileRow,tags:['autodocs','ready'],args:{type:'uploaded',fileName:'File name.png',weight:'2,7 МБ',error:false,errorText:'Ошибка в файле',draggable:false,deletable:true},argTypes:{type:{control:'select',options:['loading','uploaded','uploaded-preview','disabled','template','template-edit','skeleton']}}} satisfies Meta<typeof FileRow>;
export default meta; type Story=StoryObj<typeof meta>;
export const Uploaded:Story={}; export const Loading:Story={args:{type:'loading'}}; export const LoadingError:Story={args:{type:'loading',error:true}}; export const Error:Story={args:{error:true}};
export const Draggable:Story={args:{draggable:true}}; export const Menu:Story={args:{draggable:true,deletable:false,menuItems}};
export const UploadedPreview:Story={args:{type:'uploaded-preview'}}; export const Template:Story={args:{type:'template',fileName:'File name'}}; export const TemplateEdit:Story={args:{type:'template-edit',fileName:'File name'}};
export const Disabled:Story={args:{type:'disabled'}}; export const DisabledError:Story={args:{type:'disabled',error:true}}; export const Skeleton:Story={args:{type:'skeleton'}};
