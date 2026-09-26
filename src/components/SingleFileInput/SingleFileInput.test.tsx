import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SingleFileInput } from './SingleFileInput';

describe('SingleFileInput', () => {
  it('passes the selected file to onFileChange', () => {
    const onFileChange = vi.fn();
    const { container } = render(<SingleFileInput onFileChange={onFileChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });

    fireEvent.change(input, { target: { files: [file] } });
    expect(onFileChange).toHaveBeenCalledWith(file);
  });

  it('shows error content and the error icon in Default', () => {
    render(<SingleFileInput error errorText="Ошибка файла" />);
    expect(screen.getByText('Ошибка файла')).toBeInTheDocument();
    expect(document.querySelector('[data-icon="filled/exclamation_circle_filled"]')).toBeInTheDocument();
  });

  it('keeps the disabled anatomy and does not render the upload button', () => {
    render(<SingleFileInput type="disabled" error errorText="Ошибка файла" />);
    expect(screen.getByText('Загрузка файлов недоступна')).toBeInTheDocument();
    expect(document.querySelector('[data-icon="doc-paper"]')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Загрузить' })).not.toBeInTheDocument();
  });

  it('uses ButtonIcon on mobile', () => {
    render(<SingleFileInput size="mobile" />);
    expect(screen.getByRole('button', { name: 'Загрузить' })).toHaveAttribute('data-button-icon-size', '32');
  });

  it('renders Skeleton without content', () => {
    render(<SingleFileInput type="skeleton" />);
    expect(screen.getByTestId('single-file-input-skeleton')).toBeInTheDocument();
    expect(screen.queryByText('Выберите файл')).not.toBeInTheDocument();
  });
});
