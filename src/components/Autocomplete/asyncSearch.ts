import type { ReactNode } from 'react';

export type AsyncIdleText =
  | ReactNode
  | ((remaining: number, minCharacters: number) => ReactNode);

function charactersWord(value: number) {
  const mod100 = value % 100;
  const mod10 = value % 10;
  if (mod100 >= 11 && mod100 <= 14) return 'символов';
  if (mod10 === 1) return 'символ';
  if (mod10 >= 2 && mod10 <= 4) return 'символа';
  return 'символов';
}

export function defaultAsyncIdleText(remaining: number) {
  return `Введите еще ${remaining} ${charactersWord(remaining)}, чтобы начать поиск`;
}

export function resolveAsyncIdleText(
  idleText: AsyncIdleText | undefined,
  queryLength: number,
  minCharacters: number,
) {
  const threshold = Math.max(0, minCharacters);
  const remaining = Math.max(0, threshold - queryLength);
  if (remaining === 0) return undefined;
  if (typeof idleText === 'function') return idleText(remaining, threshold);
  return idleText ?? defaultAsyncIdleText(remaining);
}
