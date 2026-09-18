import type { ArgTypes, Meta, StoryObj } from '@storybook/react-vite';
import { Icon, type IconName, type IconProps, iconNames } from '../components/Icon/Icon';
import { Page } from './atoms-helpers';

const meta = {
  title: 'Atoms/Icons',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Единая библиотека SVG-иконок, импортированная из Figma. Иконки сгруппированы по разделам, выбираются через prop name, масштабируются через size и поддерживают color для монохромных вариантов. Для самостоятельной иконки доступное имя задается через title.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<IconProps>;

export default meta;
type Story = StoryObj<IconProps>;

const iconArgTypes: ArgTypes<IconProps> = {
  name: { control: 'select', options: iconNames },
  size: { control: { type: 'number', min: 12, max: 64, step: 1 } },
  color: { control: 'color' },
  title: { control: 'text' },
};

const iconGroup = (name: IconName) => {
  const prefix = name.split('/')[0];
  if (!name.includes('/')) return 'General';
  if (prefix === 'flag_chevron') return 'Flag chevron';
  if (prefix === 'multicolor') return 'Multicolor';
  if (prefix === 'social') return 'Social';
  if (prefix === 'filled') return 'Filled';
  if (prefix === 'currency') return 'Currency';
  if (prefix === 'cursors') return 'Cursors';
  return prefix;
};

const groupNames = ['General', 'Currency', 'Cursors', 'Filled', 'Flag chevron', 'Multicolor', 'Social'] as const;
const iconsByGroup = Object.fromEntries(
  groupNames.map((group) => [group, iconNames.filter((name) => iconGroup(name) === group)]),
) as Record<(typeof groupNames)[number], IconName[]>;

const renderGroup = (group: (typeof groupNames)[number], args: IconProps) => (
  <Page title={group}>
    <div className="fdoc-atoms__icons">
      {iconsByGroup[group].map((name) => (
        <div key={name} className="fdoc-atoms__icon">
          <Icon name={name} />
          <span className="fdoc-atoms__label">{name}</span>
        </div>
      ))}
    </div>
    <div className="fdoc-atoms__icon">
      <Icon {...args} />
      <span className="fdoc-atoms__label">Selected from icon library ({iconNames.length} icons total)</span>
    </div>
  </Page>
);

const createIconStory = (group: (typeof groupNames)[number]): Story => ({
  args: { name: iconsByGroup[group][0] },
  argTypes: iconArgTypes,
  render: (args) => renderGroup(group, args as IconProps),
});

export const General: Story = createIconStory('General');
export const Currency: Story = createIconStory('Currency');
export const Cursors: Story = createIconStory('Cursors');
export const Filled: Story = createIconStory('Filled');
export const FlagChevron: Story = createIconStory('Flag chevron');
export const Multicolor: Story = createIconStory('Multicolor');
export const Social: Story = createIconStory('Social');
