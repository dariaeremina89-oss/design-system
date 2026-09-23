import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { InfoBlock } from './InfoBlock';

const actions = (
  <>
    <Button size="small" color="base">Button</Button>
    <Button size="small" color="tertiary">Button</Button>
  </>
);

const meta = {
  title: 'Components/Feedback/InfoBlock',
  component: InfoBlock,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Контекстный информационный блок внутри интерфейса. Поддерживает Title, Text, левую иконку, Close и до двух Actions. Small размещает Actions снизу. Medium поддерживает Horizontal и Vertical; при недостатке ширины Horizontal перестраивает Actions вниз. Длинные слова и ссылки не ломают ширину компонента.',
      },
    },
  },
  args: {
    size: 'medium',
    direction: 'horizontal',
    color: 'neutral',
    title: 'Title',
    text: 'Notification text',
    showLeftIcon: true,
    closable: true,
  },
  argTypes: {
    size: { control: 'select', options: ['small', 'medium'] },
    direction: { control: 'select', options: ['horizontal', 'vertical'] },
    color: { control: 'select', options: ['neutral', 'base', 'success', 'accent', 'warning', 'error', 'inverse'] },
    leftIcon: { control: 'text' },
    leftIconView: { control: false },
    actions: { control: false },
    onClose: { action: 'close' },
  },
} satisfies Meta<typeof InfoBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithActions: Story = { args: { actions } };
export const Vertical: Story = { args: { direction: 'vertical', actions } };
export const Small: Story = { args: { size: 'small', actions } };
export const WithoutTitle: Story = { args: { title: undefined } };
export const WithoutIcon: Story = { args: { showLeftIcon: false } };
export const WithoutClose: Story = { args: { closable: false } };
export const LongContent: Story = {
  args: {
    actions,
    title: 'Очень длинный заголовок информационного блока',
    text: 'Обычные слова переносятся целиком, а сверхдлиннаяпоследовательностьсимволовбезпробеловдолжнапереноситьсявнутридоступнойширины.',
  },
};
export const Colors: Story = {
  render: args => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 640 }}>
      {(['neutral','base','success','accent','warning','error','inverse'] as const).map(color => (
        <InfoBlock {...args} key={color} color={color} />
      ))}
    </div>
  ),
};
