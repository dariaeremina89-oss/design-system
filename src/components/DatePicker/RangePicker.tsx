import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { RangeCalendar, type RangeCalendarProps } from '../Calendar/RangeCalendar';
import { Input, type InputProps } from '../Input/Input';
import { Popup } from '../Menu/Popup';
import {
  compareDays,
  formatRangeValue,
  maskRangeInput,
  parseRangeValue,
  startOfDay,
  type DateRange,
} from '../Calendar/dateUtils';
import './DatePicker.css';

export interface RangePickerProps
  extends Omit<
    InputProps,
    'value' | 'defaultValue' | 'onChange' | 'type' | 'placeholder'
    | 'description' | 'counter'
    | 'leadingIcon' | 'leadingContent'
    | 'clearable' | 'onClear' | 'clearIcon'
    | 'sum' | 'sumIcon' | 'inlineSuffix'
    | 'trailingContent' | 'trailingIcon' | 'trailingSkeleton'
  > {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (value: DateRange) => void;
  placeholder?: string;
  manualInput?: boolean;
  calendarSelection?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  minRange?: number;
  maxRange?: number;
  calendarProps?: Omit<
    RangeCalendarProps,
    'value' | 'defaultValue' | 'onValueChange' | 'onComplete' | 'onApply' | 'onCancel'
    | 'minDate' | 'maxDate' | 'isDateDisabled' | 'minRange' | 'maxRange'
  >;
  'data-testid'?: string;
}

const EMPTY_RANGE: DateRange = { start: null, end: null };
const DAY_MS = 24 * 60 * 60 * 1000;

function joinClassNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function rangeLength(start: Date, end: Date) {
  return Math.round((startOfDay(end).getTime() - startOfDay(start).getTime()) / DAY_MS) + 1;
}

export function RangePicker({
  value: controlledValue,
  defaultValue = EMPTY_RANGE,
  onValueChange,
  placeholder = '__.__.____ — __.__.____',
  manualInput = true,
  calendarSelection = true,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  minDate,
  maxDate,
  isDateDisabled,
  minRange = 1,
  maxRange,
  calendarProps,
  label = 'Выберите период',
  disabled = false,
  skeleton = false,
  wrapperClassName,
  onBlur,
  'data-testid': testId = 'range-picker',
  ...inputProps
}: RangePickerProps) {
  const popupId = useId();
  const fieldRef = useRef<HTMLDivElement>(null);
  const calendarButtonRef = useRef<HTMLButtonElement | null>(null);
  const [internalValue, setInternalValue] = useState<DateRange>(defaultValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const currentValue = controlledValue ?? internalValue;
  const open = controlledOpen ?? internalOpen;
  const calendarOpen = open && calendarSelection && !disabled && !skeleton;
  const [textValue, setTextValue] = useState(() => formatRangeValue(controlledValue ?? defaultValue));
  const [draftValue, setDraftValue] = useState<DateRange>(controlledValue ?? defaultValue);
  const resolvedManualInput = manualInput || !calendarSelection;
  const calendarButtons = calendarProps?.showActions ?? true;

  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const restoreCalendarButtonFocus = () => {
    requestAnimationFrame(() => calendarButtonRef.current?.focus());
  };

  const isRangeAllowed = (range: DateRange) => {
    if (!range.start || !range.end) return false;
    if (compareDays(range.start, range.end) > 0) return false;
    if (minDate && compareDays(range.start, minDate) < 0) return false;
    if (maxDate && compareDays(range.end, maxDate) > 0) return false;
    const length = rangeLength(range.start, range.end);
    if (length < Math.max(1, minRange)) return false;
    if (maxRange !== undefined && length > maxRange) return false;

    const cursor = startOfDay(range.start);
    const end = startOfDay(range.end);
    while (compareDays(cursor, end) <= 0) {
      if (isDateDisabled?.(cursor)) return false;
      cursor.setDate(cursor.getDate() + 1);
    }
    return true;
  };

  const commit = (next: DateRange) => {
    if (controlledValue === undefined) setInternalValue(next);
    setTextValue(formatRangeValue(next));
    onValueChange?.(next);
  };

  const closeCalendar = (restoreFocus = false, applyDraft = false) => {
    if (applyDraft && isRangeAllowed(draftValue)) commit(draftValue);
    else setDraftValue(currentValue);
    setOpen(false);
    if (restoreFocus) restoreCalendarButtonFocus();
  };

  useEffect(() => {
    if (controlledValue !== undefined) setTextValue(formatRangeValue(controlledValue));
  }, [controlledValue]);

  useEffect(() => {
    if (!open) return;
    setDraftValue(currentValue);
  }, [open, currentValue]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!resolvedManualInput) return;
    const nextText = maskRangeInput(event.currentTarget.value);
    setTextValue(nextText);
    if (!nextText) {
      commit(EMPTY_RANGE);
      return;
    }

    const parsed = parseRangeValue(nextText);
    if (parsed && isRangeAllowed(parsed)) {
      if (controlledValue === undefined) setInternalValue(parsed);
      onValueChange?.(parsed);
    }
  };

  return (
    <div
      className={joinClassNames('fdoc-range-picker', calendarOpen && 'fdoc-range-picker--open')}
      data-testid={testId}
      onKeyDown={event => {
        if (event.key === 'Escape' && calendarOpen) {
          event.stopPropagation();
          closeCalendar(true, !calendarButtons);
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
        focused={calendarOpen}
        wrapperClassName={wrapperClassName}
        inputMode="numeric"
        maxLength={23}
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
            className="fdoc-range-picker__calendar-button"
            aria-label={open ? 'Закрыть календарь' : 'Открыть календарь'}
            aria-haspopup="dialog"
            aria-expanded={calendarOpen}
            aria-controls={calendarOpen ? popupId : undefined}
            disabled={disabled}
            onClick={event => {
              calendarButtonRef.current = event.currentTarget;
              if (open) closeCalendar(false, !calendarButtons);
              else setOpen(true);
            }}
            data-testid="range-picker-button"
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
        data-testid="range-picker-input"
      />

      {calendarOpen && (
        <Popup
          anchor={fieldRef}
          placement="auto"
          gap={0}
          maxHeight={640}
          onDismiss={reason => closeCalendar(reason === 'escape', !calendarButtons)}
        >
          <div
            id={popupId}
            className="fdoc-range-picker__popup"
            role="dialog"
            aria-label="Выбор периода"
            data-testid="range-picker-popup"
          >
            <RangeCalendar
              {...calendarProps}
              showActions={calendarButtons}
              value={draftValue}
              defaultVisibleMonth={draftValue.start ?? currentValue.start ?? new Date()}
              minDate={minDate}
              maxDate={maxDate}
              isDateDisabled={isDateDisabled}
              minRange={minRange}
              maxRange={maxRange}
              months={calendarProps?.months ?? 'responsive'}
              onValueChange={setDraftValue}
              onComplete={next => {
                if (!calendarButtons) {
                  commit(next);
                  setOpen(false);
                  restoreCalendarButtonFocus();
                }
              }}
              onCancel={() => closeCalendar(true)}
              onApply={next => {
                if (isRangeAllowed(next)) commit(next);
                setOpen(false);
                restoreCalendarButtonFocus();
              }}
            />
          </div>
        </Popup>
      )}
    </div>
  );
}

export type { DateRange } from '../Calendar/dateUtils';
