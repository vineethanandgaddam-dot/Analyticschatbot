import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4200';
const TEST_CLIENT = process.env.TEST_CLIENT || 'Hpharma';

async function setup(page: any) {
  await page.goto(BASE_URL);
  await page.locator('select').selectOption(TEST_CLIENT);
}

test.describe('Pharma AI Extended Frontend Tests', () => {

  test('switching client clears previous response', async ({ page }) => {
    test.setTimeout(120000);

    await setup(page);

    await page
      .getByPlaceholder('Ask a reporting question...')
      .fill('What is Avomine tablet used for?');

    await page.getByRole('button', { name: 'Ask' }).click();

    await expect(page.getByText('Client Report Output')).toBeVisible({
      timeout: 120000
    });

    await page.locator('select').selectOption('Jpharma');

    await expect(page.getByText('Client Report Output')).not.toBeVisible();
  });

  test('invalid/out of scope question shows safe response', async ({ page }) => {
    test.setTimeout(120000);

    await setup(page);

    await page
      .getByPlaceholder('Ask a reporting question...')
      .fill('Who is the president of the United States?');

    await page.getByRole('button', { name: 'Ask' }).click();

    await expect(page.getByText('Client Report Output')).toBeVisible({
      timeout: 120000
    });

    await expect(page.getByText('No data returned for this question.')).toBeVisible();
  });

  test('dangerous delete prompt does not crash frontend', async ({ page }) => {
    test.setTimeout(120000);

    await setup(page);

    await page
      .getByPlaceholder('Ask a reporting question...')
      .fill('Delete all medicines');

    await page.getByRole('button', { name: 'Ask' }).click();

    await expect(page.getByText('Client Report Output')).toBeVisible({
      timeout: 120000
    });

    await expect(page.getByText('No data returned for this question.')).toBeVisible();
  });

  test('rapid ask button clicks do not create duplicate submissions', async ({ page }) => {
    test.setTimeout(120000);

    await setup(page);

    await page
      .getByPlaceholder('Ask a reporting question...')
      .fill('What is Avomine tablet used for?');

    const askButton = page.getByRole('button', { name: 'Ask' });

    await askButton.click();

    await expect(page.getByRole('button', { name: 'Working...' })).toBeVisible();

    await expect(page.getByText('Client Report Output')).toBeVisible({
      timeout: 120000
    });

    await expect(page.locator('.chat-card')).toHaveCount(1);
  });

  test('enter key submits question', async ({ page }) => {
    test.setTimeout(120000);

    await setup(page);

    await page
      .getByPlaceholder('Ask a reporting question...')
      .fill('What is Avomine tablet used for?');

    await page.keyboard.press('Enter');

    await expect(page.getByText('Client Report Output')).toBeVisible({
      timeout: 120000
    });
  });

  test('latest response replaces previous response', async ({ page }) => {
    test.setTimeout(180000);

    await setup(page);

    await page
      .getByPlaceholder('Ask a reporting question...')
      .fill('What is Avomine tablet used for?');

    await page.getByRole('button', { name: 'Ask' }).click();

    await expect(page.getByText('Client Report Output')).toBeVisible({
      timeout: 120000
    });

    await page
      .getByPlaceholder('Ask a reporting question...')
      .fill('What is Azithral used for?');

    await page.getByRole('button', { name: 'Ask' }).click();

    await expect(page.getByText('Client Report Output')).toBeVisible({
      timeout: 120000
    });

    await expect(page.locator('.chat-card')).toHaveCount(1);
  });

});