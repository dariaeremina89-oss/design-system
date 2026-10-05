import { qualityDocs } from '../../docs/quality';
import { coreDocs } from '../../docs/core-components';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, type BadgeSize } from '../Badge/Badge';
import { iconNames } from '../Icon/Icon';
import { Button, type ButtonColor, type ButtonSize, type ButtonState } from './Button';
import { HoverActionExample } from '../Menu/dropdown-examples';

const meta = {
  title: 'Components/Actions/Button',
  id: 'components-buttons-button',
  component: Button,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: coreDocs('Button') + qualityDocs('Button'),
      },
    },
  },
  args: {
    text: 'Button',
    color: 'primary',
    size: 'medium',
    state: 'default',
  },
  argTypes: {
    text: { control: 'text', description: 'Однострочный текст кнопки.' },
    children: { control: false },
    size: { control: 'radio', options: ['small', 'medium', 'large', 'giant'] },
    color: {
      control: 'select',
      options: ['primary', 'base', 'secondary', 'tertiary', 'inverse', 'inverse-primary'],
    },
    state: {
      control: 'select',
      options: ['default', 'hover', 'focused', 'pressed', 'disabled', 'skeleton'],
    },
    iconLeft: { control: 'select', options: iconNames },
    iconRight: { control: 'select', options: iconNames },
    iconLeftView: { control: false },
    iconRightView: { control: false },
    badgeLeft: { control: false },
    badgeRight: { control: false },
    showIconLeft: { control: 'boolean', description: 'Включить левый слот иконки.' },
    showIconRight: { control: 'boolean', description: 'Включить правый слот иконки.' },
    showBadgeLeft: { control: 'boolean', description: 'Включить левый слот Badge.' },
    showBadgeRight: { control: 'boolean', description: 'Включить правый слот Badge.' },
    isLoading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    skeletonWidth: { control: 'text' },
    onClick: { action: 'click' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
      {(['small', 'medium', 'large', 'giant'] as ButtonSize[]).map((size) => (
        <Button {...args} key={size} size={size} text={size} data-testid={`button-${size}`} />
      ))}
    </div>
  ),
};

export const AllSizesWithElements: Story = {
  args: {
    iconLeft: 'arrow-left',
    iconRight: 'arrow-right',
    showIconLeft: true,
    showIconRight: true,
    showBadgeLeft: true,
    showBadgeRight: true,
  },
  render: (args) => {
    const badgeSize: Record<ButtonSize, BadgeSize> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
      giant: 'giant',
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        {(['small', 'medium', 'large', 'giant'] as ButtonSize[]).map((size) => (
          <Button
            {...args}
            key={size}
            size={size}
            text={size}
            badgeLeft={<Badge size={badgeSize[size]} color="inverse">2</Badge>}
            badgeRight={<Badge size={badgeSize[size]} color="inverse">9</Badge>}
            data-testid={`button-all-elements-${size}`}
          />
        ))}
      </div>
    );
  },
};

export const AllColors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
      {(['primary', 'base', 'secondary', 'tertiary', 'inverse', 'inverse-primary'] as ButtonColor[]).map((color) => (
        <Button {...args} key={color} color={color} text={color} data-testid={`button-${color}`} />
      ))}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ overflowX: 'auto', padding: 8 }}>
      <table style={{ borderSpacing: '24px 16px' }}>
        <thead><tr><th scope="col">Color</th>{(['default', 'hover', 'pressed', 'focused', 'disabled', 'skeleton'] as ButtonState[]).map(state=><th scope="col" key={state}>{state}</th>)}</tr></thead>
        <tbody>{(['primary', 'base', 'secondary', 'tertiary', 'inverse', 'inverse-primary'] as ButtonColor[]).map(color=><tr key={color}>
          <th scope="row" style={{textAlign:'left',whiteSpace:'nowrap'}}>{color}</th>
          {(['default', 'hover', 'pressed', 'focused', 'disabled', 'skeleton'] as ButtonState[]).map(state=><td key={state} style={{padding:12,background:color==='base'||color==='tertiary'?'var(--background-base-secondary)':'var(--background-base-default)'}}><Button {...args} color={color} state={state} text="Button" data-testid={`button-${color}-${state}`}/></td>)}
        </tr>)}</tbody>
      </table>
    </div>
  ),
};

export const WithIcons: Story = {
  args: { iconLeft: 'arrow-left', iconRight: 'arrow-right' },
};

export const WithDropdown: Story = {
  parameters: { docs: { description: { story: 'Кнопка с шевроном и Dropdown: наведение показывает меню, клик запускает основное действие. В адаптиве тап раскрывает меню, основное действие находится в первом пункте.' } } },
  render: () => <HoverActionExample />,
};

export const WithBadges: Story = {
  args: {
    badgeLeft: <Badge size="small" color="inverse">2</Badge>,
    badgeRight: <Badge size="small" color="inverse">9</Badge>,
    iconLeft: 'check',
  },
};

export const WithDisabledBadges: Story = {
  args: {
    color: 'primary',
    state: 'disabled',
    badgeLeft: <Badge size="medium" color="primary" state="default">2</Badge>,
    badgeRight: <Badge size="medium" color="primary" state="default">9</Badge>,
  },
};

export const Loading: Story = {
  args: { text: 'Saving', iconLeft: 'check', isLoading: true },
};

export const LongText: Story = {
  args: { text: 'Очень длинный текст действия без переноса строки', iconLeft: 'send' },
  render: (args) => <Button {...args} style={{ width: 220 }} />,
};

export const FullWidth: Story = {
  args: { fullWidth: true, text: 'Full width' },
  render: (args) => <div style={{ width: 320 }}><Button {...args} /></div>,
};

export const IconOnly: Story = {
  args: { text: undefined, iconLeft: 'cross', 'aria-label': 'Close' },
};

export const Skeleton: Story = {
  args: { state: 'skeleton', skeletonWidth: 108 },
};

export const SkeletonWithSlots: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Button state="skeleton" size="small" skeletonWidth={92} data-testid="button-skeleton-small" />
      <Button state="skeleton" size="medium" skeletonWidth={132} data-testid="button-skeleton-medium" />
      <Button state="skeleton" size="large" skeletonWidth={188} data-testid="button-skeleton-large" />
      <Button state="skeleton" size="giant" skeletonWidth={232} data-testid="button-skeleton-giant" />
    </div>
  ),
};
