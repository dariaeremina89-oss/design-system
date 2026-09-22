import type { Meta, StoryObj } from '@storybook/react-vite';
import { Highlight } from './Highlight';
import { Typography } from '../Typography/Typography';

const meta = {
  title: 'Components/Elements/Highlight',
  component: Highlight,
  tags: ['autodocs', 'ready'],
  parameters: { layout: 'padded', docs: { description: { component: 'Подсвечивает все совпадающие подстроки нативным <mark>. Наследует типографику окружающего текста, в том числе его адаптив. Цвета Accent переключаются вместе с Light / Dark и не зависят от кастомного Primary. Поиск буквальный, поддерживает кириллицу. Во вложенной разметке совпадения ищутся внутри каждого текстового узла, без объединения текста через границы тегов.' } } },
  args: { children: 'Ищи в этой строке', highlight: 'Этой', matchWholeWord: false, isCaseInsensitive: true },
  argTypes: {
    children: { control: 'text' },
    highlight: { control: 'text' },
    matchWholeWord: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    isCaseInsensitive: { control: 'boolean', table: { defaultValue: { summary: 'true' } } },
  },
  decorators: [Story => <Typography responsive><Story /></Typography>],
} satisfies Meta<typeof Highlight>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const AllMatches: Story = { args: { children: 'Договор, договоры и ДОГОВОР готовы.', highlight: 'договор' } };
export const WholeWords: Story = { args: { ...AllMatches.args, matchWholeWord: true } };
export const CaseSensitive: Story = { args: { ...AllMatches.args, isCaseInsensitive: false } };
export const LiteralSearch: Story = { args: { children: 'Цена (руб.): 100. Поле (руб.) обязательно.', highlight: '(руб.)' } };
export const InlineTypography: Story = {
  decorators: [],
  render: args => <div>
    <Typography as="h2" variant="h2-heading" responsive data-testid="highlight-heading"><Highlight {...args}>Найденный договор</Highlight></Typography>
    <Typography responsive data-testid="highlight-body"><Highlight {...args}>Откройте <strong>договор</strong> и проверьте данные.</Highlight></Typography>
    <Typography variant="caption" responsive data-testid="highlight-caption"><Highlight {...args}>Договор обновлен сегодня</Highlight></Typography>
    <Typography data-testid="highlight-fixed"><Highlight {...args}>Договор: фиксированный размер текста</Highlight></Typography>
  </div>,
  args: { highlight: 'договор' },
};
