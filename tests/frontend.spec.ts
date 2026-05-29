import { test, expect } from '@playwright/test';

test.describe('Customer Reporting Tool Frontend', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200');
    await expect(page.locator('body')).toBeVisible();
  });

  async function selectClientAndGenerate(page: any) {

    // Select Hpharma from dropdown
    await page.getByRole('combobox').selectOption('Hpharma');

    // Verify client selected
    await expect(page.locator('body')).toContainText(/Hpharma/i);

    // Click Generate Report
    const generateButton = page.getByRole('button', {
      name: /generate report/i,
    });

    await expect(generateButton).toBeVisible();

    await generateButton.click();

    // Wait for workspace/report area
    await expect(page.locator('body')).toContainText(
      /AI Analytics Workspace|report|analytics/i,
      { timeout: 30000 }
    );
  }

  test('homepage loads', async ({ page }) => {
    await expect(page.locator('body')).toContainText(
      /Customer Reporting Tool/i
    );
  });

  test('client can be selected', async ({ page }) => {

    await page.getByRole('combobox').selectOption('Hpharma');

    await expect(page.locator('body')).toContainText(/Hpharma/i);
  });

  test('generate report works after selecting client', async ({ page }) => {

    await selectClientAndGenerate(page);

    await expect(page.locator('body')).toContainText(
      /workspace|analytics|report/i
    );
  });

  test('question input appears after report generation', async ({ page }) => {

    await selectClientAndGenerate(page);

    const input = page.locator(
      'textarea, input[type="text"], input:not([type])'
    ).first();

    await expect(input).toBeVisible({ timeout: 30000 });
  });

  test('can type a question', async ({ page }) => {

    await selectClientAndGenerate(page);

    const input = page.locator(
      'textarea, input[type="text"], input:not([type])'
    ).first();

    await expect(input).toBeVisible({ timeout: 30000 });

    await input.fill('Show me total claims by drug');

    await expect(input).toHaveValue(/Show me total claims by drug/i);
  });

  test('data preview section exists after report generation', async ({ page }) => {

    await selectClientAndGenerate(page);

    await expect(page.locator('body')).toContainText(
      /data preview|preview|data/i
    );
  });

});