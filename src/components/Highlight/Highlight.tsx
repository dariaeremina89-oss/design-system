import { Children, cloneElement, isValidElement, type ReactNode } from 'react';
import './Highlight.css';

export interface HighlightProps {
  /** Текст или разметка, в которой нужно подсветить совпадения. */
  children?: ReactNode;
  /** Буквальная подстрока, а не регулярное выражение. */
  highlight: string;
  /** Подсвечивать только целые слова, включая кириллицу. */
  matchWholeWord?: boolean;
  /** Не учитывать регистр при поиске. По умолчанию true. */
  isCaseInsensitive?: boolean;
}

export function Highlight({ children, highlight, matchWholeWord = false, isCaseInsensitive = true }: HighlightProps) {
  if (!highlight) return <>{children}</>;
  const literal = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const word = '[\\p{L}\\p{M}\\p{N}_]';
  const pattern = matchWholeWord ? `(?<!${word})${literal}(?!${word})` : literal;

  function visit(nodes: ReactNode): ReactNode {
    return Children.map(nodes, node => {
      if (typeof node === 'string' || typeof node === 'number') {
        const text = String(node);
        const matches = text.matchAll(new RegExp(pattern, isCaseInsensitive ? 'giu' : 'gu'));
        const parts: ReactNode[] = [];
        let cursor = 0;
        for (const match of matches) {
          const start = match.index;
          parts.push(text.slice(cursor, start));
          parts.push(<mark className="fdoc-highlight" key={start}>{match[0]}</mark>);
          cursor = start + match[0].length;
        }
        parts.push(text.slice(cursor));
        return parts;
      }
      if (isValidElement<{ children?: ReactNode }>(node) && node.props.children !== undefined) {
        // Preserve the element, its props and handlers; only transform supplied text children.
        return cloneElement(node, undefined, visit(node.props.children));
      }
      return node;
    });
  }

  return <>{visit(children)}</>;
}
