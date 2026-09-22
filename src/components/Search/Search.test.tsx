import { it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Search } from './Search';
it('only Enter and the button submit; clear empties without submitting',async()=>{
 const user=userEvent.setup(), search=vi.fn();render(<Search label="Документы" onSearch={search}/>);const input=screen.getByRole('searchbox');
 await user.type(input,'Договор');expect(search).not.toHaveBeenCalled();await user.keyboard('{Enter}');expect(search).toHaveBeenLastCalledWith('Договор');await user.click(screen.getByRole('button',{name:'Найти'}));expect(search).toHaveBeenCalledTimes(2);
 await user.click(screen.getByRole('button',{name:'Очистить поле'}));expect(input).toHaveValue('');expect(input).toHaveFocus();expect(search).toHaveBeenCalledTimes(2);
});
it('disabled blocks both input and button; skeleton exposes no controls',()=>{
 const {rerender}=render(<Search label="Документы" disabled/>);expect(screen.getByRole('searchbox')).toBeDisabled();expect(screen.getByRole('button',{name:'Найти'})).toBeDisabled();rerender(<Search label="Документы" skeleton/>);expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();expect(screen.queryByRole('button')).not.toBeInTheDocument();
});
