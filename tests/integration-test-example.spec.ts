import { test, expect } from '@playwright/test';

// Mock data: only the fields the catalog page actually renders
const clawHammer = {
  id: '01TEST00000000000000000001',
  name: 'Claw Hammer',
  price: 12.5,
  in_stock: false,
  is_eco_friendly: false,
  co2_rating: 'C',
  product_image: { file_name: 'hammer01.avif' },
};

// Same pagination shape as the real API response
const onePage = (data: object[]) => ({
  current_page: 1,
  last_page: 1,
  per_page: 9,
  from: data.length ? 1 : 0,
  to: data.length,
  total: data.length,
  data,
});

test('search shows the products returned by the API', async ({ page }) => {
  let searchRequest = '';

  await page.route('**/products/search**', async route => {
    const request = route.request();
    searchRequest = request.postData() ?? request.url();
    await route.fulfill({ json: onePage([clawHammer]) });
  });

  await page.goto('/');
  await page.getByTestId('search-query').fill('hammer');
  await page.getByTestId('search-submit').click();

  await expect(page.getByTestId('search-result-count')).toHaveText("1 product found for 'hammer'");
  await expect(page.getByTestId('product-name')).toHaveCount(1);
  await expect(page.getByTestId('product-name')).toHaveText('Claw Hammer');
  await expect(page.getByTestId('product-price')).toHaveText('$12.50');
  await expect(page.getByTestId('out-of-stock')).toHaveText('Out of stock');
  expect(searchRequest).toContain('hammer');
});

test('failed search shows an empty result instead of old products', async ({ page }) => {
  await page.route('**/products/search**', route =>
    route.fulfill({ status: 500, json: { message: 'Server error' } })
  );

  await page.goto('/');
  await expect(page.getByTestId('product-name').first()).toBeVisible(); // initial catalog is loaded

  await page.getByTestId('search-query').fill('hammer');
  await page.getByTestId('search-submit').click();

  await expect(page.getByTestId('search-term')).toHaveText('hammer');
  await expect(page.getByTestId('no-results')).toHaveText('There are no products found.');
  await expect(page.getByTestId('product-name')).toHaveCount(0);
});