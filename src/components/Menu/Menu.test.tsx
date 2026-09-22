import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropdown } from './Dropdown';
import { Menu } from './Menu';
import { Button } from '../Button/Button';

beforeAll(() => { globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }; });
const items = [{id:'head',title:'Документ',variant:'header' as const},{id:'edit',title:'Редактировать'},{id:'off',title:'Недоступно',disabled:true},{id:'copy',title:'Копировать'}];
describe('Menu and Dropdown',()=>{
  it('opens from a real Button, navigates, activates and restores trigger focus',async()=>{
    const user=userEvent.setup(), action=vi.fn();render(<Dropdown items={items} onAction={action}><Button>Действия</Button></Dropdown>);
    const trigger=screen.getByRole('button',{name:'Действия'});await user.click(trigger);
    await waitFor(()=>expect(screen.getByRole('menuitem',{name:'Редактировать'})).toHaveFocus());
    await user.keyboard('{ArrowDown}');expect(screen.getByRole('menuitem',{name:'Копировать'})).toHaveFocus();await user.keyboard(' ');
    expect(action).toHaveBeenCalledTimes(1);expect(screen.queryByRole('menu')).not.toBeInTheDocument();expect(trigger).toHaveFocus();
  });
  it('opens at last item using ArrowUp and closes with Escape',async()=>{
    const user=userEvent.setup();render(<Dropdown items={items}><Button>Действия</Button></Dropdown>);await user.tab();await user.keyboard('{ArrowUp}');
    await waitFor(()=>expect(screen.getByRole('menuitem',{name:'Копировать'})).toHaveFocus());await user.keyboard('{Escape}');expect(screen.getByRole('button',{name:'Действия'})).toHaveFocus();expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
  it('filters in Search without closing and navigates into results',async()=>{
    const user=userEvent.setup();render(<Dropdown items={items} searchable><Button>Действия</Button></Dropdown>);await user.click(screen.getByRole('button',{name:'Действия'}));
    await waitFor(()=>expect(screen.getByRole('searchbox')).toHaveFocus());await user.type(screen.getByRole('searchbox'),'Коп');expect(screen.getAllByRole('menuitem')).toHaveLength(1);
    await user.keyboard('{ArrowDown}');expect(screen.getByRole('menuitem',{name:'Копировать'})).toHaveFocus();
  });
  it('checkbox rows expose one interactive control and do not double activate',async()=>{
    const user=userEvent.setup(), action=vi.fn();render(<Menu items={[{id:'one',title:'Один',selection:'checkbox',selected:true}]} onAction={action}/>);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();const row=screen.getByRole('menuitemcheckbox');expect(row).toHaveAttribute('aria-checked','true');await user.click(row);expect(action).toHaveBeenCalledTimes(1);
  });
  it('links keep navigation semantics and keyboard focus',async()=>{
    const user=userEvent.setup();render(<Menu items={[{id:'one',title:'Один'},{id:'help',title:'Справка',variant:'link',href:'#help'}]}/>);await user.tab();await user.keyboard('{End}');expect(screen.getByRole('menuitem',{name:'Справка'})).toHaveFocus();expect(screen.getByRole('menuitem',{name:'Справка'})).toHaveAttribute('href','#help');
  });
});
