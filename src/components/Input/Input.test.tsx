import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders a label connected to the input', () => {
    render(<Input label="Телефон" placeholder="Введите номер" />);

    const input = screen.getByLabelText('Телефон');
    expect(input).toHaveAttribute('placeholder', 'Введите номер');
  });

  it('sets the error semantics and renders error text', () => {
    render(<Input label="Email" error="Проверьте адрес" />);

    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Проверьте адрес');
  });

  it('marks a required field for assistive technology and shows the required marker', () => {
    render(<Input label="Имя" required />);

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-required', 'true');
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders description and counter together', () => {
    render(
      <Input
        label="Комментарий"
        description="Описание поля"
        caption="Подсказка"
        counter="20 / 100"
      />,
    );

    expect(screen.getByText('Описание поля')).toBeInTheDocument();
    expect(screen.getByText('Подсказка')).toBeInTheDocument();
    expect(screen.getByText('20 / 100')).toBeInTheDocument();
    expect(screen.getByLabelText('Комментарий')).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('description'),
    );
  });

  it('clears an uncontrolled value when clear button is pressed', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<Input label="Поиск" defaultValue="Запрос" clearable onClear={onClear} />);

    await user.click(screen.getByRole('button', { name: 'Очистить поле' }));
    expect(onClear).toHaveBeenCalledOnce();
    expect(screen.getByLabelText('Поиск')).toHaveValue('');
  });

  it('does not render the clear button for disabled inputs', () => {
    render(<Input label="Поле" defaultValue="Значение" clearable disabled />);

    expect(screen.queryByRole('button', { name: 'Очистить поле' })).not.toBeInTheDocument();
  });

  it('has no accessibility violations in the default state', async () => {
    const { container } = render(<Input label="Имя" placeholder="Введите имя" />);
    const violations = await axe(container);
    expect(violations.violations).toHaveLength(0);
  });
});
