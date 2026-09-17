import type { Meta, StoryObj } from '@storybook/react-vite';
import { Page } from './atoms-helpers';

const meta = {
  title: 'Atoms/Docs',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TokenHierarchy: Story = {
  render: () => (
    <Page title="Token hierarchy">
      <p className="fdoc-atoms__note">
        Primitive tokens store base values. Semantic tokens are aliases built on top of them and are used by components.
      </p>
      <div className="fdoc-atoms__layer-grid">
        <div className="fdoc-atoms__layer-card">
          <strong>1 · Primitive</strong>
          <code>--white-1000</code>
          <span>Base color value</span>
        </div>
        <div className="fdoc-atoms__layer-arrow">→</div>
        <div className="fdoc-atoms__layer-card">
          <strong>2 · Semantic</strong>
          <code>--background-base-default</code>
          <span>Alias → --white-1000</span>
        </div>
        <div className="fdoc-atoms__layer-arrow">→</div>
        <div className="fdoc-atoms__layer-card">
          <strong>3 · Component</strong>
          <code>Input background</code>
          <span>Uses the semantic token</span>
        </div>
      </div>
      <pre className="fdoc-atoms__code">{`--background-base-default: var(--white-1000);`}</pre>
    </Page>
  ),
};
