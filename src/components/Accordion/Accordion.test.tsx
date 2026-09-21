import { describe,it,expect } from 'vitest';
import { render,screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Accordion,AccordionGroup } from './Accordion';
const items=[{value:'one',title:'Первый',children:<a href="#first">Ссылка</a>},{value:'two',title:'Второй',children:'Вторая панель'}];
describe('Accordion',()=>{
 it('uses one header button and hides content from keyboard',async()=>{const user=userEvent.setup();const {container}=render(<Accordion title="Условия"><a href="#details">Подробнее</a></Accordion>);expect(container.querySelectorAll('button')).toHaveLength(1);expect(screen.queryByRole('link')).toBe(null);await user.tab();await user.keyboard('{Enter}');expect(screen.getByRole('button')).toHaveAttribute('aria-expanded','true');await user.tab();expect(screen.getByRole('link')).toHaveFocus();await user.tab({shift:true});await user.keyboard(' ');expect(screen.queryByRole('link')).toBe(null);});
 it('single and multiple group semantics',async()=>{const user=userEvent.setup();const {rerender}=render(<AccordionGroup items={items}/>);await user.click(screen.getByRole('button',{name:'Первый'}));await user.click(screen.getByRole('button',{name:'Второй'}));expect(screen.getByRole('button',{name:'Первый'})).toHaveAttribute('aria-expanded','false');rerender(<AccordionGroup items={items} multiple/>);await user.click(screen.getByRole('button',{name:'Первый'}));expect(screen.getByRole('button',{name:'Второй'})).toHaveAttribute('aria-expanded','true');});
 it('disabled does not toggle and links aria-controls',async()=>{const user=userEvent.setup();const {container}=render(<Accordion title="Раздел" disabled defaultExpanded>Текст</Accordion>);await user.click(screen.getByRole('button'));expect(screen.getByRole('button')).toHaveAttribute('aria-expanded','true');expect(container.querySelector('button')?.getAttribute('aria-controls')).toBe(screen.getByRole('region').id);expect((await axe(container)).violations).toEqual([]);});
});
