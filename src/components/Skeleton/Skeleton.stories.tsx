import type { Meta, StoryObj } from '@storybook/react-vite';
import { qualityDocs } from '../../docs/quality';
import { coreDocs } from '../../docs/core-components';
import { Autocomplete } from '../Autocomplete/Autocomplete';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { ButtonFAB } from '../ButtonFAB/ButtonFAB';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { CodeInput } from '../CodeInput/CodeInput';
import { FileRow } from '../FileRow/FileRow';
import { Input } from '../Input/Input';
import { Multiselect } from '../Multiselect/Multiselect';
import { Select } from '../Select/Select';
import { SingleFileInput } from '../SingleFileInput/SingleFileInput';
import { Textarea } from '../Textarea/Textarea';
import { Typography } from '../Typography/Typography';
import { Skeleton, type SkeletonShape, type SkeletonTextSize } from './Skeleton';

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

export const Shapes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
      <Skeleton shape="rounded" width={120} height={32} data-testid="skeleton-rounded" />
      <Skeleton shape="circle" width={32} height={32} data-testid="skeleton-circle" />
      <Skeleton shape="icon" width={24} height={24} data-testid="skeleton-icon" />
      <Skeleton shape="text" width={120} textSize="body" data-testid="skeleton-text" />
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
          <Typography as="span" variant={size} data-testid={`typography-${size}`}>Пример текста</Typography>
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
      {
        name: 'Button',
        view: <Button state="skeleton" skeletonWidth={132} />,
      },
      {
        name: 'ButtonIcon',
        view: <ButtonIcon aria-label="Действие" icon="plus" state="skeleton" />,
      },
      {
        name: 'ButtonFAB',
        view: <ButtonFAB aria-label="Создать" icon="plus" state="skeleton" position="inline" />,
      },
      {
        name: 'Badge',
        view: <Badge state="skeleton" size="medium" />,
      },
      {
        name: 'Input',
        view: <Input label="Label" caption="Caption" skeleton />,
      },
      {
        name: 'Textarea',
        view: <Textarea label="Label" caption="Caption" skeleton />,
      },
      {
        name: 'Select',
        view: <Select label="Label" options={[]} skeleton />,
      },
      {
        name: 'Autocomplete',
        view: <Autocomplete label="Label" data={[]} skeleton />,
      },
      {
        name: 'Multiselect',
        view: <Multiselect label="Label" options={[]} skeleton />,
      },
      {
        name: 'CodeInput',
        view: <CodeInput label="Код подтверждения" skeleton />,
      },
      {
        name: 'FileRow',
        view: <FileRow state="skeleton" />,
      },
      {
        name: 'SingleFileInput',
        view: <SingleFileInput type="skeleton" />,
      },
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
        <div>Fixed 160 × 32</div>
        <Skeleton width={160} height={32} />
      </div>
      <div>
        <div>Fluid 100% × 48</div>
        <Skeleton width="100%" height={48} />
      </div>
    </div>
  ),
};
