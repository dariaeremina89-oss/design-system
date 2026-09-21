import { beforeEach,afterEach,describe,it,expect,vi } from 'vitest';
import { render,screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Tabs } from './Tabs';
beforeEach(()=>vi.stubGlobal('ResizeObserver',class {observe(){} disconnect(){}}));afterEach(()=>vi.unstubAllGlobals());
const items=[{value:'one',label:'Первый',content:'Первая панель'},{value:'disabled',label:'Недоступно',disabled:true,content:'Скрыто'},{value:'two',label:'Второй',content:'Вторая панель'}];
describe('Tabs',()=>{
 it('arrows move focus without selection; Enter activates',async()=>{const user=userEvent.setup(),change=vi.fn();render(<Tabs aria-label="Разделы" items={items} onValueChange={change}/>);await user.tab();await user.keyboard('{ArrowRight}');expect(screen.getByRole('tab',{name:'Второй'})).toHaveFocus();expect(screen.getByRole('tab',{name:'Первый'})).toHaveAttribute('aria-selected','true');expect(change).not.toHaveBeenCalled();await user.keyboard('{Enter}');expect(screen.getByRole('tabpanel')).toHaveTextContent('Вторая панель');expect(change).toHaveBeenCalledWith('two');});
 it('selected panel is linked and accessible',async()=>{const {container}=render(<Tabs aria-label="Разделы" items={items}/>);const tab=screen.getByRole('tab',{selected:true});expect(tab.getAttribute('aria-controls')).toBe(screen.getByRole('tabpanel').id);expect((await axe(container)).violations).toEqual([]);});
});
