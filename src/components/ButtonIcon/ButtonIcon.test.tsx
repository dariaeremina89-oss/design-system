import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ButtonIcon } from './ButtonIcon';

describe('ButtonIcon', () => {
  it('uses the icon library and native button semantics', () => {
    render(<ButtonIcon icon="cross" aria-label="Close" onClick={() => undefined} />);
    const button = screen.getByRole('button', { name: 'Close' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button.querySelector('[data-icon="cross"]')).toBeTruthy();
  });

  it('keeps button and icon sizes independently configurable', () => {
    render(<ButtonIcon icon="cross" size="large" iconSize={16} aria-label="Close" />);
    const button = screen.getByRole('button', { name: 'Close' });
    expect(button).toHaveAttribute('data-button-icon-size', '48');
    expect(button).toHaveStyle('--fdoc-button-icon-size: 48px');
    expect(button.querySelector('.fdoc-icon')).toHaveStyle('--fdoc-icon-size: 16px');
  });

  it('uses native disabled behavior for the disabled state', () => {
    const onClick = vi.fn();
    render(<ButtonIcon icon="cross" state="disabled" aria-label="Close" onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Close' });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not render an interactive element for skeleton state', () => {
    render(<ButtonIcon icon="cross" state="skeleton" aria-label="Loading" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(document.querySelector('.fdoc-button-icon__skeleton')).toBeTruthy();
  });

  it('renders a custom icon slot', () => {
    render(
      <ButtonIcon iconView={<span data-testid="custom-icon" />} aria-label="Custom" />,
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});
