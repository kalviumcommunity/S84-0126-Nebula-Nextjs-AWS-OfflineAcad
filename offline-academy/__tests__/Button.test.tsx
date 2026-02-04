import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/Button';

describe('Button Component', () => {
    it('renders with correct label', () => {
        render(<Button label="Submit" onClick={() => { }} />);
        // Check if "Submit" text exists in the DOM
        expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('calls onClick handler when clicked', () => {
        const handleClick = jest.fn(); // Mock function
        render(<Button label="Click Me" onClick={handleClick} />);

        const button = screen.getByText('Click Me');
        fireEvent.click(button); // Simulate click

        // Check if the mock function was called exactly once
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
