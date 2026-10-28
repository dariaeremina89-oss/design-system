import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { BottomSheet } from './BottomSheet';

afterEach(() => {
  document.body.style.overflow = '';
});

describe('BottomSheet', () => {
  it('renders modal structure, locks scroll and restores focus', async () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'Открыть';
    document.body.append(trigger);
    trigger.focus();
    document.body.style.overflow = 'auto';

    const { rerender, baseElement } = render(
      <BottomSheet
        open
        onClose={() => {}}
        aria-label="Дополнительная информация"
        footer={<button>Продолжить</button>}
      >
        <p>Текст</p>
      </BottomSheet>,
    );

    const sheet = screen.getByRole('dialog', { name: 'Дополнительная информация' });
    expect(sheet).toHaveAttribute('aria-modal', 'true');
    expect(document.body.style.overflow).toBe('hidden');
    expect(screen.getByText('Продолжить')).toHaveFocus();
    expect(screen.getByTestId('bottom-sheet-handle')).toBeVisible();
    expect((await axe(baseElement)).violations).toEqual([]);

    rerender(<BottomSheet open={false} onClose={() => {}} aria-label="Дополнительная информация" />);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe('auto');
    trigger.remove();
  });

  it('closes by scrim, Escape and downward swipe', () => {
    const close = vi.fn();
    const { rerender } = render(<BottomSheet open onClose={close} aria-label="Меню"><p>Контент</p></BottomSheet>);

    fireEvent.click(screen.getByTestId('bottom-sheet-scrim'));
    expect(close).toHaveBeenLastCalledWith('scrim');

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(close).toHaveBeenLastCalledWith('escape');

    const sheet = screen.getByRole('dialog');
    Object.defineProperty(sheet, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({ width: 320, height: 300, top: 0, left: 0, right: 320, bottom: 300, x: 0, y: 0, toJSON: () => ({}) }),
    });
    fireEvent.touchStart(sheet, { touches: [{ clientY: 100 }] });
    fireEvent.touchMove(sheet, { touches: [{ clientY: 180 }] });
    fireEvent.touchEnd(sheet);
    expect(close).toHaveBeenLastCalledWith('swipe');

    close.mockClear();
    rerender(<BottomSheet open onClose={close} aria-label="Меню" swipeToClose={false}><p>Контент</p></BottomSheet>);
    fireEvent.touchStart(screen.getByRole('dialog'), { touches: [{ clientY: 100 }] });
    fireEvent.touchMove(screen.getByRole('dialog'), { touches: [{ clientY: 220 }] });
    fireEvent.touchEnd(screen.getByRole('dialog'));
    expect(close).not.toHaveBeenCalled();
  });

  it('keeps the page interactive without Scrim', () => {
    document.body.style.overflow = 'auto';
    render(<BottomSheet open scrim={false} onClose={() => {}} aria-label="Подсказка"><p>Контент</p></BottomSheet>);
    expect(screen.queryByTestId('bottom-sheet-scrim')).toBeNull();
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-modal');
    expect(document.body.style.overflow).toBe('auto');
  });

  it('contains Tab focus only in modal mode', () => {
    render(
      <BottomSheet open onClose={() => {}} aria-label="Действия" footer={<><button>Первый</button><button>Второй</button></>}>
        <button>Контент</button>
      </BottomSheet>,
    );
    const sheet = screen.getByRole('dialog');
    const first = screen.getByText('Контент');
    const last = screen.getByText('Второй');
    last.focus();
    fireEvent.keyDown(sheet, { key: 'Tab' });
    expect(first).toHaveFocus();
    first.focus();
    fireEvent.keyDown(sheet, { key: 'Tab', shiftKey: true });
    expect(last).toHaveFocus();
  });
});
