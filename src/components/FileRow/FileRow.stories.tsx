import { qualityDocs } from '../../docs/quality';
import { Fragment, useRef, useState, type ComponentProps, type PointerEvent, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { Chips } from '../Chips/Chips';
import { Link } from '../Link/Link';
import { fileRowDocs } from '../../docs/file-row';
import { FileRow } from './FileRow';

const menuItems = [
  { id: 'rename', title: 'Переименовать', leftIcon: 'pencil' as const },
  { id: 'delete', title: 'Удалить', leftIcon: 'trash' as const },
];

const reorderableRows = [
  { id: 'contract', fileName: 'Договор.pdf', weight: '2,7 МБ' },
  { id: 'application', fileName: 'Заявление.pdf', weight: '1,3 МБ' },
  { id: 'agreement', fileName: 'Согласие.pdf', weight: '1,4 МБ' },
];

function Example({ label, testId, children }: { label: string; testId?: string; children: ReactNode }) {
  return (
    <div data-testid={testId} style={{ display: 'grid', minWidth: 0, gap: 'var(--space-6)' }}>
      <span style={{ color: 'var(--text-base-secondary)', font: 'var(--page-caption)' }}>{label}</span>
      {children}
    </div>
  );
}

function ExampleGrid({ children }: { children: ReactNode }) {
  return <div style={{ display: 'grid', width: '100%', minWidth: 0, gap: 'var(--space-16)' }}>{children}</div>;
}

function ReorderableFileRows(args: ComponentProps<typeof FileRow>) {
  const [rows, setRows] = useState(reorderableRows);
  const listRef = useRef<HTMLDivElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const dragIndexRef = useRef<number | null>(null);
  const [dropSlot, setDropSlot] = useState<number | null>(null);
  const dropSlotRef = useRef<number | null>(null);

  const updateDragIndex = (index: number | null) => {
    dragIndexRef.current = index;
    setDragIndex(index);
  };

  const updateDropSlot = (slot: number | null) => {
    dropSlotRef.current = slot;
    setDropSlot(slot);
  };

  const clearReorderState = () => {
    updateDragIndex(null);
    updateDropSlot(null);
  };

  const moveRow = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= rows.length) return;
    setRows(current => {
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const getClientDropSlot = (clientY: number) => {
    const items = listRef.current?.querySelectorAll<HTMLElement>('[data-testid^="reorder-row-"]');
    if (!items?.length) return null;

    for (let index = 0; index < items.length; index += 1) {
      const rect = items[index].getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) return index;
    }

    return items.length;
  };

  const finishPointerReorder = (fromIndex: number, event: PointerEvent<HTMLButtonElement>) => {
    const slot = event.type === 'pointercancel' ? null : dropSlotRef.current;
    if (slot !== null) {
      moveRow(fromIndex, fromIndex < slot ? slot - 1 : slot);
    }
    clearReorderState();
  };

  const dropIndicator = (slot: number) =>
    dragIndex !== null && dropSlot === slot ? (
      <div className="fdoc-file-row-drop-indicator" data-testid="file-row-drop-indicator" aria-hidden="true" />
    ) : null;

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <span style={{ color: 'var(--text-base-secondary)', font: 'var(--page-caption)' }}>
        Тяни за drag handle слева. Перемещается вся строка; линия показывает новую позицию.
      </span>
      <div
        ref={listRef}
        style={{ display: 'flex', width: '100%', minWidth: 0, flexDirection: 'column', gap: 4 }}
        onDragOver={event => {
          if (dragIndex === null) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = 'move';
          updateDropSlot(getClientDropSlot(event.clientY));
        }}
        onDrop={event => {
          if (dragIndex === null) return;
          event.preventDefault();
          const slot = dropSlotRef.current;
          if (slot !== null) moveRow(dragIndex, dragIndex < slot ? slot - 1 : slot);
          clearReorderState();
        }}
      >
        {dropIndicator(0)}
        {rows.map((row, index) => (
          <Fragment key={row.id}>
            <div data-testid={`reorder-row-${row.id}`}>
              <FileRow
                {...args}
                reorderable
                fileName={row.fileName}
                weight={row.weight}
                onReorderDragStart={event => {
                  updateDragIndex(index);
                  updateDropSlot(null);
                  event.dataTransfer.effectAllowed = 'move';
                }}
                onReorderDragEnd={() => {
                  updateDragIndex(null);
                  updateDropSlot(null);
                }}
                onReorderPointerStart={() => {
                  updateDragIndex(index);
                  updateDropSlot(null);
                }}
                onReorderPointerMove={event => {
                  updateDropSlot(getClientDropSlot(event.clientY));
                }}
                onReorderPointerEnd={event => {
                  finishPointerReorder(index, event);
                }}
                onReorderKey={direction => moveRow(index, direction === 'up' ? index - 1 : index + 1)}
              />
            </div>
            {dropIndicator(index + 1)}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: 'Components/Elements/FileRow',
  component: FileRow,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: (fileRowDocs) + qualityDocs('FileRow') } },
  },
  args: {
    state: 'default',
    disabled: false,
    fileName: 'File name.png',
    weight: '2,7 МБ',
    reorderable: false,
    deletable: true,
  },
  argTypes: {
    state: { control: 'select', options: ['default', 'loading', 'disabled', 'skeleton'] },
    disabled: { control: 'boolean' },
    fileName: { control: 'text' },
    weight: { control: 'text' },
    reorderable: { control: 'boolean' },
    reorderDisabled: { control: 'boolean' },
    reorderTooltip: { control: 'text' },
    deletable: { control: 'boolean' },
    additionalContent: { control: false },
    trailingAction: { control: false },
    message: { control: false },
    leading: { control: false },
    leadingIcon: { control: 'text', description: 'Имя иконки Leading из библиотеки Icon.' },
    preview: { control: false },
    menuItems: { control: false },
    menuAriaLabel: { control: 'text', description: 'Доступное название кнопки меню файла.' },
    onDelete: { action: 'delete' },
    onMenuAction: { action: 'menuAction' },
    onReorderDragStart: { action: 'reorderDragStart' },
    onReorderDragEnd: { action: 'reorderDragEnd' },
    onReorderPointerStart: { action: 'reorderPointerStart' },
    onReorderPointerMove: { action: 'reorderPointerMove' },
    onReorderPointerEnd: { action: 'reorderPointerEnd' },
    onReorderKey: { action: 'reorderKey' },
  },
  decorators: [Story => (
    <div style={{ width: 'min(456px, calc(100vw - 32px))', maxWidth: '100%', minWidth: 0 }}>
      <Story />
    </div>
  )],
} satisfies Meta<typeof FileRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => <Example label="Default"><FileRow {...args} /></Example>,
};

