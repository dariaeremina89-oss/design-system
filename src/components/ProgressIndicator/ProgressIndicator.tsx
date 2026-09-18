import type { CSSProperties, HTMLAttributes } from 'react';
import './ProgressIndicator.css';

export type ProgressIndicatorType = 'linear' | 'circular';
export type ProgressIndicatorMode = 'determinate' | 'indeterminate';
export type ProgressIndicatorColor = 'primary' | 'secondary' | 'tertiary';

export interface ProgressIndicatorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  /** Вид индикатора из Figma. */
  type?: ProgressIndicatorType;
  /** Determinate показывает value, Indeterminate показывает процесс без известного срока. */
  mode?: ProgressIndicatorMode;
  /** Значение от 0 до 100 для determinate. */
  value?: number;
  /** Цветовая схема Circular. Для Linear используется Primary из Figma. */
  color?: ProgressIndicatorColor;
}

const CIRCUMFERENCE = 2 * Math.PI * 10;

function joinClassNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function clampValue(value: number) {
  return Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
}

export function ProgressIndicator({
  type = 'linear',
  mode = 'indeterminate',
  value = 0,
  color = 'primary',
  className,
  style,
  'aria-label': ariaLabel,
  ...props
}: ProgressIndicatorProps) {
  const normalizedValue = clampValue(value);
  const isDeterminate = mode === 'determinate';
  const label = ariaLabel ?? (isDeterminate ? `Прогресс: ${normalizedValue}%` : 'Загрузка');
  const classes = joinClassNames(
    'fdoc-progress',
    `fdoc-progress--${type}`,
    `fdoc-progress--${mode}`,
    `fdoc-progress--${color}`,
    className,
  );
  const progressStyle = {
    ...style,
    '--fdoc-progress-value': `${normalizedValue}%`,
  } as CSSProperties;

  if (type === 'circular') {
    const dashOffset = CIRCUMFERENCE * (1 - normalizedValue / 100);

    return (
      <div
        {...props}
        className={classes}
        role="progressbar"
        aria-label={label}
        aria-valuemin={isDeterminate ? 0 : undefined}
        aria-valuemax={isDeterminate ? 100 : undefined}
        aria-valuenow={isDeterminate ? normalizedValue : undefined}
        data-progress-type={type}
        data-progress-mode={mode}
        data-progress-color={color}
        style={progressStyle}
      >
        <svg className="fdoc-progress__circular-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle className="fdoc-progress__track" cx="12" cy="12" r="10" pathLength="1" />
          <circle
            className="fdoc-progress__indicator"
            cx="12"
            cy="12"
            r="10"
            pathLength="1"
            strokeDasharray={isDeterminate ? '1' : '0.25 1'}
            strokeDashoffset={isDeterminate ? `${dashOffset / CIRCUMFERENCE}` : undefined}
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
      aria-valuemax={isDeterminate ? 100 : undefined}
      aria-valuenow={isDeterminate ? normalizedValue : undefined}
      data-progress-type={type}
      data-progress-mode={mode}
      data-progress-color={color}
      style={progressStyle}
    >
      <span className="fdoc-progress__track" aria-hidden="true">
        <span className="fdoc-progress__indicator" />
      </span>
    </div>
  );
}
