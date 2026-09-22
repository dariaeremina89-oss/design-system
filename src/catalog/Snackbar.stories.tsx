import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from '../components/Typography/Typography';
const meta = { title: 'Components/Elements/Snackbar', parameters: { layout: 'padded', controls: { disable: true } } } satisfies Meta;
export default meta;
export const Planned: StoryObj<typeof meta> = {
  render: () => <section><Typography as="h1" variant="h1-heading" responsive>Snackbar</Typography><Typography responsive>Компонент запланирован в структуре библиотеки. Реализация, примеры и тесты пока отсутствуют.</Typography></section>,
};
