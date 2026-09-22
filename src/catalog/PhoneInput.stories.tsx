import type { Meta, StoryObj } from '@storybook/react-vite';
const meta = { title: 'Components/Inputs/PhoneInput', parameters: { layout: 'padded', controls: { disable: true } } } satisfies Meta;
export default meta;
export const Planned: StoryObj<typeof meta> = {
  render: () => <section><h1>PhoneInput</h1><p>Компонент запланирован в структуре библиотеки. Реализация, примеры и тесты пока отсутствуют.</p></section>,
};
