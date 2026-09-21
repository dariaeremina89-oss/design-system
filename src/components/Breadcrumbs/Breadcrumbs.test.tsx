import { beforeEach,afterEach,describe,it,expect,vi } from 'vitest';
import { render,screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Breadcrumbs } from './Breadcrumbs';
beforeEach(()=>vi.stubGlobal('matchMedia',()=>({matches:true,addEventListener(){},removeEventListener(){}})));afterEach(()=>vi.unstubAllGlobals());
describe('Breadcrumbs',()=>{
 it('hides one level and collapses mobile history without hidden links',()=>{const {rerender}=render(<Breadcrumbs items={[{label:'Домой'}]}/>);expect(screen.queryByRole('navigation')).toBe(null);rerender(<Breadcrumbs items={['Главная','Компания','Документы','Текущая'].map(label=>({label,href:'#'+label}))}/>);expect(screen.getAllByRole('link')).toHaveLength(1);expect(screen.getByRole('link')).toHaveAccessibleName('Документы');expect(screen.getByText('Текущая')).toHaveAttribute('aria-current','page');expect(screen.getByLabelText('Пропущены уровни навигации')).not.toHaveAttribute('tabindex');});
 it('keeps full text and accessible navigation',async()=>{const {container}=render(<Breadcrumbs items={[{label:'Документы',href:'#docs'},{label:'Длинное полное название'}]}/>);expect(screen.getByText('Длинное полное название')).toHaveAttribute('title','Длинное полное название');expect((await axe(container)).violations).toEqual([]);});
});
