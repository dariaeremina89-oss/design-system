import { useMemo, useState } from 'react';
import { Button } from '../Button/Button';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import {
  MONTH_LABELS_SHORT,
  WEEKDAY_LABELS,
  addMonths,
  addYears,
  buildMonthCells,
  compareDays,
  formatMonthYear,
  isDateWithinRange,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
} from './dateUtils';
import './Calendar.css';

export type CalendarView = 'date' | 'month' | 'year';

export interface CalendarProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
  visibleMonth?: Date;
  defaultVisibleMonth?: Date;
  onVisibleMonthChange?: (month: Date) => void;
  view?: CalendarView;
  defaultView?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  showActions?: boolean;
  applyText?: string;
  cancelText?: string;
  onApply?: (value: Date | null) => void;
  onCancel?: () => void;
  className?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

type CalendarMonthPanelProps = {
  month: Date;
  selectedDate?: Date | null;
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  onSelectDate: (date: Date) => void;
  onPeriodClick?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  showPrevious?: boolean;
  showNext?: boolean;
  previousButtonClassName?: string;
  nextButtonClassName?: string;
  className?: string;
  'data-testid'?: string;
};

function joinClassNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function isDisabledDate(
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  isDateDisabled?: (date: Date) => boolean,
) {
  if (minDate && compareDays(date, minDate) < 0) return true;
  if (maxDate && compareDays(date, maxDate) > 0) return true;
  return Boolean(isDateDisabled?.(date));
}

