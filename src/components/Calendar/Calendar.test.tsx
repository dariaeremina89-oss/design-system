import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Calendar } from './Calendar';
import { RangeCalendar } from './RangeCalendar';

describe('Calendar', () => {
  it('renders the requested month and selects a date', () => {
    const change = vi.fn();
    render(
      <Calendar
        defaultVisibleMonth={new Date(2026, 9, 1)}
        showActions={false}
        onValueChange={change}
      />,
    );

    expect(screen.getByTestId('calendar-period')).toHaveTextContent('Октябрь 2026');
    fireEvent.click(screen.getByTestId('calendar-day-2026-10-15'));

    const selected = change.mock.calls.at(-1)?.[0] as Date;
    expect(selected.getFullYear()).toBe(2026);
    expect(selected.getMonth()).toBe(9);
    expect(selected.getDate()).toBe(15);
  });

  it('disables dates outside min and max', () => {
    render(
      <Calendar
        defaultVisibleMonth={new Date(2026, 9, 1)}
        minDate={new Date(2026, 9, 5)}
        maxDate={new Date(2026, 9, 25)}
        showActions={false}
      />,
    );

    expect(screen.getByTestId('calendar-day-2026-10-4')).toBeDisabled();
    expect(screen.getByTestId('calendar-day-2026-10-5')).toBeEnabled();
    expect(screen.getByTestId('calendar-day-2026-10-26')).toBeDisabled();
  });

  it('switches between date, month, and year views', () => {
    render(
      <Calendar
        defaultVisibleMonth={new Date(2026, 9, 1)}
        showActions={false}
      />,
    );

    const root = screen.getByTestId('calendar');
    expect(root).toHaveAttribute('data-calendar-view', 'date');

    fireEvent.click(screen.getByTestId('calendar-period'));
    expect(root).toHaveAttribute('data-calendar-view', 'month');

    fireEvent.click(screen.getByTestId('calendar-period'));
    expect(root).toHaveAttribute('data-calendar-view', 'year');

    fireEvent.click(screen.getByRole('button', { name: '2026' }));
    expect(root).toHaveAttribute('data-calendar-view', 'month');
  });
});

describe('RangeCalendar', () => {
  it('creates an ordered range when the second date is earlier', () => {
    const change = vi.fn();
    render(
      <RangeCalendar
        defaultVisibleMonth={new Date(2026, 9, 1)}
        defaultValue={{ start: null, end: null }}
        showActions={false}
        onValueChange={change}
      />,
    );

    fireEvent.click(screen.getByTestId('calendar-day-2026-10-10'));
    fireEvent.click(screen.getByTestId('calendar-day-2026-10-5'));

    const range = change.mock.calls.at(-1)?.[0];
    expect(range.start.getDate()).toBe(5);
    expect(range.end.getDate()).toBe(10);
  });

  it('renders two months for the desktop range variant', () => {
    render(
      <RangeCalendar
        defaultVisibleMonth={new Date(2026, 9, 1)}
        months={2}
        showActions={false}
      />,
    );

    expect(screen.getByTestId('range-calendar-month-1')).toBeInTheDocument();
    expect(screen.getByTestId('range-calendar-month-2')).toBeInTheDocument();
  });
});
