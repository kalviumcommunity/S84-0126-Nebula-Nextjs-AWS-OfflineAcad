import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/components/ui/Input';

describe('Input component', () => {
  test('renders label and input', () => {
    render(<Input label="Email" placeholder="Enter email" />);

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  test('displays error message when error prop is provided', () => {
    render(<Input label="Password" error="Required field" />);

    expect(screen.getByText('Required field')).toBeVisible();
  });

  test('allows user typing', async () => {
    const user = userEvent.setup();

    render(<Input placeholder="Username" />);
    const input = screen.getByPlaceholderText('Username');

    await user.type(input, 'krish');

    expect(input).toHaveValue('krish');
  });
});
