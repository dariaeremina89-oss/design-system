import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Calendar,
  CalendarActions,
  CalendarMonthPanel,
  CalendarWeekdays,
  isCalendarDateDisabled,
} from './Calendar';
import {
  addMonths,
  compareDays,
  formatMonthYear,
  startOfDay,
  startOfMonth,
  type DateRange,
} from './dateUtils';
import { Scrollbar } from '../Scrollbar/Scrollbar';
import './Calendar.css';

export interface RangeCalendarProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (value: DateRange) => void;
  /** Вызывается после выбора второй границы полного периода. */
  onComplete?: (value: DateRange) => void;
  visibleMonth?: Date;
  defaultVisibleMonth?: Date;
  onVisibleMonthChange?: (month: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  minRange?: number;
  maxRange?: number;
  months?: 1 | 2 | 'responsive';
  showActions?: boolean;
  applyText?: string;
  cancelText?: string;
  onApply?: (value: DateRange) => void;
  onCancel?: () => void;
  /** Внутренний сигнал сброса незавершенного выбора без изменения примененного value. */
  resetKey?: string | number;
  className?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

function joinClassNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

const EMPTY_RANGE: DateRange = { start: null, end: null };
const DAY_MS = 24 * 60 * 60 * 1000;

function orderRange(left: Date, right: Date): DateRange {
  return compareDays(left, right) <= 0
    ? { start: left, end: right }
    : { start: right, end: left };
}

function rangeLength(start: Date, end: Date) {
  return Math.round((startOfDay(end).getTime() - startOfDay(start).getTime()) / DAY_MS) + 1;
}

function everyDateInRange(start: Date, end: Date, predicate: (date: Date) => boolean) {
  const cursor = startOfDay(start);
  const last = startOfDay(end);
  while (compareDays(cursor, last) <= 0) {
    if (!predicate(cursor)) return false;
    cursor.setDate(cursor.getDate() + 1);
  }
  return true;
}

export function RangeCalendar({
  value: controlledValue,
  defaultValue = EMPTY_RANGE,
  onValueChange,
  onComplete,
  visibleMonth: controlledVisibleMonth,
  defaultVisibleMonth,
  onVisibleMonthChange,
  minDate,
  maxDate,
  isDateDisabled,
  minRange = 1,
  maxRange,
  months = 'responsive',
  showActions = true,
  applyText = 'Выбрать',
  cancelText = 'Отменить',
  onApply,
  onCancel,
  resetKey,
  className,
  'aria-label': ariaLabel = 'Выбор периода',
  'data-testid': testId = 'range-calendar',
}: RangeCalendarProps) {
  const [internalValue, setInternalValue] = useState<DateRange>(defaultValue);
  const [internalVisibleMonth, setInternalVisibleMonth] = useState(() =>
    startOfMonth(defaultVisibleMonth ?? defaultValue.start ?? new Date()),
  );
  const [anchorDate, setAnchorDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [periodTarget, setPeriodTarget] = useState<'left' | 'right' | null>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const value = controlledValue ?? internalValue;
  const visibleMonth = startOfMonth(controlledVisibleMonth ?? internalVisibleMonth);
  const secondMonth = addMonths(visibleMonth, 1);
  const singleMonth = months === 1;

  const mobileMonths = useMemo(
    () => Array.from({ length: 12 }, (_, index) => addMonths(visibleMonth, index - 1)),
    [visibleMonth],
  );

  useEffect(() => {
    setAnchorDate(null);
    setHoverDate(null);
    setPeriodTarget(null);
  }, [resetKey]);

  const setVisibleMonth = (next: Date) => {
    const normalized = startOfMonth(next);
    if (controlledVisibleMonth === undefined) setInternalVisibleMonth(normalized);
    onVisibleMonthChange?.(normalized);
  };

  const commit = (next: DateRange) => {
    if (controlledValue === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const isRangeValid = (left: Date, right: Date) => {
    const ordered = orderRange(left, right);
    if (!ordered.start || !ordered.end) return false;
    const length = rangeLength(ordered.start, ordered.end);
    if (length < Math.max(1, minRange)) return false;
    if (maxRange !== undefined && length > maxRange) return false;

    return everyDateInRange(
      ordered.start,
      ordered.end,
      date => !isCalendarDateDisabled(date, minDate, maxDate, isDateDisabled),
    );
  };

  const rangeAwareDisabled = (date: Date) => {
    if (isDateDisabled?.(date)) return true;
    if (!anchorDate) return false;
    return !isRangeValid(anchorDate, date);
  };

  const selectDate = (date: Date) => {
    if (!anchorDate) {
      setAnchorDate(date);
      setHoverDate(null);
      if (minRange <= 1) commit({ start: date, end: date });
      else commit({ start: date, end: null });
      return;
    }

    if (!isRangeValid(anchorDate, date)) return;
    const next = orderRange(anchorDate, date);
    commit(next);
    setAnchorDate(null);
    setHoverDate(null);
    onComplete?.(next);
  };

  const preview = anchorDate && hoverDate && isRangeValid(anchorDate, hoverDate)
    ? orderRange(anchorDate, hoverDate)
    : EMPTY_RANGE;

  const openPeriodPicker = (target: 'left' | 'right') => {
    setPeriodTarget(current => current === target ? null : target);
  };

  const handlePeriodMonth = (month: Date | null) => {
    if (!month) return;
    setVisibleMonth(periodTarget === 'right' ? addMonths(month, -1) : month);
    setPeriodTarget(null);
  };

  const panelProps = {
    rangeStart: value.start,
    rangeEnd: value.end,
    previewStart: preview.start,
    previewEnd: preview.end,
    minDate,
    maxDate,
    isDateDisabled: rangeAwareDisabled,
    onSelectDate: selectDate,
    onHoverDate: setHoverDate,
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
      <div className="fdoc-range-calendar__desktop">
        <div className="fdoc-range-calendar__months">
          <div className="fdoc-range-calendar__month fdoc-range-calendar__month--primary">
            <CalendarMonthPanel
              {...panelProps}
              month={visibleMonth}
              onPeriodClick={() => openPeriodPicker('left')}
              periodOpen={periodTarget === 'left'}
              onPrevious={() => setVisibleMonth(addMonths(visibleMonth, -1))}
              headerLayout={singleMonth ? 'single' : 'range-left'}
              onNext={singleMonth ? () => setVisibleMonth(addMonths(visibleMonth, 1)) : undefined}
              data-testid="range-calendar-month-1"
            />
          </div>

          <div className="fdoc-range-calendar__month fdoc-range-calendar__month--secondary">
            <CalendarMonthPanel
              {...panelProps}
              month={secondMonth}
              onPeriodClick={() => openPeriodPicker('right')}
              periodOpen={periodTarget === 'right'}
              onNext={() => setVisibleMonth(addMonths(visibleMonth, 1))}
              headerLayout="range-right"
              data-testid="range-calendar-month-2"
            />
          </div>
        </div>

        {periodTarget && (
          <div
            className={joinClassNames(
              'fdoc-range-calendar__period-popover',
              periodTarget === 'right' && 'fdoc-range-calendar__period-popover--right',
            )}
            data-testid="range-calendar-period-picker"
          >
            <Calendar
              type="month"
              value={periodTarget === 'right' ? secondMonth : visibleMonth}
              defaultVisibleMonth={periodTarget === 'right' ? secondMonth : visibleMonth}
              showActions={false}
              minDate={minDate}
              maxDate={maxDate}
              isDateDisabled={isDateDisabled}
              onValueChange={handlePeriodMonth}
            />
          </div>
        )}
      </div>

      {months === 'responsive' && (
        <div className="fdoc-range-calendar__mobile" data-testid="range-calendar-mobile">
          <div className="fdoc-range-calendar__mobile-weekdays">
            <CalendarWeekdays />
          </div>
          <div className="fdoc-range-calendar__mobile-scroll-area">
            <div ref={mobileScrollRef} className="fdoc-range-calendar__mobile-scroll fdoc-scrollbar-viewport">
              {mobileMonths.map(month => (
                <section key={month.toISOString()} data-testid="range-calendar-mobile-month">
                  <div className="fdoc-range-calendar__mobile-month-title">
                    {formatMonthYear(month)}
                  </div>
                  <CalendarMonthPanel
                    {...panelProps}
                    month={month}
                    headerLayout="none"
                    showWeekdays={false}
                  />
                </section>
              ))}
            </div>
            <Scrollbar viewportRef={mobileScrollRef} data-testid="range-calendar-scrollbar" />
          </div>
        </div>
      )}

      {showActions && (
        <CalendarActions
          applyText={applyText}
          cancelText={cancelText}
          onCancel={onCancel}
          onApply={() => onApply?.(value)}
          applyDisabled={!value.start || !value.end || !isRangeValid(value.start, value.end)}
        />
      )}
    </div>
  );
}

export type { DateRange } from './dateUtils';
