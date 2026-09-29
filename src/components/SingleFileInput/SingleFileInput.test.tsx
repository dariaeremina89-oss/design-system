import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SingleFileInput } from './SingleFileInput';

describe('SingleFileInput', () => {
  it('switches from the picker to FileRow after selecting a file', () => {
    const onFileChange = vi.fn();
    const { container } = render(<SingleFileInput onFileChange={onFileChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(onFileChange).toHaveBeenCalledWith(file);
    expect(screen.getByTestId('file-row')).toBeInTheDocument();
    expect(screen.getByText('document.pdf')).toBeInTheDocument();
    expect(screen.getByText('7 Б')).toBeInTheDocument();
    expect(screen.queryByText('Выберите файл')).not.toBeInTheDocument();
  });

  it('clears an uncontrolled selected file through the FileRow delete action', () => {
    const onFileChange = vi.fn();
    const { container } = render(<SingleFileInput onFileChange={onFileChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: 'Удалить файл document.pdf' }));

    expect(onFileChange).toHaveBeenLastCalledWith(null);
    expect(screen.getByText('Выберите файл')).toBeInTheDocument();
    expect(screen.queryByTestId('file-row')).not.toBeInTheDocument();
  });

  it('uses FileRow Loading for the selected-file loading state', () => {
    render(
      <SingleFileInput
        fileRowProps={{ fileName: 'document.pdf', weight: '2,7 МБ', state: 'loading' }}
      />,
    );

    expect(screen.getByRole('progressbar', { name: 'Загрузка' })).toBeInTheDocument();
    expect(screen.getByText('document.pdf')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Удалить файл document.pdf' })).toBeInTheDocument();
  });

  it('combines a selected FileRow with Disabled', () => {
    render(
      <SingleFileInput
        type="disabled"
        fileRowProps={{ fileName: 'document.pdf', weight: '2,7 МБ', state: 'loading' }}
      />,
    );

    expect(screen.getByRole('progressbar', { name: 'Загрузка' })).toBeInTheDocument();
    expect(screen.getByTestId('file-row')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('button', { name: 'Удалить файл document.pdf' })).toBeDisabled();
  });

  it('maps selected-file Error to FileRow Message', () => {
    render(
      <SingleFileInput
        error
        errorText="Ошибка файла"
        fileRowProps={{ fileName: 'document.pdf', weight: '2,7 МБ' }}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Ошибка файла');
    expect(document.querySelector('[data-icon="filled/exclamation_circle_filled"]')).toBeInTheDocument();
  });

  it('shows error content and the error icon in the empty Default state', () => {
    render(<SingleFileInput error errorText="Ошибка файла" />);
    expect(screen.getByText('Ошибка файла')).toBeInTheDocument();
    expect(document.querySelector('[data-icon="filled/exclamation_circle_filled"]')).toBeInTheDocument();
  });

  it('keeps the disabled empty error anatomy and does not render the upload button', () => {
    render(<SingleFileInput type="disabled" error errorText="Ошибка файла" />);
    expect(screen.getByText('Загрузка файлов недоступна')).toBeInTheDocument();
    expect(document.querySelector('[data-icon="filled/exclamation_circle_filled"]')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Загрузить' })).not.toBeInTheDocument();
  });

  it('uses a 32px ButtonIcon on mobile', () => {
    render(<SingleFileInput size="mobile" />);
    expect(screen.getByRole('button', { name: 'Загрузить' })).toHaveAttribute('data-button-icon-size', '32');
  });

  it('renders Skeleton without content', () => {
    render(<SingleFileInput type="skeleton" />);
    expect(screen.getByTestId('single-file-input-skeleton')).toBeInTheDocument();
    expect(screen.queryByText('Выберите файл')).not.toBeInTheDocument();
  });
});
