import type { Meta, StoryObj } from '@storybook/react-vite';
import { coreDocs } from '../docs/core-components';
import { qualityDocs } from '../docs/quality';
import { Autocomplete } from '../components/Autocomplete/Autocomplete';
import { Badge } from '../components/Badge/Badge';
import { Button } from '../components/Button/Button';
import { ButtonFAB } from '../components/ButtonFAB/ButtonFAB';
import { ButtonIcon } from '../components/ButtonIcon/ButtonIcon';
import { CodeInput } from '../components/CodeInput/CodeInput';
import { FileRow } from '../components/FileRow/FileRow';
import { Input } from '../components/Input/Input';
import { Multiselect } from '../components/Multiselect/Multiselect';
import { Select } from '../components/Select/Select';
import { SingleFileInput } from '../components/SingleFileInput/SingleFileInput';
import { Skeleton, type SkeletonShape, type SkeletonTextSize } from '../components/Skeleton/Skeleton';
import { Textarea } from '../components/Textarea/Textarea';
import { Typography } from '../components/Typography/Typography';

const textSizes: Exclude<SkeletonTextSize, 'inherit'>[] = [
  'h0-heading',
  'h1-heading',
  'h2-heading',
  'h3-heading',
  'subtitle',
  'body',
  'caption',
  'overline',
  'code',
];

const meta = {
  title: 'Components/Elements/Skeleton',
  id: 'atoms-skeleton',
  component: Skeleton,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: coreDocs('Skeleton') + qualityDocs('Skeleton'),
      },
    },
  },
  args: {
    shape: 'rounded',
    width: 120,
    height: 32,
  },
  argTypes: {
    shape: { control: 'select', options: ['text', 'rounded', 'circle', 'icon'] satisfies SkeletonShape[] },
    width: { control: 'text', description: 'Ширина Skeleton: фиксированная или fluid.' },
    height: { control: 'text', description: 'Высота Skeleton: фиксированная или fluid.' },
    textSize: { control: 'select', options: [...textSizes, 'inherit'] },
    'data-testid': { control: 'text', description: 'Стабильный selector для автотестов.' },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: 'По одному примеру каждой формы Skeleton. Полная матрица текстовых размеров вынесена отдельно в Text Styles.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', width: 'min(456px, 100%)', gap: 16 }}>
      {[
        { name: 'Text', view: <Skeleton width={160} shape="text" textSize="body" /> },
        { name: 'Rounded', view: <Skeleton width={160} height={32} shape="rounded" /> },
        { name: 'Circle', view: <Skeleton width={48} height={48} shape="circle" /> },
        { name: 'Icon', view: <Skeleton width={24} height={24} shape="icon" /> },
      ].map(item => (
        <div
          key={item.name}
          style={{
            display: 'grid',
            gridTemplateColumns: '88px minmax(0, 1fr)',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <Typography as="span" variant="caption" strong>{item.name}</Typography>
          <div>{item.view}</div>
        </div>
      ))}
    </div>
  ),
};

export const TextStyles: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Слева показан реальный Typography, справа — текстовый Skeleton того же стиля. Высота строки Skeleton синхронизирована с line-height соответствующего page style.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', width: 'min(760px, 100%)', gap: 12 }}>
      <div
        aria-hidden="true"
        style={{
          display: 'grid',
          gridTemplateColumns: '104px minmax(0, 1fr) minmax(0, 1fr)',
          gap: 12,
          color: 'var(--text-base-secondary)',
        }}
      >
        <Typography as="span" variant="caption" strong>Style</Typography>
        <Typography as="span" variant="caption" strong>Typography</Typography>
        <Typography as="span" variant="caption" strong>Skeleton</Typography>
      </div>
      {textSizes.map(size => (
        <div
          key={size}
          style={{
            display: 'grid',
            gridTemplateColumns: '104px minmax(0, 1fr) minmax(0, 1fr)',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <code style={{ overflowWrap: 'anywhere' }}>{size}</code>
          <Typography as="span" variant={size} data-testid={`typography-${size}`}>Текст</Typography>
          <Skeleton
            shape="text"
            width="100%"
            textSize={size}
            data-testid={`skeleton-${size}`}
          />
        </div>
      ))}
    </div>
  ),
};

export const ComponentSkeletonStates: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Skeleton-состояния составных компонентов. Каждый пример использует публичный skeleton API самого компонента, а не отдельную декоративную заглушку в story.',
      },
    },
  },
  render: () => {
    const examples = [
      { name: 'Button', view: <Button state="skeleton" skeletonWidth={132} /> },
      { name: 'ButtonIcon', view: <ButtonIcon aria-label="Действие" icon="plus" state="skeleton" /> },
      { name: 'ButtonFAB', view: <ButtonFAB aria-label="Создать" icon="plus" state="skeleton" position="inline" /> },
      { name: 'Badge', view: <Badge state="skeleton" size="medium" /> },
      { name: 'Input', view: <Input label="Label" caption="Caption" skeleton /> },
      { name: 'Textarea', view: <Textarea label="Label" caption="Caption" skeleton /> },
      { name: 'Select', view: <Select label="Label" options={[]} skeleton /> },
      { name: 'Autocomplete', view: <Autocomplete label="Label" data={[]} skeleton /> },
      { name: 'Multiselect', view: <Multiselect label="Label" options={[]} skeleton /> },
      { name: 'CodeInput', view: <CodeInput label="Код подтверждения" skeleton /> },
      { name: 'FileRow', view: <FileRow state="skeleton" /> },
      { name: 'SingleFileInput', view: <SingleFileInput type="skeleton" /> },
    ];

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 24,
          width: '100%',
        }}
      >
        {examples.map(example => (
          <div
            key={example.name}
            data-testid={`component-skeleton-${example.name.toLocaleLowerCase()}`}
            style={{ display: 'grid', alignContent: 'start', gap: 8, minWidth: 0 }}
          >
            <Typography as="div" variant="caption" strong>{example.name}</Typography>
            <div style={{ minWidth: 0 }}>{example.view}</div>
          </div>
        ))}
      </div>
    );
  },
};

export const FixedAndFluid: Story = {
  render: () => (
    <div style={{ display: 'grid', width: 'min(456px, 100%)', gap: 16 }}>
      <div>
        <Typography as="div" variant="caption">Fixed 160 × 32</Typography>
        <Skeleton width={160} height={32} />
      </div>
      <div>
        <Typography as="div" variant="caption">Fluid 100% × 48</Typography>
        <Skeleton width="100%" height={48} />
      </div>
    </div>
  ),
};
