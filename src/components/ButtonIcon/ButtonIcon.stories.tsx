import { testingDocs } from '../../docs/testing';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { iconNames } from '../Icon/Icon';
import { ButtonIcon } from './ButtonIcon';

const meta = {
  title: 'Components/Actions/ButtonIcon',
  id: 'components-buttons-buttonicon',
  component: ButtonIcon,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
**ButtonIcon** — кнопка с одним действием, представленным иконкой без текста. Она используется для компактных вспомогательных действий, когда смысл понятен из контекста или дополнительно раскрывается через Tooltip.

Это базовый компонент тестовой дизайн-системы и личного плейбука. Источник визуальной истины — компонент **Button Icon** в Figma; frontend-реализация использует локальную библиотеку \`Icon\` и семантические токены проекта.

### Ограничения

- ButtonIcon содержит одну иконку и не поддерживает текст.
- Для неочевидных действий рекомендуется Tooltip.
- \`aria-label\` обязателен и не заменяется Tooltip.
- \`iconSize\` можно переопределить отдельно от размера кнопки.

### Размеры

| Size | Кнопка | Иконка | Padding |
| --- | ---: | ---: | ---: |
| \`xxsmall\` / 16 Xxsmall | \`--elements-16\` | \`--elements-16\` | \`--space-0\` |
| \`xsmall\` / 24 Xsmall | \`--elements-24\` | \`--elements-16\` | \`--space-4\` |
| \`small\` / 32 Small | \`--elements-32\` | \`--elements-16\` | \`--space-8\` |
| \`medium\` / 40 Medium | \`--elements-40\` | \`--elements-24\` | \`--space-8\` |
| \`large\` / 48 Large | \`--elements-48\` | \`--elements-32\` | \`--space-8\` |
| \`giant\` / 56 Giant | \`--elements-56\` | \`--elements-40\` | \`--space-8\` |

Кнопка круглая: \`--radius-full\`. Focus-обводка использует \`--border-large\` и не меняет размер layout-бокса.

### Цвета и состояния

Поддерживаются цвета \`Primary\`, \`Secondary\`, \`Tertiary\`, \`Neutral\`, \`Base\`, \`Inverse\`, \`Inverse Primary\`, \`Inverse light\` и состояния \`Default\`, \`Hover\`, \`Focused\`, \`Pressed\`, \`Disabled\`, \`Skeleton\`.

\`Tertiary\` и \`Neutral\` не имеют фона в Default, Focused и Disabled; фон появляется только в Hover и Pressed. В Skeleton для этих цветов фон кнопки остается прозрачным, а внутри показывается \`skeleton_icon\`; остальные цвета используют заполненный skeleton-круг. Skeleton использует общую анимацию и не является интерактивной кнопкой.

### Доступность

Используется нативный \`button\`: он доступен через Tab, активируется клавишами Enter и Space, а в Disabled исключается из tab-навигации через нативный \`disabled\`.

Это не официальная библиотека F.Doc и не production-компонент.
        ` + testingDocs('ButtonIcon'),
      },
    },
  },
  args: {
    icon: 'cross',
    'aria-label': 'Close',
  },
  argTypes: {
    icon: { control: 'select', options: iconNames, description: 'Иконка из библиотеки проекта.' },
    iconView: { control: false, description: 'Произвольный слот иконки.' },
    size: { control: 'radio', options: ['xxsmall', 'xsmall', 'small', 'medium', 'large', 'giant'] },
    iconSize: { control: { type: 'number', min: 8, max: 48, step: 1 } },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'neutral', 'base', 'inverse', 'inverse-primary', 'inverse-light'],
    },
    state: { control: 'select', options: ['default', 'hover', 'focused', 'pressed', 'disabled', 'skeleton'] },
    onClick: { action: 'click' },
  },
} satisfies Meta<typeof ButtonIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {(['xxsmall', 'xsmall', 'small', 'medium', 'large', 'giant'] as const).map((size) => (
        <ButtonIcon {...args} key={size} size={size} aria-label={size} />
      ))}
    </div>
  ),
};
export const AllColors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
      {(['primary', 'secondary', 'tertiary', 'neutral', 'base', 'inverse', 'inverse-primary', 'inverse-light'] as const).map((color) => (
        <ButtonIcon {...args} key={color} color={color} aria-label={color} />
      ))}
    </div>
  ),
};
export const States: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {(['default', 'hover', 'focused', 'pressed', 'disabled', 'skeleton'] as const).map((state) => (
        <ButtonIcon {...args} key={state} state={state} aria-label={state} />
      ))}
    </div>
  ),
};
export const ForcedIconSize: Story = { args: { size: 'giant', iconSize: 16 } };
