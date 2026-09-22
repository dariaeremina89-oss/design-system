import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Highlight } from './Highlight';

describe('Highlight', () => {
  it('marks every match while preserving original case and complete text', () => {
    const { container } = render(<Highlight highlight="этой">Ищи в этой, ЭТОЙ и этой строке</Highlight>);
    expect([...container.querySelectorAll('mark')].map(el => el.textContent)).toEqual(['этой', 'ЭТОЙ', 'этой']);
    expect(container.textContent).toBe('Ищи в этой, ЭТОЙ и этой строке');
  });
  it('can match case exactly', () => {
    const { container } = render(<Highlight highlight="этой" isCaseInsensitive={false}>этой ЭТОЙ</Highlight>);
    expect(container.querySelectorAll('mark')).toHaveLength(1);
  });
  it('recognizes Cyrillic whole words and excludes letters, digits and underscores', () => {
    const { container } = render(<Highlight highlight="акт" matchWholeWord>Акт, акты, контракт, акт2, акт_1 и (акт).</Highlight>);
    expect([...container.querySelectorAll('mark')].map(el => el.textContent)).toEqual(['Акт', 'акт']);
  });
  it('treats regex punctuation literally', () => {
    const { container } = render(<Highlight highlight="[a+b].*">[a+b].* aab [a+b].*</Highlight>);
    expect(container.querySelectorAll('mark')).toHaveLength(2);
  });
  it('leaves empty queries and absent matches unchanged', () => {
    const { container, rerender } = render(<Highlight highlight="">Текст</Highlight>);
    expect(container.innerHTML).toBe('Текст');
    rerender(<Highlight highlight="нет">Текст</Highlight>);
    expect(container.innerHTML).toBe('Текст');
  });
  it('preserves nested markup and handlers without injecting HTML', () => {
    const click = vi.fn();
    const { container } = render(<Highlight highlight="акт"><strong>Акт</strong> <button onClick={click}>акт</button>{'<script>акт</script>'}</Highlight>);
    expect(container.querySelector('strong > mark')).toHaveTextContent('Акт');
    fireEvent.click(screen.getByRole('button'));
    expect(click).toHaveBeenCalledOnce();
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelectorAll('mark')).toHaveLength(3);
  });
});
