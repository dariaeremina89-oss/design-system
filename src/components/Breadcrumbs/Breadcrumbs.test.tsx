import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Breadcrumbs } from './Breadcrumbs';

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', undefined);
  vi.stubGlobal('matchMedia', () => ({
    matches: true,
    addEventListener() {},
    removeEventListener() {},
  }));
});

afterEach(() => vi.unstubAllGlobals());

describe('Breadcrumbs', () => {
  it('hides one level and collapses compact history without hidden links', () => {
    const { rerender } = render(<Breadcrumbs items={[{ label: 'Домой' }]} />);
    expect(screen.queryByRole('navigation')).toBe(null);

    rerender(
      <Breadcrumbs items={['Главная', 'Компания', 'Документы', 'Текущая'].map(label => ({ label, href: `#${label}` }))} />,
    );

    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('link')).toHaveAccessibleName('Документы');
    expect(screen.getByText('Текущая')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByLabelText('Пропущены уровни навигации')).not.toHaveAttribute('tabindex');
  });

  it('uses its own container width instead of the viewport', () => {
    let resize: ((entries: Array<{ contentRect: { width: number } }>) => void) | undefined;
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: typeof resize) { resize = callback; }
      observe() { resize?.([{ contentRect: { width: 320 } }]); }
      disconnect() {}
    });

    render(
      <Breadcrumbs items={['Главная', 'Компания', 'Документы', 'Текущая'].map(label => ({ label, href: `#${label}` }))} />,
    );

    expect(screen.getByRole('navigation')).toHaveAttribute('data-compact', 'true');
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('link')).toHaveAccessibleName('Документы');
  });

  it('keeps full text and accessible navigation', async () => {
    const { container } = render(
      <Breadcrumbs items={[{ label: 'Документы', href: '#docs' }, { label: 'Длинное полное название' }]} />,
    );
    expect(screen.getByText('Длинное полное название')).toHaveAttribute('title', 'Длинное полное название');
    expect((await axe(container)).violations).toEqual([]);
  });
});
