import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MultipleFileInput } from './MultipleFileInput';

const files = [
  { fileName: 'Договор.pdf', weight: '2,7 МБ', type: 'uploaded' as const },
  { fileName: 'Анкета.docx', type: 'template' as const },
  { fileName: 'Очень-длинное-название-файла-которое-должно-корректно-переноситься-без-поломки-верстки.pdf', weight: '4,1 МБ', type: 'uploaded' as const },
];

function Interactive(args: any) {
  const [currentFiles, setCurrentFiles] = useState(args.files ?? files);
  const [collapsed, setCollapsed] = useState(args.collapsed ?? false);
  const inputRef = useRef<HTMLInputElement>(null);
  const removeAt = (index: number) => setCurrentFiles((current: any[]) => current.filter((_, i) => i !== index));
  const wired = currentFiles.map((file: any, index: number) => ({ ...file, onDelete: () => removeAt(index), ...(args.withMenu && index === 0 ? { deletable: false, menuItems: [{ id: 'rename', title: 'Переименовать', leftIcon: 'pencil' }, { id: 'delete', title: 'Удалить', leftIcon: 'trash', onAction: () => removeAt(index) }] } : {}) }));
  const add = (added: File[]) => setCurrentFiles((current: any[]) => [...current, ...added.map(file => ({ fileName: file.name, type: 'uploaded' as const }))]);
  return <><input ref={inputRef} hidden type="file" multiple onChange={e => { add(Array.from(e.target.files ?? [])); e.currentTarget.value = ''; }} /><MultipleFileInput {...args} files={wired} collapsed={collapsed} onToggleCollapse={() => setCollapsed(v => !v)} onDeleteAll={() => setCurrentFiles([])} onChooseFiles={() => inputRef.current?.click()} onAddFiles={add} onReorder={(from: number, to: number) => setCurrentFiles((current: any[]) => { const next = [...current]; const [moved] = next.splice(from, 1); next.splice(to, 0, moved); return next; })} /></>;
}

const meta = {
  title: 'Components/Inputs/MultipleFileInput',
  component: MultipleFileInput,
  tags: ['autodocs', 'ready'],
  args: { files, showButtons: false, showDropzone: false, showCollapse: true, collapsed: false, errorCount: 0, totalSize: undefined, reorderable: false },
  render: args => <Interactive {...args} />,
} satisfies Meta<typeof MultipleFileInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Reorderable: Story = { args: { reorderable: true } };
export const WithMenu: Story = { args: { reorderable: true, withMenu: true } as any };
export const WithErrors: Story = { args: { errorCount: 1, files: [{ ...files[0], error: true, errorText: 'Файл слишком большой' }, ...files.slice(1)] } };
export const GroupError: Story = { args: { groupErrorText: 'Превышен максимальный общий размер файлов', totalSize: '8,1 МБ' } };
export const WithDropzone: Story = { args: { showDropzone: true } };
export const Collapsed: Story = { args: { collapsed: true } };
export const Buttons: Story = { args: { showButtons: true, showDropzone: false } };
