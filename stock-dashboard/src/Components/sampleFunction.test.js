import '@testing-library/react';
import '@testing-library/jest-dom';
import { sampleAddFunction, sampleMultiplyFunction } from "./sampleFunctions";

test("adds two numbers", () => {
    const result = sampleAddFunction(2, 3);
    expect(result).toBe(5);
});

test("multiplies two numbers", () => {
    const result = sampleMultiplyFunction(2, 3);
    expect(result).toBe(6);
});