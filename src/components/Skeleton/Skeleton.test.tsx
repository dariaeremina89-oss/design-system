import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('applies the typography-aware text variant', () => {
    render(<Skeleton width="64px" shape="text" textSize="caption" />);

    const skeleton = document.querySelector('.fdoc-skeleton');

    expect(skeleton).toHaveClass('fdoc-skeleton--text-caption');
    expect(skeleton).toHaveAttribute('data-text-size', 'caption');
    expect(skeleton).toHaveStyle({ width: '64px' });
  });

  it('uses the scalable icon placeholder shape', () => {
    render(<Skeleton width="24px" height="24px" shape="icon" />);

    const skeleton = document.querySelector('.fdoc-skeleton');

    expect(skeleton).toHaveClass('fdoc-skeleton--icon');
    expect(skeleton).toHaveStyle({ width: '24px', height: '24px' });
  });
});
