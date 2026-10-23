import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { RangeCalendar, type RangeCalendarProps } from '../Calendar/RangeCalendar';
import { Input, type InputProps } from '../Input/Input';
import {
  formatRangeValue,
  maskRangeInput,
  parseRangeValue,
  type DateRange,
} from '../Calendar/dateUtils';
import './DatePicker.css';

export interface RangePickerProps
  extends Omit<
    InputProps,
    'value' | 'defaultValue' | 'onChange' | 'type' | 'placeholder' | 'trailingContent' | 'trailingIcon'
  > {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (value: DateRange) => void;
  placeholder?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  calendarProps?: Omit<
    RangeCalendarProps,
    'value' | 'defaultValue' | 'onValueChange' | 'onApply' | 'onCancel' | 'minDate' | 'maxDate' | 'isDateDisabled'
  >;
  'data-testid'?: string;
}

const EMPTY_RANGE: DateRange = { start: null, end: null };

export function RangePicker({
  value: controlledValue,
  defaultValue = EMPTY_RANGE,
  onValueChange,
  placeholder = '__.__.____ — __.__.____',
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  minDate,
  maxDate,
  isDateDisabled,
  calendarProps,
  label = 'Выберите период',
  disabled = false,
  skeleton = false,
  wrapperClassName,
  'data-testid': testId = 'range-picker',
  ...inputProps
}: RangePickerProps) {
  const popupId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = useState<DateRange>(defaultValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const currentValue = controlledValue ?? internalValue;
  const open = controlledOpen ?? internalOpen;
  const [textValue, setTextValue] = useState(() => formatRangeValue(controlledValue ?? defaultValue));
  const [draftValue, setDraftValue] = useState<DateRange>(controlledValue ?? defaultValue);

  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (controlledValue !== undefined) setTextValue(formatRangeValue(controlledValue));
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

  const commit = (next: DateRange) => {
    if (controlledValue === undefined) setInternalValue(next);
    setTextValue(formatRangeValue(next));
    onValueChange?.(next);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextText = maskRangeInput(event.currentTarget.value);
    setTextValue(nextText);
    if (!nextText) {
      commit(EMPTY_RANGE);
      return;
    }
    const parsed = parseRangeValue(nextText);
    if (parsed) {
      if (controlledValue === undefined) setInternalValue(parsed);
      onValueChange?.(parsed);
    }
  };

  return (
    <div
      ref={rootRef}
      className="fdoc-range-picker"
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
        maxLength={23}
        autoComplete="off"
        onChange={handleInputChange}
        trailingContent={(
          <ButtonIcon
            icon="calendar"
            size="small"
            color="neutral"
            className="fdoc-range-picker__calendar-button"
            aria-label={open ? 'Закрыть календарь' : 'Открыть календарь'}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={open ? popupId : undefined}
            disabled={disabled}
            onClick={() => setOpen(!open)}
            data-testid="range-picker-button"
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
        data-testid="range-picker-input"
      />

      {open && !disabled && !skeleton && (
        <div
          id={popupId}
          className="fdoc-range-picker__popup"
          role="dialog"
          aria-label="Выбор периода"
          data-testid="range-picker-popup"
        >
          <RangeCalendar
            {...calendarProps}
            value={draftValue}
            defaultVisibleMonth={draftValue.start ?? currentValue.start ?? new Date()}
            minDate={minDate}
            maxDate={maxDate}
            isDateDisabled={isDateDisabled}
            months={calendarProps?.months ?? 'responsive'}
            onValueChange={setDraftValue}
            onCancel={() => {
              setDraftValue(currentValue);
              setOpen(false);
            }}
            onApply={next => {
              if (next.start && next.end) commit(next);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

export type { DateRange } from '../Calendar/dateUtils';
