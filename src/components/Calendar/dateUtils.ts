export type DateRange = {
  start: Date | null;
  end: Date | null;
};

export const WEEKDAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] as const;
export const MONTH_LABELS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
] as const;
export const MONTH_LABELS_SHORT = [
  'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
  'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек',
] as const;

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function addYears(date: Date, amount: number) {
  return new Date(date.getFullYear() + amount, date.getMonth(), 1);
}

export function isSameDay(left: Date | null | undefined, right: Date | null | undefined) {
  return Boolean(
    left && right
    && left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate(),
  );
}

export function isSameMonth(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

export function compareDays(left: Date, right: Date) {
  return startOfDay(left).getTime() - startOfDay(right).getTime();
}

export function isDateWithinRange(date: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false;
  const value = startOfDay(date).getTime();
  const from = startOfDay(start).getTime();
  const to = startOfDay(end).getTime();
  return value > from && value < to;
}

export function buildMonthCells(month: Date): Array<Date | null> {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const days = new Date(year, monthIndex + 1, 0).getDate();
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const mondayOffset = (firstWeekday + 6) % 7;
  const cells: Array<Date | null> = Array.from({ length: mondayOffset }, () => null);

  for (let day = 1; day <= days; day += 1) {
    cells.push(new Date(year, monthIndex, day));
  }

  while (cells.length % 7 !== 0) cells.push(null);
  while (cells.length < 35) cells.push(null);
  return cells;
}

export function formatMonthYear(date: Date) {
  return new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' })
    .format(date)
    .replace(/^./, value => value.toUpperCase());
}

export function formatDateValue(date: Date | null | undefined) {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).padStart(4, '0');
  return `${day}.${month}.${year}`;
}

export function parseDateValue(value: string) {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]) - 1;
  const year = Number(match[3]);
  const date = new Date(year, month, day);
  if (
    date.getFullYear() !== year
    || date.getMonth() !== month
    || date.getDate() !== day
  ) return null;
  return date;
}

export function maskDateInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
}

export function formatRangeValue(range: DateRange | null | undefined) {
  if (!range?.start && !range?.end) return '';
  const start = formatDateValue(range?.start);
  const end = formatDateValue(range?.end);
  return end ? `${start} — ${end}` : start;
}

export function maskRangeInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  const start = maskDateInput(digits.slice(0, 8));
  const endDigits = digits.slice(8);
  if (!endDigits) return start;
  return `${start} — ${maskDateInput(endDigits)}`;
}

export function parseRangeValue(value: string): DateRange | null {
  const parts = value.split(/\s+[—–-]\s+/);
  if (parts.length !== 2) return null;
  const start = parseDateValue(parts[0]);
  const end = parseDateValue(parts[1]);
  if (!start || !end || compareDays(start, end) > 0) return null;
  return { start, end };
}
