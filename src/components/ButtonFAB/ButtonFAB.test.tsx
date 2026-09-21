import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { ButtonFAB } from './ButtonFAB';

describe('ButtonFAB', () => {
  it('renders one decorative library icon and an accessible native button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<ButtonFAB icon="plus" aria-label="Создать" position="inline" ref={ref} />);
    const button = screen.getByRole('button', { name: 'Создать' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button.querySelectorAll('[data-icon]')).toHaveLength(1);
    expect(button.querySelector('[data-icon]')).toHaveAttribute('aria-hidden', 'true');
    expect(ref.current).toBe(button);
  });

  it.each([true, false])('blocks clicks with disabled prop or state (%s)', (useProp) => {
    const onClick = vi.fn();
    render(<ButtonFAB icon="plus" aria-label="Создать" disabled={useProp} state={useProp ? 'default' : 'disabled'} onClick={onClick} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not submit a surrounding form by default', () => {
    const submit = vi.fn(event => event.preventDefault());
    const click = vi.fn();
    render(<form onSubmit={submit}><ButtonFAB icon="plus" aria-label="Создать" position="inline" onClick={click} /></form>);
    fireEvent.click(screen.getByRole('button'));
    expect(click).toHaveBeenCalledOnce();
    expect(submit).not.toHaveBeenCalled();
  });

  it('uses a body portal for floating and removes it on unmount', () => {
    const { container, unmount } = render(<div style={{ transform: 'translateZ(0)' }}><ButtonFAB icon="plus" aria-label="Создать" /></div>);
    const button = screen.getByRole('button');
    expect(button.parentElement).toBe(document.body);
    expect(container).not.toContainElement(button);
    unmount();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('keeps inline placement in the supplied layout', () => {
    const { container } = render(<ButtonFAB icon="plus" aria-label="Создать" position="inline" />);
    expect(container).toContainElement(screen.getByRole('button'));
  });

  it('renders shared non-interactive Skeleton without click handlers', () => {
    const click = vi.fn();
    render(<ButtonFAB icon="plus" aria-label="Создать" state="skeleton" onClick={click} data-testid="loading-fab" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    const skeleton = screen.getByTestId('loading-fab');
    expect(skeleton).toHaveClass('fdoc-skeleton', 'fdoc-skeleton--circle');
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    fireEvent.click(skeleton);
    expect(click).not.toHaveBeenCalled();
  });

  it('passes the automated accessibility audit', async () => {
    const { container } = render(<ButtonFAB icon="plus" aria-label="Создать документ" position="inline" />);
    expect((await axe(container)).violations).toEqual([]);
  });
});
