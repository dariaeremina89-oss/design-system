import type { Meta, StoryObj } from '@storybook/react-vite';
const meta = { title: 'Components/DateTime/RangeCalendar', parameters: { layout: 'padded', controls: { disable: true } } } satisfies Meta;
export default meta;
export const Planned: StoryObj<typeof meta> = {
  name: 'Еще не реализован',
  render: () => <section><h1>RangeCalendar</h1><p>Компонент запланирован в структуре библиотеки. Реализация, примеры и тесты пока отсутствуют.</p></section>,
};
