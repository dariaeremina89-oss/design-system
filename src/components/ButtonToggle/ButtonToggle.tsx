import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Button, type ButtonProps } from '../Button/Button';
import { Select } from '../Select/Select';
import { Skeleton } from '../Skeleton/Skeleton';
import './ButtonToggle.css';

export interface ButtonToggleOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  iconLeft?: ButtonProps['iconLeft'];
}

export interface ButtonToggleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  options: ButtonToggleOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: 'small' | 'medium';
  color?: 'primary' | 'base' | 'inverse';
  disabled?: boolean;
  isLoading?: boolean;
  name?: string;
}

function measureIntrinsicWidth(node: HTMLDivElement) {
  const clone = node.cloneNode(true) as HTMLDivElement;
  clone.removeAttribute('role');
  clone.removeAttribute('aria-label');
  clone.setAttribute('aria-hidden', 'true');
  Object.assign(clone.style, {
    position: 'fixed',
    left: '-100000px',
    top: '0',
    width: 'max-content',
    maxWidth: 'none',
    visibility: 'hidden',
    pointerEvents: 'none',
  });
  clone.querySelectorAll<HTMLElement>('.fdoc-button').forEach(button => {
    button.style.maxWidth = 'none';
  });
  clone.querySelectorAll<HTMLElement>('[id]').forEach(element => element.removeAttribute('id'));

  document.body.append(clone);
  const width = clone.getBoundingClientRect().width;
  clone.remove();
  return width;
}

export function ButtonToggle({
  options,
  value,
  defaultValue,
  onValueChange,
  size = 'medium',
  color = 'primary',
  disabled = false,
  isLoading = false,
  name,
  className = '',
  'aria-label': ariaLabel,
  ...props
}: ButtonToggleProps) {
  const [local, setLocal] = useState(defaultValue);
  const [useSelect, setUseSelect] = useState(false);
  const id = useId();
  const hostRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const requiredWidthRef = useRef(0);
  const measurementKeyRef = useRef('');
  const items = options;
  const selectedValue = value ?? local;
  const active = items.some(option => option.value === selectedValue)
    ? selectedValue
    : items.find(option => !option.disabled)?.value;
  const canUseSelect = items.every(option => typeof option.label === 'string');
  const measurementKey = `${size}|${items.map(option => `${option.value}:${String(option.label)}:${option.iconLeft ?? ''}`).join('|')}`;

  function select(next: string) {
    if (next === active) return;
    if (value === undefined) setLocal(next);
    onValueChange?.(next);
  }

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host || isLoading || !canUseSelect) {
      requiredWidthRef.current = 0;
      measurementKeyRef.current = measurementKey;
      setUseSelect(false);
      return;
    }

    if (measurementKeyRef.current !== measurementKey) {
      measurementKeyRef.current = measurementKey;
      requiredWidthRef.current = 0;
      if (useSelect) {
        setUseSelect(false);
        return;
      }
    }

    const update = (width?: number) => {
      const availableWidth = width ?? host.getBoundingClientRect().width;
      if (availableWidth <= 0) return;

      if (!useSelect) {
        const toggle = toggleRef.current;
        if (!toggle) return;
        const requiredWidth = measureIntrinsicWidth(toggle);
        requiredWidthRef.current = requiredWidth;
        if (requiredWidth > availableWidth + 1) setUseSelect(true);
        return;
      }

      if (requiredWidthRef.current > 0 && availableWidth >= requiredWidthRef.current - 1) {
        setUseSelect(false);
      }
    };

    update();

    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(entries => update(entries[0]?.contentRect.width));
    observer.observe(host);
    return () => observer.disconnect();
  }, [canUseSelect, isLoading, measurementKey, useSelect]);

  if (isLoading) {
    return (
      <div ref={hostRef} className={`fdoc-button-toggle-host ${className}`}>
        <div className="fdoc-button-toggle" data-color="skeleton" aria-hidden="true">
          {items.map((option, index) => (
            <span
              key={option.value}
              className="fdoc-button-toggle__segment"
              data-separator={index > 0 && items[index - 1]?.value !== active && option.value !== active}
            >
              {option.value === active ? (
                <Skeleton width={79} height={size === 'small' ? 32 : 40} />
              ) : (
                <span style={{ width: 79, height: size === 'small' ? 32 : 40 }} />
              )}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (useSelect && canUseSelect) {
    return (
      <div ref={hostRef} className={`fdoc-button-toggle-host fdoc-button-toggle-host--select ${className}`} data-responsive-fallback="select">
        <Select
          aria-label={ariaLabel ?? 'Выбор значения'}
          size={size}
          label={false}
          options={items.map(option => ({
            value: option.value,
            label: option.label as string,
            leadingIcon: option.iconLeft,
            disabled: option.disabled,
          }))}
          value={active}
          onValueChange={select}
          disabled={disabled}
          name={name}
        />
      </div>
    );
  }

  return (
    <div ref={hostRef} className={`fdoc-button-toggle-host ${className}`} data-responsive-fallback="toggle">
      <div
        {...props}
        ref={toggleRef}
        role="radiogroup"
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        data-color={color}
        className="fdoc-button-toggle"
      >
        {name && <input type="hidden" name={name} value={active ?? ''} disabled={disabled} />}
        {items.map((option, index) => (
          <span
            className="fdoc-button-toggle__segment"
            key={option.value}
            data-separator={index > 0 && items[index - 1]?.value !== active && option.value !== active}
          >
            <Button
              id={`${id}-${index}`}
              text={typeof option.label === 'string' ? option.label : undefined}
              size={size}
              color={option.value === active ? (color === 'base' ? 'secondary' : color) : (color === 'base' ? 'base' : 'secondary')}
              iconLeft={option.iconLeft}
              disabled={disabled || option.disabled}
              role="radio"
              aria-checked={option.value === active}
              tabIndex={option.value === active ? 0 : -1}
              onClick={() => select(option.value)}
              onKeyDown={event => {
                const delta = event.key === 'ArrowRight' || event.key === 'ArrowDown'
                  ? 1
                  : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
                    ? -1
                    : 0;
                if (!delta && event.key !== 'Home' && event.key !== 'End') return;
                event.preventDefault();
                const available = items.filter(item => !item.disabled);
                if (!available.length) return;
                const currentIndex = available.findIndex(item => item.value === option.value);
                const next = event.key === 'Home'
                  ? available[0]
                  : event.key === 'End'
                    ? available.at(-1)!
                    : available[(currentIndex + delta + available.length) % available.length];
                select(next.value);
                document.getElementById(`${id}-${items.indexOf(next)}`)?.focus();
              }}
            >
              {option.label}
            </Button>
          </span>
        ))}
      </div>
    </div>
  );
}
