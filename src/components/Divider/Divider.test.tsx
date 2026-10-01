import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Divider } from './Divider';

describe('Divider', () => {
  it('is decorative and exposes stable geometry selectors', () => {
    render(<Divider />);
    const divider = screen.getByTestId('divider');

    expect(divider).toHaveAttribute('aria-hidden', 'true');
    expect(divider).toHaveAttribute('data-divider-orientation', 'horizontal');
    expect(divider).toHaveAttribute('data-divider-inset', '0');
    expect(divider.style.getPropertyValue('--divider-inset')).toBe('0px');
  });

  it('supports vertical orientation and numeric inset', () => {
    render(<Divider orientation="vertical" inset={24} />);
    const divider = screen.getByTestId('divider');

    expect(divider).toHaveClass('fdoc-divider--vertical');
    expect(divider).toHaveAttribute('data-divider-orientation', 'vertical');
    expect(divider).toHaveAttribute('data-divider-inset', '24');
    expect(divider.style.getPropertyValue('--divider-inset')).toBe('24px');
  });

  it('clamps invalid negative inset and lets consumers override the root test id', () => {
    render(<Divider inset={-16} data-testid="section-divider" />);
    const divider = screen.getByTestId('section-divider');

    expect(divider).toHaveAttribute('data-divider-inset', '0');
    expect(divider.style.getPropertyValue('--divider-inset')).toBe('0px');
  });
});
