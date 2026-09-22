import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon, iconNames } from './Icon';
import { Typography } from '../Typography/Typography';

const meta={
  title:'Components/Elements/Icon',component:Icon,tags:['autodocs','ready'],
  parameters:{layout:'padded',docs:{description:{component:'SVG-иконка из общей библиотеки. name выбирает изображение, size задает размер в px, color — цвет монохромной иконки. Без color иконка наследует цвет текста. Самостоятельной смысловой иконке задайте title; декоративная скрыта от скринридера. Полный каталог находится в General / Icons.'}}},
  args:{name:'doc-list',size:24,title:'Документ'},
  argTypes:{name:{control:'select',options:iconNames},size:{control:{type:'number',min:1}},color:{control:'color'},title:{control:'text'}},
} satisfies Meta<typeof Icon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:args=><div style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:24}}>{[16,20,24,32,40].map(size=><div key={size} style={{display:'grid',justifyItems:'center',gap:8}}><Icon {...args} size={size}/><Typography variant="caption">{size} px</Typography></div>)}</div>};
export const SemanticColors:Story={render:args=><div style={{display:'flex',flexWrap:'wrap',gap:24}}>{['base-default','primary-secondary','success-secondary','error-secondary'].map(color=><div key={color} style={{display:'grid',justifyItems:'center',gap:8}}><Icon {...args} color={`var(--icon-${color})`}/><Typography variant="caption">{color}</Typography></div>)}</div>};
