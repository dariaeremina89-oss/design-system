import { beforeEach,afterEach,describe,it,expect,vi } from 'vitest';
import { render,screen,fireEvent,waitFor } from '@testing-library/react';
import { Tooltip } from './Tooltip';
beforeEach(()=>vi.stubGlobal('ResizeObserver',class {observe(){} disconnect(){}}));afterEach(()=>vi.unstubAllGlobals());
describe('Tooltip',()=>{
 it('opens on focus and preserves describedby; cleans portal',async()=>{const {unmount}=render(<Tooltip content="Подсказка" delayShow={0} delayHide={0}><button aria-describedby="existing">Действие</button></Tooltip>);const button=screen.getByRole('button');fireEvent.focus(button);const tip=await screen.findByRole('tooltip');expect(button.getAttribute('aria-describedby')).toBe(`existing ${tip.id}`);expect(tip.parentElement).toBe(document.body);fireEvent.blur(button);await waitFor(()=>expect(screen.queryByRole('tooltip')).toBe(null));fireEvent.focus(button);await screen.findByRole('tooltip');unmount();expect(screen.queryByRole('tooltip')).toBe(null);});
 it('disabled blocks both triggers',async()=>{render(<Tooltip content="Подсказка" disabled delayShow={0}><button>Действие</button></Tooltip>);fireEvent.mouseEnter(screen.getByRole('button'));fireEvent.focus(screen.getByRole('button'));await new Promise(r=>setTimeout(r,5));expect(screen.queryByRole('tooltip')).toBe(null);});
});
