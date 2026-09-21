import base, { CircularProps as props, CircularModes as modes, CircularColors as colors } from './progress-examples';
const meta = {
  ...base,
  tags: ['autodocs', 'ready'],
  title: 'Components/Indicators/CircularProgress',
  id: 'components-progress-indicators-progressindicator',
  args: { ...base.args, type: 'circular' as const, mode: 'indeterminate' as const },
  argTypes: { ...base.argTypes, type: { control: false as const } },
};
export default meta;
export const CircularProps = props;
export const CircularModes = modes;
export const CircularColors = colors;
