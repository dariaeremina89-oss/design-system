import { act } from 'react';
import { beforeAll, afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { AsyncMultiselect } from './AsyncMultiselect';

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

afterEach(() => {
  vi.useRealTimers();
});

const options = [
  { value: 'design', label: 'Дизайн' },
  { value: 'frontend', label: 'Фронтенд' },
  { value: 'backend', label: 'Бэкенд' },
];

describe('AsyncMultiselect', () => {
  it('waits for minCharacters and debounce before fetching', async () => {
    vi.useFakeTimers();
    const fetch = vi.fn();
    render(
      <AsyncMultiselect
        options={[]}
        minCharacters={2}
        debounce={500}
        onFetch={fetch}
        aria-label="Команды"
      />,
    );

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Д' } });
    await act(async () => vi.advanceTimersByTime(600));
    expect(fetch).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: 'Ди' } });
    await act(async () => vi.advanceTimersByTime(499));
    expect(fetch).not.toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTime(1));
    expect(fetch).toHaveBeenCalledExactlyOnceWith('Ди');
  });

  it('shows and updates the remaining character hint before search starts', () => {
    render(
      <AsyncMultiselect
        options={[]}
        minCharacters={3}
        debounce={0}
        onFetch={() => undefined}
        aria-label="Команды"
      />,
    );

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    expect(screen.getByRole('listbox')).toHaveTextContent('Введите еще 3 символа, чтобы начать поиск');

    fireEvent.change(input, { target: { value: 'Д' } });
    expect(screen.getByRole('listbox')).toHaveTextContent('Введите еще 2 символа, чтобы начать поиск');

    fireEvent.change(input, { target: { value: 'Ди' } });
    expect(screen.getByRole('listbox')).toHaveTextContent('Введите еще 1 символ, чтобы начать поиск');
  });

  it('fetches on mount when minCharacters is zero', async () => {
    vi.useFakeTimers();
    const fetch = vi.fn();
    render(<AsyncMultiselect options={[]} minCharacters={0} debounce={0} onFetch={fetch} />);
    await act(async () => vi.runAllTimers());
    expect(fetch).toHaveBeenCalledExactlyOnceWith('');
  });

  it('does not refetch only because onFetch callback identity changed', async () => {
    vi.useFakeTimers();
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = render(
      <AsyncMultiselect
        options={options}
        defaultInputValue="Ди"
        debounce={0}
        onFetch={first}
      />,
    );
    await act(async () => vi.runAllTimers());
    expect(first).toHaveBeenCalledTimes(1);

    rerender(
      <AsyncMultiselect
        options={options}
        defaultInputValue="Ди"
        debounce={0}
        onFetch={second}
      />,
    );
    await act(async () => vi.runAllTimers());
    expect(second).not.toHaveBeenCalled();
  });

  it('clears the search after selection without refetching below minCharacters', async () => {
    vi.useFakeTimers();
    const fetch = vi.fn();
    const change = vi.fn();
    render(
      <AsyncMultiselect
        options={options}
        debounce={0}
        defaultInputValue="Д"
        defaultOpen
        onFetch={fetch}
        onValueChange={change}
        label="Команды"
      />,
    );
    await act(async () => vi.runAllTimers());
    expect(fetch).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('option', { name: 'Дизайн' }));
    expect(change).toHaveBeenLastCalledWith(['design']);
    expect(screen.getByRole('combobox')).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Удалить: Дизайн' })).toBeInTheDocument();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await act(async () => vi.runAllTimers());
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('keeps selected labels when the next server response no longer contains them', () => {
    const { rerender } = render(
      <AsyncMultiselect
        options={[options[0]]}
        defaultValue={['design']}
        defaultInputValue="Ди"
        onFetch={() => undefined}
        label="Команды"
      />,
    );
    expect(screen.getByRole('button', { name: 'Удалить: Дизайн' })).toBeInTheDocument();

    rerender(
      <AsyncMultiselect
        options={[options[1]]}
        defaultValue={['design']}
        defaultInputValue="Фр"
        onFetch={() => undefined}
        label="Команды"
      />,
    );
    expect(screen.getByRole('button', { name: 'Удалить: Дизайн' })).toBeInTheDocument();
  });

  it('uses selectedOptions for controlled values absent from current results', () => {
    render(
      <AsyncMultiselect
        options={[]}
        value={['design']}
        selectedOptions={[options[0]]}
        onFetch={() => undefined}
        label="Команды"
      />,
    );
    expect(screen.getByRole('button', { name: 'Удалить: Дизайн' })).toBeInTheDocument();
  });

  it('limits server results without filtering them again locally', () => {
    render(
      <AsyncMultiselect
        options={options}
        defaultInputValue="не совпадает"
        defaultOpen
        minCharacters={1}
        debounce={0}
        limit={2}
        onFetch={() => undefined}
        label="Команды"
      />,
    );
    expect(screen.getAllByRole('option')).toHaveLength(2);
    expect(screen.getByRole('option', { name: 'Дизайн' })).toBeInTheDocument();
  });

  it('renders external Menu message, Loading and Load Error inside Menu', () => {
    const { rerender } = render(
      <AsyncMultiselect
        options={[]}
        defaultInputValue="Ди%"
        defaultOpen
        menuMessage="Вы ввели недопустимые символы"
        dropdownHeader="Ваши сотрудники"
        dropdownFooter={<button type="button">Добавить нового сотрудника</button>}
        onFetch={() => undefined}
        label="Команды"
      />,
    );
    const menu = screen.getByRole('listbox');
    expect(within(menu).getByText('Ваши сотрудники')).toBeInTheDocument();
    expect(within(menu).getByText('Вы ввели недопустимые символы')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Добавить нового сотрудника' })).toBeInTheDocument();

    rerender(
      <AsyncMultiselect
        options={[]}
        defaultInputValue="Ди"
        defaultOpen
        loading
        onFetch={() => undefined}
        label="Команды"
      />,
    );
    expect(document.querySelectorAll('.fdoc-item-row[data-state="skeleton"]')).toHaveLength(5);

    rerender(
      <AsyncMultiselect
        options={[]}
        defaultInputValue="Ди"
        defaultOpen
        loadError="Не удалось получить список"
        onFetch={() => undefined}
        label="Команды"
      />,
    );
    expect(document.querySelector('.fdoc-async-multiselect__message--error')).toHaveTextContent('Не удалось получить список');
  });

  it('keeps required semantics and blocks fetch while disabled', async () => {
    vi.useFakeTimers();
    const fetch = vi.fn();
    render(
      <AsyncMultiselect
        options={[]}
        label="Команды"
        required
        disabled
        defaultInputValue="Ди"
        debounce={0}
        onFetch={fetch}
      />,
    );
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-required', 'true');
    await act(async () => vi.runAllTimers());
    expect(fetch).not.toHaveBeenCalled();
  });
});
