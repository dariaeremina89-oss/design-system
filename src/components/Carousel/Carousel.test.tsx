import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Carousel } from './Carousel';
import { CarouselViewport } from './CarouselViewport';

describe('Carousel', () => {
  it('hides navigation for fewer than two items', () => {
    const {rerender} = render(<Carousel count={0} controlsId="slides"/>);
    expect(screen.queryByRole('navigation')).toBeNull();
    rerender(<Carousel count={1} controlsId="slides"/>);
    expect(screen.queryByRole('navigation')).toBeNull();
  });
  it('changes once, preserves dots and respects boundaries', async () => {
    const user=userEvent.setup(), change=vi.fn();
    render(<Carousel count={3} controlsId="slides" onIndexChange={change}/>);
    const first=screen.getByLabelText('Перейти к элементу 1 из 3');
    expect(screen.getByLabelText('Предыдущий элемент')).toBeDisabled();
    await user.click(first); expect(change).not.toHaveBeenCalled();
    await user.click(screen.getByLabelText('Следующий элемент'));
    expect(change).toHaveBeenLastCalledWith(1);
    expect(screen.getByLabelText('Перейти к элементу 1 из 3')).toBe(first);
    await user.click(screen.getByLabelText('Следующий элемент'));
    expect(screen.getByLabelText('Следующий элемент')).toBeDisabled();
    expect(screen.getByLabelText('Перейти к элементу 3 из 3')).toHaveAttribute('aria-current','true');
  });
  it('arrows move only focus; Enter selects, Tab returns to selected dot', async () => {
    const user=userEvent.setup(); render(<Carousel count={4} defaultIndex={1} controlsId="slides"/>);
    await user.tab(); await user.tab();
    expect(screen.getByLabelText('Перейти к элементу 2 из 4')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByLabelText('Перейти к элементу 3 из 4')).toHaveFocus();
    expect(screen.getByLabelText('Перейти к элементу 2 из 4')).toHaveAttribute('aria-current','true');
    await user.keyboard('{Enter}');
    expect(screen.getByLabelText('Перейти к элементу 3 из 4')).toHaveAttribute('aria-current','true');
    await user.keyboard('{Home}'); await user.tab(); await user.tab({shift:true});
    expect(screen.getByLabelText('Перейти к элементу 3 из 4')).toHaveFocus();
  });
  it('controlled selection waits for parent and clamps when count shrinks', () => {
    const change=vi.fn(); const {rerender}=render(<Carousel count={10} index={8} controlsId="slides" onIndexChange={change}/>);
    fireEvent.click(screen.getByLabelText('Предыдущий элемент')); expect(change).toHaveBeenCalledWith(7);
    expect(screen.getByLabelText('Перейти к элементу 9 из 10')).toHaveAttribute('aria-current','true');
    rerender(<Carousel count={3} index={8} controlsId="slides"/>);
    expect(screen.getByLabelText('Перейти к элементу 3 из 3')).toHaveAttribute('aria-current','true');
  });
  it('disables every action and links controls to content', () => {
    render(<Carousel count={3} disabled controlsId="slides"/>);
    screen.getAllByRole('button').forEach(button=>{expect(button).toBeDisabled();expect(button).toHaveAttribute('aria-controls','slides');});
  });
  it('removes inactive content from interaction and announces position', () => {
    const {rerender}=render(<CarouselViewport id="slides" index={0} onIndexChange={()=>{}}><button>One</button><button>Two</button></CarouselViewport>);
    expect(screen.getByText('Two').parentElement).toHaveAttribute('inert');
    rerender(<CarouselViewport id="slides" index={1} onIndexChange={()=>{}}><button>One</button><button>Two</button></CarouselViewport>);
    expect(screen.getByText('One').parentElement).toHaveAttribute('inert');
    expect(screen.getByText('Элемент 2 из 2')).toBeInTheDocument();
  });
});
