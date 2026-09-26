import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SingleFileInput } from './SingleFileInput';

function Interactive(args: React.ComponentProps<typeof SingleFileInput>) {
  const [fileName, setFileName] = useState<string>();
  return <div style={{ width: '100%', maxWidth: 640 }}>
    <SingleFileInput {...args} placeholder={fileName ?? args.placeholder} onFileChange={file => { setFileName(file?.name); args.onFileChange?.(file); }} />
  </div>;
}

const meta={title:'Components/Inputs/SingleFileInput',component:SingleFileInput,tags:['autodocs','ready'],args:{type:'default',size:'desktop',error:false,errorText:'Файл не соответствует требованиям'},argTypes:{type:{control:'select',options:['default','disabled','skeleton']},size:{control:'select',options:['desktop','mobile']}},render:args=><Interactive {...args}/>} satisfies Meta<typeof SingleFileInput>;
export default meta; type Story=StoryObj<typeof meta>;
export const Default:Story={}; export const Mobile:Story={args:{size:'mobile'}}; export const Error:Story={args:{error:true}}; export const MobileError:Story={args:{size:'mobile',error:true}}; export const Disabled:Story={args:{type:'disabled'}}; export const DisabledError:Story={args:{type:'disabled',error:true}}; export const Skeleton:Story={args:{type:'skeleton'}};
