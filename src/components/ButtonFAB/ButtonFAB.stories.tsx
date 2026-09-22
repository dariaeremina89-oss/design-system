import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { iconNames } from '../Icon/Icon';
import { testingDocs } from '../../docs/testing';
import { ButtonFAB, type ButtonFABProps } from './ButtonFAB';

const meta = {
  title: 'Components/Actions/ButtonFAB',
  component: ButtonFAB,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: `
**ButtonFAB** — кнопка одного приоритетного действия экрана, доступного независимо от прокрутки. В этой версии поддерживается только одна библиотечная иконка; текста и меню действий нет.

### Применение

Используйте один FAB на экране для частого основного действия: создания, запуска сценария или доступа к помощи. Не заменяйте им обычные кнопки форм, таблиц и списков. Выбирайте место, где кнопка не мешает важному содержимому и другим действиям.

### Размеры и анатомия

| Элемент | Токен / значение |
| --- | --- |
| Кнопка | \`--elements-64\` — 64 × 64 px |
| Иконка | \`--elements-40\` — 40 × 40 px |
| Padding | \`--space-12\` — 12 px |
| Радиус | \`--radius-full\` — 9999 px |
| Тень | \`--shadow-s\` |
| Внешняя рамка Focused | \`--border-large\` — 4 px |

Рамка фокуса идет снаружи, не уменьшает иконку и не меняет размеры кнопки. Тень сохраняется во всех состояниях.

### Цвета и состояния

| Color | Фон Default / Hover / Pressed / Disabled | Иконка / Disabled | Рамка Focused |
| --- | --- | --- | --- |
| Primary | \`--background-primary-default\` / \`--background-primary-default-hover\` / \`--background-primary-default-pressed\` / \`--background-primary-default-disabled\` | \`--icon-primary-default-light\` / \`--icon-primary-default-light-disabled\` | \`--border-primary-focused\` |
| Secondary | \`--background-base-secondary\` / \`--background-base-secondary-hover\` / \`--background-base-secondary-pressed\` / \`--background-base-secondary-disabled\` | \`--icon-base-default\` / \`--icon-base-default-disabled\` | \`--border-base-default-focused\` |
| Base | \`--background-base-default\` / \`--background-base-default-hover\` / \`--background-base-default-pressed\` / \`--background-base-default-disabled\` | \`--icon-base-default\` / \`--icon-base-default-disabled\` | \`--border-base-default-focused\` |
| Inverse | \`--background-base-inverse\` / \`--background-base-inverse-hover\` / \`--background-base-inverse-pressed\` / \`--background-base-inverse-disabled\` | \`--icon-base-inverse\` / \`--icon-base-inverse-disabled\` | \`--border-base-inverse-focused\` |

Focused использует фон Default. Hover и Pressed меняют только фон. При реальном взаимодействии фокус остается виден одновременно с Hover или Pressed. Проп \`state\` позволяет зафиксировать образец состояния; \`default\` включает обычные реакции на мышь и клавиатуру.

Skeleton из макета — общий неинтерактивный круг 64 × 64 без иконки, с \`--background-base-skeleton\`.

### Размещение

- \`position="floating"\` по умолчанию: фиксированная кнопка справа внизу, отступ \`--space-24\` плюс safe area, слой \`--layer-floating\`. Она находится над контентом, под блокирующими overlay и диалогами.
- Floating рендерится через portal в body и сохраняет положение даже внутри прокручиваемого или трансформированного родителя. Токены темы должны быть доступны на корне документа. Отступы можно изменить через \`style\` или \`className\`.
- \`position="inline"\`: кнопка участвует в layout. Примеры состояний используют Inline, чтобы сравнивать образцы рядом. На реальном экране размещается один FAB.

### Доступность

\`aria-label\` и \`icon\` обязательны. Используется нативный button с \`type="button"\` по умолчанию. Tab переводит фокус, Enter и Space вызывают действие. Disabled блокирует действие и исключает кнопку из Tab-порядка. Иконка декоративна для экранного диктора, имя действия берется из aria-label.
` + testingDocs('ButtonFAB') } },
  },
  args: { icon: 'plus', 'aria-label': 'Создать документ', position: 'inline' },
  argTypes: {
    icon: { control: 'select', options: iconNames },
    color: { control: 'select', options: ['primary', 'secondary', 'base', 'inverse'] },
    state: { control: 'select', options: ['default', 'hover', 'focused', 'pressed', 'disabled', 'skeleton'] },
    position: { control: 'radio', options: ['floating', 'inline'] },
    disabled: { control: 'boolean' },
    onClick: { action: 'click' },
    ref: { control: false },
  },
} satisfies Meta<typeof ButtonFAB>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focused: Story = { args: { state: 'focused' } };
export const Disabled: Story = { args: { disabled: true } };
export const Skeleton: Story = { args: { state: 'skeleton' } };
export const States: Story = {
  render: (args) => (
    <div style={{ overflowX: 'auto', padding: 8 }}>
      <table aria-label="ButtonFAB: цвета и состояния" style={{ borderSpacing: 24 }}>
        <thead><tr><th scope="col">Color</th>{['default', 'hover', 'focused', 'pressed', 'disabled', 'skeleton'].map(state => <th key={state} scope="col">{state}</th>)}</tr></thead>
        <tbody>{(['primary', 'secondary', 'base', 'inverse'] as const).map(color => (
          <tr key={color}><th scope="row">{color}</th>{(['default', 'hover', 'focused', 'pressed', 'disabled', 'skeleton'] as const).map(state => (
            <td key={state}><ButtonFAB {...args} position="inline" color={color} state={state} aria-label={`${color} ${state}`} data-testid={`button-fab-${color}-${state}`} /></td>
          ))}</tr>
        ))}</tbody>
      </table>
    </div>
  ),
};

function InteractionExample(args: ButtonFABProps) {
  const [clicks, setClicks] = useState(0);
  return <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
    <ButtonFAB {...args} position="inline" onClick={() => setClicks(count => count + 1)} />
    <output aria-live="polite">Действий: {clicks}</output>
  </div>;
}
export const Keyboard: Story = { render: (args) => <InteractionExample {...args} /> };

export const Floating: Story = {
  args: { position: 'floating' },
  parameters: { docs: { story: { inline: false, height: '420px' } } },
  render: (args) => (
    <div style={{ transform: 'translateZ(0)', paddingBottom: 112 }}>
      <h2>Документы</h2>
      <p>Прокрутите страницу: кнопка создания остается справа внизу.</p>
      {Array.from({ length: 24 }, (_, i) => <p key={i} style={{ padding: 20, borderBottom: '1px solid var(--border-base-secondary)' }}>Документ {i + 1}</p>)}
      <ButtonFAB {...args} position="floating" />
    </div>
  ),
};
