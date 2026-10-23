import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react';
import { usePickerPopoverPosition } from './usePickerPopoverPosition';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { Calendar, type CalendarProps } from '../Calendar/Calendar';
import { Input, type InputProps } from '../Input/Input';
import {
  compareDays,
  formatDateValue,
  maskDateInput,
  parseDateValue,
} from '../Calendar/dateUtils';
import './DatePicker.css';

export interface DatePickerProps
  extends Omit<
    InputProps,
    'value' | 'defaultValue' | 'onChange' | 'type' | 'placeholder'
    | 'description' | 'leadingIcon' | 'leadingContent'
    | 'clearable' | 'onClear' | 'clearIcon'
    | 'sum' | 'sumIcon' | 'inlineSuffix'
    | 'trailingContent' | 'trailingIcon' | 'trailingSkeleton'
  > {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
  placeholder?: string;
  /** Разрешает ручной ввод. Нельзя отключать одновременно с calendarSelection. */
  manualInput?: boolean;
  /** Показывает отдельную Calendar icon и разрешает выбор через Calendar. */
  calendarSelection?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  calendarProps?: Omit<
    CalendarProps,
    'type' | 'value' | 'defaultValue' | 'onValueChange' | 'onApply' | 'onCancel' | 'minDate' | 'maxDate' | 'isDateDisabled'
  >;
  'data-testid'?: string;
}

function joinClassNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function isAllowed(
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  isDateDisabled?: (date: Date) => boolean,
) {
  if (minDate && compareDays(date, minDate) < 0) return false;
  if (maxDate && compareDays(date, maxDate) > 0) return false;
  return !isDateDisabled?.(date);
}

export function DatePicker({
  value: controlledValue,
  defaultValue = null,
  onValueChange,
  placeholder = '__.__.____',
  manualInput = true,
  calendarSelection = true,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  minDate,
  maxDate,
  isDateDisabled,
  calendarProps,
  label = 'Выберите дату',
  disabled = false,
  skeleton = false,
  wrapperClassName,
  onBlur,
  'data-testid': testId = 'date-picker',
  ...inputProps
}: DatePickerProps) {
  const popupId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const calendarButtonRef = useRef<HTMLButtonElement | null>(null);
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;
  const open = controlledOpen ?? internalOpen;
  const calendarOpen = open && calendarSelection && !disabled && !skeleton;
  const [textValue, setTextValue] = useState(() => formatDateValue(controlledValue ?? defaultValue));
  const [draftValue, setDraftValue] = useState<Date | null>(controlledValue ?? defaultValue);
  const resolvedManualInput = manualInput || !calendarSelection;
  const calendarButtons = calendarProps?.showActions ?? false;
  const popupStyle = usePickerPopoverPosition(calendarOpen, fieldRef, popupRef);

  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const restoreCalendarButtonFocus = () => {
    requestAnimationFrame(() => calendarButtonRef.current?.focus());
  };

  const closeCalendar = (restoreFocus = false) => {
    setDraftValue(currentValue);
    setOpen(false);
    if (restoreFocus) restoreCalendarButtonFocus();
  };

  useEffect(() => {
    if (controlledValue !== undefined) setTextValue(formatDateValue(controlledValue));
  }, [controlledValue]);

  useEffect(() => {
    if (!open) return;
    setDraftValue(currentValue);
  }, [open, currentValue]);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeCalendar();
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open, currentValue]);

  const commit = (next: Date | null) => {
    if (controlledValue === undefined) setInternalValue(next);
    setTextValue(formatDateValue(next));
    onValueChange?.(next);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!resolvedManualInput) return;
    const nextText = maskDateInput(event.currentTarget.value);
    setTextValue(nextText);
    if (!nextText) {
      commit(null);
      return;
    }
    const parsed = parseDateValue(nextText);
    if (parsed && isAllowed(parsed, minDate, maxDate, isDateDisabled)) {
      if (controlledValue === undefined) setInternalValue(parsed);
      onValueChange?.(parsed);
    }
  };

  const handleCalendarValueChange = (next: Date | null) => {
    if (!next) return;
    if (calendarButtons) {
      setDraftValue(next);
      return;
    }
    commit(next);
    setOpen(false);
    restoreCalendarButtonFocus();
  };

  return (
    <div
      ref={rootRef}
      className={joinClassNames('fdoc-date-picker', calendarOpen && 'fdoc-date-picker--open')}
      data-testid={testId}
      onKeyDown={event => {
        if (event.key === 'Escape' && calendarOpen) {
          event.stopPropagation();
          closeCalendar(true);
        }
      }}
    >
      <Input
        {...inputProps}
        value={textValue}
        label={label}
        placeholder={placeholder}
        disabled={disabled}
        skeleton={skeleton}
        wrapperClassName={wrapperClassName}
        inputMode="numeric"
        maxLength={10}
        autoComplete="off"
        aria-controls={calendarOpen ? popupId : undefined}
        readOnly={!resolvedManualInput}
        fieldRef={fieldRef}
        onChange={handleInputChange}
        onBlur={onBlur}
        trailingContent={calendarSelection ? (
          <ButtonIcon
            icon="calendar"
            iconSize={24}
            size="small"
            color="neutral"
            className="fdoc-date-picker__calendar-button"
            aria-label={open ? 'Закрыть календарь' : 'Открыть календарь'}
            aria-haspopup="dialog"
            aria-expanded={calendarOpen}
            aria-controls={calendarOpen ? popupId : undefined}
            disabled={disabled}
            onClick={event => {
              calendarButtonRef.current = event.currentTarget;
              setOpen(!open);
            }}
            data-testid="date-picker-button"
          />
        ) : undefined}
        trailingSkeleton={calendarSelection ? (
          <ButtonIcon
            icon="calendar"
            iconSize={24}
            size="small"
            color="neutral"
            state="skeleton"
            aria-label="Календарь"
          />
        ) : undefined}
        data-testid="date-picker-input"
      />

      {calendarOpen && (
        <div
          ref={popupRef}
          id={popupId}
          className="fdoc-date-picker__popup"
          style={popupStyle}
          role="dialog"
          aria-label="Выбор даты"
          data-testid="date-picker-popup"
        >
          <Calendar
            {...calendarProps}
            type="date"
            showActions={calendarButtons}
            value={draftValue}
            defaultVisibleMonth={draftValue ?? currentValue ?? new Date()}
            minDate={minDate}
            maxDate={maxDate}
            isDateDisabled={isDateDisabled}
            onValueChange={handleCalendarValueChange}
            onCancel={() => closeCalendar(true)}
            onApply={next => {
              if (next) commit(next);
              setOpen(false);
              restoreCalendarButtonFocus();
            }}
          />
        </div>
      )}
    </div>
  );
}
