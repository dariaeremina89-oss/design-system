import { beforeAll, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Autocomplete } from './Autocomplete';

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const data = [
  { value: 'apple', label: 'Яблоки' },
  { value: 'banana', label: 'Бананы', disabled: true },
  { value: 'broccoli', label: 'Брокколи' },
  { value: 'carrot', label: 'Морковь' },
];

describe('Autocomplete', () => {
  it('filters a local list and does not accept an arbitrary value', async () => {
    const user = userEvent.setup();
    const select = vi.fn();
    render(<Autocomplete data={data} label="Продукты" onValueChange={select} />);

    const input = screen.getByRole('combobox');
    await user.type(input, 'Брок');

    expect(screen.getByRole('option', { name: 'Брокколи' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Яблоки' })).not.toBeInTheDocument();
    await user.keyboard('{Enter}');
    expect(select).not.toHaveBeenCalled();

    await user.keyboard('{ArrowDown}{Enter}');
    expect(select).toHaveBeenCalledWith('broccoli', expect.objectContaining({ value: 'broccoli' }));
    expect(input).toHaveValue('Брокколи');
  });

  it('keeps focus in input and skips disabled options during keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<Autocomplete data={data} label="Продукты" />);
    const input = screen.getByRole('combobox');

    await user.click(input);
    await user.keyboard('{ArrowDown}{ArrowDown}');

    expect(input).toHaveFocus();
    expect(screen.getByRole('option', { name: 'Брокколи' })).toHaveAttribute('data-state', 'focused');
    expect(input).toHaveAttribute('aria-activedescendant');
  });

  it('resets a previous selection when text is edited', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<Autocomplete data={data} defaultValue="apple" onValueChange={change} />);
    const input = screen.getByRole('combobox');

    expect(input).toHaveValue('Яблоки');
    await user.type(input, 'x');
    expect(change).toHaveBeenCalledWith('');
  });

  it('clear resets value and query, closes Menu and restores focus', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<Autocomplete data={data} defaultValue="apple" clearable onValueChange={change} />);
    const input = screen.getByRole('combobox');

    await user.click(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Очистить поле' }));

    expect(change).toHaveBeenCalledWith('');
    expect(input).toHaveValue('');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  it('separates no-results, load error and validation error states', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Autocomplete data={[]} defaultInputValue="Киви" defaultOpen noOptionsText="Результаты не найдены" />,
    );
    expect(screen.getByText('Результаты не найдены')).toBeInTheDocument();

    rerender(
      <Autocomplete data={[]} defaultInputValue="Киви" defaultOpen loadError="Ошибка загрузки" />,
    );
    expect(screen.getByText('Ошибка загрузки')).toBeInTheDocument();

    rerender(<Autocomplete data={data} error="Выберите продукт" required />);
    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Выберите продукт');
    await user.click(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('respects minCharacters before showing results', () => {
    render(<Autocomplete data={data} minCharacters={2} />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Я' } });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'Яб' } });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });
});
