import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressIndicator } from './ProgressIndicator';

describe('ProgressIndicator', () => {
  it('renders Linear determinate with the Figma height and ARIA range', () => {
    render(<ProgressIndicator type="linear" mode="determinate" value={60} />);
    const progress = screen.getByRole('progressbar');

    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
    expect(progress).toHaveAttribute('aria-valuenow', '60');
    expect(progress).toHaveClass('fdoc-progress--linear', 'fdoc-progress--determinate');
    expect(progress).toHaveStyle({ '--fdoc-progress-value': '60%' });
    expect(progress.querySelector('.fdoc-progress__indicator')).toBeInTheDocument();
  });

  it('clamps determinate values to the supported 0..100 range', () => {
    const { rerender } = render(<ProgressIndicator type="circular" mode="determinate" value={140} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');

    rerender(<ProgressIndicator type="circular" mode="determinate" value={-20} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('supports a custom max for Linear determinate progress', () => {
    render(<ProgressIndicator type="linear" mode="determinate" value={40} max={200} />);
    const progress = screen.getByRole('progressbar');

    expect(progress).toHaveAttribute('aria-valuemax', '200');
    expect(progress).toHaveAttribute('aria-valuenow', '40');
    expect(progress).toHaveStyle({ '--fdoc-progress-value': '20%' });
  });

  it('does not expose aria-valuenow for Indeterminate', () => {
    render(<ProgressIndicator type="circular" mode="indeterminate" />);
    const progress = screen.getByRole('progressbar');

    expect(progress).not.toHaveAttribute('aria-valuenow');
    expect(progress).toHaveAccessibleName('Загрузка');
  });

  it.each(['primary', 'secondary', 'tertiary'] as const)('maps Circular %s to semantic tokens', (color) => {
    render(<ProgressIndicator type="circular" mode="determinate" variant={color} value={40} />);
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('data-progress-color', color);
    expect(progress).toHaveAttribute('data-progress-variant', color);
  });

  it('keeps color as a backwards-compatible alias for variant', () => {
    render(<ProgressIndicator type="circular" mode="determinate" color="secondary" value={40} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('data-progress-variant', 'secondary');
  });

  it('uses the Figma secondary track and indicator tokens together', () => {
    render(<ProgressIndicator type="circular" mode="indeterminate" variant="secondary" />);
    const styles = getComputedStyle(screen.getByRole('progressbar'));

    expect(styles.getPropertyValue('--fdoc-progress-track').trim()).toBe('var(--background-base-secondary)');
    expect(styles.getPropertyValue('--fdoc-progress-indicator').trim()).toBe('var(--background-base-inverse)');
  });

  it('uses the Figma Primary scheme for Linear regardless of the ignored color prop', () => {
    render(<ProgressIndicator type="linear" mode="determinate" color="tertiary" value={40} />);

    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('data-progress-color', 'primary');
    expect(progress).toHaveClass('fdoc-progress--primary');
  });

  it('is not focusable through the tab order', () => {
    render(<ProgressIndicator type="linear" mode="indeterminate" />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('tabindex');
  });

  it('keeps size in the external container and forwards style overrides', () => {
    render(<ProgressIndicator type="circular" mode="indeterminate" style={{ width: 32, height: 32 }} />);
    expect(screen.getByRole('progressbar')).toHaveStyle({ width: '32px', height: '32px' });
  });

  it('keeps the circular stroke inside the 24px viewBox', () => {
    render(<ProgressIndicator type="circular" mode="determinate" value={50} />);

    expect(screen.getByRole('progressbar').querySelector('.fdoc-progress__indicator')).toHaveAttribute('r', '11');
  });

  it('applies Circular size, stroke width, duration and animation props', () => {
    render(
      <ProgressIndicator
        type="circular"
        mode="indeterminate"
        size={56}
        strokeWidth={4}
        duration={2400}
        animation="ease-in-out"
      />,
    );
    const progress = screen.getByRole('progressbar');
    const indicator = progress.querySelector('.fdoc-progress__indicator');

    expect(progress).toHaveStyle({
      width: '56px',
      height: '56px',
      '--fdoc-progress-duration': '2400ms',
      '--fdoc-progress-animation': 'ease-in-out',
      '--fdoc-progress-stroke-width': '4',
    });
    expect(indicator).toHaveAttribute('stroke-width', '4');
    expect(indicator).toHaveAttribute('r', '26');
  });
});
