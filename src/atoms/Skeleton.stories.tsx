import type { Meta, StoryObj } from '@storybook/react-vite';
import { coreDocs } from '../docs/core-components';
import { qualityDocs } from '../docs/quality';
import { AsyncMultiselect } from '../components/AsyncMultiselect/AsyncMultiselect';
import { Autocomplete } from '../components/Autocomplete/Autocomplete';
import { AsyncAutocomplete } from '../components/Autocomplete/AsyncAutocomplete';
import { Badge } from '../components/Badge/Badge';
import { Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs';
import { Button } from '../components/Button/Button';
import { ButtonFAB } from '../components/ButtonFAB/ButtonFAB';
import { ButtonIcon } from '../components/ButtonIcon/ButtonIcon';
import { ButtonToggle } from '../components/ButtonToggle/ButtonToggle';
import { Chips } from '../components/Chips/Chips';
import { ChipsGroup } from '../components/Chips/ChipsGroup';
import { CodeInput } from '../components/CodeInput/CodeInput';
import { Dropzone } from '../components/Dropzone/Dropzone';
import { FileRow } from '../components/FileRow/FileRow';
import { Input } from '../components/Input/Input';
import { ItemRow } from '../components/ItemRow/ItemRow';
import { ButtonLink, Link } from '../components/Link/Link';
import { Menu } from '../components/Menu/Menu';
import { Multiselect } from '../components/Multiselect/Multiselect';
import { Pagination } from '../components/Pagination/Pagination';
import { PhoneInput } from '../components/PhoneInput/PhoneInput';
import { PriceInput } from '../components/PriceInput/PriceInput';
import { Search } from '../components/Search/Search';
import { Select } from '../components/Select/Select';
import { Checkbox, Radio, Switch } from '../components/SelectionControl/SelectionControl';
import { CheckboxGroup, RadioGroup, SwitchGroup } from '../components/SelectionControl/SelectionGroup';
import { SingleFileInput } from '../components/SingleFileInput/SingleFileInput';
import { Skeleton, type SkeletonShape, type SkeletonTextSize } from '../components/Skeleton/Skeleton';
import { Tabs } from '../components/Tabs/Tabs';
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
        story: 'Готовые skeleton-состояния компонентов дизайн-системы. Каждый пример ниже рендерится через публичный skeleton / state / isLoading API самого компонента; вручную из атома Skeleton эти примеры не собираются.',
      },
    },
  },
  render: () => {
    const selectionOptions = [
      { value: 'one', label: 'Первый вариант', description: 'Описание' },
      { value: 'two', label: 'Второй вариант' },
    ];
    const tabsItems = [
      { value: 'one', label: 'Первый раздел', content: '' },
      { value: 'two', label: 'Второй раздел', content: '' },
      { value: 'three', label: 'Третий раздел', content: '' },
    ];
    const breadcrumbItems = [
      { label: 'Документы', href: '#documents' },
      { label: 'Шаблоны', href: '#templates' },
      { label: 'Создание шаблона' },
    ];
    const chipOptions = [
      { value: 'all', text: 'Все документы' },
      { value: 'signed', text: 'Подписанные' },
    ];
    const menuItems = [
      { id: 'one', title: 'Первый пункт' },
      { id: 'two', title: 'Второй пункт' },
    ];

    const groups = [
      {
        title: 'Actions',
        examples: [
          { name: 'Button', view: <Button state="skeleton" skeletonWidth={132} /> },
          { name: 'ButtonIcon', view: <ButtonIcon aria-label="Действие" icon="plus" state="skeleton" /> },
          { name: 'ButtonFAB', view: <ButtonFAB aria-label="Создать" icon="plus" state="skeleton" position="inline" /> },
          {
            name: 'ButtonToggle',
            view: (
              <ButtonToggle
                aria-label="Период"
                options={[
                  { value: 'day', label: 'День' },
                  { value: 'week', label: 'Неделя' },
                ]}
                isLoading
              />
            ),
          },
          { name: 'Link', view: <Link href="#details" text="Подробнее" state="skeleton" /> },
          { name: 'ButtonLink', view: <ButtonLink text="Подробнее" state="skeleton" /> },
        ],
      },
      {
        title: 'Inputs',
        examples: [
          { name: 'Input', view: <Input label="Label" caption="Caption" skeleton /> },
          { name: 'Textarea', view: <Textarea label="Label" caption="Caption" skeleton /> },
          { name: 'Search', view: <Search label="Поиск" skeleton /> },
          { name: 'PriceInput', view: <PriceInput label="Сумма" skeleton /> },
          { name: 'PhoneInput', view: <PhoneInput label="Номер телефона" skeleton /> },
          { name: 'Select', view: <Select label="Label" options={[]} skeleton /> },
          { name: 'Autocomplete', view: <Autocomplete label="Label" data={[]} skeleton /> },
          {
            name: 'AsyncAutocomplete',
            view: <AsyncAutocomplete label="Label" data={[]} skeleton onFetch={() => undefined} />,
          },
          { name: 'Multiselect', view: <Multiselect label="Label" options={[]} skeleton /> },
          {
            name: 'AsyncMultiselect',
            view: <AsyncMultiselect label="Label" options={[]} skeleton onFetch={() => undefined} />,
          },
          { name: 'CodeInput', view: <CodeInput label="Код подтверждения" skeleton /> },
          { name: 'SingleFileInput', view: <SingleFileInput type="skeleton" /> },
          { name: 'Dropzone', view: <Dropzone state="skeleton" /> },
          { name: 'FileRow', view: <FileRow state="skeleton" /> },
        ],
      },
      {
        title: 'Selection',
        examples: [
          { name: 'Badge', view: <Badge state="skeleton" size="medium" /> },
          { name: 'Chips', view: <Chips text="Chips" state="skeleton" /> },
          {
            name: 'ChipsGroup',
            view: <ChipsGroup aria-label="Статусы" options={chipOptions} isLoading />,
          },
          { name: 'Checkbox', view: <Checkbox label="Checkbox" description="Описание" state="skeleton" /> },
          { name: 'Radio', view: <Radio label="Radio" description="Описание" state="skeleton" /> },
          { name: 'Switch', view: <Switch label="Switch" description="Описание" state="skeleton" /> },
          {
            name: 'CheckboxGroup',
            view: <CheckboxGroup label="CheckboxGroup" options={selectionOptions} state="skeleton" />,
          },
          {
            name: 'RadioGroup',
            view: <RadioGroup label="RadioGroup" options={selectionOptions} state="skeleton" />,
          },
          {
            name: 'SwitchGroup',
            view: <SwitchGroup label="SwitchGroup" options={selectionOptions} state="skeleton" />,
          },
          { name: 'ItemRow', view: <ItemRow title="Название пункта" state="skeleton" /> },
          { name: 'Menu', view: <Menu aria-label="Меню" items={menuItems} skeleton /> },
        ],
      },
      {
        title: 'Navigation',
        examples: [
          { name: 'Tabs', view: <Tabs aria-label="Разделы" items={tabsItems} isLoading /> },
          { name: 'Breadcrumbs', view: <Breadcrumbs items={breadcrumbItems} isLoading /> },
          {
            name: 'Pagination',
            view: <Pagination totalElements={400} size={10} page={1} isLoading />,
          },
        ],
      },
    ];

    return (
      <div style={{ display: 'grid', gap: 32, width: '100%' }}>
        {groups.map(group => (
          <section key={group.title} style={{ display: 'grid', gap: 16, minWidth: 0 }}>
            <Typography as="h3" variant="h3-heading">{group.title}</Typography>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
                gap: 24,
                width: '100%',
              }}
            >
              {group.examples.map(example => (
                <div
                  key={example.name}
                  data-testid={`component-skeleton-${example.name.toLocaleLowerCase()}`}
                  style={{ display: 'grid', alignContent: 'start', gap: 8, minWidth: 0 }}
                >
                  <Typography as="div" variant="caption" strong>{example.name}</Typography>
                  <div style={{ minWidth: 0, maxWidth: '100%', overflowX: 'auto', paddingBottom: 2 }}>
                    {example.view}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  },
};

export const FixedAndFluid: Story = {
  name: 'Fixed And Fluid Sizes',
  parameters: {
    docs: {
      description: {
        story: 'Показывает два способа задавать размеры Skeleton через width / height. Fixed использует конкретные значения в px и сохраняет заданную геометрию. Fluid использует относительную ширину и подстраивается под доступную ширину родителя.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', width: 'min(456px, 100%)', gap: 24 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <Typography as="div" variant="caption" strong>Fixed — фиксированный размер</Typography>
        <Typography as="div" variant="caption">
          width 160 px, height 32 px. Размер не зависит от ширины контейнера.
        </Typography>
        <Skeleton width={160} height={32} />
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        <Typography as="div" variant="caption" strong>Fluid — адаптивная ширина</Typography>
        <Typography as="div" variant="caption">
          width 100%, height 48 px. Skeleton занимает доступную ширину родителя.
        </Typography>
        <Skeleton width="100%" height={48} />
      </div>
    </div>
  ),
};
