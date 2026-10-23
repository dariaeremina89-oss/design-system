import { useMemo, useState } from 'react';
import { Button } from '../Button/Button';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { Icon } from '../Icon/Icon';
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
  startOfDay,
  startOfMonth,
} from './dateUtils';
import './Calendar.css';

export type CalendarType = 'date' | 'month' | 'year';
export type CalendarView = CalendarType;

export interface CalendarProps {
  /** Итоговое значение Calendar: дата, месяц или год. */
  type?: CalendarType;
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
  visibleMonth?: Date;
  defaultVisibleMonth?: Date;
  onVisibleMonthChange?: (month: Date) => void;
  /** Управление внутренним уровнем навигации. Обычно достаточно type. */
  view?: CalendarView;
  defaultView?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  /** Buttons из Figma. При false итоговое значение применяется сразу. */
  showActions?: boolean;
  applyText?: string;
  cancelText?: string;
  onApply?: (value: Date | null) => void;
  onCancel?: () => void;
  className?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

export type CalendarMonthHeaderLayout = 'single' | 'range-left' | 'range-right' | 'none';

export type CalendarMonthPanelProps = {
  month: Date;
  selectedDate?: Date | null;
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  previewStart?: Date | null;
  previewEnd?: Date | null;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  onSelectDate: (date: Date) => void;
  onHoverDate?: (date: Date | null) => void;
  onPeriodClick?: () => void;
  periodOpen?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  headerLayout?: CalendarMonthHeaderLayout;
  showWeekdays?: boolean;
  className?: string;
  'data-testid'?: string;
};

function joinClassNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function isCalendarDateDisabled(
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  isDateDisabled?: (date: Date) => boolean,
) {
  if (minDate && compareDays(date, minDate) < 0) return true;
  if (maxDate && compareDays(date, maxDate) > 0) return true;
  return Boolean(isDateDisabled?.(date));
}

function periodHasAvailableDate(
  month: Date,
  minDate?: Date,
  maxDate?: Date,
  isDateDisabled?: (date: Date) => boolean,
) {
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  for (let day = 1; day <= days; day += 1) {
    if (!isCalendarDateDisabled(new Date(month.getFullYear(), month.getMonth(), day), minDate, maxDate, isDateDisabled)) {
      return true;
    }
  }
  return false;
}

function yearHasAvailableDate(
  year: number,
  minDate?: Date,
  maxDate?: Date,
  isDateDisabled?: (date: Date) => boolean,
) {
  for (let month = 0; month < 12; month += 1) {
    if (periodHasAvailableDate(new Date(year, month, 1), minDate, maxDate, isDateDisabled)) return true;
  }
  return false;
}

function CalendarPeriodButton({
  label,
  open = false,
  onClick,
  disabled = false,
  centered = false,
}: {
  label: string;
  open?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  centered?: boolean;
}) {
  return (
    <button
      type="button"
      className={joinClassNames('fdoc-calendar__period', centered && 'fdoc-calendar__period--centered')}
      onClick={onClick}
      disabled={disabled}
      aria-expanded={open}
      data-testid="calendar-period"
    >
      <span className="fdoc-calendar__period-text">{label}</span>
      <Icon name={open ? 'arrow-drop-up' : 'arrow-drop-down'} size={24} />
    </button>
  );
}

function CalendarArrow({
  direction,
  onClick,
  disabled,
  ariaLabel,
}: {
  direction: 'previous' | 'next';
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  return (
    <ButtonIcon
      icon={direction === 'previous' ? 'arrow-chevron-left' : 'arrow-chevron-right'}
      iconSize={24}
      size="small"
      color="neutral"
      aria-label={ariaLabel ?? (direction === 'previous' ? 'Предыдущий месяц' : 'Следующий месяц')}
      onClick={onClick}
      disabled={disabled}
      data-testid={direction === 'previous' ? 'calendar-previous' : 'calendar-next'}
    />
  );
}

const WEEKDAY_ACCESSIBLE_LABELS = [
  'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье',
] as const;

export function CalendarWeekdays() {
  return (
    <div className="fdoc-calendar__weekdays" data-testid="calendar-weekdays">
      {WEEKDAY_LABELS.map((label, index) => (
        <span key={label} aria-label={WEEKDAY_ACCESSIBLE_LABELS[index]}>{label}</span>
      ))}
    </div>
  );
}

export function CalendarMonthPanel({
  month,
  selectedDate,
  rangeStart,
  rangeEnd,
  previewStart,
  previewEnd,
  minDate,
  maxDate,
  isDateDisabled,
  onSelectDate,
  onHoverDate,
  onPeriodClick,
  periodOpen = false,
  onPrevious,
  onNext,
  previousDisabled = false,
  nextDisabled = false,
  headerLayout = 'single',
  showWeekdays = true,
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

  const header = headerLayout === 'single' ? (
    <div className="fdoc-calendar__header fdoc-calendar__header--single">
      <CalendarPeriodButton
        label={formatMonthYear(month)}
        open={periodOpen}
        onClick={onPeriodClick}
      />
      <div className="fdoc-calendar__arrows">
        <CalendarArrow direction="previous" onClick={onPrevious} disabled={previousDisabled} />
        <CalendarArrow direction="next" onClick={onNext} disabled={nextDisabled} />
      </div>
    </div>
  ) : headerLayout === 'range-left' ? (
    <div className="fdoc-calendar__header fdoc-calendar__header--range-left">
      <CalendarArrow direction="previous" onClick={onPrevious} disabled={previousDisabled} />
      <div className="fdoc-calendar__range-period">
        <CalendarPeriodButton
          label={formatMonthYear(month)}
          open={periodOpen}
          onClick={onPeriodClick}
          centered
        />
      </div>
    </div>
  ) : headerLayout === 'range-right' ? (
    <div className="fdoc-calendar__header fdoc-calendar__header--range-right">
      <div className="fdoc-calendar__range-period">
        <CalendarPeriodButton
          label={formatMonthYear(month)}
          open={periodOpen}
          onClick={onPeriodClick}
          centered
        />
      </div>
      <CalendarArrow direction="next" onClick={onNext} disabled={nextDisabled} />
    </div>
  ) : null;

  return (
    <div className={joinClassNames('fdoc-calendar__month-panel', className)} data-testid={testId}>
      {header}
      {showWeekdays && <CalendarWeekdays />}

      <div className="fdoc-calendar__date-grid" role="grid">
        {weeks.map((week, weekIndex) => (
          <div className="fdoc-calendar__week" role="row" key={weekIndex}>
            {week.map((date, dayIndex) => {
              if (!date) {
                return <span className="fdoc-calendar__day-empty" role="gridcell" key={`empty-${dayIndex}`} />;
              }

              const disabled = isCalendarDateDisabled(date, minDate, maxDate, isDateDisabled);
              const selected = isSameDay(date, selectedDate);
              const todayState = isSameDay(date, today);
              const rangeStartState = isSameDay(date, rangeStart);
              const rangeEndState = isSameDay(date, rangeEnd);
              const rangeMiddle = isDateWithinRange(date, rangeStart ?? null, rangeEnd ?? null);
              const rangeSingle = rangeStartState && rangeEndState;
              const hasRangeFill = rangeStartState || rangeEndState || rangeMiddle;
              const previewStartState = isSameDay(date, previewStart);
              const previewEndState = isSameDay(date, previewEnd);
              const previewMiddle = isDateWithinRange(date, previewStart ?? null, previewEnd ?? null);
              const hasPreview = !hasRangeFill && (previewStartState || previewEndState || previewMiddle);

              return (
                <span
                  className={joinClassNames(
                    'fdoc-calendar__day-shell',
                    rangeStartState && 'fdoc-calendar__day-shell--range-start',
                    rangeEndState && 'fdoc-calendar__day-shell--range-end',
                    rangeSingle && 'fdoc-calendar__day-shell--range-single',
                    hasPreview && 'fdoc-calendar__day-shell--range-preview',
                  )}
                  role="gridcell"
                  aria-selected={selected || rangeStartState || rangeEndState || undefined}
                  aria-disabled={disabled || undefined}
                  key={date.toISOString()}
                >
                  {hasRangeFill && <span className="fdoc-calendar__range-fill" aria-hidden="true" />}
                  {hasPreview && <span className="fdoc-calendar__range-preview-fill" aria-hidden="true" />}
                  <button
                    type="button"
                    className={joinClassNames(
                      'fdoc-calendar__day',
                      todayState && !selected && !rangeStartState && !rangeEndState && 'fdoc-calendar__day--today',
                      (selected || rangeStartState || rangeEndState) && 'fdoc-calendar__day--selected',
                    )}
                    disabled={disabled}
                    aria-label={new Intl.DateTimeFormat('ru-RU', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    }).format(date)}
                    onMouseEnter={() => onHoverDate?.(date)}
                    onMouseLeave={() => onHoverDate?.(null)}
                    onFocus={() => onHoverDate?.(date)}
                    onClick={() => onSelectDate(date)}
                    data-testid={`calendar-day-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`}
                  >
                    <span className="fdoc-calendar__day-value">{date.getDate()}</span>
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
  type = 'date',
  value: controlledValue,
  defaultValue = null,
  onValueChange,
  visibleMonth: controlledVisibleMonth,
  defaultVisibleMonth,
  onVisibleMonthChange,
  view: controlledView,
  defaultView,
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
  const baseView: CalendarView = type;
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue);
  const [internalVisibleMonth, setInternalVisibleMonth] = useState(() =>
    startOfMonth(defaultVisibleMonth ?? defaultValue ?? new Date()),
  );
  const [internalView, setInternalView] = useState<CalendarView>(defaultView ?? baseView);
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

  const selectFinalValue = (date: Date) => {
    if (controlledValue === undefined) setInternalValue(date);
    onValueChange?.(date);
    if (!showActions) onApply?.(date);
  };

  const changePage = (direction: -1 | 1) => {
    if (view === 'date') setVisibleMonth(addMonths(visibleMonth, direction));
    else if (view === 'month') setVisibleMonth(addYears(visibleMonth, direction));
    else setVisibleMonth(addYears(visibleMonth, direction * 24));
  };

  const currentPeriodAvailable = (target: Date) => {
    if (view === 'date') return periodHasAvailableDate(target, minDate, maxDate, isDateDisabled);
    if (view === 'month') return yearHasAvailableDate(target.getFullYear(), minDate, maxDate, isDateDisabled);
    const rangeStart = target.getFullYear() - 14;
    return Array.from({ length: 24 }, (_, index) => rangeStart + index)
      .some(year => yearHasAvailableDate(year, minDate, maxDate, isDateDisabled));
  };

  const previousTarget = view === 'date'
    ? addMonths(visibleMonth, -1)
    : view === 'month'
      ? addYears(visibleMonth, -1)
      : addYears(visibleMonth, -24);
  const nextTarget = view === 'date'
    ? addMonths(visibleMonth, 1)
    : view === 'month'
      ? addYears(visibleMonth, 1)
      : addYears(visibleMonth, 24);

  const yearStart = visibleMonth.getFullYear() - 14;
  const years = Array.from({ length: 24 }, (_, index) => yearStart + index);

  const periodLabel = view === 'month'
    ? String(visibleMonth.getFullYear())
    : `${yearStart}–${yearStart + 23}`;

  const handlePeriodClick = () => {
    if (view === 'date') setView('month');
    else if (view === 'month') setView('year');
    else if (type !== 'year') setView(type === 'date' ? 'month' : type);
  };

  const handleMonthChoice = (monthIndex: number) => {
    const date = new Date(visibleMonth.getFullYear(), monthIndex, 1);
    if (type === 'month') {
      selectFinalValue(date);
      return;
    }
    setVisibleMonth(date);
    setView('date');
  };

  const handleYearChoice = (year: number) => {
    if (type === 'year') {
      selectFinalValue(new Date(year, 0, 1));
      return;
    }
    setVisibleMonth(new Date(year, visibleMonth.getMonth(), 1));
    setView('month');
  };

  return (
    <div
      className={joinClassNames('fdoc-calendar', className)}
      role="group"
      aria-label={ariaLabel}
      data-testid={testId}
      data-calendar-type={type}
      data-calendar-view={view}
    >
      {view === 'date' ? (
        <CalendarMonthPanel
          month={visibleMonth}
          selectedDate={type === 'date' ? value : null}
          minDate={minDate}
          maxDate={maxDate}
          isDateDisabled={isDateDisabled}
          onSelectDate={selectFinalValue}
          onPeriodClick={handlePeriodClick}
          periodOpen={false}
          onPrevious={() => changePage(-1)}
          onNext={() => changePage(1)}
          previousDisabled={!currentPeriodAvailable(previousTarget)}
          nextDisabled={!currentPeriodAvailable(nextTarget)}
          headerLayout="single"
        />
      ) : (
        <>
          <div className="fdoc-calendar__header fdoc-calendar__header--single">
            <CalendarPeriodButton
              label={periodLabel}
              open
              onClick={handlePeriodClick}
            />
            <div className="fdoc-calendar__arrows">
              <CalendarArrow
                direction="previous"
                onClick={() => changePage(-1)}
                disabled={!currentPeriodAvailable(previousTarget)}
                ariaLabel={view === 'month' ? 'Предыдущий год' : 'Предыдущий диапазон лет'}
              />
              <CalendarArrow
                direction="next"
                onClick={() => changePage(1)}
                disabled={!currentPeriodAvailable(nextTarget)}
                ariaLabel={view === 'month' ? 'Следующий год' : 'Следующий диапазон лет'}
              />
            </div>
          </div>

          <div className="fdoc-calendar__choices" role="grid">
            {view === 'month'
              ? MONTH_LABELS_SHORT.map((label, monthIndex) => {
                  const date = new Date(visibleMonth.getFullYear(), monthIndex, 1);
                  const selected = Boolean(
                    type === 'month'
                    && value
                    && value.getFullYear() === date.getFullYear()
                    && value.getMonth() === monthIndex,
                  );
                  const current = today.getFullYear() === date.getFullYear() && today.getMonth() === monthIndex;
                  const disabled = !periodHasAvailableDate(date, minDate, maxDate, isDateDisabled);
                  return (
                    <button
                      key={label}
                      type="button"
                      className={joinClassNames(
                        'fdoc-calendar__choice',
                        selected && 'fdoc-calendar__choice--selected',
                        current && !selected && 'fdoc-calendar__choice--today',
                      )}
                      role="gridcell"
                      aria-selected={selected || undefined}
                      aria-disabled={disabled || undefined}
                      disabled={disabled}
                      onClick={() => handleMonthChoice(monthIndex)}
                    >
                      {label}
                    </button>
                  );
                })
              : years.map(year => {
                  const selected = type === 'year' && value?.getFullYear() === year;
                  const current = today.getFullYear() === year;
                  const disabled = !yearHasAvailableDate(year, minDate, maxDate, isDateDisabled);
                  return (
                    <button
                      key={year}
                      type="button"
                      className={joinClassNames(
                        'fdoc-calendar__choice',
                        selected && 'fdoc-calendar__choice--selected',
                        current && !selected && 'fdoc-calendar__choice--today',
                      )}
                      role="gridcell"
                      aria-selected={selected || undefined}
                      aria-disabled={disabled || undefined}
                      disabled={disabled}
                      onClick={() => handleYearChoice(year)}
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
