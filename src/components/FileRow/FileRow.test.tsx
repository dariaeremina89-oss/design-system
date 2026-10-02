import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'jest-axe';
import { Badge } from '../Badge/Badge';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { Chips } from '../Chips/Chips';
import { Link } from '../Link/Link';
import { FileRow } from './FileRow';

describe('FileRow', () => {
  it('keeps delete available while loading and uses the shared spinner', () => {
    const onDelete = vi.fn();
    render(<FileRow state="loading" fileName="Договор.pdf" onDelete={onDelete} />);
    const progress = screen.getByRole('progressbar', { name: 'Загрузка' });
    expect(progress).toHaveAttribute('data-progress-color', 'primary');
    expect(progress.style.getPropertyValue('--fdoc-progress-duration')).toBe('1400ms');
    expect(screen.getByTestId('file-row')).toHaveAttribute('aria-busy', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Удалить файл Договор.pdf' }));
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it('combines Loading with Disabled without replacing the loader', () => {
    render(<FileRow state="loading" disabled fileName="Договор.pdf" deletable reorderable />);
    expect(screen.getByRole('progressbar', { name: 'Загрузка' })).toBeInTheDocument();
    expect(screen.getByTestId('file-row')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByTestId('file-row')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('button', { name: 'Изменить порядок файла Договор.pdf' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Удалить файл Договор.pdf' })).toBeDisabled();
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
    expect(container.querySelector('.fdoc-file-item__leading')).not.toBeInTheDocument();
  });

  it('keeps Additional content independent from state and disables state-aware actions', () => {
    const { rerender } = render(<FileRow additionalContent="Шаблон" />);
    expect(screen.getByText('Шаблон')).toBeInTheDocument();

    rerender(
      <FileRow
        disabled
        additionalContent={({ disabled }) => <Link href="#" disabled={disabled}>Заполнить</Link>}
      />,
    );
    expect(screen.getByRole('link', { name: 'Заполнить' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('keeps Badge and Chips as their own components inside Additional content', () => {
    const { rerender } = render(
      <FileRow
        fileName="Договор.pdf"
        additionalContent={({ disabled }) => (
          <Badge size="medium" color="secondary" state={disabled ? 'disabled' : 'default'} text="PDF" />
        )}
      />,
    );

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('data-badge-size', 'medium');
    expect(badge).toHaveAttribute('data-badge-state', 'default');
    expect(badge.closest('.fdoc-file-item__additional')).toBeInTheDocument();

    rerender(
      <FileRow
        disabled
        fileName="Договор.pdf"
        additionalContent={({ disabled }) => (
          <Chips text="На подпись" size="small" color="secondary" disabled={disabled} interactive />
        )}
      />,
    );

    const chips = screen.getByTestId('chips');
    expect(chips).toHaveClass('fdoc-chips--small');
    expect(screen.getByRole('button', { name: 'На подпись' })).toBeDisabled();
    expect(chips.closest('.fdoc-file-item__additional')).toBeInTheDocument();
  });

  it('accepts arbitrary child components in Additional and Trailing slots', () => {
    render(
      <FileRow
        fileName="Договор.pdf"
        additionalContent={({ disabled }) => (
          <Chips text="На подпись" interactive disabled={disabled} />
        )}
        trailingAction={({ disabled }) => (
          <ButtonIcon aria-label="Открыть действия файла" icon="more-vertical" size="xsmall" color="neutral" disabled={disabled} />
        )}
      />,
    );

    expect(screen.getByRole('button', { name: 'На подпись' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Открыть действия файла' })).toBeEnabled();
  });

  it('exposes stable FileItem slot selectors', () => {
    render(
      <FileRow
        fileName="Договор.pdf"
        additionalContent="2,7 МБ"
        trailingAction={<ButtonIcon aria-label="Действия" icon="more-vertical" size="xsmall" color="neutral" />}
        message={{ type: 'warning', text: 'Проверьте файл' }}
      />,
    );

    const row = screen.getByTestId('file-row');
    expect(row.querySelector('[data-file-item-slot="name"]')).toHaveTextContent('Договор.pdf');
    expect(row.querySelector('[data-file-item-slot="leading"]')).toBeInTheDocument();
    expect(row.querySelector('[data-file-item-slot="additional"]')).toHaveTextContent('2,7 МБ');
    expect(row.querySelector('[data-file-item-slot="trailing"]')).toBeInTheDocument();
    expect(row.querySelector('[data-file-item-slot="message"]')).toHaveTextContent('Проверьте файл');
  });

  it('drags only by the reorder handle, uses the whole row as drag image and supports keyboard reorder', () => {
    const onReorderKey = vi.fn();
    const onReorderDragStart = vi.fn();
    const onReorderDragEnd = vi.fn();
    const setDragImage = vi.fn();
    const setData = vi.fn();
    const dataTransfer = {
      effectAllowed: 'none',
      setDragImage,
      setData,
    } as unknown as DataTransfer;

    const { container } = render(
      <FileRow
        fileName="Договор.pdf"
        reorderable
        onReorderKey={onReorderKey}
        onReorderDragStart={onReorderDragStart}
        onReorderDragEnd={onReorderDragEnd}
      />,
    );
    const row = screen.getByTestId('file-row');
    const handle = screen.getByTestId('file-row-reorder-handle');

    expect(row).not.toHaveAttribute('draggable', 'true');
    expect(handle).toHaveAttribute('draggable', 'true');
    expect(handle).toHaveAttribute('aria-keyshortcuts', 'ArrowUp ArrowDown');

    fireEvent.dragStart(handle, { dataTransfer, clientX: 10, clientY: 10 });
    expect(setDragImage).toHaveBeenCalledOnce();
    expect(setDragImage.mock.calls[0][0]).toHaveClass('fdoc-file-row__drag-preview');
    expect(setData).toHaveBeenCalledWith('text/plain', 'Договор.pdf');
    expect(onReorderDragStart).toHaveBeenCalledOnce();
    expect(row).toHaveAttribute('data-file-row-dragging', 'true');

    fireEvent.dragEnd(handle, { dataTransfer });
    expect(onReorderDragEnd).toHaveBeenCalledOnce();
    expect(row).not.toHaveAttribute('data-file-row-dragging');

    fireEvent.keyDown(handle, { key: 'ArrowUp' });
    fireEvent.keyDown(handle, { key: 'ArrowDown' });
    expect(onReorderKey).toHaveBeenNthCalledWith(1, 'up');
    expect(onReorderKey).toHaveBeenNthCalledWith(2, 'down');
    expect(container.querySelector('[data-icon="drag-dot"]')).toBeInTheDocument();
  });

  it('disables reorder and standard actions independently from row content', () => {
    render(<FileRow disabled fileName="Договор.pdf" reorderable deletable />);
    expect(screen.getByTestId('file-row-reorder-handle')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Удалить файл Договор.pdf' })).toBeDisabled();
  });

  it('keeps state="disabled" as a backward-compatible alias', () => {
    render(<FileRow state="disabled" fileName="Договор.pdf" deletable />);
    expect(screen.getByTestId('file-row')).toHaveAttribute('aria-disabled', 'true');
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

  it.each([false, true])('keeps slot accessibility and disabled state consistent (disabled=%s)', async disabled => {
    const { container } = render(
      <FileRow
        fileName="Договор.pdf"
        disabled={disabled}
        reorderable
        deletable
        message={{ type: 'warning', text: 'Проверьте документ' }}
        additionalContent={({ disabled: inactive }) => <>
          <Badge text="PDF" state={inactive ? 'disabled' : 'default'} />
          <Chips text="На подпись" interactive disabled={inactive} />
        </>}
      />,
    );
    expect(screen.getByTestId('badge')).toHaveAttribute('data-badge-state', disabled ? 'disabled' : 'default');
    expect(screen.getByTestId('chips')).toHaveAttribute('data-state', disabled ? 'disabled' : 'default');
    expect(screen.getByRole('button', { name: 'На подпись' }).hasAttribute('disabled')).toBe(disabled);
    expect((await axe(container)).violations).toEqual([]);
  });

  it('renders Skeleton without row content or actions', () => {
    render(<FileRow state="skeleton" deletable reorderable />);
    expect(screen.getByTestId('file-row-skeleton')).toBeInTheDocument();
    expect(screen.queryByText('File name.png')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
