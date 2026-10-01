import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'jest-axe';
import { ItemRow } from './ItemRow';

describe('ItemRow', () => {
  it('exposes stable root and content selectors', () => {
    render(<ItemRow title="Договор" description="PDF" helper="2,7 МБ" leadingIcon="doc-paper" trailingIcon="arrow-chevron-right" divider />);

    expect(screen.getByTestId('item-row')).toHaveAttribute('data-variant', 'item');
    expect(screen.getByTestId('item-row-title')).toHaveTextContent('Договор');
    expect(screen.getByTestId('item-row-description')).toHaveTextContent('PDF');
    expect(screen.getByTestId('item-row-helper')).toHaveTextContent('2,7 МБ');
    expect(screen.getByTestId('item-row-left-slot')).toBeInTheDocument();
    expect(screen.getByTestId('item-row-right-slot')).toBeInTheDocument();
    expect(screen.getByTestId('item-row-divider')).toBeInTheDocument();
  });

  it('activates an interactive item with click, Enter and Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ItemRow title="Открыть" onClick={onClick} />);
    const row = screen.getByRole('button', { name: 'Открыть' });

    await user.click(row);
    row.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('keeps header noninteractive and disables item actions', () => {
    const onClick = vi.fn();
    const { rerender } = render(<ItemRow variant="header" title="Раздел" onClick={onClick} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rerender(<ItemRow title="Недоступно" disabled onClick={onClick} />);
    const row = screen.getByTestId('item-row');
    expect(row).toHaveAttribute('data-state', 'disabled');
    expect(row).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(row);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders selection on the configured side', () => {
    const { rerender } = render(<ItemRow title="Документ" selection="check" selected selectionPosition="right" />);
    expect(screen.getByTestId('item-row-selection')).toHaveAttribute('data-selected', 'true');
    expect(screen.getByTestId('item-row-right-slot')).toContainElement(screen.getByTestId('item-row-selection'));

    rerender(<ItemRow title="Документ" selection="checkbox" selected selectionPosition="left" />);
    expect(screen.getByTestId('item-row-left-slot')).toContainElement(screen.getByTestId('item-row-selection'));
  });

  it('uses Link and Search semantics for their variants', () => {
    const { rerender } = render(<ItemRow variant="link" title="Подробнее" href="#details" />);
    expect(screen.getByRole('link', { name: 'Подробнее' })).toHaveAttribute('href', '#details');

    rerender(<ItemRow variant="search" searchProps={{ 'aria-label': 'Поиск', placeholder: 'Найти' }} />);
    expect(screen.getByRole('textbox', { name: 'Поиск' })).toBeInTheDocument();
  });

  it('replaces row content with noninteractive Skeleton state', () => {
    render(<ItemRow title="Документ" description="Описание" helper="2,7 МБ" leadingIcon="doc-paper" state="skeleton" />);
    const row = screen.getByTestId('item-row');
    expect(row).toHaveAttribute('aria-hidden', 'true');
    expect(row).not.toHaveAttribute('role');
    expect(screen.queryByText('Документ')).not.toBeInTheDocument();
    expect(row.querySelectorAll('[data-testid="skeleton"]').length).toBeGreaterThan(0);
  });

  it('has no axe violations in an interactive item', async () => {
    const { container } = render(<ItemRow title="Договор" description="Документ клиента" onClick={() => undefined} />);
    expect((await axe(container)).violations).toEqual([]);
  });
});
