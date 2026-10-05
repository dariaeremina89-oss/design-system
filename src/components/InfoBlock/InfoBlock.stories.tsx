import { componentDocs } from '../../docs/bulk-components';
import { qualityDocs } from '../../docs/quality';
import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, type ButtonColor } from '../Button/Button';
import { InfoBlock, type InfoBlockColor } from './InfoBlock';

type StoryArgs = ComponentProps<typeof InfoBlock> & { actionsCount: 'none' | 'one' | 'two' };

const actionColors: Record<InfoBlockColor, [ButtonColor, ButtonColor]> = {
  neutral: ['base', 'tertiary'],
  base: ['secondary', 'tertiary'],
  success: ['base', 'tertiary'],
  accent: ['base', 'tertiary'],
  warning: ['base', 'tertiary'],
  error: ['base', 'tertiary'],
  inverse: ['secondary', 'inverse'],
};

function getActions(count: StoryArgs['actionsCount'], color: InfoBlockColor = 'neutral') {
  if (count === 'none') return undefined;
  const [first, second] = actionColors[color];
  if (count === 'one') return <Button size="small" color={first}>Button</Button>;
  return <><Button size="small" color={first}>Button</Button><Button size="small" color={second}>Button</Button></>;
}

const meta = {
  title: 'Components/Elements/InfoBlock',
  component: InfoBlock,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: componentDocs('InfoBlock') + qualityDocs('InfoBlock') } },
  },
  args: { color: 'neutral', title: 'Title', text: 'Notification text', showLeftIcon: true, closable: true, actionsCount: 'two' },
  argTypes: {
    color: { control: 'select', options: ['neutral', 'base', 'success', 'accent', 'warning', 'error', 'inverse'] },
    actionsCount: { name: 'Actions', control: 'select', options: ['none', 'one', 'two'] },
    actions: { table: { disable: true } },
    leftIcon: { control: 'text' }, leftIconView: { control: false }, onClose: { action: 'close' },
  },
  render: ({ actionsCount, color = 'neutral', ...args }) => <InfoBlock {...args} color={color} actions={getActions(actionsCount, color)} />,
} satisfies Meta<StoryArgs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const OneAction: Story = { args: { actionsCount: 'one' } };
export const WithoutActions: Story = { args: { actionsCount: 'none' } };
export const TitleOnly: Story = { args: { text: null } };
export const TextOnly: Story = { args: { title: null } };
export const WithoutIcon: Story = { args: { showLeftIcon: false } };
export const WithoutClose: Story = { args: { closable: false } };
export const NarrowContainer: Story = { render: ({ actionsCount, color = 'neutral', ...args }) => <div style={{ width: 288 }}><InfoBlock {...args} color={color} actions={getActions(actionsCount, color)} /></div> };
export const WideContainer: Story = { render: ({ actionsCount, color = 'neutral', ...args }) => <div style={{ width: 640 }}><InfoBlock {...args} color={color} actions={getActions(actionsCount, color)} /></div> };
export const LongContent: Story = { args: { title: 'Очень длинный заголовок информационного блока', text: 'Обычные слова переносятся целиком, а сверхдлиннаяпоследовательностьсимволовбезпробеловдолжнапереноситьсявнутридоступнойширины. https://example.com/очень-длинная-ссылка-без-подходящего-места-для-переноса' } };
export const Colors: Story = { render: ({ actionsCount, ...args }) => <div style={{ display:'grid', gap:12, maxWidth:640 }}>{(['neutral','base','success','accent','warning','error','inverse'] as const).map(color => <InfoBlock {...args} key={color} color={color} actions={getActions(actionsCount, color)} />)}</div> };
