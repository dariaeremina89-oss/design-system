import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from '../Link/Link';
import { SingleFileInput } from './SingleFileInput';

function Interactive(args: React.ComponentProps<typeof SingleFileInput>) {
  const referenceWidth = args.size === 'mobile' ? 256 : 456;

  return (
    <div style={{ width: referenceWidth, maxWidth: '100%' }}>
      <SingleFileInput {...args} />
    </div>
  );
}

const meta = {
  title: 'Components/Inputs/SingleFileInput',
  component: SingleFileInput,
  tags: ['autodocs', 'ready'],
  args: {
    type: 'default',
    size: 'desktop',
    error: false,
    errorText: 'Файл не соответствует требованиям',
  },
  argTypes: {
    type: { control: 'select', options: ['default', 'disabled', 'skeleton'] },
    size: { control: 'select', options: ['desktop', 'mobile'] },
    fileRowProps: { control: false },
  },
  render: args => <Interactive {...args} />,
} satisfies Meta<typeof SingleFileInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Mobile: Story = { args: { size: 'mobile' } };
export const Error: Story = { args: { error: true } };
export const MobileError: Story = { args: { size: 'mobile', error: true } };
export const Disabled: Story = { args: { type: 'disabled' } };
export const DisabledError: Story = { args: { type: 'disabled', error: true } };

export const Loading: Story = {
  args: {
    fileRowProps: {
      fileName: 'File name.png',
      weight: '2,7 МБ',
      state: 'loading',
    },
  },
};
export const LoadingDisabled: Story = {
  args: {
    type: 'disabled',
    fileRowProps: {
      fileName: 'File name.png',
      weight: '2,7 МБ',
      state: 'loading',
    },
  },
};
export const FilledFile: Story = {
  args: {
    fileRowProps: {
      fileName: 'File name.png',
      weight: '2,7 МБ',
    },
  },
};
export const FilledFileError: Story = {
  args: {
    error: true,
    fileRowProps: {
      fileName: 'File name.png',
      weight: '2,7 МБ',
    },
  },
};
export const FilledTemplate: Story = {
  args: {
    fileRowProps: {
      fileName: 'File name',
      additionalContent: 'Шаблон',
    },
  },
};
export const FilledTemplateEdit: Story = {
  args: {
    fileRowProps: {
      fileName: 'File name.png',
      leadingIcon: 'pencil-paper',
      additionalContent: ({ disabled }) => (
        <Link href="#" size="medium" color="accent" decoration={null} disabled={disabled}>
          Заполнить
        </Link>
      ),
    },
  },
};
export const FilledDisabled: Story = {
  args: {
    type: 'disabled',
    fileRowProps: {
      fileName: 'File name.png',
      weight: '2,7 МБ',
    },
  },
};
export const FilledWarning: Story = {
  args: {
    fileRowProps: {
      fileName: 'File name.png',
      weight: '2,7 МБ',
      message: { type: 'warning', text: 'Warning text' },
    },
  },
};

export const Skeleton: Story = { args: { type: 'skeleton' } };
export const MobileSkeleton: Story = { args: { type: 'skeleton', size: 'mobile' } };
