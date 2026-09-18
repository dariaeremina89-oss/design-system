import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders a label connected to the input', () => {
    render(<Input label="Телефон" placeholder="Введите номер" />);
    expect(screen.getByLabelText('Телефон')).toHaveAttribute('placeholder', 'Введите номер');
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

  it('renders description and a live character counter together', async () => {
    const user = userEvent.setup();
    render(
      <Input
        label="Комментарий"
        description="Описание поля"
        caption="Подсказка"
        defaultValue="Input"
        maxLength={100}
        counter
      />,
    );
    expect(screen.getByText('5 / 100')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Комментарий'), '!');
    expect(screen.getByText('6 / 100')).toBeInTheDocument();
    expect(screen.getByText('Описание поля')).toBeInTheDocument();
    expect(screen.getByText('Подсказка')).toBeInTheDocument();
    expect(screen.getByLabelText('Комментарий')).toHaveAttribute('aria-describedby', expect.stringContaining('description'));
  });

  it('removes an empty description instead of keeping its layout gap', () => {
    const { container, rerender } = render(
      <Input label="Поле" description="Описание" />,
    );

    expect(container.querySelector('.fdoc-input__description')).toBeInTheDocument();

    rerender(<Input label="Поле" description="" />);

    expect(container.querySelector('.fdoc-input__description')).not.toBeInTheDocument();
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

  it('renders a selected library icon in a slot', () => {
    render(<Input label="Поиск" leadingIcon="magnifying-glass" />);
    expect(document.querySelector('[data-icon="magnifying-glass"]')).toBeInTheDocument();
  });

  it('preserves the input anatomy in skeleton state', () => {
    const { container } = render(
      <Input
        skeleton
        label="Название"
        required
        description="Описание"
        error="Ошибка"
        counter
        maxLength={100}
        leadingIcon="magnifying-glass"
        trailingIcon="eye"
        sum="100"
        sumIcon="currency/ruble-sign_regular"
        caret
        clearable
        defaultValue="Значение"
      />,
    );

    expect(container.querySelector('.fdoc-input__label')).toBeInTheDocument();
    expect(container.querySelector('.fdoc-input__skeleton--required')).toBeInTheDocument();
    expect(container.querySelector('.fdoc-input__skeleton--description')).toBeInTheDocument();
    expect(container.querySelector('.fdoc-input__skeleton--helper')).toBeInTheDocument();
    expect(container.querySelector('.fdoc-input__skeleton--counter')).toBeInTheDocument();
    expect(container.querySelectorAll('.fdoc-input__slot')).toHaveLength(2);
    expect(container.querySelector('.fdoc-input__sum-icon')).toBeInTheDocument();
    expect(container.querySelector('.fdoc-input__caret')).toBeInTheDocument();
    expect(container.querySelector('.fdoc-input__clear')).toBeInTheDocument();
  });

  it('has no accessibility violations in the default state', async () => {
    const { container } = render(<Input label="Имя" placeholder="Введите имя" />);
    const violations = await axe(container);
    expect(violations.violations).toHaveLength(0);
  });
});
