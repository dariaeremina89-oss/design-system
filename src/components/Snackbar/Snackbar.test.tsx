import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Snackbar } from './Snackbar';
import { SnackbarStack } from './SnackbarStack';
import { Button } from '../Button/Button';

afterEach(() => vi.useRealTimers());
describe('Snackbar', () => {
  it('announces types and only allows replacing the default icon', () => {
    const { rerender } = render(<Snackbar text="Готово" icon={{ name: 'info_circle' }} />);
    expect(screen.getByRole('status')).toHaveTextContent('Готово');
    expect(document.querySelector('[data-icon="info_circle"]')).not.toBeNull();
    rerender(<Snackbar type="error" text="Ошибка" icon={{ name: 'info_circle' }} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Ошибка');
    expect(document.querySelector('[data-icon="filled/cross_circle_filled"]')).not.toBeNull();
    rerender(<Snackbar type="success" text="Успешно" />);
    expect(document.querySelector('[data-icon="filled/check_circle_filled"]')).not.toBeNull();
  });
  it('does not render an empty notification', () => {
    const { container } = render(<Snackbar text="   " onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });
  it('keeps action before close and delegates visibility to the parent', async () => {
    const action = vi.fn(), close = vi.fn();
    render(<Snackbar text="Готово" onClose={close}><Button onClick={action}>Отменить</Button></Snackbar>);
    const user = userEvent.setup();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Отменить' })).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Закрыть уведомление' })).toHaveFocus();
    await user.keyboard(' ');
    expect(action).toHaveBeenCalledOnce(); expect(close).toHaveBeenCalledOnce();
    expect(screen.getByRole('status')).toBeVisible();
  });
  it('restores focus only when it is removed from inside the notification', () => {
    const trigger = document.createElement('button'); document.body.append(trigger); trigger.focus();
    const view = render(<Snackbar text="Готово" onClose={() => {}} />);
    expect(trigger).toHaveFocus();
    screen.getByRole('button', { name: 'Закрыть уведомление' }).focus();
    view.unmount(); expect(trigger).toHaveFocus(); trigger.remove();
  });
});
describe('SnackbarStack', () => {
  it('uses independent timers without restarting them on parent renders', () => {
    vi.useFakeTimers(); const dismiss = vi.fn();
    const first = { id: 'a', text: 'Первый' };
    const view = render(<SnackbarStack items={[first]} onDismiss={dismiss} />);
    act(() => vi.advanceTimersByTime(3000));
    view.rerender(<SnackbarStack items={[first, { id: 'b', text: 'Второй' }]} onDismiss={id => dismiss(id)} />);
    act(() => vi.advanceTimersByTime(2000)); expect(dismiss.mock.calls).toEqual([['a']]);
    act(() => vi.advanceTimersByTime(3000)); expect(dismiss.mock.calls).toEqual([['a'], ['b']]);
  });
  it('pauses on hover and focus and resumes with the remaining duration', () => {
    vi.useFakeTimers(); const dismiss = vi.fn();
    render(<SnackbarStack items={[{ id: 'a', text: 'Первый', onClose: () => {} }]} onDismiss={dismiss} />);
    const item = screen.getByTestId('snackbar').parentElement!;
    act(() => vi.advanceTimersByTime(2000)); fireEvent.mouseEnter(item);
    act(() => vi.advanceTimersByTime(6000)); expect(dismiss).not.toHaveBeenCalled();
    fireEvent.focus(screen.getByTestId('snackbar-close')); fireEvent.mouseLeave(item);
    act(() => vi.advanceTimersByTime(6000)); expect(dismiss).not.toHaveBeenCalled();
    fireEvent.blur(screen.getByTestId('snackbar-close'), { relatedTarget: document.body });
    act(() => vi.advanceTimersByTime(2999)); expect(dismiss).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1)); expect(dismiss).toHaveBeenCalledWith('a');
  });
  it('cleans timers on removal and keeps separate stacks independent', () => {
    vi.useFakeTimers(); const a = vi.fn(), b = vi.fn();
    const view = render(<SnackbarStack items={[{ id: 'a', text: 'Страница', onClose: () => {} }]} onDismiss={a} />);
    render(<SnackbarStack items={[{ id: 'b', text: 'Диалог' }]} onDismiss={b} />);
    fireEvent.click(screen.getByTestId('snackbar-close')); expect(a).toHaveBeenCalledWith('a');
    view.unmount(); act(() => vi.advanceTimersByTime(5000));
    expect(a).toHaveBeenCalledOnce(); expect(b).toHaveBeenCalledWith('b');
  });
  it('handles Escape locally without closing the surrounding dialog', () => {
    const outer = vi.fn(), dismiss = vi.fn();
    render(<div onKeyDown={outer}><SnackbarStack items={[{ id: 'a', text: 'Готово', onClose: () => {} }]} onDismiss={dismiss} /></div>);
    fireEvent.keyDown(screen.getByTestId('snackbar-close'), { key: 'Escape' });
    expect(dismiss).toHaveBeenCalledWith('a'); expect(outer).not.toHaveBeenCalled();
  });
});
