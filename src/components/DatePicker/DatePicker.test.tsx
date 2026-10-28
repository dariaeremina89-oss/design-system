import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker } from './DatePicker';
import { RangePicker } from './RangePicker';

describe('DatePicker', () => {
  it('applies the date mask while typing and emits a valid date', () => {
    const change = vi.fn();
    render(<DatePicker onValueChange={change} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '23102026' } });

    expect(input).toHaveValue('23.10.2026');
    const value = change.mock.calls.at(-1)?.[0] as Date;
    expect(value.getFullYear()).toBe(2026);
    expect(value.getMonth()).toBe(9);
    expect(value.getDate()).toBe(23);
  });

  it('uses Calendar without Buttons by default and applies a date immediately', () => {
    render(<DatePicker defaultValue={new Date(2026, 9, 10)} />);

    const input = screen.getByRole('textbox');
    fireEvent.click(screen.getByTestId('date-picker-button'));
    expect(screen.getByTestId('date-picker-popup')).toBeInTheDocument();
    expect(screen.queryByTestId('calendar-actions')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('calendar-day-2026-10-15'));
    expect(input).toHaveValue('15.10.2026');
    expect(screen.queryByTestId('date-picker-popup')).not.toBeInTheDocument();
  });

  it('keeps a draft when Calendar Buttons are enabled', () => {
    render(
      <DatePicker
        defaultValue={new Date(2026, 9, 10)}
        defaultOpen
        calendarProps={{ showActions: true }}
      />,
    );

    const input = screen.getByRole('textbox');
    fireEvent.click(screen.getByTestId('calendar-day-2026-10-15'));
    expect(input).toHaveValue('10.10.2026');

    fireEvent.click(screen.getByRole('button', { name: 'Выбрать' }));
    expect(input).toHaveValue('15.10.2026');
    expect(screen.queryByTestId('date-picker-popup')).not.toBeInTheDocument();
  });

  it('supports manual input only and calendar only modes', () => {
    const { rerender } = render(<DatePicker calendarSelection={false} />);
    expect(screen.queryByTestId('date-picker-button')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox')).not.toHaveAttribute('readonly');

    rerender(<DatePicker manualInput={false} defaultValue={new Date(2026, 9, 10)} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
    expect(screen.getByTestId('date-picker-button')).toBeInTheDocument();
  });

  it('closes the popup on Escape', () => {
    render(<DatePicker defaultOpen />);
    expect(screen.getByTestId('date-picker-popup')).toBeInTheDocument();

    fireEvent.keyDown(screen.getByTestId('date-picker'), { key: 'Escape' });
    expect(screen.queryByTestId('date-picker-popup')).not.toBeInTheDocument();
  });
});

describe('RangePicker', () => {
  it('formats a controlled range value', () => {
    render(
      <RangePicker
        value={{
          start: new Date(2026, 9, 10),
          end: new Date(2026, 9, 20),
        }}
      />,
    );

    expect(screen.getByRole('textbox')).toHaveValue('10.10.2026 — 20.10.2026');
  });

  it('applies the range mask while typing and emits a complete range', () => {
    const change = vi.fn();
    render(<RangePicker onValueChange={change} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '1010202620102026' } });

    expect(input).toHaveValue('10.10.2026 — 20.10.2026');
    const range = change.mock.calls.at(-1)?.[0];
    expect(range.start.getDate()).toBe(10);
    expect(range.end.getDate()).toBe(20);
  });

  it('restores the applied range after Cancel', () => {
    render(
      <RangePicker
        defaultOpen
        defaultValue={{
          start: new Date(2026, 9, 10),
          end: new Date(2026, 9, 20),
        }}
      />,
    );

    const firstMonth = screen.getByTestId('range-calendar-month-1');
    fireEvent.click(within(firstMonth).getByTestId('calendar-day-2026-10-5'));
    fireEvent.click(within(firstMonth).getByTestId('calendar-day-2026-10-8'));

    expect(within(firstMonth).getByTestId('calendar-day-2026-10-5')).toHaveClass('fdoc-calendar__day--selected');
    expect(screen.getByRole('textbox')).toHaveValue('10.10.2026 — 20.10.2026');

    fireEvent.click(screen.getByRole('button', { name: 'Отменить' }));
    expect(screen.queryByTestId('range-picker-popup')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('10.10.2026 — 20.10.2026');

    fireEvent.click(screen.getByTestId('range-picker-button'));
    const reopenedMonth = screen.getByTestId('range-calendar-month-1');
    expect(within(reopenedMonth).getByTestId('calendar-day-2026-10-10')).toHaveClass('fdoc-calendar__day--selected');
    expect(within(reopenedMonth).getByTestId('calendar-day-2026-10-20')).toHaveClass('fdoc-calendar__day--selected');
    expect(within(reopenedMonth).getByTestId('calendar-day-2026-10-5')).not.toHaveClass('fdoc-calendar__day--selected');
    expect(within(reopenedMonth).getByTestId('calendar-day-2026-10-8')).not.toHaveClass('fdoc-calendar__day--selected');
  });

  it('supports Manual input and Calendar selection independently', () => {
    const { rerender } = render(<RangePicker calendarSelection={false} />);
    expect(screen.queryByTestId('range-picker-button')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox')).not.toHaveAttribute('readonly');

    rerender(<RangePicker manualInput={false} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
    expect(screen.getByTestId('range-picker-button')).toBeInTheDocument();
  });

  it('opens the responsive RangeCalendar', () => {
    render(<RangePicker defaultOpen />);
    expect(screen.getByTestId('range-picker-popup')).toBeInTheDocument();
    expect(screen.getByTestId('range-calendar')).toHaveAttribute('data-months', 'responsive');
  });
});
