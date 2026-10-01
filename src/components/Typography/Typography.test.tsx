import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Typography } from './Typography';

describe('Typography', () => {
  it('uses body paragraph defaults and stable selectors', () => {
    render(<Typography>Текст</Typography>);
    const text = screen.getByTestId('typography');

    expect(text.tagName).toBe('P');
    expect(text).toHaveAttribute('data-typography', 'body');
    expect(text).toHaveAttribute('data-responsive', 'false');
    expect(text).toHaveAttribute('data-strong', 'false');
    expect(text.style.getPropertyValue('--typography-size')).toBe('var(--page-body-size)');
  });

  it('changes semantic element independently from visual variant', () => {
    render(<Typography as="h2" variant="h1-heading">Заголовок</Typography>);
    const heading = screen.getByRole('heading', { level: 2, name: 'Заголовок' });

    expect(heading).toHaveAttribute('data-typography', 'h1-heading');
    expect(heading.style.getPropertyValue('--typography-family')).toBe('var(--page-h1-heading-family)');
  });

  it('uses strong token for non-heading variants', () => {
    render(<Typography variant="subtitle" strong>Подзаголовок</Typography>);
    const text = screen.getByTestId('typography');

    expect(text).toHaveAttribute('data-strong', 'true');
    expect(text.style.getPropertyValue('--typography-weight')).toBe('var(--page-subtitle-weight-strong)');
  });

  it('exposes responsive mobile token references without changing the public variant', () => {
    render(<Typography variant="caption" responsive>Подпись</Typography>);
    const text = screen.getByTestId('typography');

    expect(text).toHaveAttribute('data-responsive', 'true');
    expect(text).toHaveAttribute('data-typography', 'caption');
    expect(text.style.getPropertyValue('--typography-size-mobile')).toBe('var(--page-caption-size-mobile)');
    expect(text.style.getPropertyValue('--typography-line-height-mobile')).toBe('var(--page-caption-line-height-mobile)');
  });

  it('lets consumers override the root test id and style', () => {
    render(<Typography data-testid="page-title" style={{ margin: 0 }}>Заголовок</Typography>);
    expect(screen.getByTestId('page-title')).toHaveStyle({ margin: '0px' });
  });
});
