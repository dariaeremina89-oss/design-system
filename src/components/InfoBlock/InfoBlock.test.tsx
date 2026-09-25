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

  it('supports optional anatomy', () => {
    render(<InfoBlock text="Text only" showLeftIcon={false} closable={false} />);
    expect(screen.getByText('Text only')).toBeInTheDocument();
    expect(screen.queryByTestId('info-block-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('info-block-close')).not.toBeInTheDocument();
  });

  it('calls onClose', () => {
    const onClose = vi.fn();
    render(<InfoBlock title="Title" onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders no more than two actions', () => {
    render(<InfoBlock actions={<><Button>One</Button><Button>Two</Button><Button>Three</Button></>} />);
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(screen.queryByText('Three')).not.toBeInTheDocument();
  });

  it('applies semantic color class without size or direction variants', () => {
    render(<InfoBlock color="warning" />);
    expect(screen.getByTestId('info-block')).toHaveClass('fdoc-info-block--warning');
    expect(screen.getByTestId('info-block')).not.toHaveClass('fdoc-info-block--small', 'fdoc-info-block--vertical');
  });
});
