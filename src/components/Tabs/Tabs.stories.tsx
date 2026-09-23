import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, Tab, type TabsProps } from './Tabs';
import { componentDocs } from '../../docs/bulk-components';

const defaultItems: TabsProps['items'] = [
  { value: 'info', label: 'Информация', content: 'Данные компании' },
  { value: 'settings', label: 'Настройки', content: 'Настройки компании' },
  { value: 'employees', label: 'Сотрудники', badge: 12, content: 'Список сотрудников' },
  { value: 'archive', label: 'Архив', disabled: true, content: 'Архив' },
];

const adaptiveItems: TabsProps['items'] = [
  { value: 'info', label: 'Информация', content: 'Данные компании' },
  { value: 'settings', label: 'Настройки', content: 'Настройки компании' },
  { value: 'employees', label: 'Сотрудники', badge: 12, content: 'Список сотрудников' },
  { value: 'certificates', label: 'Сертификаты', content: 'Сертификаты' },
  { value: 'integrations', label: 'Интеграции', content: 'Интеграции' },
  { value: 'security', label: 'Безопасность', content: 'Безопасность' },
];

const meta = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: componentDocs('Tabs') } },
  },
  args: {
    'aria-label': 'Разделы компании',
    items: defaultItems,
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Overflow: Story = {
  args: {
    items: Array.from({ length: 12 }, (_, index) => ({
      value: String(index),
      label: `Раздел ${index + 1}`,
      content: `Содержимое ${index + 1}`,
    })),
  },
  decorators: [StoryComponent => (
    <div style={{ maxWidth: 480 }}>
      <StoryComponent />
    </div>
  )],
};

function AdaptiveOverflowDemo(args: TabsProps) {
  const [width, setWidth] = useState(900);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontFamily: 'var(--font-family-sans)',
          fontSize: 14,
          lineHeight: '20px',
        }}
      >
        <span style={{ minWidth: 172 }}>Ширина контейнера: {width}px</span>
        <input
          aria-label="Ширина контейнера Tabs"
          type="range"
          min="280"
          max="900"
          step="20"
          value={width}
          onChange={event => setWidth(Number(event.currentTarget.value))}
          style={{ width: 240 }}
        />
      </label>

      <div
        data-testid="adaptive-tabs-container"
        style={{ width: `min(${width}px, 100%)`, maxWidth: '100%' }}
      >
        <Tabs {...args} />
      </div>
    </div>
  );
}

export const AdaptiveOverflow: Story = {
  args: {
    items: adaptiveItems,
  },
  render: args => <AdaptiveOverflowDemo {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'Изменяйте ширину контейнера. Стрелки появляются автоматически только тогда, когда суммарная ширина Tab item перестает помещаться. Фиксированный breakpoint не используется.',
      },
    },
  },
};

export const Skeleton: Story = {
  args: { isLoading: true },
};

export const States: Story = {
  render: () => (
    <div>
      {[false, true].map(selected => (
        <div
          role="tablist"
          aria-label={selected ? 'Выбранные' : 'Невыбранные'}
          key={String(selected)}
          style={{ display: 'flex' }}
        >
          {(['default', 'hover', 'focused', 'pressed', 'disabled', 'skeleton'] as const).map(state => (
            <Tab key={state} selected={selected} state={state}>
              {state}
            </Tab>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const SkeletonWithElements: Story = {
  args: {
    isLoading: true,
    items: [
      { value: 'info', label: 'Документы', icon: 'doc-paper', badge: 12, content: '' },
      { value: 'settings', icon: 'gear', ariaLabel: 'Настройки', content: '' },
    ],
  },
};
