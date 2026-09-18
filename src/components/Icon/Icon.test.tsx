import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Icon } from './Icon';

describe('Icon', () => {
  it('keeps layered cursor fills by rendering the SVG as an image', () => {
    render(<Icon name="cursors/cursor" />);

    const icon = document.querySelector('[data-icon="cursors/cursor"]');

    expect(icon?.tagName).toBe('IMG');
    expect(icon).toHaveClass('fdoc-icon--color');
  });
});
