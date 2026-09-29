import { useState, type DragEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileRow } from './FileRow';

const menuItems = [
  { id: 'rename', title: 'Переименовать', leftIcon: 'pencil' as const },
  { id: 'delete', title: 'Удалить', leftIcon: 'trash' as const },
];

const draggableRows = [
  { id: 'contract', fileName: 'Договор.pdf', weight: '2,7 МБ' },
  { id: 'application', fileName: 'Заявление.pdf', weight: '1,3 МБ' },
  { id: 'agreement', fileName: 'Согласие.pdf', weight: '1,4 МБ' },
];

function DraggableFileRows(args: React.ComponentProps<typeof FileRow>) {
  const [rows, setRows] = useState(draggableRows);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const moveRow = (toIndex: number) => {
    if (dragIndex === null || dragIndex === toIndex) return;
    setRows(current => {
      const next = [...current];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    setDragIndex(null);
  };

  return (
    <div style={{ display: 'flex', width: '100%', minWidth: 0, flexDirection: 'column', gap: 4 }}>
      {rows.map((row, index) => (
        <FileRow
          {...args}
          key={row.id}
          type="uploaded"
          draggable
          fileName={row.fileName}
          weight={row.weight}
          onDragStart={(event: DragEvent<HTMLDivElement>) => {
            setDragIndex(index);
            event.dataTransfer.effectAllowed = 'move';
          }}
          onDragOver={event => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
          }}
          onDrop={event => {
            event.preventDefault();
            moveRow(index);
          }}
          onDragEnd={() => setDragIndex(null)}
        />
      ))}
    </div>
  );
}

const meta = {
  title: 'Components/Elements/FileRow',
  component: FileRow,
  tags: ['autodocs', 'ready'],
  args: {
    type: 'uploaded',
    fileName: 'File name.png',
    weight: '2,7 МБ',
    error: false,
    errorText: 'Ошибка в файле',
    draggable: false,
    deletable: true,
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['loading', 'uploaded', 'uploaded-preview', 'disabled', 'template', 'template-edit', 'skeleton'],
    },
  },
  decorators: [Story => <div style={{ width: '100%', minWidth: 0 }}><Story /></div>],
} satisfies Meta<typeof FileRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Uploaded: Story = {};
export const Loading: Story = { args: { type: 'loading' } };
export const LoadingError: Story = { args: { type: 'loading', error: true } };
export const Error: Story = { args: { error: true } };
export const Draggable: Story = { render: args => <DraggableFileRows {...args} /> };
export const Menu: Story = { args: { draggable: true, deletable: false, menuItems } };
export const UploadedPreview: Story = { args: { type: 'uploaded-preview' } };
export const Template: Story = { args: { type: 'template', fileName: 'File name' } };
export const TemplateEdit: Story = { args: { type: 'template-edit', fileName: 'File name' } };
export const Disabled: Story = { args: { type: 'disabled' } };
export const DisabledError: Story = { args: { type: 'disabled', error: true } };
export const Skeleton: Story = { args: { type: 'skeleton' } };
