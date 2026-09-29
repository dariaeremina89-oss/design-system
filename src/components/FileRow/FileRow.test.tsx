import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Link } from '../Link/Link';
import { FileRow } from './FileRow';

describe('FileRow', () => {
  it('keeps delete available while loading and uses the Figma spinner', () => {
    const onDelete = vi.fn();
    render(<FileRow state="loading" fileName="Договор.pdf" onDelete={onDelete} />);
    const progress = screen.getByRole('progressbar', { name: 'Загрузка' });
    expect(progress).toHaveAttribute('data-progress-color', 'primary');
    expect(progress.style.getPropertyValue('--fdoc-progress-duration')).toBe('2000ms');
    expect(screen.getByTestId('file-row')).toHaveAttribute('aria-busy', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Удалить файл Договор.pdf' }));
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it('renders Error and Warning as one semantic Message API', () => {
    const { rerender } = render(<FileRow message={{ type: 'error', text: 'Ошибка файла' }} />);
    expect(document.querySelector('[data-icon="filled/exclamation_circle_filled"]')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Ошибка файла');
    expect(screen.getByTestId('file-row')).toHaveAttribute('aria-describedby', screen.getByRole('alert').id);

    rerender(<FileRow message={{ type: 'warning', text: 'Проверьте файл' }} />);
    expect(document.querySelector('[data-icon="exclamation_triangle"]')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Проверьте файл');
  });

  it('keeps loader and preview instead of replacing special Leading with a Message icon', () => {
    const { rerender } = render(<FileRow state="loading" message={{ type: 'error', text: 'Ошибка' }} />);
    expect(screen.getByRole('progressbar', { name: 'Загрузка' })).toBeInTheDocument();
    expect(document.querySelector('[data-icon="filled/exclamation_circle_filled"]')).not.toBeInTheDocument();

    rerender(<FileRow preview={<span data-testid="preview">preview</span>} message={{ type: 'warning', text: 'Проверьте' }} />);
    expect(screen.getByTestId('preview')).toBeInTheDocument();
    expect(document.querySelector('[data-icon="exclamation_triangle"]')).not.toBeInTheDocument();
  });

  it('supports optional Leading without reserving its slot', () => {
    const { container } = render(<FileRow leading={false} />);
    expect(container.querySelector('.fdoc-file-row__leading')).not.toBeInTheDocument();
  });

  it('keeps Additional content independent from state and disables state-aware actions', () => {
    const { rerender } = render(<FileRow additionalContent="Шаблон" />);
    expect(screen.getByText('Шаблон')).toBeInTheDocument();

    rerender(
      <FileRow
        state="disabled"
        additionalContent={({ disabled }) => <Link href="#" disabled={disabled}>Заполнить</Link>}
      />,
    );
    expect(screen.getByRole('link', { name: 'Заполнить' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('drags only by the reorder handle and supports keyboard reorder', () => {
    const onReorderKey = vi.fn();
    const { container } = render(<FileRow fileName="Договор.pdf" reorderable onReorderKey={onReorderKey} />);
    const row = screen.getByTestId('file-row');
    const handle = screen.getByRole('button', { name: 'Изменить порядок файла Договор.pdf' });

    expect(row).not.toHaveAttribute('draggable', 'true');
    expect(handle).toHaveAttribute('draggable', 'true');
    expect(handle).toHaveAttribute('aria-keyshortcuts', 'ArrowUp ArrowDown');
    fireEvent.keyDown(handle, { key: 'ArrowUp' });
    fireEvent.keyDown(handle, { key: 'ArrowDown' });
    expect(onReorderKey).toHaveBeenNthCalledWith(1, 'up');
    expect(onReorderKey).toHaveBeenNthCalledWith(2, 'down');
    expect(container.querySelector('[data-icon="drag-dot"]')).toBeInTheDocument();
  });

  it('disables reorder and standard actions in Disabled', () => {
    render(<FileRow state="disabled" fileName="Договор.pdf" reorderable deletable />);
    expect(screen.getByRole('button', { name: 'Изменить порядок файла Договор.pdf' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Удалить файл Договор.pdf' })).toBeDisabled();
  });

  it('opens action menu with contextual accessible name', () => {
    const onDelete = vi.fn();
    const items = [{ id: 'rename', title: 'Переименовать' }, { id: 'delete', title: 'Удалить', onAction: onDelete }];
    render(<FileRow fileName="Договор.pdf" menuItems={items} />);
    fireEvent.click(screen.getByRole('button', { name: 'Действия с файлом Договор.pdf' }));
    expect(screen.getByText('Переименовать')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Удалить'));
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it('renders Skeleton without row content or actions', () => {
    render(<FileRow state="skeleton" deletable reorderable />);
    expect(screen.getByTestId('file-row-skeleton')).toBeInTheDocument();
    expect(screen.queryByText('File name.png')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