export const LeadingContent: Story = {
  render: args => (
    <ExampleGrid>
      <Example label="Default icon"><FileRow {...args} /></Example>
      <Example label="Preview"><FileRow {...args} preview={<span style={{ display: 'block', width: '100%', height: '100%', background: 'var(--background-base-skeleton)' }} />} /></Example>
      <Example label="Preview + Warning"><FileRow {...args} preview={<span style={{ display: 'block', width: '100%', height: '100%', background: 'var(--background-base-skeleton)' }} />} message={{ type: 'warning', text: 'Warning text' }} /></Example>
      <Example label="Without Leading"><FileRow {...args} leading={false} /></Example>
    </ExampleGrid>
  ),
};

export const AdditionalContent: Story = {
  render: args => (
    <ExampleGrid>
      <Example label="Text / weight">
        <FileRow {...args} weight="2,7 МБ" />
      </Example>
      <Example label="Text / custom">
        <FileRow {...args} weight={undefined} additionalContent="Шаблон" />
      </Example>
      <Example label="Link">
        <FileRow
          {...args}
          weight={undefined}
          additionalContent={({ disabled }) => (
            <Link href="#" size="medium" color="accent" decoration={null} disabled={disabled}>Заполнить</Link>
          )}
        />
      </Example>
      <Example label="Button">
        <FileRow
          {...args}
          weight={undefined}
          additionalContent={({ disabled }) => (
            <Button size="small" color="secondary" disabled={disabled}>Открыть</Button>
          )}
        />
      </Example>
      <Example label="ButtonIcon">
        <FileRow
          {...args}
          weight={undefined}
          additionalContent={({ disabled }) => (
            <ButtonIcon aria-label="Подробнее" icon="more-vertical" size="xsmall" iconSize={24} className="fdoc-file-row__button-icon" color="neutral" disabled={disabled} />
          )}
        />
      </Example>
      <Example label="Badge / Primary" testId="file-row-example-badge">
        <FileRow
          {...args}
          weight={undefined}
          additionalContent={({ disabled }) => (
            <Badge
              data-testid="file-row-additional-badge"
              size="medium"
              color="primary"
              state={disabled ? 'disabled' : 'default'}
              text="PDF"
            />
          )}
        />
      </Example>
      <Example label="Chips / Base" testId="file-row-example-chips">
        <FileRow
          {...args}
          weight={undefined}
          additionalContent={({ disabled }) => (
            <Chips
              data-testid="file-row-additional-chips"
              text="На подпись"
              size="small"
              color="base"
              disabled={disabled}
              interactive={false}
            />
          )}
        />
      </Example>
    </ExampleGrid>
  ),
};

