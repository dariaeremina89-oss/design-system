import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button/Button';
import { InfoBlock } from './InfoBlock';

describe('InfoBlock', () => {
  it('renders title, text, icon and close', () => {
    render(<InfoBlock title="Title" text="Text" />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByTestId('info-block-icon')).toBeInTheDocument();
    expect(screen.getByTestId('info-block-close')).toBeInTheDocument();
  });

  it('calls onClose', () => {
    const onClose = vi.fn();
    render(<InfoBlock title="Title" onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('supports up to two actions in the actions slot', () => {
    render(<InfoBlock actions={<><Button>One</Button><Button>Two</Button></>} />);
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
  });
});
