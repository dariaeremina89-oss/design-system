import base, { LinearProps as props, LinearModes as modes } from './progress-examples';
const meta = {
  ...base,
  tags: ['autodocs', 'ready'],
  title: 'Components/Indicators/LinearProgress',
  args: { ...base.args, type: 'linear' as const },
  argTypes: {
    ...base.argTypes,
    type: { control: false as const },
    size: { table: { disable: true } },
    strokeWidth: { table: { disable: true } },
    variant: { table: { disable: true } },
  },
};
export default meta;
export const LinearProps = props;
export const LinearModes = modes;
