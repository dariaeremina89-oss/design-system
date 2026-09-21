import { beforeEach,afterEach,describe,it,expect,vi } from 'vitest';
import { render,screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Pagination,paginationPages } from './Pagination';
beforeEach(()=>vi.stubGlobal('ResizeObserver',class {observe(){} disconnect(){}}));afterEach(()=>vi.unstubAllGlobals());
describe('Pagination',()=>{
 it('calculates windows at start, middle and end',()=>{expect(paginationPages(40,1,6)).toEqual([1,2,3,4,5,'ellipsis',40]);expect(paginationPages(40,25,6)).toEqual([1,'ellipsis',24,25,26,'ellipsis',40]);expect(paginationPages(40,40,6)).toEqual([1,'ellipsis',36,37,38,39,40]);expect(paginationPages(40,25,4)).toEqual([1,'ellipsis',25,'ellipsis',40]);});
 it('hides empty state and supports counter-only single page',()=>{const {rerender}=render(<Pagination totalElements={0} page={1} size={10}/>);expect(screen.queryByRole('navigation')).toBe(null);rerender(<Pagination totalElements={7} page={1} size={10}/>);expect(screen.getByText('1—7 из 7')).toBeInTheDocument();expect(screen.queryByRole('button')).toBe(null);rerender(<Pagination totalElements={7} page={1} size={10} showCounter={false}/>);expect(screen.queryByRole('navigation')).toBe(null);});
 it('displays all 2–4 pages without arrows',()=>{render(<Pagination totalElements={40} page={1} size={10}/>);expect(screen.getAllByRole('button')).toHaveLength(4);expect(screen.queryByLabelText('Предыдущая страница')).toBe(null);});
 it('clamps final counter and disables next',async()=>{const user=userEvent.setup(),change=vi.fn();render(<Pagination totalElements={95} page={10} size={10} onChangePage={change}/>);expect(screen.getByText('91—95 из 95')).toBeInTheDocument();await user.click(screen.getByLabelText('Следующая страница'));expect(change).not.toHaveBeenCalled();await user.click(screen.getByLabelText('Предыдущая страница'));expect(change).toHaveBeenCalledWith(9);});
 it('loading exposes no buttons and honors hidden counter',()=>{render(<Pagination totalElements={95} page={1} size={10} isLoading showCounter={false}/>);expect(screen.queryByRole('button')).toBe(null);expect(document.querySelector('.fdoc-pagination__counter')).toBe(null);});
 it('passes axe',async()=>{const {container}=render(<Pagination totalElements={400} page={25} size={10}/>);expect((await axe(container)).violations).toEqual([]);});
});
