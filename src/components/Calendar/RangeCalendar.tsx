import { useState } from 'react';
import { CalendarActions, CalendarMonthPanel } from './Calendar';
import {
  addMonths,
  compareDays,
  startOfMonth,
  type DateRange,
} from './dateUtils';
import './Calendar.css';

export interface RangeCalendarProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (value: DateRange) => void;
  visibleMonth?: Date;
  defaultVisibleMonth?: Date;
  onVisibleMonthChange?: (month: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  months?: 1 | 2 | 'responsive';
  showActions?: boolean;
  applyText?: string;
  cancelText?: string;
  onApply?: (value: DateRange) => void;
  onCancel?: () => void;
  className?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

function joinClassNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

const EMPTY_RANGE: DateRange = { start: null, end: null };

export function RangeCalendar({
  value: controlledValue,
  defaultValue = EMPTY_RANGE,
  onValueChange,
  visibleMonth: controlledVisibleMonth,
  defaultVisibleMonth,
  onVisibleMonthChange,
  minDate,
  maxDate,
  isDateDisabled,
  months = 'responsive',
  showActions = true,
  applyText = 'Выбрать',
  cancelText = 'Отменить',
  onApply,
  onCancel,
  className,
  'aria-label': ariaLabel = 'Выбор периода',
  'data-testid': testId = 'range-calendar',
}: RangeCalendarProps) {
  const [internalValue, setInternalValue] = useState<DateRange>(defaultValue);
  const [internalVisibleMonth, setInternalVisibleMonth] = useState(() =>
    startOfMonth(defaultVisibleMonth ?? defaultValue.start ?? new Date()),
  );
  const value = controlledValue ?? internalValue;
  const visibleMonth = startOfMonth(controlledVisibleMonth ?? internalVisibleMonth);
  const secondMonth = addMonths(visibleMonth, 1);
  const singleMonth = months === 1;

  const setVisibleMonth = (next: Date) => {
    const normalized = startOfMonth(next);
    if (controlledVisibleMonth === undefined) setInternalVisibleMonth(normalized);
    onVisibleMonthChange?.(normalized);
  };

  const commit = (next: DateRange) => {
    if (controlledValue === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const selectDate = (date: Date) => {
    if (!value.start || value.end) {
      commit({ start: date, end: null });
      return;
    }

    if (compareDays(date, value.start) < 0) {
      commit({ start: date, end: value.start });
      return;
    }

    commit({ start: value.start, end: date });
  };

  return (
    <div
      className={joinClassNames(
        'fdoc-range-calendar',
        singleMonth && 'fdoc-range-calendar--single',
        className,
      )}
      role="group"
      aria-label={ariaLabel}
      data-testid={testId}
      data-months={months}
    >
      <div className="fdoc-range-calendar__months">
        <div className="fdoc-range-calendar__month fdoc-range-calendar__month--primary">
          <CalendarMonthPanel
            month={visibleMonth}
            rangeStart={value.start}
            rangeEnd={value.end}
            minDate={minDate}
            maxDate={maxDate}
            isDateDisabled={isDateDisabled}
            onSelectDate={selectDate}
            onPrevious={() => setVisibleMonth(addMonths(visibleMonth, -1))}
            onNext={() => setVisibleMonth(addMonths(visibleMonth, 1))}
            showPrevious
            showNext
            nextButtonClassName="fdoc-range-calendar__mobile-next"
            data-testid="range-calendar-month-1"
          />
        </div>

        <div className="fdoc-range-calendar__month fdoc-range-calendar__month--secondary">
          <CalendarMonthPanel
            month={secondMonth}
            rangeStart={value.start}
            rangeEnd={value.end}
            minDate={minDate}
            maxDate={maxDate}
            isDateDisabled={isDateDisabled}
            onSelectDate={selectDate}
            onNext={() => setVisibleMonth(addMonths(visibleMonth, 1))}
            showPrevious={false}
            showNext
            data-testid="range-calendar-month-2"
          />
        </div>
      </div>

      {showActions && (
        <CalendarActions
          applyText={applyText}
          cancelText={cancelText}
          onCancel={onCancel}
          onApply={() => onApply?.(value)}
          applyDisabled={!value.start || !value.end}
        />
      )}
    </div>
  );
}

export type { DateRange } from './dateUtils';
