import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Textarea } from './Textarea';
import { Input } from '../Input/Input';

describe('Textarea', () => {
  it('associates the label, error, counter and an external description', () => {
    render(<><p id="help">Внешняя подсказка</p><Textarea label="Комментарий" error="Ошибка" caption="Скрытая подсказка" counter maxLength={100} aria-describedby="help" /></>);
    expect(screen.getByLabelText('Комментарий')).toHaveAccessibleDescription('Внешняя подсказка Ошибка 0 / 100');
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByText('Скрытая подсказка')).not.toBeInTheDocument();
  });
  it('preserves line breaks from typing and paste, updates count, limits input', async () => {
    const user = userEvent.setup(); const onChange = vi.fn();
    render(<Textarea label="Комментарий" defaultValue="abc" counter maxLength={10} onChange={onChange} />);
    const control = screen.getByRole('textbox');
    await user.type(control, '{Enter}de');
    expect(control).toHaveValue('abc\nde');
    await user.paste('\nfghijkl');
    expect(control).toHaveValue('abc\nde\nfgh');
    expect(screen.getByTestId('textarea-counter')).toHaveTextContent('10 / 10');
    expect(onChange).toHaveBeenCalled();
  });
  it('updates a controlled value and preserves it through rerenders', async () => {
    const user = userEvent.setup();
    function Controlled() { const [value, setValue] = useState('abc'); return <Textarea label="Текст" value={value} onChange={event => setValue(event.target.value)} counter />; }
    render(<Controlled />);
    await user.type(screen.getByRole('textbox'), 'd');
    expect(screen.getByRole('textbox')).toHaveValue('abcd');
    expect(screen.getByTestId('textarea-counter')).toHaveTextContent('4');
  });
  it('does not change a controlled value without a parent update', async () => {
    const user = userEvent.setup(); const change = vi.fn();
    const { rerender } = render(<Textarea label="Текст" value="abc" onChange={change} counter />);
    await user.type(screen.getByRole('textbox'), 'd');
    expect(screen.getByRole('textbox')).toHaveValue('abc');
    rerender(<Textarea label="Текст" value="new" onChange={change} counter />);
    expect(screen.getByRole('textbox')).toHaveValue('new');
    expect(change).toHaveBeenCalled();
  });
  it('supports required, forwarded ref and custom selectors', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea label="Текст" required ref={ref} data-testid="comment" />);
    expect(ref.current).toBe(screen.getByTestId('comment'));
    expect(ref.current).toBeRequired();
    expect(ref.current).toHaveAttribute('aria-required', 'true');
    expect(screen.getByTestId('comment-root')).toBeInTheDocument();
  });
  it('blocks disabled input, focus and resize but preserves the error', async () => {
    const user = userEvent.setup();
    render(<Textarea label="Текст" disabled resize error="Ошибка" defaultValue="abc" />);
    const control = screen.getByRole('textbox');
    await user.type(control, 'd'); control.focus();
    expect(control).toHaveValue('abc'); expect(control).not.toHaveFocus();
    expect(control).toHaveStyle({ resize: 'none' });
    expect(control).toHaveAccessibleDescription('Ошибка');
  });
  it('preserves readonly content and accepts an accessible name without label', async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="Текст" readOnly defaultValue="abc" />);
    await user.type(screen.getByRole('textbox', { name: 'Текст' }), 'd');
    expect(screen.getByRole('textbox')).toHaveValue('abc');
  });
  it('uses noninteractive skeletons and omits value bars for empty fields', () => {
    const { rerender } = render(<Textarea skeleton label="Текст" caption="Подсказка" counter />);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByTestId('textarea-skeleton')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByTestId('textarea-skeleton-text')).not.toBeInTheDocument();
    rerender(<Textarea skeleton label="Текст" value="abc" caption="Подсказка" counter />);
    expect(screen.getByTestId('textarea-skeleton-text')).toBeInTheDocument();
    expect(screen.getByTestId('textarea-skeleton-counter')).toBeInTheDocument();
  });
  it('omits empty helper content and preserves custom counters', () => {
    const { rerender } = render(<Textarea aria-label="Текст" caption="" counter={false} />);
    expect(screen.queryByTestId('textarea-helper')).not.toBeInTheDocument();
    rerender(<Textarea aria-label="Текст" counter="Осталось 20" />);
    expect(screen.getByTestId('textarea-counter')).toHaveTextContent('Осталось 20');
  });
  it.each([undefined, 'Ошибка'])('has no axe violations with error=%s', async error => {
    const { container } = render(<Textarea label="Комментарий" caption="Подсказка" error={error} required counter maxLength={100} />);
    expect((await axe(container)).violations).toHaveLength(0);
  });
});

describe('shared Input and Textarea contract', () => {
  it.each([Input, Textarea])('preserves supplied ARIA descriptions and helper priority', Component => {
    const { rerender } = render(<><p id="external">Внешний текст</p><Component label="Поле" aria-describedby="external" caption="Подсказка" error="Ошибка" counter defaultValue="abc" /></>);
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Внешний текст Ошибка 3');
    rerender(<><p id="external">Внешний текст</p><Component label="Поле" aria-describedby="external" caption="Подсказка" counter defaultValue="abc" /></>);
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Внешний текст Подсказка 3');
  });
});
