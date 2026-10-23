import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Scrollbar } from '../components/Scrollbar/Scrollbar';
import { componentDocs } from '../docs/bulk-components';

function ScrollbarDemo() {
  const viewportRef = useRef<HTMLDivElement>(null);
  return (
    <div style={{ position: 'relative', width: 240, height: 240, background: 'var(--background-base-default)' }}>
      <div ref={viewportRef} className="fdoc-scrollbar-viewport" style={{ height: '100%', overflowY: 'auto' }}>
        {Array.from({ length: 14 }, (_, index) => (
          <div key={index} style={{ height: 48, display: 'flex', alignItems: 'center', padding: '0 12px' }}>
            Строка {index + 1}
          </div>
        ))}
      </div>
      <Scrollbar viewportRef={viewportRef} />
    </div>
  );
}

const meta = {
  title: 'Components/Elements/Scrollbar',
  component: Scrollbar,
  tags: ['autodocs', 'ready'],
  args: { viewportRef: { current: null } },
  parameters: {
    layout: 'centered',
    docs: { description: { component: componentDocs('Scrollbar') } },
  },
  render: () => <ScrollbarDemo />,
} satisfies Meta<typeof Scrollbar>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
