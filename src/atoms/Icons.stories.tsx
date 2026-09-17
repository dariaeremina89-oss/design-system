import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon, iconNames } from '../components/Icon/Icon';
import { Page } from './atoms-helpers';

const meta = {
  title: 'Atoms/Icons',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Library: Story = {
  args: { name: 'magnifying-glass' },
  argTypes: {
    name: { control: 'select', options: iconNames },
    size: { control: { type: 'number', min: 12, max: 64, step: 1 } },
    color: { control: 'color' },
    title: { control: 'text' },
  },
  render: (args) => (
    <Page title="Icons">
      <div className="fdoc-atoms__icons">
        {iconNames.slice(0, 24).map((name) => (
          <div key={name} className="fdoc-atoms__icon">
            <Icon name={name} />
            <span className="fdoc-atoms__label">{name}</span>
          </div>
        ))}
      </div>
      <div className="fdoc-atoms__icon">
        <Icon {...args} />
        <span className="fdoc-atoms__label">Selected from icon library ({iconNames.length} icons)</span>
      </div>
    </Page>
  ),
};
