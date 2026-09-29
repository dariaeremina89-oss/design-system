import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MultipleFileInput } from './MultipleFileInput';

const files = [
  { id: 'contract', fileName: 'Договор.pdf', weight: '2,7 МБ' },
  { id: 'form', fileName: 'Анкета.docx', additionalContent: 'Шаблон' },
  { id: 'application', fileName: 'Заявление.pdf', weight: '1,3 МБ' },
  { id: 'agreement', fileName: 'Согласие.pdf', weight: '1,4 МБ' },
];

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} МБ`;
};

function Interactive(args: any) {
  const [currentFiles, setCurrentFiles] = useState(args.files ?? files);
  const [collapsed, setCollapsed] = useState(args.collapsed ?? false);
  const inputRef = useRef<HTMLInputElement>(null);

  const removeAt = (index: number) => setCurrentFiles((current: any[]) => current.filter((_, i) => i !== index));
  const wired = currentFiles.map((file: any, index: number) => ({
    ...file,
    onDelete: () => removeAt(index),
    ...(args.withMenu && index === 0 ? {
      deletable: false,
      menuItems: [
        { id: 'rename', title: 'Переименовать', leftIcon: 'pencil' },
        { id: 'delete', title: 'Удалить', leftIcon: 'trash', onAction: () => removeAt(index) },
      ],
    } : {}),
  }));
  const add = (added: File[]) => setCurrentFiles((current: any[]) => [
    ...current,
    ...added.map(file => ({ id: `${file.name}-${file.lastModified}`, fileName: file.name, weight: formatFileSize(file.size) })),
  ]);

  return (
    <div className="fdoc-multiple-file-input-story">
      <input
        ref={inputRef}
        hidden
        type="file"
        multiple
        onChange={event => {
          add(Array.from(event.target.files ?? []));
          event.currentTarget.value = '';
        }}
      />
      <MultipleFileInput
        {...args}
        files={wired}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(value => !value)}
        onDeleteAll={() => setCurrentFiles([])}
        onChooseFiles={() => inputRef.current?.click()}
        onAddFiles={add}
        onReorder={(from: number, to: number) => setCurrentFiles((current: any[]) => {
          const next = [...current];
          const [moved] = next.splice(from, 1);
          next.splice(to, 0, moved);
          return next;
        })}
      />
    </div>
  );
}

const meta = {
  title: 'Components/Inputs/MultipleFileInput',
  component: MultipleFileInput,
  tags: ['autodocs', 'ready'],
  args: {
    files,
    showButtons: false,
    showDropzone: false,
    showCollapse: true,
    collapsed: false,
    errorCount: 0,
    totalSize: '8,1 МБ',
    reorderable: false,
  },
  render: args => <Interactive {...args} />,
} satisfies Meta<typeof MultipleFileInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Reorderable: Story = { args: { reorderable: true } };
export const WithMenu: Story = { args: { reorderable: true, withMenu: true } as any };
export const WithErrors: Story = {
  args: {
    errorCount: 1,
    files: [{ ...files[0], message: { type: 'error' as const, text: 'Файл слишком большой' } }, ...files.slice(1)],
  },
};
export const WithWarnings: Story = {
  args: {
    files: [{ ...files[0], message: { type: 'warning' as const, text: 'Проверьте содержимое файла' } }, ...files.slice(1)],
  },
};
export const GroupError: Story = { args: { groupErrorText: 'Превышен максимальный общий размер файлов' } };
export const WithDropzone: Story = { args: { showDropzone: true } };
export const Collapsed: Story = { args: { collapsed: true } };
export const Buttons: Story = { args: { showButtons: true, showDropzone: false } };
