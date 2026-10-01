import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('exposes a stable test id by default and accepts an override', () => {
    const { rerender } = render(<Skeleton />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();

    rerender(<Skeleton data-testid="custom-skeleton" />);
    expect(screen.getByTestId('custom-skeleton')).toBeInTheDocument();
  });

  it('applies the typography-aware text variant and preserves a fixed width', () => {
    render(<Skeleton width="64px" shape="text" textSize="caption" />);

    const skeleton = document.querySelector('.fdoc-skeleton');

    expect(skeleton).toHaveClass('fdoc-skeleton--text-caption');
    expect(skeleton).toHaveAttribute('data-text-size', 'caption');
    expect(skeleton).toHaveStyle({ width: '64px', minWidth: '64px' });
  });

  it('uses the scalable icon placeholder shape and preserves fixed geometry', () => {
    render(<Skeleton width="24px" height="24px" shape="icon" />);

    const skeleton = document.querySelector('.fdoc-skeleton');

    expect(skeleton).toHaveClass('fdoc-skeleton--icon');
    expect(skeleton).toHaveStyle({
      width: '24px',
      minWidth: '24px',
      height: '24px',
      minHeight: '24px',
    });
  });

  it('keeps fluid dimensions shrinkable and respects explicit min-size overrides', () => {
    const { rerender } = render(<Skeleton width="100%" height="clamp(16px, 10vw, 40px)" />);
    let skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveStyle({ width: '100%', height: 'clamp(16px, 10vw, 40px)' });
    expect(skeleton.style.minWidth).toBe('');
    expect(skeleton.style.minHeight).toBe('');

    rerender(<Skeleton width={80} height={32} style={{ minWidth: 0, minHeight: 0 }} />);
    skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveStyle({ width: '80px', height: '32px', minWidth: '0', minHeight: '0' });
  });
});
