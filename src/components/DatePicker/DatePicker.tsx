import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react';
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
    'value' | 'defaultValue' | 'onChange' | 'type' | 'placeholder' | 'trailingContent' | 'trailingIcon'
  > {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
  placeholder?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  calendarProps?: Omit<
    CalendarProps,
    'value' | 'defaultValue' | 'onValueChange' | 'onApply' | 'onCancel' | 'minDate' | 'maxDate' | 'isDateDisabled'
  >;
  'data-testid'?: string;
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
  'data-testid': testId = 'date-picker',
  ...inputProps
}: DatePickerProps) {
  const popupId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;
  const open = controlledOpen ?? internalOpen;
  const [textValue, setTextValue] = useState(() => formatDateValue(controlledValue ?? defaultValue));
  const [draftValue, setDraftValue] = useState<Date | null>(controlledValue ?? defaultValue);

  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(next);
    onOpenChange?.(next);
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
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  const commit = (next: Date | null) => {
    if (controlledValue === undefined) setInternalValue(next);
    setTextValue(formatDateValue(next));
    onValueChange?.(next);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div
      ref={rootRef}
      className="fdoc-date-picker"
      data-testid={testId}
      onKeyDown={event => {
        if (event.key === 'Escape' && open) {
          event.stopPropagation();
          setOpen(false);
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
        onChange={handleInputChange}
        trailingContent={(
          <ButtonIcon
            icon="calendar"
            size="small"
            color="neutral"
            className="fdoc-date-picker__calendar-button"
            aria-label={open ? 'Закрыть календарь' : 'Открыть календарь'}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={open ? popupId : undefined}
            disabled={disabled}
            onClick={() => setOpen(!open)}
            data-testid="date-picker-button"
          />
        )}
        trailingSkeleton={(
          <ButtonIcon
            icon="calendar"
            size="small"
            color="neutral"
            state="skeleton"
            aria-label="Календарь"
          />
        )}
        data-testid="date-picker-input"
      />

      {open && !disabled && !skeleton && (
        <div
          id={popupId}
          className="fdoc-date-picker__popup"
          role="dialog"
          aria-label="Выбор даты"
          data-testid="date-picker-popup"
        >
          <Calendar
            {...calendarProps}
            value={draftValue}
            defaultVisibleMonth={draftValue ?? currentValue ?? new Date()}
            minDate={minDate}
            maxDate={maxDate}
            isDateDisabled={isDateDisabled}
            onValueChange={setDraftValue}
            onCancel={() => {
              setDraftValue(currentValue);
              setOpen(false);
            }}
            onApply={next => {
              if (next) commit(next);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
