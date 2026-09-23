import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import { Badge } from '../Badge/Badge';
import { Skeleton } from '../Skeleton/Skeleton';
import './Tabs.css';

export interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  icon?: IconName;
  badge?: ReactNode;
  state?: 'default' | 'hover' | 'focused' | 'pressed' | 'disabled' | 'skeleton';
}

export function Tab({
  selected = false,
  icon,
  badge,
  state = 'default',
  disabled = false,
  children,
  className = '',
  ...props
}: TabProps) {
  const inactive = disabled || state === 'disabled';
  const content = (
    <>
      {icon && (
        <span className="fdoc-tab__icon">
          <Icon name={icon} size={24} />
        </span>
      )}
      {children != null && <span className="fdoc-tab__label">{children}</span>}
      {badge != null && (
        <span className="fdoc-tab__badge">
          <Badge size="small" state={inactive ? 'disabled' : 'default'}>
            {badge}
          </Badge>
        </span>
      )}
    </>
  );

  if (state === 'skeleton') {
    return (
      <span className={`fdoc-tab ${className}`} data-icon-only={children == null} aria-hidden="true">
        {icon && (
          <span className="fdoc-tab__icon">
            <Skeleton width={24} height={24} shape="icon" />
          </span>
        )}
        {children != null && (
          <span className="fdoc-tab__label">
            <Skeleton width={56} shape="text" textSize="body" />
          </span>
        )}
        {badge != null && (
          <span className="fdoc-tab__badge">
            <Badge size="small" state="skeleton" />
          </span>
        )}
      </span>
    );
  }

  return (
    <button
      {...props}
      type="button"
      role="tab"
      aria-selected={selected}
      disabled={inactive}
      data-icon-only={children == null}
      data-state={inactive ? 'disabled' : state}
      className={`fdoc-tab ${className}`}
    >
      {content}
    </button>
  );
}

export interface TabItem {
  value: string;
  label?: ReactNode;
  ariaLabel?: string;
  icon?: IconName;
  badge?: ReactNode;
  disabled?: boolean;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  'aria-label': string;
  className?: string;
  isLoading?: boolean;
}

interface ScrollState {
  overflow: boolean;
  left: boolean;
  right: boolean;
}

export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  'aria-label': label,
  className = '',
  isLoading = false,
}: TabsProps) {
  const id = useId();
  const [local, setLocal] = useState(defaultValue);
  const active = items.some(item => item.value === (value ?? local))
    ? (value ?? local)
    : items.find(item => !item.disabled)?.value;
  const [focusValue, setFocusValue] = useState(active);
  const bar = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState<ScrollState>({ overflow: false, left: false, right: false });

  const tabElement = (tabValue: string | undefined) => {
    if (tabValue === undefined) return null;
    const index = items.findIndex(item => item.value === tabValue);
    return index < 0 ? null : document.getElementById(`${id}-tab-${index}`);
  };

  const reveal = (element: HTMLElement | null) => {
    const root = list.current;
    if (!root || !element) return;

    const viewport = root.getBoundingClientRect();
    const tab = element.getBoundingClientRect();
    if (tab.left < viewport.left) root.scrollLeft -= viewport.left - tab.left;
    else if (tab.right > viewport.right) root.scrollLeft += tab.right - viewport.right;
  };

  const refresh = () => {
    const root = list.current;
    const container = bar.current;
    if (!root || !container) return;

    // Compare the intrinsic Tabs content with the full container width.
    // Measuring against root.clientWidth would include the space already taken by
    // visible arrows and could keep them stuck on after the container grows again.
    const overflow = root.scrollWidth > container.clientWidth + 1;
    const left = overflow && root.scrollLeft > 1;
    const right = overflow && root.scrollLeft + root.clientWidth < root.scrollWidth - 1;

    setScroll(previous => {
      if (
        previous.overflow === overflow &&
        previous.left === left &&
        previous.right === right
      ) {
        return previous;
      }
      return { overflow, left, right };
    });
  };

  useLayoutEffect(() => {
    refresh();

    const observer = new ResizeObserver(() => {
      refresh();
      reveal(tabElement(active));
    });

    if (bar.current) observer.observe(bar.current);
    if (list.current) {
      observer.observe(list.current);
      Array.from(list.current.children).forEach(element => observer.observe(element));
    }

    return () => observer.disconnect();
  }, [items, isLoading, active]);

  useEffect(() => {
    setFocusValue(active);
    reveal(tabElement(active));
  }, [active, id]);

  const enabled = items.filter(item => !item.disabled);
  const focused = enabled.some(item => item.value === focusValue) ? focusValue : enabled[0]?.value;

  const scrollByPage = (direction: -1 | 1) => {
    const root = list.current;
    if (!root) return;
    root.scrollBy({ left: direction * root.clientWidth * 0.7 });
  };

  return (
    <div className={`fdoc-tabs ${className}`}>
      <div
        ref={bar}
        className="fdoc-tabs__bar"
        data-scrollable={scroll.overflow || undefined}
      >
        {scroll.overflow && (
          <button
            type="button"
            className="fdoc-tabs__arrow"
            aria-label="Прокрутить вкладки влево"
            aria-controls={`${id}-tablist`}
            disabled={!scroll.left}
            onClick={() => scrollByPage(-1)}
          >
            <Icon name="arrow-chevron-left" size={24} />
          </button>
        )}

        <div
          ref={list}
          id={`${id}-tablist`}
          role="tablist"
          aria-label={label}
          className="fdoc-tabs__list"
          onScroll={refresh}
          onBlur={event => {
            if (!event.currentTarget.contains(event.relatedTarget)) setFocusValue(active);
          }}
        >
          {items.map((item, index) => (
            <Tab
              key={item.value}
              id={`${id}-tab-${index}`}
              aria-controls={`${id}-panel-${index}`}
              aria-label={item.ariaLabel}
              selected={item.value === active}
              disabled={item.disabled}
              icon={item.icon}
              badge={item.badge}
              state={isLoading ? 'skeleton' : 'default'}
              tabIndex={focused === item.value ? 0 : -1}
              onFocus={() => setFocusValue(item.value)}
              onClick={() => {
                if (item.value === active) return;
                if (value === undefined) setLocal(item.value);
                onValueChange?.(item.value);
              }}
              onKeyDown={event => {
                const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
                if (!delta && event.key !== 'Home' && event.key !== 'End') return;

                event.preventDefault();
                const currentIndex = enabled.findIndex(enabledItem => enabledItem.value === item.value);
                const next = event.key === 'Home'
                  ? enabled[0]
                  : event.key === 'End'
                    ? enabled.at(-1)
                    : enabled[(currentIndex + delta + enabled.length) % enabled.length];

                if (!next) return;
                const element = tabElement(next.value);
                element?.focus();
                reveal(element);
              }}
            >
              {item.label}
            </Tab>
          ))}
        </div>

        {scroll.overflow && (
          <button
            type="button"
            className="fdoc-tabs__arrow"
            aria-label="Прокрутить вкладки вправо"
            aria-controls={`${id}-tablist`}
            disabled={!scroll.right}
            onClick={() => scrollByPage(1)}
          >
            <Icon name="arrow-chevron-right" size={24} />
          </button>
        )}
      </div>

      {!isLoading && items.map((item, index) => (
        <div
          key={item.value}
          id={`${id}-panel-${index}`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${index}`}
          hidden={item.value !== active}
          tabIndex={0}
          className="fdoc-tabs__panel"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
