import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropdown } from './Dropdown';
import { Button } from '../Button/Button';

beforeAll(() => { globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }; });
afterEach(() => vi.unstubAllGlobals());
function media(matches: boolean) {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
}
const items = [{id:'docx',title:'Скачать DOCX'},{id:'off',title:'Недоступно',disabled:true},{id:'zip',title:'Скачать архив'}];
function example(action = vi.fn(), childClick = vi.fn(), disabled = false) {
  render(<Dropdown trigger="hover" primaryAction={{id:'pdf',title:'Скачать PDF',onAction:action}} items={items}>
    <Button disabled={disabled} onClick={childClick}>Скачать PDF</Button>
  </Dropdown>);
  return screen.getByRole('button',{name:'Скачать PDF'});
}
describe('Dropdown hover action', () => {
  it('hover preserves focus, crossing into the popup keeps it open, leaving closes without focusing the trigger', async () => {
    media(true); const user=userEvent.setup(), action=vi.fn(); const trigger=example(action);
    await user.hover(trigger); expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(document.body).toHaveFocus(); expect(action).not.toHaveBeenCalled();
    expect(screen.queryByRole('menuitem',{name:'Скачать PDF'})).not.toBeInTheDocument();
    await user.hover(screen.getByRole('menuitem',{name:'Скачать DOCX'}));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.hover(document.body);
    await waitFor(()=>expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(document.body).toHaveFocus();
  });
  it('desktop click, Enter and Space each run the main action once', async () => {
    media(true); const user=userEvent.setup(), action=vi.fn(); const trigger=example(action);
    await user.click(trigger); expect(action).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await user.keyboard('{Enter} '); expect(action).toHaveBeenCalledTimes(3);
  });
  it('ArrowDown enters an already hovered menu and ArrowUp skips disabled rows', async () => {
    media(true); const user=userEvent.setup(); const trigger=example();
    await user.tab(); await user.hover(trigger); await user.keyboard('{ArrowDown}');
    await waitFor(()=>expect(screen.getByRole('menuitem',{name:'Скачать DOCX'})).toHaveFocus());
    await user.keyboard('{ArrowUp}'); expect(screen.getByRole('menuitem',{name:'Скачать архив'})).toHaveFocus();
    await user.keyboard('{Escape}'); expect(trigger).toHaveFocus(); expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
  it('narrow or non-hover mode moves the same action into the menu without firing on the trigger', async () => {
    media(false); const user=userEvent.setup(), action=vi.fn(), childClick=vi.fn(); const trigger=example(action,childClick);
    await user.click(trigger); expect(action).not.toHaveBeenCalled(); expect(childClick).not.toHaveBeenCalled();
    expect(screen.getAllByRole('menuitem')[0]).toHaveTextContent('Скачать PDF');
    await user.click(screen.getByRole('menuitem',{name:'Скачать PDF'}));
    expect(action).toHaveBeenCalledTimes(1); expect(trigger).toHaveFocus(); expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
  it('actual touch on a hover-capable screen also moves the action into the menu', async () => {
    media(true); const user=userEvent.setup(), action=vi.fn(); const trigger=example(action);
    await user.pointer([{keys:'[TouchA>]',target:trigger},{keys:'[/TouchA]',target:trigger}]);
    expect(action).not.toHaveBeenCalled(); expect(screen.getAllByRole('menuitem')[0]).toHaveTextContent('Скачать PDF');
    await user.click(screen.getByRole('menuitem',{name:'Скачать PDF'})); expect(action).toHaveBeenCalledTimes(1);
  });
  it('disabled trigger cannot open or execute', async () => {
    media(true); const user=userEvent.setup(), action=vi.fn(); const trigger=example(action,vi.fn(),true);
    await user.hover(trigger); await user.click(trigger); expect(screen.queryByRole('menu')).not.toBeInTheDocument(); expect(action).not.toHaveBeenCalled();
  });
});
