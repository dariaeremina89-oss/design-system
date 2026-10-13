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


export function Breadcrumbs({
  items,
  'aria-label': label = 'Навигационная цепочка',
  isLoading = false,
  className = '',
}: BreadcrumbsProps) {
  if (items.length < 2) return null;

  const collapsed = items.length > 3;
  const visible = collapsed ? items.slice(-2) : items;

  return (
    <nav
      aria-label={label}
      aria-busy={isLoading || undefined}
      className={`fdoc-breadcrumbs ${className}`}
    >
      <ul>
        {collapsed && (
          <li className="fdoc-breadcrumbs__ellipsis">
            <span aria-label="Пропущены уровни навигации">
              <span aria-hidden="true">…</span>
            </span>
            {isLoading
              ? <Skeleton className="fdoc-breadcrumbs__separator-skeleton" width={16} height={16} shape="icon" />
              : <Icon name="arrow-chevron-right" size={16} aria-hidden="true" />}
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
              {!current && (isLoading
                ? <Skeleton className="fdoc-breadcrumbs__separator-skeleton" width={16} height={16} shape="icon" />
                : <Icon name="arrow-chevron-right" size={16} aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export const Breadcrumb = Breadcrumbs;
