import { test, expect } from '@playwright/test';
import { isAffordable, Product } from '../../src/katas/k02';

const hammer: Product = { id: '1', name: 'Hammer', price: 10, inStock: true};

test('affordable when price is below budget', () => {
    expect(isAffordable(hammer, 15)).toBe(true);
});

test('not affordable when out of stock', () => {
    expect(isAffordable({...hammer, inStock: false}, 15)).toBe(false);
    
});

test('affordable when price is the same as budget', () => {
    expect(isAffordable({...hammer, price: 15}, 15)).toBe(true);
    
});

test('not affordable when budget is below the price', () => {
    expect(isAffordable({...hammer, price: 15.01}, 15)).toBe(false);
    
});

test('affordable when product have tags', () => {
    expect(isAffordable({...hammer,  tags: ['best price']}, 15)).toBe(true);
    
});
