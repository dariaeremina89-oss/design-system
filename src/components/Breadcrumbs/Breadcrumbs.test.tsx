import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Breadcrumbs } from './Breadcrumbs';

describe('Breadcrumbs', () => {
  it('hides the component for a single level', () => {
    render(<Breadcrumbs items={[{ label: 'Домой' }]} />);
    expect(screen.queryByRole('navigation')).toBe(null);
  });

  it('shows all levels when the hierarchy contains no more than three items', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Главная', href: '#home' },
          { label: 'Документы', href: '#documents' },
          { label: 'Текущая' },
        ]}
      />,
    );

    expect(screen.getAllByRole('link')).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Главная' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Документы' })).toBeInTheDocument();
    expect(screen.getByText('Текущая')).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByLabelText('Пропущены уровни навигации')).toBe(null);
  });

  it('always collapses hierarchies deeper than three levels to ellipsis + previous + current', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Главная', href: '#home' },
          { label: 'Компания', href: '#company' },
          { label: 'Документы', href: '#documents' },
          { label: 'Договоры', href: '#contracts' },
          { label: 'Текущая' },
        ]}
      />,
    );

    expect(screen.queryByText('Главная')).toBe(null);
    expect(screen.queryByText('Компания')).toBe(null);
    expect(screen.queryByText('Документы')).toBe(null);

    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Договоры' })).toBeInTheDocument();
    expect(screen.getByText('Текущая')).toHaveAttribute('aria-current', 'page');

    const ellipsis = screen.getByLabelText('Пропущены уровни навигации');
    expect(ellipsis).toHaveTextContent('…');
    expect(ellipsis.closest('a,button')).toBe(null);
    expect(ellipsis).not.toHaveAttribute('tabindex');
  });

  it('keeps full text and accessible navigation', async () => {
    const { container } = render(
      <Breadcrumbs items={[{ label: 'Документы', href: '#docs' }, { label: 'Длинное полное название' }]} />,
    );
    expect(screen.getByText('Длинное полное название')).toHaveAttribute('title', 'Длинное полное название');
    expect((await axe(container)).violations).toEqual([]);
  });
});
