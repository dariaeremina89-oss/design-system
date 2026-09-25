import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { InfoBlock } from './InfoBlock';

type StoryArgs = ComponentProps<typeof InfoBlock> & { actionsCount: 'none' | 'one' | 'two' };
const actionsByCount = {
  none: undefined,
  one: <Button size="small" color="base">Button</Button>,
  two: <><Button size="small" color="base">Button</Button><Button size="small" color="tertiary">Button</Button></>,
};

const meta = {
  title: 'Components/Elements/InfoBlock',
  component: InfoBlock,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Контекстный информационный блок внутри интерфейса. Поддерживает Title, Text, левую иконку, Close и до двух Actions. Actions автоматически остаются справа при достаточной ширине и переносятся вниз, когда места не хватает. Длинные слова и ссылки не ломают ширину компонента.' } },
  },
  args: { color: 'neutral', title: 'Title', text: 'Notification text', showLeftIcon: true, closable: true, actionsCount: 'two' },
  argTypes: {
    color: { control: 'select', options: ['neutral', 'base', 'success', 'accent', 'warning', 'error', 'inverse'] },
    actionsCount: { name: 'Actions', control: 'select', options: ['none', 'one', 'two'] },
    actions: { table: { disable: true } },
    leftIcon: { control: 'text' }, leftIconView: { control: false }, onClose: { action: 'close' },
  },
  render: ({ actionsCount, ...args }) => <InfoBlock {...args} actions={actionsByCount[actionsCount]} />,
} satisfies Meta<StoryArgs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const OneAction: Story = { args: { actionsCount: 'one' } };
export const WithoutActions: Story = { args: { actionsCount: 'none' } };
export const TitleOnly: Story = { args: { text: undefined } };
export const TextOnly: Story = { args: { title: undefined } };
export const WithoutIcon: Story = { args: { showLeftIcon: false } };
export const WithoutClose: Story = { args: { closable: false } };
export const NarrowContainer: Story = { render: ({ actionsCount, ...args }) => <div style={{ width: 288 }}><InfoBlock {...args} actions={actionsByCount[actionsCount]} /></div> };
export const WideContainer: Story = { render: ({ actionsCount, ...args }) => <div style={{ width: 480 }}><InfoBlock {...args} actions={actionsByCount[actionsCount]} /></div> };
export const LongContent: Story = { args: { title: 'Очень длинный заголовок информационного блока', text: 'Обычные слова переносятся целиком, а сверхдлиннаяпоследовательностьсимволовбезпробеловдолжнапереноситьсявнутридоступнойширины. https://example.com/очень-длинная-ссылка-без-подходящего-места-для-переноса' } };
export const Colors: Story = { render: ({ actionsCount, ...args }) => <div style={{ display:'grid', gap:12, maxWidth:640 }}>{(['neutral','base','success','accent','warning','error','inverse'] as const).map(color => <InfoBlock {...args} key={color} color={color} actions={actionsByCount[actionsCount]} />)}</div> };
