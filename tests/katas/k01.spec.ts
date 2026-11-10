import { test, expect } from '@playwright/test';
import { formatPrice } from '../../src/katas/k01';


const cases = [
  { amount: 12.5, expected: '12.50 EUR' },
  { amount: 2, expected: '2.00 EUR' },
  { amount: 0, expected: '0.00 EUR' },
  { amount: 1.005, expected: '1.01 EUR' },
  { amount: 2.675, expected: '2.68 EUR' }
];

for (const { amount, expected } of cases) {
  test(`formats ${amount} as "${expected}"`, () => {
    expect(formatPrice(amount, 'EUR')).toBe(expected);
  });
}

const invalidAmounts = [-5, -0.001, NaN, Infinity];
for(const amount of invalidAmounts){
    test(`rejects ${amount}`, () => {
    expect(() => formatPrice(amount, 'EUR')).toThrow();
  });
}
