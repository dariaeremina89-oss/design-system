import { beforeAll, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Multiselect } from './Multiselect';

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const options = [
  { value: 'one', label: 'Первый' },
  { value: 'two', label: 'Второй', disabled: true },
  { value: 'three', label: 'Третий' },
];

describe('Multiselect', () => {
  it('toggles several values without closing Menu', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<Multiselect options={options} label="Команды" onValueChange={change} />);
    const input = screen.getByRole('combobox');

    await user.click(screen.getByTestId('multiselect-field'));
    await user.click(screen.getByRole('option', { name: 'Первый' }));
    expect(change).toHaveBeenLastCalledWith(['one']);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.click(screen.getByRole('option', { name: 'Третий' }));
    expect(change).toHaveBeenLastCalledWith(['one', 'three']);
    expect(input).toHaveValue('Первый, Третий');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('skips disabled options during keyboard navigation and toggles with Enter', async () => {
    const user = userEvent.setup();
    render(<Multiselect options={options} label="Команды" />);
    const input = screen.getByRole('combobox');

    input.focus();
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(input).toHaveValue('Третий');
    expect(screen.getByRole('option', { name: 'Третий' })).toHaveAttribute('aria-selected', 'true');
  });

  it('removes one chip, clears all values and restores combobox focus', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const clear = vi.fn();
    render(
      <Multiselect
        options={options}
        label="Команды"
        defaultValue={['one', 'three']}
        onValueChange={change}
        onClear={clear}
      />,
    );
    const input = screen.getByRole('combobox');

    await user.click(screen.getByRole('button', { name: 'Удалить: Первый' }));
    expect(change).toHaveBeenLastCalledWith(['three']);
    expect(input).toHaveValue('Третий');

    await user.click(screen.getByRole('button', { name: 'Очистить выбор' }));
    expect(change).toHaveBeenLastCalledWith([]);
    expect(clear).toHaveBeenCalledOnce();
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
  });

  it('supports required marker and accessible required semantics', () => {
    render(<Multiselect options={options} label="Команды" required />);
    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('keeps controlled value until the parent changes it', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const { rerender } = render(<Multiselect options={options} value={['one']} onValueChange={change} aria-label="Команды" />);
    const input = screen.getByRole('combobox');

    await user.click(screen.getByTestId('multiselect-field'));
    await user.click(screen.getByRole('option', { name: 'Третий' }));
    expect(change).toHaveBeenCalledWith(['one', 'three']);
    expect(input).toHaveValue('Первый');

    rerender(<Multiselect options={options} value={['one', 'three']} onValueChange={change} aria-label="Команды" />);
    expect(input).toHaveValue('Первый, Третий');
  });

  it('blocks disabled interaction and skeleton exposes no combobox', () => {
    const { rerender } = render(<Multiselect options={options} label="Команды" disabled defaultValue={['one']} />);
    const input = screen.getByRole('combobox');
    expect(input).toBeDisabled();
    fireEvent.click(screen.getByTestId('multiselect-field'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    rerender(<Multiselect options={options} label="Команды" skeleton />);
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('Backspace removes the last selected value when Menu is closed', async () => {
    const user = userEvent.setup();
    render(<Multiselect options={options} defaultValue={['one', 'three']} aria-label="Команды" />);
    const input = screen.getByRole('combobox');
    input.focus();
    await user.keyboard('{Backspace}');
    expect(input).toHaveValue('Первый');
  });
});
