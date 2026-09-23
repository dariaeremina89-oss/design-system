import { act, beforeAll, afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { AsyncAutocomplete } from './AsyncAutocomplete';

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

describe('AsyncAutocomplete', () => {
  it('waits for minCharacters and debounce before fetching', async () => {
    vi.useFakeTimers();
    const fetch = vi.fn();
    render(
      <AsyncAutocomplete
        data={[]}
        minCharacters={2}
        debounce={500}
        onFetch={fetch}
        aria-label="Поиск продукта"
      />,
    );

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Я' } });
    await act(async () => vi.advanceTimersByTime(600));
    expect(fetch).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: 'Яб' } });
    await act(async () => vi.advanceTimersByTime(499));
    expect(fetch).not.toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTime(1));
    expect(fetch).toHaveBeenCalledExactlyOnceWith('Яб');
  });

  it('fetches on mount when minCharacters is zero', async () => {
    vi.useFakeTimers();
    const fetch = vi.fn();
    render(<AsyncAutocomplete data={[]} minCharacters={0} debounce={0} onFetch={fetch} />);
    await act(async () => vi.runAllTimers());
    expect(fetch).toHaveBeenCalledExactlyOnceWith('');
  });

  it('does not fetch again when a returned option is selected', async () => {
    vi.useFakeTimers();
    const fetch = vi.fn();
    render(
      <AsyncAutocomplete
        data={[{ value: 'apple', label: 'Яблоки' }]}
        minCharacters={1}
        debounce={0}
        onFetch={fetch}
      />,
    );

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Я' } });
    await act(async () => vi.runAllTimers());
    expect(fetch).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    await act(async () => vi.runAllTimers());
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('Яблоки');
  });

  it('limits rendered server results without filtering them again', () => {
    render(
      <AsyncAutocomplete
        data={[
          { value: '1', label: 'Первый результат' },
          { value: '2', label: 'Второй результат' },
          { value: '3', label: 'Третий результат' },
        ]}
        defaultInputValue="не совпадает"
        defaultOpen
        minCharacters={1}
        debounce={0}
        limit={2}
        onFetch={() => undefined}
      />,
    );

    expect(screen.getAllByRole('option')).toHaveLength(2);
    expect(screen.getByRole('option', { name: 'Первый результат' })).toBeInTheDocument();
  });
});
