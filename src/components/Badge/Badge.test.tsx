import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it.each(['smallest', 'small', 'medium', 'large', 'giant'] as const)('renders the Figma height class for %s', (size) => {
    render(<Badge size={size} text={size === 'smallest' ? undefined : '99+'} />);
    const badge = screen.getByTestId('badge');

    expect(badge).toHaveAttribute('data-badge-size', size);
    expect(badge).toHaveClass(`fdoc-badge--${size}`);
  });

  it('renders Smallest as a 16px wrapper with an 8px dot and no text', () => {
    render(<Badge size="smallest" text="99+" />);
    const badge = screen.getByTestId('badge');
    const dot = badge.querySelector('.fdoc-badge__dot');

    expect(badge).not.toHaveTextContent('99+');
    expect(dot).toHaveClass('fdoc-badge__dot');
  });

  it('does not add interactive semantics', () => {
    render(<Badge text="New" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByTestId('badge').tagName).toBe('SPAN');
  });

  it('maps disabled color tokens by scheme', () => {
    const { rerender } = render(<Badge color="primary" state="disabled" text="1" />);
    expect(getComputedStyle(screen.getByTestId('badge')).getPropertyValue('--fdoc-badge-background').trim()).toBe(
      'var(--background-primary-default-disabled)',
    );

    rerender(<Badge color="secondary" state="disabled" text="1" />);
    expect(getComputedStyle(screen.getByTestId('badge')).getPropertyValue('--fdoc-badge-background').trim()).toBe(
      'var(--background-base-secondary-disabled)',
    );

    rerender(<Badge color="inverse" state="disabled" text="1" />);
    expect(getComputedStyle(screen.getByTestId('badge')).getPropertyValue('--fdoc-badge-background').trim()).toBe(
      'var(--background-base-inverse-disabled)',
    );
  });

  it('uses the shared skeleton atom with the Figma radius and size', () => {
    render(<Badge size="large" state="skeleton" />);
    const skeleton = screen.getByTestId('badge-skeleton');

    expect(skeleton).toHaveClass('fdoc-skeleton', 'fdoc-badge__skeleton');
    expect(skeleton).toHaveStyle({ width: '43px', height: '24px' });
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  });
});
