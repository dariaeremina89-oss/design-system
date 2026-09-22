import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

beforeAll(() => { globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }; });
const options = [{value:'one',label:'Первый'}, {value:'two',label:'Второй',disabled:true}, {value:'three',label:'Третий'}];
describe('Select', () => {
  it('focus does not open; keyboard skips disabled and commits exactly once', async () => {
    const user=userEvent.setup(), change=vi.fn();render(<Select label="Статус" options={options} onValueChange={change}/>);
    const input=screen.getByRole('combobox');await user.tab();expect(input).toHaveFocus();expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');expect(input).toHaveValue('Третий');expect(change).toHaveBeenCalledExactlyOnceWith('three');expect(input).toHaveFocus();
  });
  it('search text is not a selection and Escape restores selected label', async () => {
    const user=userEvent.setup(), change=vi.fn();render(<Select label="Статус" options={options} defaultValue="one" searchable onValueChange={change}/>);
    const input=screen.getByRole('combobox');await user.click(input);await user.clear(input);await user.type(input,'Тре');expect(screen.getAllByRole('option')).toHaveLength(1);
    await user.keyboard('{Escape}');expect(input).toHaveValue('Первый');expect(change).not.toHaveBeenCalled();
  });
  it('creates a value without changing options, clears and keeps focus', async () => {
    const user=userEvent.setup();render(<Select label="Категория" options={options} creatable clearable name="category"/>);
    const input=screen.getByRole('combobox');await user.type(input,'Новое{Enter}');expect(input).toHaveValue('Новое');expect(document.querySelector('input[name=category]')).toHaveValue('Новое');
    await user.click(input);expect(screen.getAllByRole('option')).toHaveLength(3);await user.keyboard('{Escape}');
    await user.click(screen.getByRole('button',{name:'Очистить выбор'}));expect(input).toHaveValue('');expect(input).toHaveFocus();expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
  it('preserves controlled value and closes on outside click', async () => {
    const user=userEvent.setup(), change=vi.fn();render(<><Select options={options} aria-label="Статус" value="one" onValueChange={change}/><button>Снаружи</button></>);
    await user.click(screen.getByRole('combobox'));await user.click(screen.getByRole('option',{name:'Третий'}));expect(change).toHaveBeenCalledWith('three');expect(screen.getByRole('combobox')).toHaveValue('Первый');
    await user.click(screen.getByRole('combobox'));await user.click(screen.getByRole('button',{name:'Снаружи'}));expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
  it('disabled and skeleton have no interactive popup; error is associated', async () => {
    const {rerender}=render(<Select options={options} label="Статус" disabled error="Выберите статус" required/>);
    const input=screen.getByRole('combobox');expect(input).toBeDisabled();expect(input).toHaveAttribute('aria-invalid','true');expect(input).toHaveAccessibleDescription('Выберите статус');fireEvent.click(input);expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    rerender(<Select options={options} label="Статус" skeleton/>);expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });
  it('does not commit an IME composition and safely handles zero options', async () => {
    const change=vi.fn();render(<Select options={[]} aria-label="Категория" creatable onValueChange={change}/>);
    const input=screen.getByRole('combobox');fireEvent.change(input,{target:{value:'日本'}});fireEvent.keyDown(input,{key:'Enter',isComposing:true});expect(change).not.toHaveBeenCalled();
    fireEvent.keyDown(input,{key:'ArrowDown'});fireEvent.keyDown(input,{key:'Enter'});await waitFor(()=>expect(change).toHaveBeenCalledWith('日本'));
  });
});
