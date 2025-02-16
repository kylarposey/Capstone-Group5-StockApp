/**
 * This file is used as an initial testing of a component
 * The component it is testing is TestingSetupButton.js file
 * For future testing a component, you can use this file as a reference
 * A separate file is created for each component to test
 */

import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./TestingSetupButton";

test("renders the button with text", () => {
    render(<Button label="Click me" />);
    const buttonElement = screen.getByText(/click me/i);
    expect(buttonElement).toBeInTheDocument();
});

test("calls onClick when clicked", () => {
    const handleClick = jest.fn(); // Mock function
    render(<Button label="Click me" onClick={handleClick} />);
    const buttonElement = screen.getByText(/click me/i);
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
});
