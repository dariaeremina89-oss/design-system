import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'jest-axe';
import { ChipsGroup } from './ChipsGroup';

const options = [
  { value: 'all', text: 'Все' },
  { value: 'signed', text: 'Подписанные' },
  { value: 'draft', text: 'Черновики', disabled: true },
];

describe('ChipsGroup', () => {
  it('exposes stable group metadata', () => {
    render(<ChipsGroup aria-label="Фильтр" options={options} selectionMode="single" size="small" shape="square" />);
    const group = screen.getByTestId('chips-group');

    expect(group).toHaveAttribute('role', 'group');
    expect(group).toHaveAttribute('data-selection-mode', 'single');
    expect(group).toHaveAttribute('data-size', 'small');
    expect(group).toHaveAttribute('data-shape', 'square');
  });

  it('supports uncontrolled multiple selection', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ChipsGroup aria-label="Фильтр" options={options} defaultValue={['all']} onValueChange={onValueChange} />);

    await user.click(screen.getByRole('button', { name: 'Подписанные' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['all', 'signed']);
    expect(screen.getByRole('button', { name: 'Подписанные' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('keeps only one selected value in single mode', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ChipsGroup aria-label="Фильтр" options={options} defaultValue={['all']} selectionMode="single" onValueChange={onValueChange} />);

    await user.click(screen.getByRole('button', { name: 'Подписанные' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['signed']);
    expect(screen.getByRole('button', { name: 'Все' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Подписанные' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('uses roving focus and skips disabled chips', async () => {
    const user = userEvent.setup();
    render(<ChipsGroup aria-label="Фильтр" options={options} />);
    const all = screen.getByRole('button', { name: 'Все' });
    const signed = screen.getByRole('button', { name: 'Подписанные' });
    const draft = screen.getByRole('button', { name: 'Черновики' });

    all.focus();
    await user.keyboard('{ArrowRight}');
    expect(signed).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(all).toHaveFocus();
    expect(draft).toBeDisabled();
  });

  it('renders loading as noninteractive chip skeletons', () => {
    render(<ChipsGroup aria-label="Фильтр" options={options} isLoading />);
    const group = screen.getByTestId('chips-group');

    expect(group).toHaveAttribute('aria-busy', 'true');
    expect(group).toHaveAttribute('data-loading', 'true');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(group.querySelectorAll('[data-testid="chips"]').length).toBe(options.length);
  });

  it('disables the whole group and passes axe', async () => {
    const { container } = render(<ChipsGroup aria-label="Фильтр" options={options} disabled />);
    expect(screen.getByTestId('chips-group')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getAllByRole('button').every(button => (button as HTMLButtonElement).disabled)).toBe(true);
    expect((await axe(container)).violations).toEqual([]);
  });
});
