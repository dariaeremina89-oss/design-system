import type { CSSProperties, HTMLAttributes } from 'react';
import './Typography.css';

export type TypographyVariant = 'h0-heading' | 'h1-heading' | 'h2-heading' | 'h3-heading' | 'subtitle' | 'body' | 'caption' | 'overline' | 'code';
export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  variant?: TypographyVariant;
  /** Только для текста страницы: использовать Mobile-вариант того же стиля. */
  responsive?: boolean;
  strong?: boolean;
  'data-testid'?: string;
}

/** Применяет существующий именованный стиль из General / Typography. */
export function Typography({ as: Tag = 'p', variant = 'body', responsive = false, strong = false, className = '', style, 'data-testid':testId, ...props }: TypographyProps) {
  const token = `--page-${variant}`;
  const weight = variant.endsWith('-heading') ? 'weight' : `weight-${strong ? 'strong' : 'base'}`;
  return <Tag {...props} className={`fdoc-typography ${className}`} data-testid={testId??'typography'} data-responsive={responsive} data-strong={strong} data-typography={variant} style={{
    '--typography-family': `var(${token}-family)`,
    '--typography-weight': `var(${token}-${weight})`,
    '--typography-size': `var(${token}-size)`,
    '--typography-line-height': `var(${token}-line-height)`,
    '--typography-size-mobile': `var(${token}-size-mobile)`,
    '--typography-line-height-mobile': `var(${token}-line-height-mobile)`,
    ...style,
  } as CSSProperties} />;
}
