import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ButtonToggle } from './ButtonToggle';

const options = [
  { value: 'a', label: 'День' },
  { value: 'b', label: 'Неделя', disabled: true },
  { value: 'c', label: 'Месяц' },
];

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('ButtonToggle', () => {
  it('keeps one selected and skips disabled with arrows', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<ButtonToggle aria-label="Период" options={options} onValueChange={change} />);
    await user.tab();
    expect(screen.getByRole('radio', { name: 'День' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Месяц' })).toHaveFocus();
    expect(change).toHaveBeenLastCalledWith('c');
    await user.keyboard('{Enter}');
    expect(change).toHaveBeenCalledTimes(1);
    await user.keyboard('{Home}');
    expect(screen.getByRole('radio', { name: 'День' })).toHaveAttribute('aria-checked', 'true');
  });

  it('controlled selection is not changed internally', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<ButtonToggle aria-label="Период" options={options} value="a" onValueChange={change} />);
    await user.click(screen.getByText('Месяц'));
    expect(change).toHaveBeenCalledWith('c');
    expect(screen.getByRole('radio', { name: 'День' })).toHaveAttribute('aria-checked', 'true');
  });

  it('submits chosen value and supports axe', async () => {
    const { container } = render(
      <form><ButtonToggle aria-label="Период" name="period" options={options} defaultValue="c" /></form>,
    );
    expect(new FormData(container.querySelector('form')!).get('period')).toBe('c');
    expect((await axe(container)).violations).toEqual([]);
  });

  it('replaces long segments with Select when the container is too narrow', () => {
    let resize: ((entries: Array<{ contentRect: { width: number } }>) => void) | undefined;
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: typeof resize) { resize = callback; }
      observe() {}
      disconnect() {}
    });

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
      const element = this as HTMLElement;
      const width = element.classList.contains('fdoc-button-toggle') && element.style.position === 'fixed' ? 640 : 0;
      return {
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: width,
        bottom: 40,
        width,
        height: 40,
        toJSON: () => ({}),
      } as DOMRect;
    });

    const longOptions = [
      { value: 'medical', label: 'Медицинская организация' },
      { value: 'business', label: 'Другой тип бизнеса' },
      { value: 'individual', label: 'Индивидуальный предприниматель' },
    ];
    const { container } = render(
      <form><ButtonToggle aria-label="Тип организации" name="kind" options={longOptions} /></form>,
    );

    act(() => resize?.([{ contentRect: { width: 280 } }]));

    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Тип организации' })).toBeInTheDocument();
    expect(new FormData(container.querySelector('form')!).get('kind')).toBe('medical');
  });
});
