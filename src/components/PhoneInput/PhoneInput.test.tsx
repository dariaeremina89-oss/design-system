import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { PhoneInput, PHONE_INPUT_FORMAT_ERROR, PHONE_INPUT_REQUIRED_ERROR, isValidPhoneValue } from './PhoneInput';

beforeAll(() => {
  vi.stubGlobal('ResizeObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
});

describe('PhoneInput', () => {
  it('renders Russian mode by default with a separate type selector', () => {
    render(<PhoneInput label="Телефон" />);
    expect(screen.getByLabelText('Телефон')).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Тип номера: Россия +7' })).toBeInTheDocument();
    expect(document.querySelector('[data-icon="flag_chevron/Country=Rus, State=Default"]')).toBeInTheDocument();
  });

  it('inherits field click focus from Input', async () => {
    const user = userEvent.setup();
    render(<PhoneInput label="Телефон" />);
    const input = screen.getByLabelText('Телефон');
    await user.click(screen.getByTestId('input-field'));
    expect(input).toHaveFocus();
  });

  it('formats Russian input and emits a normalized value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<PhoneInput label="Телефон" onValueChange={onValueChange} />);
    const input = screen.getByLabelText('Телефон');
    await user.type(input, '9081822772');
    expect(input).toHaveValue('+7 (908) 182-27-72');
    expect(onValueChange).toHaveBeenLastCalledWith('+79081822772');
  });

  it('switches to International during manual foreign input', async () => {
    const user = userEvent.setup();
    const onTypeChange = vi.fn();
    render(<PhoneInput label="Телефон" onPhoneTypeChange={onTypeChange} />);
    const input = screen.getByLabelText('Телефон');

    await user.type(input, '47');

    expect(input).toHaveValue('+47');
    expect(screen.getByRole('button', { name: 'Тип номера: Иностранный номер' })).toBeInTheDocument();
    expect(onTypeChange).toHaveBeenCalledWith('international');
  });

  it('switches from International to Russian when manual input becomes a Russian number', async () => {
    const user = userEvent.setup();
    const onTypeChange = vi.fn();
    render(
      <PhoneInput
        label="Телефон"
        defaultPhoneType="international"
        onPhoneTypeChange={onTypeChange}
      />,
    );
    const input = screen.getByLabelText('Телефон');

    await user.type(input, '9081822772');

    expect(input).toHaveValue('+7 (908) 182-27-72');
    expect(screen.getByRole('button', { name: 'Тип номера: Россия +7' })).toBeInTheDocument();
    expect(onTypeChange).toHaveBeenLastCalledWith('russian');
  });

  it('converts an 89 Russian number typed in International mode to +7', async () => {
    const user = userEvent.setup();
    render(<PhoneInput label="Телефон" defaultPhoneType="international" />);
    const input = screen.getByLabelText('Телефон');

    await user.type(input, '89081822772');

    expect(input).toHaveValue('+7 (908) 182-27-72');
    expect(screen.getByRole('button', { name: 'Тип номера: Россия +7' })).toBeInTheDocument();
  });

  it('deletes digits through Russian mask separators', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<PhoneInput label="Телефон" onValueChange={onValueChange} />);
    const input = screen.getByLabelText('Телефон');

    await user.type(input, '908');
    expect(input).toHaveValue('+7 (908)');

    await user.keyboard('{Backspace}');
    expect(input).toHaveValue('+7 (90');

    await user.keyboard('{Backspace}{Backspace}');
    expect(input).toHaveValue('');
    expect(onValueChange).toHaveBeenLastCalledWith('');
  });

  it('normalizes a pasted Russian number starting with 8', () => {
    const onValueChange = vi.fn();
    render(<PhoneInput label="Телефон" onValueChange={onValueChange} />);
    const input = screen.getByLabelText('Телефон');
    fireEvent.paste(input, { clipboardData: { getData: () => '8 (908) 182-27-72' } });
    expect(input).toHaveValue('+7 (908) 182-27-72');
    expect(onValueChange).toHaveBeenLastCalledWith('+79081822772');
  });

  it('switches to International for a pasted foreign number', () => {
    const onTypeChange = vi.fn();
    render(<PhoneInput label="Телефон" onPhoneTypeChange={onTypeChange} />);
    const input = screen.getByLabelText('Телефон');
    fireEvent.paste(input, { clipboardData: { getData: () => '+47 476 03 236' } });
    expect(input).toHaveValue('+4747603236');
    expect(onTypeChange).toHaveBeenLastCalledWith('international');
    expect(screen.getByRole('button', { name: 'Тип номера: Иностранный номер' })).toBeInTheDocument();
  });

  it('opens Menu from the selector and returns focus to the selector after choosing a type', async () => {
    const user = userEvent.setup();
    render(<PhoneInput label="Телефон" />);
    const selector = screen.getByRole('button', { name: 'Тип номера: Россия +7' });
    await user.click(selector);
    expect(screen.getByRole('listbox', { name: 'Тип номера' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Россия +7' })).toHaveAttribute('aria-selected', 'true');
    const international = screen.getByRole('option', { name: 'Иностранный номер' });
    expect(international.querySelector('.fdoc-item-row__check')).not.toBeInTheDocument();
    await user.click(international);
    expect(screen.queryByRole('listbox', { name: 'Тип номера' })).not.toBeInTheDocument();
    const internationalSelector = screen.getByRole('button', { name: 'Тип номера: Иностранный номер' });
    await waitFor(() => expect(internationalSelector).toHaveFocus());
  });

  it('filters unsupported characters from International input', async () => {
    const user = userEvent.setup();
    render(<PhoneInput label="Телефон" defaultPhoneType="international" />);
    const input = screen.getByLabelText('Телефон');
    await user.type(input, '47abc-476');
    expect(input).toHaveValue('+47476');
  });

  it('inherits required and error semantics from Input', () => {
    const { rerender } = render(<PhoneInput label="Телефон" required error={PHONE_INPUT_REQUIRED_ERROR} />);
    const requiredInput = screen.getByRole('textbox', { name: /Телефон/ });
    expect(requiredInput).toHaveAttribute('aria-required', 'true');
    expect(requiredInput).toHaveAttribute('aria-invalid', 'true');
    expect(requiredInput).toHaveAccessibleDescription(PHONE_INPUT_REQUIRED_ERROR);
    expect(screen.getByText('*')).toBeInTheDocument();

    rerender(<PhoneInput label="Телефон" defaultValue="+7908182277" error={PHONE_INPUT_FORMAT_ERROR} />);
    expect(screen.getByRole('textbox', { name: 'Телефон' })).toHaveAccessibleDescription(PHONE_INPUT_FORMAT_ERROR);
  });

  it('disables both the input and type selector', () => {
    render(<PhoneInput label="Телефон" disabled defaultValue="+79081822772" />);
    expect(screen.getByLabelText('Телефон')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Тип номера: Россия +7' })).toBeDisabled();
    expect(document.querySelector('[data-icon="flag_chevron/Country=Rus, State=Disabled"]')).toBeInTheDocument();
  });

  it('uses Input skeleton anatomy without interactive controls', () => {
    render(<PhoneInput label="Телефон" skeleton />);
    expect(screen.getByTestId('input-skeleton-field')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Тип номера/ })).not.toBeInTheDocument();
  });

  it('validates the fixed Russian mask and leaves International length to product validation', () => {
    expect(isValidPhoneValue('+79081822772', 'russian')).toBe(true);
    expect(isValidPhoneValue('+7908182277', 'russian')).toBe(false);
    expect(isValidPhoneValue('+4747603236', 'international')).toBe(true);
    expect(isValidPhoneValue('+47', 'international')).toBe(true);
    expect(isValidPhoneValue('', 'international')).toBe(false);
  });

  it('has no accessibility violations in the default state', async () => {
    const { container } = render(<PhoneInput label="Номер телефона" />);
    const violations = await axe(container);
    expect(violations.violations).toHaveLength(0);
  });
});
