import { Fragment, useState, type ComponentProps, type DragEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from '../Link/Link';
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

function ReorderableFileRows(args: ComponentProps<typeof FileRow>) {
  const [rows, setRows] = useState(reorderableRows);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropSlot, setDropSlot] = useState<number | null>(null);

  const moveRow = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= rows.length) return;
    setRows(current => {
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const getDropSlot = (event: DragEvent<HTMLDivElement>, index: number) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return event.clientY < rect.top + rect.height / 2 ? index : index + 1;
  };

  const dropIndicator = (slot: number) =>
    dragIndex !== null && dropSlot === slot ? (
      <div className="fdoc-file-row-drop-indicator" aria-hidden="true" />
    ) : null;

  return (
    <div style={{ display: 'flex', width: '100%', minWidth: 0, flexDirection: 'column', gap: 4 }}>
      {dropIndicator(0)}
      {rows.map((row, index) => (
        <Fragment key={row.id}>
          <div
            onDragOver={(event: DragEvent<HTMLDivElement>) => {
              if (dragIndex !== null) {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'move';
                setDropSlot(getDropSlot(event, index));
              }
            }}
            onDrop={(event: DragEvent<HTMLDivElement>) => {
              if (dragIndex !== null) {
                event.preventDefault();
                const slot = getDropSlot(event, index);
                const toIndex = dragIndex < slot ? slot - 1 : slot;
                moveRow(dragIndex, toIndex);
                setDragIndex(null);
                setDropSlot(null);
              }
            }}
          >
            <FileRow
              {...args}
              reorderable
              fileName={row.fileName}
              weight={row.weight}
              onReorderDragStart={event => {
                setDragIndex(index);
                setDropSlot(null);
                event.dataTransfer.effectAllowed = 'move';
              }}
              onReorderDragEnd={() => {
                setDragIndex(null);
                setDropSlot(null);
              }}
              onReorderKey={direction => moveRow(index, direction === 'up' ? index - 1 : index + 1)}
            />
          </div>
          {dropIndicator(index + 1)}
        </Fragment>
      ))}
    </div>
  );
}

const meta = {
  title: 'Components/Elements/FileRow',
  component: FileRow,
  tags: ['autodocs', 'ready'],
  args: {
    state: 'default',
    fileName: 'File name.png',
    weight: '2,7 МБ',
    reorderable: false,
    deletable: true,
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'loading', 'disabled', 'skeleton'],
    },
  },
  decorators: [Story => <div style={{ width: '100%', minWidth: 0 }}><Story /></div>],
} satisfies Meta<typeof FileRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Loading: Story = { args: { state: 'loading' } };
export const LoadingWithError: Story = {
  args: { state: 'loading', message: { type: 'error', text: 'Error text' } },
};
export const Error: Story = { args: { message: { type: 'error', text: 'Error text' } } };
export const Warning: Story = { args: { message: { type: 'warning', text: 'Warning text' } } };
export const Preview: Story = {
  args: { preview: <span style={{ display: 'block', width: '100%', height: '100%', background: 'var(--background-base-skeleton)' }} /> },
};
export const PreviewWithWarning: Story = {
  args: {
    preview: <span style={{ display: 'block', width: '100%', height: '100%', background: 'var(--background-base-skeleton)' }} />,
    message: { type: 'warning', text: 'Warning text' },
  },
};
export const WithoutLeading: Story = { args: { leading: false } };
export const AdditionalText: Story = { args: { weight: undefined, additionalContent: 'Шаблон' } };
export const AdditionalAction: Story = {
  args: {
    weight: undefined,
    additionalContent: ({ disabled }) => (
      <Link href="#" size="medium" color="accent" decoration={null} disabled={disabled}>
        Заполнить
      </Link>
    ),
  },
};
export const Reorderable: Story = { render: args => <ReorderableFileRows {...args} /> };
export const Menu: Story = { args: { reorderable: true, deletable: false, menuItems } };
export const Disabled: Story = { args: { state: 'disabled' } };
export const DisabledWithMessage: Story = {
  args: { state: 'disabled', message: { type: 'error', text: 'Error text' } },
};
export const Skeleton: Story = { args: { state: 'skeleton' } };
