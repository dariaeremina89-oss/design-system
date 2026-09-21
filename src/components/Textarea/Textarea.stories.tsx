import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';
import { testingDocs } from '../../docs/testing';

const meta = {
  title: 'Components/Inputs/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: `
**Textarea** — нативное многострочное поле F.Doc. [Макет в Figma](https://www.figma.com/design/qfWNJqugbOC6RmiKKEv9Bb/F.Doc-Design-System?node-id=499-9705).

### API и анатомия

Label → область ввода → Helper (Caption или Error + Counter). Label, Helper, приоритет ошибки, счетчик и связи доступности используют общую основу с Input. Цвета состояний и типографика подписей также общие.

- Размеры: medium — область ввода 112 px, small — 48 px. При однострочных Label и Helper общая высота составляет 152 и 88 px.
- Отступы области ввода: medium — 16 px, small — 8 px по вертикали и 16 px по горизонтали. Рамка входит в габариты и не сдвигает текст при фокусе.
- Текст — 16/24, подпись и Helper — 12/16; типографика сохраняется на мобильном экране.
- label, placeholder, caption, error, counter, required, disabled, skeleton — по назначению как у Input.
- counter=true показывает длину значения; с maxLength формат становится N / N. Нативный maxLength ограничивает ввод и вставку. Программно переданное value не обрезается.
- error заменяет caption. В Error + Disabled подпись и ошибка используют --text-error-secondary-disabled, рамка — --border-error-disabled. Значение, placeholder и счетчик сохраняют свои disabled-цвета.
- value + onChange — управляемое значение, defaultValue — начальное неуправляемое значение. ref указывает на textarea. Поддерживаются нативные name, readOnly, autoFocus и обработчики событий.

### Поведение и высота

Enter добавляет новую строку, вставка сохраняет переносы, Tab переводит фокус дальше. Длинные последовательности переносятся внутри поля; при переполнении появляется вертикальная прокрутка.

resize=false по умолчанию: высота не растет от ввода. resize=true разрешает ручное изменение высоты только по вертикали; используется нативный маркер браузера. Disabled блокирует ввод, фокус и изменение высоты. Произвольную высоту можно задать через style, минимальная остается по размеру. Автоматическое увеличение высоты не включено.

**Приоритет макета:** в описании упоминались четыре строки Medium, но 112 px при отступах 16 px и line-height 24 px не вмещают четыре полные строки. Реализация сохраняет размеры Figma, оставшийся текст доступен прокруткой.

### Доступность и Skeleton

Label связан с полем через htmlFor/id; Error, Caption, Counter и внешний aria-describedby объединяются. Ошибка задает aria-invalid, required — нативную обязательность и aria-required. Без Label передайте aria-label или aria-labelledby.

Skeleton использует общий компонент Skeleton и сохраняет состав: Label/Helper по наличию, полоска значения — только у заполненного поля. Поле Skeleton не интерактивно и скрыто от дерева доступности.

Это компонент тестовой дизайн-системы и личного плейбука, а не официальный production-пакет F.Doc.
` + testingDocs('Textarea') } },
  },
  decorators: [(Story, context) => <div style={{ width: context.name === 'States' ? 'min(960px, 100%)' : 'min(456px, 100%)' }}><Story /></div>],
  args: { label: 'Label text', placeholder: 'Placeholder', caption: 'Caption text' },
  argTypes: {
    size: { control: 'radio', options: ['medium', 'small'] },
    label: { control: 'text' }, caption: { control: 'text' }, error: { control: 'text' },
    value: { control: 'text' }, defaultValue: { control: 'text' }, counter: { control: 'boolean' },
    resize: { control: 'boolean' }, disabled: { control: 'boolean' }, skeleton: { control: 'boolean' },
    onChange: { action: 'change' }, onFocus: { action: 'focus' }, onBlur: { action: 'blur' },
  },
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Small: Story = { args: { size: 'small' } };
export const Filled: Story = { args: { defaultValue: 'Первая строка\nВторая строка\nТретья строка' } };
export const Focused: Story = { args: { autoFocus: true } };
export const Error: Story = { args: { error: 'Error text', counter: true, maxLength: 100 } };
export const FocusedError: Story = { args: { error: 'Error text', autoFocus: true } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Input text', counter: true } };
export const ErrorDisabled: Story = { args: { disabled: true, error: 'Error text', defaultValue: 'Input text', counter: true, maxLength: 100 } };
export const Required: Story = { args: { required: true } };
export const WithCounter: Story = { args: { counter: true, maxLength: 100 } };
export const Resize: Story = { args: { resize: true, defaultValue: 'Потяни за нижний угол поля, чтобы изменить высоту.' } };
export const Overflow: Story = { args: { defaultValue: Array.from({ length: 12 }, (_, i) => `Строка ${i + 1}`).join('\n') } };
export const LongText: Story = { args: { label: 'ДлинноеНазваниеБезПробелов'.repeat(8), caption: 'https://example.com/' + 'long'.repeat(60), defaultValue: 'ДлиннаяСтрокаБезПробелов'.repeat(50), counter: true } };
export const WithoutLabel: Story = { args: { label: undefined, 'aria-label': 'Комментарий' } };
export const SkeletonEmpty: Story = { args: { skeleton: true, placeholder: 'Placeholder' } };
export const SkeletonFilled: Story = { args: { skeleton: true, defaultValue: 'Input text', counter: true, maxLength: 100 } };
export const Controlled: Story = {
  render: function ControlledExample(args) {
    const [value, setValue] = useState('Изменяемое значение');
    return <Textarea {...args} value={value} onChange={event => setValue(event.target.value)} counter maxLength={100} />;
  },
};
export const States: Story = {
  decorators: [Story => <div style={{ width: 'min(960px, 100%)' }}><Story /></div>],
  render: () => <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24 }}>
    {(['medium', 'small'] as const).flatMap(size => [
      <Textarea key={`${size}-default`} size={size} label={`${size} / Default`} placeholder="Placeholder" caption="Caption text" />,
      <Textarea key={`${size}-filled`} size={size} label={`${size} / Filled`} defaultValue="Input text" caption="Caption text" counter maxLength={100} />,
      <Textarea key={`${size}-error`} size={size} label={`${size} / Error`} error="Error text" defaultValue="Input text" counter maxLength={100} />,
      <Textarea key={`${size}-disabled`} size={size} label={`${size} / Error + Disabled`} error="Error text" disabled defaultValue="Input text" counter maxLength={100} />,
      <Textarea key={`${size}-skeleton`} size={size} label="Label text" skeleton caption="Caption text" />,
      <Textarea key={`${size}-skeleton-filled`} size={size} label="Label text" skeleton defaultValue="Input text" caption="Caption text" counter />,
    ])}
  </div>,
};
