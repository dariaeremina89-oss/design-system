import type { Meta, StoryObj } from '@storybook/react-vite';
import { effectTokens } from '../styles/token-catalog';
import { cssVar, Page } from './atoms-helpers';

const meta = {
  title: 'Atoms/Effects',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Styles: Story = {
  render: () => (
    <Page title="Effect styles">
      <p className="fdoc-atoms__note">Effect styles are separate from Variables and are mapped to frontend shadow tokens.</p>
      <div className="fdoc-atoms__shadow-grid">
        {effectTokens.map((item) => (
          <div key={item.token} className="fdoc-atoms__shadow-card" style={{ boxShadow: cssVar(item.token) }}>
            <span>{item.token}</span>
            <code>{item.value}</code>
          </div>
        ))}
      </div>
    </Page>
  ),
};
