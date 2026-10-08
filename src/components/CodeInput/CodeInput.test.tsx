import { beforeAll, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { CodeInput } from './CodeInput';

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('CodeInput', () => {
  it('renders the requested number of cells and normalizes default value', () => {
    render(<CodeInput length={4} defaultValue="1a23x4" label="Код" />);
    expect(screen.getAllByRole('textbox')).toHaveLength(4);
    expect(screen.getByTestId('code-input-cell-1')).toHaveValue('1');
    expect(screen.getByTestId('code-input-cell-4')).toHaveValue('4');
  });

  it('moves to the next cell after input and reports the complete value', () => {
    const change = vi.fn();
    render(<CodeInput length={4} onValueChange={change} />);

    const first = screen.getByTestId('code-input-cell-1');
    const second = screen.getByTestId('code-input-cell-2');
    fireEvent.change(first, { target: { value: '1' } });

    expect(change).toHaveBeenLastCalledWith('1');
    expect(second).toHaveFocus();
  });

  it('pastes a full code across all cells and ignores separators', () => {
    const change = vi.fn();
    render(<CodeInput length={6} defaultValue="12" onValueChange={change} />);

    fireEvent.paste(screen.getByTestId('code-input-cell-2'), {
      clipboardData: { getData: () => '98-76 54' },
    });

    expect(change).toHaveBeenLastCalledWith('987654');
    expect(screen.getByTestId('code-input-cell-6')).toHaveFocus();
  });

  it('pastes a short fragment from the active position without creating gaps', () => {
    const change = vi.fn();
    render(<CodeInput length={6} defaultValue="12" onValueChange={change} />);

    fireEvent.paste(screen.getByTestId('code-input-cell-3'), {
      clipboardData: { getData: () => '34' },
    });

    expect(change).toHaveBeenLastCalledWith('1234');
    expect(screen.getByTestId('code-input-cell-5')).toHaveFocus();
  });

  it('redirects focus from a future empty cell to the first empty cell', () => {
    vi.useFakeTimers();
    render(<CodeInput length={6} defaultValue="12" />);

    screen.getByTestId('code-input-cell-6').focus();
    vi.runAllTimers();

    expect(screen.getByTestId('code-input-cell-3')).toHaveFocus();
    vi.useRealTimers();
  });

  it('removes the previous value on Backspace from an empty next cell', () => {
    const change = vi.fn();
    render(<CodeInput length={4} defaultValue="12" onValueChange={change} />);
    const third = screen.getByTestId('code-input-cell-3');
    third.focus();

    fireEvent.keyDown(third, { key: 'Backspace' });

    expect(change).toHaveBeenLastCalledWith('1');
    expect(screen.getByTestId('code-input-cell-2')).toHaveFocus();
  });

  it('supports controlled value without mutating it internally', () => {
    const change = vi.fn();
    render(<CodeInput value="12" onValueChange={change} />);
    const second = screen.getByTestId('code-input-cell-2');

    fireEvent.change(second, { target: { value: '8' } });

    expect(change).toHaveBeenLastCalledWith('18');
    expect(second).toHaveValue('2');
  });

  it('exposes required, error and disabled semantics on every cell', () => {
    render(
      <CodeInput
        length={4}
        label="Код"
        required
        disabled
        error="Неверный код"
      />,
    );

    const cells = screen.getAllByRole('textbox');
    cells.forEach(cell => {
      expect(cell).toBeDisabled();
      expect(cell).toHaveAttribute('aria-required', 'true');
      expect(cell).toHaveAttribute('aria-invalid', 'true');
    });
    expect(screen.getByText('Неверный код')).toBeInTheDocument();
  });

  it('renders skeleton cells without interactive textboxes', () => {
    render(<CodeInput length={6} skeleton label="Код" caption="Введите код" />);
    expect(screen.queryAllByRole('textbox')).toHaveLength(0);
    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThanOrEqual(6);
  });
});
