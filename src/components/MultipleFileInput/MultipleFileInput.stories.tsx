import { qualityDocs } from '../../docs/quality';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { multipleFileInputDocs } from '../../docs/file-upload';
import { MultipleFileInput } from './MultipleFileInput';

const MB = 1024 * 1024;

const files = [
  { id: 'contract', fileName: 'Договор.pdf', weight: '2,7 МБ', sizeBytes: 2.7 * MB },
  { id: 'form', fileName: 'Анкета.docx', additionalContent: 'Шаблон', sizeBytes: 2.7 * MB },
  { id: 'application', fileName: 'Заявление.pdf', weight: '1,3 МБ', sizeBytes: 1.3 * MB },
  { id: 'agreement', fileName: 'Согласие.pdf', weight: '1,4 МБ', sizeBytes: 1.4 * MB },
];

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < MB) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / MB).toFixed(1).replace('.', ',')} МБ`;
};

function Interactive(args: any) {
  const [currentFiles, setCurrentFiles] = useState(args.files ?? files);
  const [collapsed, setCollapsed] = useState(args.collapsed ?? false);

  const removeAt = (index: number) => setCurrentFiles((current: any[]) => current.filter((_, i) => i !== index));
  const totalSize = formatFileSize(
    currentFiles.reduce((sum: number, file: any) => sum + (file.sizeBytes ?? 0), 0),
  );
  const wired = currentFiles.map((file: any, index: number) => {
    const { sizeBytes: _sizeBytes, ...row } = file;
    return {
      ...row,
      onDelete: () => removeAt(index),
      ...(args.withMenu && index === 0 ? {
        deletable: false,
        menuItems: [
          { id: 'rename', title: 'Переименовать', leftIcon: 'pencil' },
          { id: 'delete', title: 'Удалить', leftIcon: 'trash', onAction: () => removeAt(index) },
        ],
      } : {}),
    };
  });
  const add = (added: File[]) => setCurrentFiles((current: any[]) => [
    ...current,
    ...added.map(file => ({
      id: `${file.name}-${file.lastModified}`,
      fileName: file.name,
      weight: formatFileSize(file.size),
      sizeBytes: file.size,
    })),
  ]);

  return (
    <div className="fdoc-multiple-file-input-story">
      <MultipleFileInput
        {...args}
        files={wired}
        totalSize={args.totalSize ?? totalSize}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((value: boolean) => !value)}
        onDeleteAll={() => setCurrentFiles([])}
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
  parameters: {
    layout: 'padded',
    docs: { description: { component: (multipleFileInputDocs) + qualityDocs('MultipleFileInput') } },
  },
  args: {
    files,
    showButtons: false,
    showDropzone: false,
    showCollapse: true,
    collapsed: false,
    errorCount: 0,
    reorderable: false,
  },
  argTypes: {
    files: { control: false },
    showButtons: { control: 'boolean' },
    showDropzone: { control: 'boolean' },
    showCollapse: { control: 'boolean' },
    collapsed: { control: 'boolean' },
    errorCount: { control: 'number' },
    groupErrorText: { control: 'text' },
    totalSize: { control: 'text' },
    reorderable: { control: 'boolean' },
    actions: { control: false },
    dropzoneProps: { control: false },
    validation: { control: 'object' },
    onAddFiles: { action: 'addFiles' },
    onValidationError: { action: 'validationError' },
    onDeleteAll: { action: 'deleteAll' },
    onToggleCollapse: { action: 'toggleCollapse' },
    onChooseFiles: { action: 'chooseFiles' },
    onReorder: { action: 'reorder' },
  },
  render: args => <Interactive {...args} />,
} satisfies Meta<typeof MultipleFileInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Reorderable: Story = { args: { reorderable: true } };

export const TemplatesReorderable: Story = {
  args: {
    files: [
      {
        id: 'template-contract',
        fileName: 'Договор.docx',
        additionalContent: 'Шаблон',
        sizeBytes: 2.1 * MB,
        reorderable: true,
      },
      {
        id: 'template-application',
        fileName: 'Заявление.docx',
        additionalContent: 'Шаблон',
        sizeBytes: 1.8 * MB,
        reorderable: true,
      },
      {
        id: 'template-consent',
        fileName: 'Согласие.docx',
        additionalContent: 'Шаблон',
        sizeBytes: 1.2 * MB,
        reorderable: true,
      },
      {
        id: 'passport',
        fileName: 'Паспорт.pdf',
        weight: '2,7 МБ',
        sizeBytes: 2.7 * MB,
      },
      {
        id: 'attachment',
        fileName: 'Приложение.pdf',
        weight: '1,3 МБ',
        sizeBytes: 1.3 * MB,
      },
    ],
    reorderable: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Частичный reorder: менять порядок можно только у шаблонов в верхней части списка. Обычные документы ниже не имеют drag handle и не участвуют в перестановке.',
      },
    },
  },
};
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
export const GroupError: Story = { args: { groupErrorText: 'Файлы не добавлены — превышен общий размер' } };
export const WithDropzone: Story = { args: { showDropzone: true } };
export const Collapsed: Story = { args: { collapsed: true } };
export const Buttons: Story = { args: { showButtons: true, showDropzone: false } };
export const ButtonsWithValidation: Story = {
  args: {
    showButtons: true,
    showDropzone: false,
    validation: {
      formats: '.doc, .docx, .xls, .xlsx, .pdf, .jpg, .jpeg, .png',
      maxQuantity: 10,
      maxFileSize: '15 МБ',
      maxTotalSize: '50 МБ',
    },
  },
};
