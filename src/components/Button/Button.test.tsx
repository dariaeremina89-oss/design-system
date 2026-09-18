import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it.each([
    ['small', '32', '16', '8px', '12px', '2px'],
    ['medium', '40', '20', '8px', '16px', '2px'],
    ['large', '48', '24', '8px', '16px', '4px'],
    ['giant', '56', '28', '12px', '20px', '4px'],
  ] as const)('matches the Figma geometry for %s', (size, height, icon, paddingY, paddingX, gap) => {
    render(<Button text={size} size={size} iconLeft="check" />);
    const button = screen.getByRole('button', { name: size });

    expect(button).toHaveAttribute('data-button-size', height);
    expect(button).toHaveStyle({
      '--fdoc-button-height': `${height}px`,
      '--fdoc-button-icon-size': `${icon}px`,
      '--fdoc-button-padding-y': paddingY,
      '--fdoc-button-padding-x': paddingX,
      '--fdoc-button-gap': gap,
    });
  });

  it('uses a native button and the local icon library', () => {
    render(<Button text="Save" iconLeft="check" onClick={() => undefined} />);
    const button = screen.getByRole('button', { name: 'Save' });

    expect(button).toHaveAttribute('type', 'button');
    expect(button.querySelector('[data-icon="check"]')).toBeTruthy();
    expect(screen.getByTestId('button-text')).toHaveTextContent('Save');
  });

  it('supports both icon slots, custom slots and Badge slots', () => {
    render(
      <Button
        text="Action"
        iconLeftView={<span data-testid="custom-left" />}
        iconRight="arrow-right"
        badgeLeft={<span data-testid="badge-left" />}
        badgeRight={<span data-testid="badge-right" />}
      />,
    );

    expect(screen.getByTestId('custom-left')).toBeInTheDocument();
    expect(screen.getByTestId('button-icon-right')).toBeInTheDocument();
    expect(screen.getByTestId('badge-left')).toBeInTheDocument();
    expect(screen.getByTestId('badge-right')).toBeInTheDocument();
  });

  it('uses native disabled behavior for the disabled state', () => {
    const onClick = vi.fn();
    render(<Button text="Disabled" state="disabled" onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Disabled' });

    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('keeps focus state inside the fixed outer size', () => {
    render(<Button text="Focused" size="large" state="focused" />);
    const button = screen.getByRole('button', { name: 'Focused' });

    expect(button).toHaveStyle({
      boxSizing: 'border-box',
      '--fdoc-button-height': '48px',
    });
    expect(button).toHaveClass('fdoc-button--focused');
  });

  it.each([
    ['primary', 'var(--background-primary-default)', 'var(--text-primary-default)', 'var(--icon-primary-default-light)'],
    ['base', 'var(--background-base-default)', 'var(--text-base-default)', 'var(--icon-base-default-light)'],
    ['secondary', 'var(--background-base-secondary)', 'var(--text-base-default)', 'var(--icon-base-default-light)'],
    ['tertiary', 'transparent', 'var(--text-base-default)', 'var(--icon-base-default-light)'],
    ['inverse', 'var(--background-base-inverse)', 'var(--text-base-inverse)', 'var(--icon-base-inverse)'],
    ['inverse-primary', 'var(--background-base-inverse)', 'var(--text-primary-inverse-light)', 'var(--icon-primary-inverse-light)'],
  ] as const)('maps %s to Figma semantic tokens', (color, background, text, icon) => {
    render(<Button text={color} color={color} iconLeft="check" />);
    const button = screen.getByRole('button', { name: color });
    const styles = getComputedStyle(button);

    expect(styles.getPropertyValue('--fdoc-button-background').trim()).toBe(background);
    expect(styles.getPropertyValue('--fdoc-button-text').trim()).toBe(text);
    expect(styles.getPropertyValue('--fdoc-button-icon').trim()).toBe(icon);
  });

  it('does not change text or icon tokens on hover and pressed states', () => {
    render(<Button text="Action" color="primary" state="hover" iconLeft="check" />);
    const hover = screen.getByRole('button', { name: 'Action' });
    expect(getComputedStyle(hover).getPropertyValue('--fdoc-button-text').trim()).toBe('var(--text-primary-default)');
    expect(getComputedStyle(hover).getPropertyValue('--fdoc-button-icon').trim()).toBe('var(--icon-primary-default-light)');

    render(<Button text="Pressed" color="primary" state="pressed" iconLeft="check" />);
    const pressed = screen.getByRole('button', { name: 'Pressed' });
    expect(getComputedStyle(pressed).getPropertyValue('--fdoc-button-text').trim()).toBe('var(--text-primary-default)');
    expect(getComputedStyle(pressed).getPropertyValue('--fdoc-button-icon').trim()).toBe('var(--icon-primary-default-light)');
  });

  it('renders a shared, non-interactive rounded skeleton', () => {
    render(<Button state="skeleton" size="giant" skeletonWidth={232} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    const skeleton = screen.getByTestId('button-skeleton');

    expect(skeleton).toHaveClass('fdoc-skeleton', 'fdoc-skeleton--rounded', 'fdoc-button__skeleton');
    expect(skeleton).toHaveStyle({ width: '232px', height: '56px' });
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  });

  it('keeps the button text on one line for long content', () => {
    render(<Button text="A very long action that must stay on one line" style={{ width: 160 }} />);
    expect(screen.getByTestId('button-text')).toHaveStyle({
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    });
  });
});
