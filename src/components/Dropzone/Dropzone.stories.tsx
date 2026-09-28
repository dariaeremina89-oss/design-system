import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropzone } from './Dropzone';

const meta = {
  title: 'Components/Inputs/Dropzone',
  component: Dropzone,
  tags: ['autodocs', 'ready'],
  args: {
    state: 'default',
    align: 'left',
    showFormats: true,
    showMaxQuantity: false,
    showMaxFileSize: true,
    showMaxTotalSize: false,
  },
  argTypes: {
    state: { control: 'select', options: ['default', 'hover', 'focused', 'pressed', 'disabled', 'error', 'success', 'skeleton'] },
    align: { control: 'select', options: ['left', 'center'] },
  },
  decorators: [Story => <div style={{ width: 456, maxWidth: '100%' }}><Story /></div>],
} satisfies Meta<typeof Dropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hover: Story = { args: { state: 'hover' } };
export const Focused: Story = { args: { state: 'focused' } };
export const Pressed: Story = { args: { state: 'pressed' } };
export const Disabled: Story = { args: { state: 'disabled' } };
export const Error: Story = { args: { state: 'error' } };
export const Success: Story = { args: { state: 'success' } };
export const Skeleton: Story = { args: { state: 'skeleton' } };

export const Center: Story = { args: { align: 'center' } };
export const CenterHover: Story = { args: { align: 'center', state: 'hover' } };
export const CenterFocused: Story = { args: { align: 'center', state: 'focused' } };
export const CenterPressed: Story = { args: { align: 'center', state: 'pressed' } };
export const CenterDisabled: Story = { args: { align: 'center', state: 'disabled' } };
export const CenterError: Story = { args: { align: 'center', state: 'error' } };
export const CenterSuccess: Story = { args: { align: 'center', state: 'success' } };
export const CenterSkeleton: Story = { args: { align: 'center', state: 'skeleton' } };