export function CalendarMonthPanel({
  month,
  selectedDate,
  rangeStart,
  rangeEnd,
  minDate,
  maxDate,
  isDateDisabled,
  onSelectDate,
  onPeriodClick,
  onPrevious,
  onNext,
  showPrevious = true,
  showNext = true,
  previousButtonClassName,
  nextButtonClassName,
  className,
  'data-testid': testId,
}: CalendarMonthPanelProps) {
  const weeks = useMemo(() => {
    const cells = buildMonthCells(month);
    return Array.from({ length: Math.ceil(cells.length / 7) }, (_, index) =>
      cells.slice(index * 7, index * 7 + 7),
    );
  }, [month]);
  const today = startOfDay(new Date());

  return (
    <div className={joinClassNames('fdoc-calendar__month-panel', className)} data-testid={testId}>
      <div className="fdoc-calendar__header">
        {showPrevious ? (
          <ButtonIcon
            icon="arrow-chevron-left"
            size="small"
            color="neutral"
            aria-label="Предыдущий месяц"
            onClick={onPrevious}
            className={previousButtonClassName}
            data-testid="calendar-previous"
          />
        ) : <span className="fdoc-calendar__header-spacer" aria-hidden="true" />}

        <button
          type="button"
          className="fdoc-calendar__period"
          onClick={onPeriodClick}
          disabled={!onPeriodClick}
          data-testid="calendar-period"
        >
          {formatMonthYear(month)}
        </button>

        {showNext ? (
          <ButtonIcon
            icon="arrow-chevron-right"
            size="small"
            color="neutral"
            aria-label="Следующий месяц"
            onClick={onNext}
            className={nextButtonClassName}
            data-testid="calendar-next"
          />
        ) : <span className="fdoc-calendar__header-spacer" aria-hidden="true" />}
      </div>

      <div className="fdoc-calendar__weekdays" aria-hidden="true">
        {WEEKDAY_LABELS.map(label => <span key={label}>{label}</span>)}
      </div>

      <div className="fdoc-calendar__date-grid" role="grid">
        {weeks.map((week, weekIndex) => (
          <div className="fdoc-calendar__week" role="row" key={weekIndex}>
            {week.map((date, dayIndex) => {
              if (!date) {
                return <span className="fdoc-calendar__day-empty" role="gridcell" key={`empty-${dayIndex}`} />;
              }

              const disabled = isDisabledDate(date, minDate, maxDate, isDateDisabled);
              const selected = isSameDay(date, selectedDate);
              const todayState = isSameDay(date, today);
              const rangeStartState = isSameDay(date, rangeStart);
              const rangeEndState = isSameDay(date, rangeEnd);
              const rangeMiddle = isDateWithinRange(date, rangeStart ?? null, rangeEnd ?? null);
              const rangeSingle = rangeStartState && rangeEndState;
              const hasRangeFill = rangeStartState || rangeEndState || rangeMiddle;

              return (
                <span
                  className={joinClassNames(
                    'fdoc-calendar__day-shell',
                    rangeStartState && 'fdoc-calendar__day-shell--range-start',
                    rangeEndState && 'fdoc-calendar__day-shell--range-end',
                    rangeSingle && 'fdoc-calendar__day-shell--range-single',
                  )}
                  role="gridcell"
                  key={date.toISOString()}
                >
                  {hasRangeFill && <span className="fdoc-calendar__range-fill" aria-hidden="true" />}
                  <button
                    type="button"
                    className={joinClassNames(
                      'fdoc-calendar__day',
                      todayState && !selected && !rangeStartState && !rangeEndState && 'fdoc-calendar__day--today',
                      (selected || rangeStartState || rangeEndState) && 'fdoc-calendar__day--selected',
                    )}
                    disabled={disabled}
                    aria-pressed={selected || rangeStartState || rangeEndState || undefined}
                    aria-label={new Intl.DateTimeFormat('ru-RU', { dateStyle: 'long' }).format(date)}
                    onClick={() => onSelectDate(date)}
                    data-testid={`calendar-day-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`}
                  >
                    {date.getDate()}
                  </button>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CalendarActions({
  applyText = 'Выбрать',
  cancelText = 'Отменить',
  applyDisabled = false,
  onApply,
  onCancel,
}: {
  applyText?: string;
  cancelText?: string;
  applyDisabled?: boolean;
  onApply?: () => void;
  onCancel?: () => void;
}) {
  return (
    <div className="fdoc-calendar__actions" data-testid="calendar-actions">
      <Button size="small" color="tertiary" text={cancelText} onClick={onCancel} />
      <Button size="small" color="primary" text={applyText} disabled={applyDisabled} onClick={onApply} />
    </div>
  );
}

export function Calendar({
  value: controlledValue,
  defaultValue = null,
  onValueChange,
  visibleMonth: controlledVisibleMonth,
  defaultVisibleMonth,
  onVisibleMonthChange,
  view: controlledView,
  defaultView = 'date',
  onViewChange,
  minDate,
  maxDate,
  isDateDisabled,
  showActions = true,
  applyText = 'Выбрать',
  cancelText = 'Отменить',
  onApply,
  onCancel,
  className,
  'aria-label': ariaLabel = 'Календарь',
  'data-testid': testId = 'calendar',
}: CalendarProps) {
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue);
  const [internalVisibleMonth, setInternalVisibleMonth] = useState(() =>
    startOfMonth(defaultVisibleMonth ?? defaultValue ?? new Date()),
  );
  const [internalView, setInternalView] = useState<CalendarView>(defaultView);
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const visibleMonth = startOfMonth(controlledVisibleMonth ?? internalVisibleMonth);
  const view = controlledView ?? internalView;
  const today = new Date();

  const setVisibleMonth = (next: Date) => {
    const normalized = startOfMonth(next);
    if (controlledVisibleMonth === undefined) setInternalVisibleMonth(normalized);
    onVisibleMonthChange?.(normalized);
  };

  const setView = (next: CalendarView) => {
    if (controlledView === undefined) setInternalView(next);
    onViewChange?.(next);
  };

  const selectDate = (date: Date) => {
    if (controlledValue === undefined) setInternalValue(date);
    onValueChange?.(date);
  };

  const changePage = (direction: -1 | 1) => {
    if (view === 'date') setVisibleMonth(addMonths(visibleMonth, direction));
    else if (view === 'month') setVisibleMonth(addYears(visibleMonth, direction));
    else setVisibleMonth(addYears(visibleMonth, direction * 16));
  };

  const yearStart = Math.floor(visibleMonth.getFullYear() / 16) * 16;
  const years = Array.from({ length: 16 }, (_, index) => yearStart + index);

  return (
    <div
      className={joinClassNames('fdoc-calendar', className)}
      role="group"
      aria-label={ariaLabel}
      data-testid={testId}
      data-calendar-view={view}
    >
      {view === 'date' ? (
        <CalendarMonthPanel
          month={visibleMonth}
          selectedDate={value}
          minDate={minDate}
          maxDate={maxDate}
          isDateDisabled={isDateDisabled}
          onSelectDate={selectDate}
          onPeriodClick={() => setView('month')}
          onPrevious={() => changePage(-1)}
          onNext={() => changePage(1)}
        />
      ) : (
        <>
          <div className="fdoc-calendar__header">
            <ButtonIcon
              icon="arrow-chevron-left"
              size="small"
              color="neutral"
              aria-label={view === 'month' ? 'Предыдущий год' : 'Предыдущие годы'}
              onClick={() => changePage(-1)}
              data-testid="calendar-previous"
            />
            <button
              type="button"
              className="fdoc-calendar__period"
              onClick={() => view === 'month' && setView('year')}
              disabled={view === 'year'}
              data-testid="calendar-period"
            >
              {view === 'month' ? visibleMonth.getFullYear() : `${yearStart}–${yearStart + 15}`}
            </button>
            <ButtonIcon
              icon="arrow-chevron-right"
              size="small"
              color="neutral"
              aria-label={view === 'month' ? 'Следующий год' : 'Следующие годы'}
              onClick={() => changePage(1)}
              data-testid="calendar-next"
            />
          </div>

          <div className="fdoc-calendar__choices" role="grid">
            {view === 'month'
              ? MONTH_LABELS_SHORT.map((label, monthIndex) => {
                  const date = new Date(visibleMonth.getFullYear(), monthIndex, 1);
                  const selected = Boolean(value && value.getFullYear() === date.getFullYear() && value.getMonth() === monthIndex);
                  const isToday = today.getFullYear() === date.getFullYear() && today.getMonth() === monthIndex;
                  return (
                    <button
                      key={label}
                      type="button"
                      className={joinClassNames(
                        'fdoc-calendar__choice',
                        selected && 'fdoc-calendar__choice--selected',
                        isToday && !selected && 'fdoc-calendar__choice--today',
                      )}
                      onClick={() => {
                        setVisibleMonth(date);
                        setView('date');
                      }}
                    >
                      {label}
                    </button>
                  );
                })
              : years.map(year => {
                  const selected = value?.getFullYear() === year;
                  const isToday = today.getFullYear() === year;
                  return (
                    <button
                      key={year}
                      type="button"
                      className={joinClassNames(
                        'fdoc-calendar__choice',
                        selected && 'fdoc-calendar__choice--selected',
                        isToday && !selected && 'fdoc-calendar__choice--today',
                      )}
                      onClick={() => {
                        setVisibleMonth(new Date(year, visibleMonth.getMonth(), 1));
                        setView('month');
                      }}
                    >
                      {year}
                    </button>
                  );
                })}
          </div>
        </>
      )}

      {showActions && (
        <CalendarActions
          applyText={applyText}
          cancelText={cancelText}
          onCancel={onCancel}
          onApply={() => onApply?.(value)}
          applyDisabled={!value}
        />
      )}
    </div>
  );
}
