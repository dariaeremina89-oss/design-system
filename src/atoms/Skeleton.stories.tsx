import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton as SkeletonBlock } from '../components/Skeleton/Skeleton';
import { Page } from './atoms-helpers';

const meta = {
  title: 'Atoms/Skeleton',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <Page title="Skeleton">
      <div className="fdoc-atoms__section">
        <SkeletonBlock width="280px" height="16px" shape="text" />
        <SkeletonBlock width="100%" height="56px" />
        <SkeletonBlock width="48px" height="48px" shape="circle" />
      </div>
    </Page>
  ),
};