export const TrailingActions: Story = {
  render: args => (
    <ExampleGrid>
      <Example label="Delete / default">
        <FileRow {...args} deletable />
      </Example>
      <Example label="ButtonIcon / custom action">
        <FileRow {...args} deletable={false} trailingAction={({ disabled }) => <ButtonIcon aria-label="Открыть действия файла" icon="more-vertical" size="xsmall" iconSize={24} className="fdoc-file-row__button-icon" color="neutral" disabled={disabled} />} />
      </Example>
      <Example label="Link / custom action">
        <FileRow {...args} deletable={false} trailingAction={({ disabled }) => <Link href="#" size="medium" color="accent" decoration={null} disabled={disabled}>Открыть</Link>} />
      </Example>
    </ExampleGrid>
  ),
};

export const States: Story = {
  render: args => (
    <ExampleGrid>
      <Example label="Default"><FileRow {...args} state="default" /></Example>
      <Example label="Loading"><FileRow {...args} state="loading" /></Example>
      <Example label="Disabled"><FileRow {...args} disabled /></Example>
      <Example label="Loading + Disabled"><FileRow {...args} state="loading" disabled /></Example>
    </ExampleGrid>
  ),
};

export const Messages: Story = {
  render: args => (
    <ExampleGrid>
      <Example label="Error"><FileRow {...args} message={{ type: 'error', text: 'Error text' }} /></Example>
      <Example label="Warning"><FileRow {...args} message={{ type: 'warning', text: 'Warning text' }} /></Example>
      <Example label="Loading + Warning"><FileRow {...args} state="loading" message={{ type: 'warning', text: 'Warning text' }} /></Example>
      <Example label="Loading + Error"><FileRow {...args} state="loading" message={{ type: 'error', text: 'Error text' }} /></Example>
      <Example label="Disabled + Warning"><FileRow {...args} disabled message={{ type: 'warning', text: 'Warning text' }} /></Example>
      <Example label="Disabled + Error"><FileRow {...args} disabled message={{ type: 'error', text: 'Error text' }} /></Example>
    </ExampleGrid>
  ),
};

export const AdditionalContentDisabled: Story = {
  render: args => (
    <ExampleGrid>
      <Example label="Badge / Primary / Disabled" testId="file-row-example-badge-disabled">
        <FileRow
          {...args}
          disabled
          weight={undefined}
          additionalContent={({ disabled }) => (
            <Badge
              data-testid="file-row-additional-badge-disabled"
              size="medium"
              color="primary"
              state={disabled ? 'disabled' : 'default'}
              text="PDF"
            />
          )}
        />
      </Example>
      <Example label="Chips / Base / Disabled" testId="file-row-example-chips-disabled">
        <FileRow
          {...args}
          disabled
          weight={undefined}
          additionalContent={({ disabled }) => (
            <Chips
              data-testid="file-row-additional-chips-disabled"
              text="На подпись"
              size="small"
              color="base"
              disabled={disabled}
              interactive={false}
            />
          )}
        />
      </Example>
    </ExampleGrid>
  ),
};

export const Skeleton: Story = {
  args: { state: 'skeleton' },
  render: args => <Example label="Skeleton"><FileRow {...args} /></Example>,
};

export const Menu: Story = {
  args: { reorderable: true, deletable: false, menuItems },
  render: args => <Example label="Reorder handle + Menu"><FileRow {...args} /></Example>,
};

export const Reorderable: Story = {
  render: args => <Example label="Reorder / drag or ArrowUp and ArrowDown"><ReorderableFileRows {...args} /></Example>,
};

export const LongFileNameWithChips: Story = {
  render: args => <Example label="Long file name + Chips / Warning"><FileRow {...args} /></Example>,
  args: {
    fileName: 'Очень длинное название документа с приложениями и дополнительными материалами.pdf',
    weight: undefined,
    additionalContent: ({ disabled }) => (
      <Chips text="Требует ознакомления" size="small" color="warning" disabled={disabled} interactive={false} />
    ),
  },
};
