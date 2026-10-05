import { qualityDocs } from '../../docs/quality';
import { coreDocs } from '../../docs/core-components';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { iconNames } from '../Icon/Icon';
import { ButtonFAB, type ButtonFABProps } from './ButtonFAB';

const meta = {
  title: 'Components/Actions/ButtonFAB',
  component: ButtonFAB,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: coreDocs('ButtonFAB') + qualityDocs('ButtonFAB') } },
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
