import { qualityDocs } from '../../docs/quality';
import { coreDocs } from '../../docs/core-components';
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
        component: coreDocs('ButtonIcon') + qualityDocs('ButtonIcon'),
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

export const StateMatrix: Story = {
  render: (args) => (
    <div style={{ overflowX: 'auto', padding: 8 }}>
      <table style={{ borderSpacing: 20 }} aria-label="ButtonIcon: цвета и состояния">
        <thead><tr><th scope="col">Color</th>{['default', 'hover', 'focused', 'pressed', 'disabled', 'skeleton'].map(state => <th key={state} scope="col">{state}</th>)}</tr></thead>
        <tbody>{(['primary', 'secondary', 'tertiary', 'neutral', 'base', 'inverse', 'inverse-primary', 'inverse-light'] as const).map(color => (
          <tr key={color}><th scope="row">{color}</th>{(['default', 'hover', 'focused', 'pressed', 'disabled', 'skeleton'] as const).map(state => (
            <td key={state}><ButtonIcon {...args} color={color} state={state} aria-label={`${color} ${state}`} data-testid={`button-icon-${color}-${state}`} /></td>
          ))}</tr>
        ))}</tbody>
      </table>
    </div>
  ),
};
