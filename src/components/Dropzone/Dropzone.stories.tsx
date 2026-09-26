import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropzone } from './Dropzone';

const meta = {
  title: 'Components/Inputs/Dropzone',
  component: Dropzone,
  tags: ['autodocs', 'ready'],
  args: { state: 'default', align: 'left', showFormats: true, showMaxQuantity: false, showMaxFileSize: true, showMaxTotalSize: false },
  argTypes: {
    state: { control: 'select', options: ['default', 'hover', 'focused', 'pressed', 'disabled', 'error', 'success', 'skeleton'] },
    align: { control: 'select', options: ['left', 'center'] },
  },
} satisfies Meta<typeof Dropzone>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Center: Story = { args: { align: 'center' } };
export const Hover: Story = { args: { state: 'hover' } };
export const Focused: Story = { args: { state: 'focused' } };
export const Pressed: Story = { args: { state: 'pressed' } };
export const Error: Story = { args: { state: 'error' } };
export const Success: Story = { args: { state: 'success' } };
export const Disabled: Story = { args: { state: 'disabled' } };
export const Skeleton: Story = { args: { state: 'skeleton' } };
