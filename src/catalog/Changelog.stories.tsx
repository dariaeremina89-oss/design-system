import type { Meta, StoryObj } from '@storybook/react-vite';
const meta = { title: 'General/Changelog', parameters: { layout: 'padded', controls: { disable: true } } } satisfies Meta;
export default meta;
export const Planned: StoryObj<typeof meta> = {
  name: 'Раздел запланирован',
  render: () => <section><h1>Changelog</h1><p>Место раздела в библиотеке зарезервировано. Содержимое еще не подготовлено.</p></section>,
};
