import { beforeAll, afterAll, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Dialog } from './Dialog';
// jsdom has no modal top layer; native focus/inert behavior is covered in browser tests.
beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {configurable:true, value:function(this: HTMLDialogElement) { this.open = true; }});
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {configurable:true, value:function(this: HTMLDialogElement) { this.open = false; }});
});
afterAll(() => { Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal'); Reflect.deleteProperty(HTMLDialogElement.prototype, 'close'); });
describe('Dialog', () => {
  it('opens with an accessible title, locks scrolling and restores focus and overflow', () => {
    const trigger = document.createElement('button'); document.body.append(trigger); trigger.focus();
    document.body.style.overflow = 'auto';
    const { rerender } = render(<Dialog open title="Документ" onClose={() => {}}>Описание</Dialog>);
    expect(screen.getByRole('dialog', { name: 'Документ' })).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('heading')).toHaveFocus(); expect(document.body.style.overflow).toBe('hidden');
    rerender(<Dialog open={false} title="Документ" onClose={() => {}} />);
    expect(screen.queryByRole('dialog')).toBeNull(); expect(trigger).toHaveFocus(); expect(document.body.style.overflow).toBe('auto');
    trigger.remove(); document.body.style.overflow = '';
  });
  it('requests controlled close and respects the Escape policy', () => {
    const close = vi.fn(); const { rerender } = render(<Dialog open title="Документ" onClose={close} />);
    fireEvent.click(screen.getByLabelText('Закрыть диалог')); expect(close).toHaveBeenLastCalledWith('close-button');
    expect(screen.getByRole('dialog')).toBeVisible();
    fireEvent(screen.getByRole('dialog'), new Event('cancel', {bubbles:false,cancelable:true})); expect(close).toHaveBeenLastCalledWith('escape');
    close.mockClear(); rerender(<Dialog open title="Документ" onClose={close} closeOnEscape={false} />);
    fireEvent(screen.getByRole('dialog'), new Event('cancel', {cancelable:true})); expect(close).not.toHaveBeenCalled();
  });
  it('handles Escape only in the innermost dialog across React portals', () => {
    const parentClose = vi.fn(), childClose = vi.fn();
    render(<Dialog open title="Родитель" onClose={parentClose}><Dialog open title="Дочерний" onClose={childClose}/></Dialog>);
    fireEvent(screen.getByRole('dialog', {name:'Дочерний'}), new Event('cancel', {cancelable:true}));
    expect(childClose).toHaveBeenCalledWith('escape'); expect(parentClose).not.toHaveBeenCalled();
  });
  it('keeps nested scroll locks until all modals close', () => {
    const a = render(<Dialog open title="Первый" onClose={() => {}}/>);
    const b = render(<Dialog open title="Второй" onClose={() => {}}/>);
    b.unmount(); expect(document.body.style.overflow).toBe('hidden'); a.unmount(); expect(document.body.style.overflow).toBe('');
  });
  it('connects descriptions and custom selectors without a11y violations', async () => {
    const { baseElement } = render(<Dialog open title="Документ" onClose={() => {}} data-testid="edit" aria-describedby="details" footer={<button>Сохранить</button>}><p id="details">Описание</p></Dialog>);
    expect(screen.getByTestId('edit')).toHaveAccessibleDescription('Описание'); expect(screen.getByTestId('edit-footer')).toBeVisible();
    expect((await axe(baseElement)).violations).toEqual([]);
  });
});
