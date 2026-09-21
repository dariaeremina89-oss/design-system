import type { Meta, StoryObj } from '@storybook/react-vite';
const meta = { title: 'Components/Navigation/Breadcrumbs', parameters: { layout: 'padded', controls: { disable: true } } } satisfies Meta;
export default meta;
export const Planned: StoryObj<typeof meta> = {
  name: 'Еще не реализован',
  render: () => <section><h1>Breadcrumbs</h1><p>Компонент запланирован в структуре библиотеки. Реализация, примеры и тесты пока отсутствуют.</p></section>,
};
