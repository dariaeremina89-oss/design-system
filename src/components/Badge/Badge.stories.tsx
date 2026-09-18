import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, type BadgeColor, type BadgeSize, type BadgeState } from './Badge';

const meta = {
  title: 'Components/Badges/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
**Badge** — небольшой неинтерактивный индикатор для количества, короткой метки или точки активности.

Это тестовая дизайн-система и личный плейбук, а не официальная production-библиотека F.Doc. Визуальная истина для Badge — Figma node 199:2534.

### API

- size: smallest / small / medium / large / giant;
- color: primary / secondary / inverse;
- state: default / disabled / skeleton;
- text или children: короткое значение без переноса;
- skeletonWidth: ширина Skeleton для конкретного контента.

### Геометрия из Figma

Smallest имеет внешний размер 16 и внутреннюю точку 8. Остальные размеры имеют фиксированную высоту 16, 20, 24 и 28, а ширина зависит от контента и горизонтальных padding. Skeleton использует общую wave-анимацию атома Skeleton и радиус --radius-small.

Badge не кликабелен, не получает фокус и не содержит иконок или вложенных интерактивных элементов. Для декоративного Badge можно передать aria-hidden, для самостоятельного текстового значения — aria-label.
        `,
      },
    },
  },
  args: {
    size: 'medium',
    color: 'primary',
    state: 'default',
    text: '99+',
  },
  argTypes: {
    size: { control: 'select', options: ['smallest', 'small', 'medium', 'large', 'giant'] },
    color: { control: 'select', options: ['primary', 'secondary', 'inverse'] },
    state: { control: 'select', options: ['default', 'disabled', 'skeleton'] },
    text: { control: 'text' },
    children: { control: false },
    skeletonWidth: { control: 'text' },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {(['smallest', 'small', 'medium', 'large', 'giant'] as BadgeSize[]).map((size) => (
        <Badge {...args} key={size} size={size} text={size === 'smallest' ? undefined : '99+'} data-testid={`badge-${size}`} />
      ))}
    </div>
  ),
};

export const AllColors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {(['primary', 'secondary', 'inverse'] as BadgeColor[]).map((color) => (
        <Badge {...args} key={color} color={color} data-testid={`badge-${color}`} />
      ))}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {(['default', 'disabled', 'skeleton'] as BadgeState[]).map((state) => (
        <Badge {...args} key={state} state={state} data-testid={`badge-${state}`} />
      ))}
    </div>
  ),
};

export const Smallest: Story = {
  args: { size: 'smallest', text: undefined, 'aria-label': 'Есть новые уведомления' },
};

export const Skeleton: Story = {
  args: { state: 'skeleton' },
};

export const SkeletonAllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {(['smallest', 'small', 'medium', 'large', 'giant'] as BadgeSize[]).map((size) => (
        <Badge key={size} size={size} state="skeleton" data-testid={`badge-skeleton-${size}`} />
      ))}
    </div>
  ),
};
