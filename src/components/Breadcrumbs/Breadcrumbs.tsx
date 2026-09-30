import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from '../Link/Link';
import { Icon } from '../Icon/Icon';
import { Skeleton } from '../Skeleton/Skeleton';
import './Breadcrumbs.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  'aria-label'?: string;
  isLoading?: boolean;
  className?: string;
}

const COMPACT_WIDTH = 600;

export function Breadcrumbs({
  items,
  'aria-label': label = 'Навигационная цепочка',
  isLoading = false,
  className = '',
}: BreadcrumbsProps) {
  const ref = useRef<HTMLElement>(null);
  const [compact, setCompact] = useState(false);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const update = (width?: number) => {
      const measuredWidth = width ?? node.getBoundingClientRect().width;
      if (measuredWidth > 0) {
        setCompact(measuredWidth <= COMPACT_WIDTH);
        return;
      }
      setCompact(typeof window !== 'undefined' && window.matchMedia?.(`(max-width:${COMPACT_WIDTH}px)`).matches === true);
    };

    update();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(entries => {
        const entry = entries[0];
        update(entry?.contentRect.width);
      });
      observer.observe(node);
      return () => observer.disconnect();
    }

    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia(`(max-width:${COMPACT_WIDTH}px)`);
    const onChange = () => update();
    media.addEventListener?.('change', onChange);
    return () => media.removeEventListener?.('change', onChange);
  }, [items.length]);

  if (items.length < 2) return null;

  const collapsed = compact && items.length > 3;
  const visible = collapsed ? items.slice(-2) : items;

  return (
    <nav
      ref={ref}
      aria-label={label}
      aria-busy={isLoading || undefined}
      className={`fdoc-breadcrumbs ${className}`}
      data-compact={compact}
    >
      <ul>
        {collapsed && (
          <li className="fdoc-breadcrumbs__ellipsis">
            <span aria-label="Пропущены уровни навигации">
              <span aria-hidden="true">…</span>
            </span>
            <Icon name="arrow-chevron-right" size={16} aria-hidden="true" />
          </li>
        )}
        {visible.map((item, index) => {
          const current = index === visible.length - 1;
          return (
            <li key={`${item.href ?? ''}-${index}`} data-current={current}>
              {isLoading ? (
                <Skeleton width={64} shape="text" textSize="caption" />
              ) : current ? (
                <span className="fdoc-breadcrumbs__current" aria-current="page" title={item.label}>
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} color="neutral" size="small" decoration={null} title={item.label}>
                  {item.label}
                </Link>
              )}
              {!current && <Icon name="arrow-chevron-right" size={16} aria-hidden="true" />}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export const Breadcrumb = Breadcrumbs;
