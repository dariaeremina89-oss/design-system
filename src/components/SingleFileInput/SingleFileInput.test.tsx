import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SingleFileInput } from './SingleFileInput';

describe('SingleFileInput', () => {
  it('opens the native file picker from the desktop button', () => {
    const click = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => undefined);
    render(<SingleFileInput />);

    fireEvent.click(screen.getByRole('button', { name: 'Загрузить' }));

    expect(click).toHaveBeenCalledOnce();
    click.mockRestore();
  });

  it('opens the native file picker from the mobile ButtonIcon', () => {
    const click = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => undefined);
    render(<SingleFileInput size="mobile" />);

    fireEvent.click(screen.getByRole('button', { name: 'Загрузить' }));

    expect(click).toHaveBeenCalledOnce();
    click.mockRestore();
  });

  it('keeps SingleFileInput as the component after selecting a file and reuses shared file-item layout', () => {
    const onFileChange = vi.fn();
    const { container } = render(<SingleFileInput onFileChange={onFileChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(onFileChange).toHaveBeenCalledWith(file);
    const root = screen.getByTestId('single-file-input');
    expect(root).toHaveClass('fdoc-single-file-input--filled');
    expect(root).toHaveClass('fdoc-file-item');
    expect(root).not.toHaveClass('fdoc-file-row');
    expect(screen.queryByTestId('file-row')).not.toBeInTheDocument();
    expect(screen.getByText('document.pdf')).toBeInTheDocument();
    expect(screen.getByText('7 Б')).toBeInTheDocument();
    expect(screen.queryByText('Выберите файл')).not.toBeInTheDocument();
  });

  it('clears an uncontrolled selected file through SingleFileInput delete logic', () => {
    const onFileChange = vi.fn();
    const { container } = render(<SingleFileInput onFileChange={onFileChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: 'Удалить файл document.pdf' }));

    expect(onFileChange).toHaveBeenLastCalledWith(null);
    expect(screen.getByText('Выберите файл')).toBeInTheDocument();
    expect(screen.getByTestId('single-file-input')).toHaveClass('fdoc-single-file-input--empty');
  });

  it('uses its own loaded-state props with the shared loading visual', () => {
    render(
      <SingleFileInput
        fileProps={{ fileName: 'document.pdf', weight: '2,7 МБ', state: 'loading' }}
      />,
    );

    expect(screen.getByRole('progressbar', { name: 'Загрузка' })).toBeInTheDocument();
    expect(screen.getByText('document.pdf')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Удалить файл document.pdf' })).toBeInTheDocument();
    expect(screen.getByTestId('single-file-input')).toHaveAttribute('aria-busy', 'true');
  });

  it('combines its loaded state with Disabled', () => {
    render(
      <SingleFileInput
        type="disabled"
        fileProps={{ fileName: 'document.pdf', weight: '2,7 МБ', state: 'loading' }}
      />,
    );

    expect(screen.getByRole('progressbar', { name: 'Загрузка' })).toBeInTheDocument();
    expect(screen.getByTestId('single-file-input')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('button', { name: 'Удалить файл document.pdf' })).toBeDisabled();
  });

  it('maps selected-file validation to the shared Message anatomy without becoming FileRow', () => {
    render(
      <SingleFileInput
        validationMessage="Ошибка файла"
        fileProps={{ fileName: 'document.pdf', weight: '2,7 МБ' }}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Ошибка файла');
    expect(document.querySelector('[data-icon="filled/exclamation_circle_filled"]')).toBeInTheDocument();
    expect(screen.queryByTestId('file-row')).not.toBeInTheDocument();
  });

  it('keeps weight visible as non-shrinking additional content for a long filename', () => {
    render(
      <SingleFileInput
        fileProps={{
          fileName: 'Очень длинное название файла которое должно сокращаться многоточием.pdf',
          weight: '2,7 МБ',
        }}
      />,
    );

    expect(screen.getByText('2,7 МБ')).toBeInTheDocument();
    expect(screen.getByText('2,7 МБ').closest('.fdoc-file-item__additional')).toBeInTheDocument();
  });

  it('keeps fileRowProps as a backward-compatible alias only', () => {
    render(<SingleFileInput fileRowProps={{ fileName: 'legacy.pdf', weight: '1 МБ' }} />);
    expect(screen.getByText('legacy.pdf')).toBeInTheDocument();
    expect(screen.getByText('1 МБ')).toBeInTheDocument();
    expect(screen.queryByTestId('file-row')).not.toBeInTheDocument();
  });

  it('shows validation content and semantic icon in the empty state', () => {
    render(<SingleFileInput validationMessage="Ошибка файла" />);
    expect(screen.getByText('Ошибка файла')).toBeInTheDocument();
    expect(screen.getByTestId('single-file-input')).toHaveAttribute('aria-invalid', 'true');
    expect(document.querySelector('[data-icon="filled/exclamation_circle_filled"]')).toBeInTheDocument();
  });

  it('keeps disabled empty validation anatomy and does not render the upload button', () => {
    render(<SingleFileInput type="disabled" validationMessage="Ошибка файла" />);
    expect(screen.getByText('Загрузка файлов недоступна')).toBeInTheDocument();
    expect(screen.getByText('Ошибка файла')).toBeInTheDocument();
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
