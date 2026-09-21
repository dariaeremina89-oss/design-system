import type { CSSProperties, HTMLAttributes } from 'react';
import './ProgressIndicator.css';

export type ProgressIndicatorType = 'linear' | 'circular';
export type ProgressIndicatorMode = 'determinate' | 'indeterminate';
export type ProgressIndicatorVariant = 'primary' | 'secondary' | 'tertiary';
/** @deprecated Use ProgressIndicatorVariant. */
export type ProgressIndicatorColor = ProgressIndicatorVariant;
export type ProgressIndicatorAnimation = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';

export interface ProgressIndicatorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  /** Вид индикатора из Figma. */
  type?: ProgressIndicatorType;
  /** Determinate показывает value, Indeterminate показывает процесс без известного срока. */
  mode?: ProgressIndicatorMode;
  /** Значение прогресса для determinate. Ограничивается диапазоном 0..max. */
  value?: number;
  /** Максимальное значение Linear для determinate. По умолчанию 100. */
  max?: number;
  /** Размер Circular в пикселях. По умолчанию 24, как в Figma. */
  size?: number;
  /** Толщина линии Circular в пикселях. По умолчанию 2. */
  strokeWidth?: number;
  /** Цветовая схема Circular из Figma. */
  variant?: ProgressIndicatorVariant;
  /** Алиас variant для обратной совместимости. */
  color?: ProgressIndicatorColor;
  /** Продолжительность одного цикла indeterminate в миллисекундах. */
  duration?: number;
  /** Функция анимации indeterminate. */
  animation?: ProgressIndicatorAnimation;
}

const DEFAULT_SIZE = 24;
const DEFAULT_STROKE_WIDTH = 2;
const DEFAULT_DURATION = 1500;
const DEFAULT_MAX = 100;

function joinClassNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function clampValue(value: number, max: number) {
  return Math.min(max, Math.max(0, Number.isFinite(value) ? value : 0));
}

function normalizePositiveNumber(value: number | undefined, fallback: number) {
  return value !== undefined && Number.isFinite(value) && value > 0 ? value : fallback;
}

export function ProgressIndicator({
  type = 'linear',
  mode = 'indeterminate',
  value = 0,
  max = DEFAULT_MAX,
  size = DEFAULT_SIZE,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  variant,
  color,
  duration = DEFAULT_DURATION,
  animation = 'linear',
  className,
  style,
  'aria-label': ariaLabel,
  ...props
}: ProgressIndicatorProps) {
  const normalizedMax = normalizePositiveNumber(max, DEFAULT_MAX);
  const normalizedValue = clampValue(value, normalizedMax);
  const normalizedSize = normalizePositiveNumber(size, DEFAULT_SIZE);
  const normalizedStrokeWidth = Math.min(normalizedSize / 2, 8, normalizePositiveNumber(strokeWidth, DEFAULT_STROKE_WIDTH));
  const normalizedDuration = normalizePositiveNumber(duration, DEFAULT_DURATION);
  const circularRadius = (normalizedSize - normalizedStrokeWidth) / 2;
  const circumference = 2 * Math.PI * circularRadius;
  const isDeterminate = mode === 'determinate';
  const effectiveColor = type === 'circular' ? (variant ?? color ?? 'primary') : 'primary';
  const normalizedPercent = (normalizedValue / normalizedMax) * 100;
  const label = ariaLabel ?? (isDeterminate ? `Прогресс: ${normalizedValue} из ${normalizedMax}` : 'Загрузка');
  const classes = joinClassNames(
    'fdoc-progress',
    `fdoc-progress--${type}`,
    `fdoc-progress--${mode}`,
    `fdoc-progress--${effectiveColor}`,
    className,
  );
  const progressStyle = {
    ...(type === 'circular' ? {
      width: `${normalizedSize}px`,
      height: `${normalizedSize}px`,
    } : {}),
    '--fdoc-progress-value': `${normalizedPercent}%`,
    '--fdoc-progress-duration': `${normalizedDuration}ms`,
    '--fdoc-progress-animation': animation,
    '--fdoc-progress-stroke-width': `${normalizedStrokeWidth}`,
    ...style,
  } as CSSProperties;

  if (type === 'circular') {
    const dashOffset = circumference * (1 - normalizedValue / normalizedMax);

    return (
      <div
        {...props}
        className={classes}
        role="progressbar"
        aria-label={label}
        aria-valuemin={isDeterminate ? 0 : undefined}
        aria-valuemax={isDeterminate ? normalizedMax : undefined}
        aria-valuenow={isDeterminate ? normalizedValue : undefined}
        data-progress-type={type}
        data-progress-mode={mode}
        data-progress-color={effectiveColor}
        data-progress-variant={effectiveColor}
        style={progressStyle}
      >
        <svg className="fdoc-progress__circular-svg" viewBox={`0 0 ${normalizedSize} ${normalizedSize}`} aria-hidden="true" focusable="false">
          <circle
            className="fdoc-progress__track"
            cx={normalizedSize / 2}
            cy={normalizedSize / 2}
            r={circularRadius}
            strokeWidth={normalizedStrokeWidth}
          />
          <circle
            className="fdoc-progress__indicator"
            cx={normalizedSize / 2}
            cy={normalizedSize / 2}
            r={circularRadius}
            strokeWidth={normalizedStrokeWidth}
            strokeDasharray={isDeterminate ? `${circumference}` : `${circumference / 4} ${circumference}`}
            strokeDashoffset={isDeterminate ? dashOffset : undefined}
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      {...props}
      className={classes}
      role="progressbar"
      aria-label={label}
      aria-valuemin={isDeterminate ? 0 : undefined}
      aria-valuemax={isDeterminate ? normalizedMax : undefined}
      aria-valuenow={isDeterminate ? normalizedValue : undefined}
      data-progress-type={type}
      data-progress-mode={mode}
      data-progress-color={effectiveColor}
      data-progress-variant={effectiveColor}
      style={progressStyle}
    >
      <span className="fdoc-progress__track" aria-hidden="true">
        <span className="fdoc-progress__indicator" />
      </span>
    </div>
  );
}
