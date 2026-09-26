import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MultipleFileInput } from './MultipleFileInput';

const files = [
  { fileName: 'Первый.pdf', weight: '2,7 МБ', type: 'uploaded' as const },
  { fileName: 'Второй.docx', type: 'template' as const },
];

describe('MultipleFileInput', () => {
  it('renders the Figma collapse summary and file rows', () => {
    render(<MultipleFileInput files={files} />);
    expect(screen.getByText('2 файлов')).toBeInTheDocument();
    expect(screen.getByText('Первый.pdf')).toBeInTheDocument();
    expect(screen.getByText('Второй.docx')).toBeInTheDocument();
  });

  it('renders file error count under the file count link', () => {
    render(<MultipleFileInput files={files} errorCount={1} />);
    expect(screen.getByText('Ошибки в файлах (1)')).toBeInTheDocument();
  });

  it('renders group-level error and total size in Group FileRow structure', () => {
    render(<MultipleFileInput files={files} groupErrorText="Превышен максимальный общий размер файлов" totalSize="8,1 МБ" />);
    expect(screen.getByTestId('multiple-file-input-group-error')).toHaveTextContent('Превышен максимальный общий размер файлов');
    expect(screen.getByText('Общий объем: 8,1 МБ')).toBeInTheDocument();
  });

  it('hides the file group when collapsed', () => {
    render(<MultipleFileInput files={files} collapsed />);
    expect(screen.queryByText('Первый.pdf')).not.toBeInTheDocument();
    expect(screen.getByText('2 файлов')).toBeInTheDocument();
  });

  it('calls collapse and delete actions', () => {
    const onToggleCollapse = vi.fn();
    const onDeleteAll = vi.fn();
    render(<MultipleFileInput files={files} onToggleCollapse={onToggleCollapse} onDeleteAll={onDeleteAll} />);
    fireEvent.click(screen.getByText('2 файлов'));
    fireEvent.click(screen.getByText('Удалить все'));
    expect(onToggleCollapse).toHaveBeenCalledOnce();
    expect(onDeleteAll).toHaveBeenCalledOnce();
  });
});
