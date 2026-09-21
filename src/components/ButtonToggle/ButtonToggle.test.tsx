import { describe,it,expect,vi } from 'vitest';
import { render,screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { ButtonToggle } from './ButtonToggle';
const options=[{value:'a',label:'День'},{value:'b',label:'Неделя',disabled:true},{value:'c',label:'Месяц'}];
describe('ButtonToggle',()=>{
 it('keeps one selected and skips disabled with arrows',async()=>{const user=userEvent.setup(),change=vi.fn();render(<ButtonToggle aria-label="Период" options={options} onValueChange={change}/>);await user.tab();expect(screen.getByRole('radio',{name:'День'})).toHaveFocus();await user.keyboard('{ArrowRight}');expect(screen.getByRole('radio',{name:'Месяц'})).toHaveFocus();expect(change).toHaveBeenLastCalledWith('c');await user.keyboard('{Enter}');expect(change).toHaveBeenCalledTimes(1);await user.keyboard('{Home}');expect(screen.getByRole('radio',{name:'День'})).toHaveAttribute('aria-checked','true');});
 it('controlled selection is not changed internally',async()=>{const user=userEvent.setup(),change=vi.fn();render(<ButtonToggle aria-label="Период" options={options} value="a" onValueChange={change}/>);await user.click(screen.getByText('Месяц'));expect(change).toHaveBeenCalledWith('c');expect(screen.getByRole('radio',{name:'День'})).toHaveAttribute('aria-checked','true');});
 it('submits chosen value and supports axe',async()=>{const {container}=render(<form><ButtonToggle aria-label="Период" name="period" options={options} defaultValue="c"/></form>);expect(new FormData(container.querySelector('form')!).get('period')).toBe('c');expect((await axe(container)).violations).toEqual([]);});
});
