import { beforeAll, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { CodeInput } from './CodeInput';

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('CodeInput', () => {
  it('renders configurable phone groups with independent prefix and suffix', () => {
    render(
      <CodeInput
        type="phone"
        phonePrefix="+7 9"
        phoneGroups={[2, 3, 2]}
        phoneSuffix="88"
        label="Телефон"
      />,
    );

    expect(screen.getAllByRole('textbox')).toHaveLength(7);
    expect(screen.getByTestId('code-input-phone-prefix')).toHaveTextContent('+7 9');
    expect(screen.getByTestId('code-input-phone-suffix')).toHaveTextContent('88');
    expect(screen.getByTestId('code-input-phone-group-1').querySelectorAll('input')).toHaveLength(2);
    expect(screen.getByTestId('code-input-phone-group-2').querySelectorAll('input')).toHaveLength(3);
    expect(screen.getByTestId('code-input-phone-group-3').querySelectorAll('input')).toHaveLength(2);
  });

  it('always renders Phone with the Small geometry even if Medium is requested', () => {
    render(
      <CodeInput
        type="phone"
        size="medium"
        phoneGroups={[2, 3, 2]}
        label="Телефон"
      />,
    );

    expect(screen.getByTestId('code-input')).toHaveClass('fdoc-code-input--small');
    expect(screen.getByTestId('code-input')).not.toHaveClass('fdoc-code-input--medium');
  });

  it('derives phone length from groups instead of Code length', () => {
    render(
      <CodeInput
        type="phone"
        length={4}
        phonePrefix="+44"
        phoneGroups={[4, 3, 3]}
        label="Телефон"
      />,
    );

    expect(screen.getAllByRole('textbox')).toHaveLength(10);
  });

  it('pastes across phone groups as one normalized value', () => {
    const change = vi.fn();
    render(
      <CodeInput
        type="phone"
        phoneGroups={[2, 3, 2]}
        onValueChange={change}
        label="Телефон"
      />,
    );

    fireEvent.paste(screen.getByTestId('code-input-cell-1'), {
      clipboardData: { getData: () => '12 345 67' },
    });

    expect(change).toHaveBeenLastCalledWith('1234567');
    expect(screen.getByTestId('code-input-cell-7')).toHaveFocus();
  });

  it('shows a typed PIN digit before masking it after maskDelay', () => {
    vi.useFakeTimers();
    const change = vi.fn();
    render(<CodeInput length={4} mask maskDelay={800} onValueChange={change} />);

    const first = screen.getByTestId('code-input-cell-1');
    fireEvent.change(first, { target: { value: '4' } });

    expect(first).toHaveValue('4');
    expect(change).toHaveBeenLastCalledWith('4');

    act(() => vi.advanceTimersByTime(799));
    expect(first).toHaveValue('4');

    act(() => vi.advanceTimersByTime(1));
    expect(first).toHaveValue('*');
    vi.useRealTimers();
  });

  it('respects a custom maskDelay', () => {
    vi.useFakeTimers();
    render(<CodeInput length={4} mask maskDelay={250} />);

    const first = screen.getByTestId('code-input-cell-1');
    fireEvent.change(first, { target: { value: '4' } });

    act(() => vi.advanceTimersByTime(249));
    expect(first).toHaveValue('4');

    act(() => vi.advanceTimersByTime(1));
    expect(first).toHaveValue('*');
    vi.useRealTimers();
  });

  it('masks immediately when maskDelay is zero', () => {
    render(<CodeInput length={4} mask maskDelay={0} />);
    const first = screen.getByTestId('code-input-cell-1');

    fireEvent.change(first, { target: { value: '4' } });

    expect(first).toHaveValue('*');
  });

  it('keeps pasted PIN digits as value and masks their display after the delay', () => {
    vi.useFakeTimers();
    const change = vi.fn();
    render(<CodeInput length={4} mask maskDelay={300} onValueChange={change} />);

    fireEvent.paste(screen.getByTestId('code-input-cell-1'), {
      clipboardData: { getData: () => '12-34' },
    });

    expect(change).toHaveBeenLastCalledWith('1234');
    expect(screen.getByTestId('code-input-cell-1')).toHaveValue('1');
    expect(screen.getByTestId('code-input-cell-4')).toHaveValue('4');

    act(() => vi.advanceTimersByTime(300));
    screen.getAllByRole('textbox').forEach(cell => expect(cell).toHaveValue('*'));
    vi.useRealTimers();
  });

  it('masks an existing PIN immediately without changing the stored value', () => {
    render(<CodeInput length={4} mask defaultValue="4206" name="pin" />);

    screen.getAllByRole('textbox').forEach(cell => {
      expect(cell).toHaveValue('*');
    });
    expect(document.querySelector('input[type="hidden"][name="pin"]')).toHaveValue('4206');
  });

  it('keeps Phone values visible even when mask is passed', () => {
    render(
      <CodeInput
        type="phone"
        phoneGroups={[2, 2]}
        defaultValue="1234"
        mask
        label="Телефон"
      />,
    );

    expect(screen.getByTestId('code-input-cell-1')).toHaveValue('1');
    expect(screen.getByTestId('code-input-cell-4')).toHaveValue('4');
  });

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

  it('renders empty skeleton cells without interactive textboxes', () => {
    render(<CodeInput length={6} skeleton label="Код" caption="Введите код" />);
    expect(screen.queryAllByRole('textbox')).toHaveLength(0);
    expect(document.querySelectorAll('.fdoc-code-input__cell .fdoc-skeleton')).toHaveLength(0);
  });

  it('renders empty and filled Phone skeleton states in Small geometry', () => {
    const empty = render(
      <CodeInput
        type="phone"
        skeleton
        phonePrefix="+7 9"
        phoneGroups={[2, 3, 2]}
        phoneSuffix="88"
        label="Телефон"
      />,
    );

    expect(screen.getAllByTestId(/code-input-cell-/)).toHaveLength(7);
    expect(document.querySelectorAll('.fdoc-code-input__cell .fdoc-skeleton')).toHaveLength(0);
    expect(screen.getByTestId('code-input')).toHaveClass('fdoc-code-input--small');

    empty.unmount();

    render(
      <CodeInput
        type="phone"
        skeleton
        defaultValue="1234567"
        phonePrefix="+7 9"
        phoneGroups={[2, 3, 2]}
        phoneSuffix="88"
        label="Телефон"
      />,
    );

    expect(screen.getAllByTestId(/code-input-cell-/)).toHaveLength(7);
    expect(document.querySelectorAll('.fdoc-code-input__cell .fdoc-skeleton')).toHaveLength(7);
    expect(screen.getByTestId('code-input')).toHaveClass('fdoc-code-input--small');
  });

  it('renders Figma filled skeleton geometry for both sizes', () => {
    const { rerender } = render(<CodeInput length={6} skeleton defaultValue="420615" label="Код" caption="Введите код" />);
    let skeletons = Array.from(document.querySelectorAll('.fdoc-code-input__cell .fdoc-skeleton')) as HTMLElement[];
    expect(skeletons).toHaveLength(6);
    skeletons.forEach(skeleton => {
      expect(skeleton.style.width).toBe('16px');
      expect(skeleton).toHaveAttribute('data-text-size', 'h3-heading');
    });

    rerender(<CodeInput length={6} skeleton defaultValue="420615" size="small" label="Код" caption="Введите код" />);
    skeletons = Array.from(document.querySelectorAll('.fdoc-code-input__cell .fdoc-skeleton')) as HTMLElement[];
    expect(skeletons).toHaveLength(6);
    skeletons.forEach(skeleton => {
      expect(skeleton.style.width).toBe('16px');
      expect(skeleton).toHaveAttribute('data-text-size', 'subtitle');
    });
  });
});
