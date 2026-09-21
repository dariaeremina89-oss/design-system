import { describe,it,expect,vi } from 'vitest';
import { render,screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Link,ButtonLink } from './Link';
describe('Link and ButtonLink',()=>{
 it('keeps navigation semantics and full accessible text',()=>{render(<Link href="/documents" iconLeft="plus" iconRight="arrow-chevron-right">Документы</Link>);expect(screen.getByRole('link',{name:'Документы'})).toHaveAttribute('href','/documents');});
 it('button link activates Enter and Space without submitting form',async()=>{const click=vi.fn(),submit=vi.fn(),user=userEvent.setup();render(<form onSubmit={submit}><ButtonLink onClick={click}>Показать</ButtonLink></form>);await user.tab();await user.keyboard('{Enter}');await user.keyboard(' ');expect(click).toHaveBeenCalledTimes(2);expect(submit).not.toHaveBeenCalled();});
 it('disabled link has no destination and blocks click',async()=>{const click=vi.fn(),user=userEvent.setup();render(<Link href="/private" disabled onClick={click}>Закрыто</Link>);const link=screen.getByRole('link');expect(link).not.toHaveAttribute('href');expect(link).toHaveAttribute('aria-disabled','true');await user.click(link);await user.tab();expect(click).not.toHaveBeenCalled();expect(link).not.toHaveFocus();});
 it('renders skeleton without anchors or buttons',()=>{const {container}=render(<><Link state="skeleton" href="/x">X</Link><ButtonLink state="skeleton">X</ButtonLink></>);expect(container.querySelector('a,button')).toBe(null);});
 it('passes axe',async()=>{const {container}=render(<><Link href="/docs">Документы</Link><ButtonLink>Показать</ButtonLink></>);expect((await axe(container)).violations).toEqual([]);});
});
