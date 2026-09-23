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
  it('toggles several values without closing Menu and clears pointer focus state', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<Multiselect options={options} label="Команды" onValueChange={change} />);
    const input = screen.getByRole('combobox');

    await user.click(screen.getByTestId('multiselect-field'));
    const first = screen.getByRole('option', { name: 'Первый' });
    await user.click(first);
    expect(change).toHaveBeenLastCalledWith(['one']);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(first).toHaveAttribute('data-state', 'default');
    expect(input).toHaveFocus();
    expect(input).not.toHaveAttribute('aria-activedescendant');

    await user.click(screen.getByRole('option', { name: 'Третий' }));
    expect(change).toHaveBeenLastCalledWith(['one', 'three']);
    expect(input).toHaveValue('Первый, Третий');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('puts Checkbox on the left by default and can move it right to preserve leadingIcon', async () => {
    const user = userEvent.setup();
    const iconOptions = [{ value: 'docs', label: 'Документы', leadingIcon: 'doc-list' as const }];
    const { rerender } = render(<Multiselect options={iconOptions} label="Разделы" />);

    await user.click(screen.getByTestId('multiselect-field'));
    let option = screen.getByRole('option', { name: 'Документы' });
    const checkbox = option.querySelector('.fdoc-item-row__checkbox');
    const main = option.querySelector('.fdoc-item-row__main');
    expect(main?.firstElementChild).toContainElement(checkbox as HTMLElement);
    expect(option.querySelector('[data-icon="doc-list"]')).not.toBeInTheDocument();

    rerender(<Multiselect options={iconOptions} label="Разделы" selectionPosition="right" />);
    option = screen.getByRole('option', { name: 'Документы' });
    expect(option.querySelector('[data-icon="doc-list"]')).toBeInTheDocument();
    expect(option.querySelector('.fdoc-item-row__checkbox')).toBeInTheDocument();
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
        display="chips"
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

  it('renders comma, count, firstAndCount and chips display modes', () => {
    const { rerender } = render(<Multiselect options={options} defaultValue={['one', 'three']} display="comma" aria-label="Команды" />);
    expect(screen.getByText('Первый, Третий')).toHaveClass('fdoc-multiselect__value');

    rerender(<Multiselect options={options} defaultValue={['one', 'three']} display="count" aria-label="Команды" />);
    expect(screen.getByText('Выбрано 2')).toBeInTheDocument();

    rerender(<Multiselect options={options} defaultValue={['one', 'three']} display="firstAndCount" aria-label="Команды" />);
    expect(screen.getByText('Первый +1')).toBeInTheDocument();

    rerender(<Multiselect options={options} defaultValue={['one', 'three']} display="chips" aria-label="Команды" />);
    expect(screen.getByRole('button', { name: 'Удалить: Первый' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Удалить: Третий' })).toBeInTheDocument();
  });

  it('creates custom values as chips and never adds them to Menu', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<Multiselect options={options} defaultValue={['one']} creatable onValueChange={change} label="Команды" />);
    const input = screen.getByRole('combobox');

    await user.click(input);
    await user.type(input, 'Свое значение{Enter}');

    expect(change).toHaveBeenLastCalledWith(['one', 'Свое значение']);
    expect(screen.getByRole('button', { name: 'Удалить: Свое значение' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Свое значение' })).not.toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('supports selectAll and indeterminate state', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<Multiselect options={options} defaultValue={['one']} selectAll onValueChange={change} label="Команды" />);

    await user.click(screen.getByTestId('multiselect-field'));
    const all = screen.getByRole('option', { name: 'Выбрать все' });
    const checkbox = all.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);

    await user.click(all);
    expect(change).toHaveBeenLastCalledWith(['one', 'three']);
  });
});
