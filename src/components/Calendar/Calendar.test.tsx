import { fireEvent, render, screen, within } from '@testing-library/react';
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

  it('uses Date → Month → Year only as navigation for Type=date', () => {
    render(
      <Calendar
        type="date"
        defaultVisibleMonth={new Date(2026, 9, 1)}
        showActions={false}
      />,
    );

    const root = screen.getByTestId('calendar');
    expect(root).toHaveAttribute('data-calendar-type', 'date');
    expect(root).toHaveAttribute('data-calendar-view', 'date');

    fireEvent.click(screen.getByTestId('calendar-period'));
    expect(root).toHaveAttribute('data-calendar-view', 'month');

    fireEvent.click(screen.getByTestId('calendar-period'));
    expect(root).toHaveAttribute('data-calendar-view', 'year');

    expect(within(root).getAllByRole('button').filter(button => /^\d{4}$/.test(button.textContent ?? ''))).toHaveLength(24);

    fireEvent.click(screen.getByRole('button', { name: '2026' }));
    expect(root).toHaveAttribute('data-calendar-view', 'month');
  });

  it('uses down icon for the base view and up icon only for a higher selection level', () => {
    const { rerender } = render(
      <Calendar
        type="date"
        defaultVisibleMonth={new Date(2026, 9, 1)}
        showActions={false}
      />,
    );

    expect(screen.getByTestId('calendar-period').querySelector('[data-icon="arrow-drop-down"]')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('calendar-period'));
    expect(screen.getByTestId('calendar-period').querySelector('[data-icon="arrow-drop-up"]')).toBeInTheDocument();

    rerender(
      <Calendar
        type="month"
        defaultVisibleMonth={new Date(2026, 9, 1)}
        showActions={false}
      />,
    );
    expect(screen.getByTestId('calendar-period').querySelector('[data-icon="arrow-drop-down"]')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('calendar-period'));
    expect(screen.getByTestId('calendar-period').querySelector('[data-icon="arrow-drop-up"]')).toBeInTheDocument();

    rerender(
      <Calendar
        type="year"
        defaultVisibleMonth={new Date(2026, 9, 1)}
        showActions={false}
      />,
    );
    expect(screen.getByTestId('calendar-period').querySelector('[data-icon="arrow-drop-down"]')).toBeInTheDocument();
  });

  it('shows the selected month and year while navigating Type=date', () => {
    render(
      <Calendar
        type="date"
        defaultValue={new Date(2024, 4, 18)}
        defaultVisibleMonth={new Date(2024, 4, 1)}
        showActions={false}
      />,
    );

    fireEvent.click(screen.getByTestId('calendar-period'));
    const may = screen.getByRole('button', { name: 'Май' });
    expect(may).toHaveClass('fdoc-calendar__choice--selected');
    expect(may.closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true');

    fireEvent.click(screen.getByTestId('calendar-period'));
    const year = screen.getByRole('button', { name: '2024' });
    expect(year).toHaveClass('fdoc-calendar__choice--selected');
    expect(year.closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true');
  });

  it('shows the selected year while navigating Type=month', () => {
    render(
      <Calendar
        type="month"
        defaultValue={new Date(2024, 4, 1)}
        defaultVisibleMonth={new Date(2024, 4, 1)}
        showActions={false}
      />,
    );

    expect(screen.getByRole('button', { name: 'Май' })).toHaveClass('fdoc-calendar__choice--selected');
    fireEvent.click(screen.getByTestId('calendar-period'));
    expect(screen.getByRole('button', { name: '2024' })).toHaveClass('fdoc-calendar__choice--selected');
  });

  it('returns a month as the final value for Type=month', () => {
    const change = vi.fn();
    render(
      <Calendar
        type="month"
        defaultVisibleMonth={new Date(2026, 0, 1)}
        showActions={false}
        onValueChange={change}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Окт' }));
    const selected = change.mock.calls.at(-1)?.[0] as Date;
    expect(selected.getFullYear()).toBe(2026);
    expect(selected.getMonth()).toBe(9);
    expect(selected.getDate()).toBe(1);
  });

  it('returns a year as the final value for Type=year', () => {
    const change = vi.fn();
    render(
      <Calendar
        type="year"
        defaultVisibleMonth={new Date(2026, 0, 1)}
        showActions={false}
        onValueChange={change}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '2026' }));
    const selected = change.mock.calls.at(-1)?.[0] as Date;
    expect(selected.getFullYear()).toBe(2026);
    expect(selected.getMonth()).toBe(0);
    expect(selected.getDate()).toBe(1);
  });
});

describe('RangeCalendar', () => {
  it('creates Range single first and an ordered range on the second selection', () => {
    const change = vi.fn();
    render(
      <RangeCalendar
        defaultVisibleMonth={new Date(2026, 9, 1)}
        defaultValue={{ start: null, end: null }}
        months={2}
        showActions={false}
        onValueChange={change}
      />,
    );

    const firstMonth = screen.getByTestId('range-calendar-month-1');
    fireEvent.click(within(firstMonth).getByTestId('calendar-day-2026-10-10'));

    let range = change.mock.calls.at(-1)?.[0];
    expect(range.start.getDate()).toBe(10);
    expect(range.end.getDate()).toBe(10);

    fireEvent.click(within(firstMonth).getByTestId('calendar-day-2026-10-5'));
    range = change.mock.calls.at(-1)?.[0];
    expect(range.start.getDate()).toBe(5);
    expect(range.end.getDate()).toBe(10);
  });

  it('prevents selecting a range through a disabled date', () => {
    const change = vi.fn();
    render(
      <RangeCalendar
        defaultVisibleMonth={new Date(2026, 9, 1)}
        defaultValue={{ start: null, end: null }}
        months={2}
        showActions={false}
        isDateDisabled={date => date.getDate() === 13}
        onValueChange={change}
      />,
    );

    const firstMonth = screen.getByTestId('range-calendar-month-1');
    fireEvent.click(within(firstMonth).getByTestId('calendar-day-2026-10-10'));

    expect(within(firstMonth).getByTestId('calendar-day-2026-10-14')).toBeDisabled();
  });

  it('renders desktop months and a separate mobile scroll structure', () => {
    render(
      <RangeCalendar
        defaultVisibleMonth={new Date(2026, 9, 1)}
        months="responsive"
        showActions={false}
      />,
    );

    expect(screen.getByTestId('range-calendar-month-1')).toBeInTheDocument();
    expect(screen.getByTestId('range-calendar-month-2')).toBeInTheDocument();
    expect(screen.getByTestId('range-calendar-mobile')).toBeInTheDocument();
    expect(screen.getAllByTestId('range-calendar-mobile-month')).toHaveLength(12);
  });
});
