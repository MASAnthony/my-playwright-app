import { test, expect } from '@playwright/test';

test('Verify Instatest navigation and check Unserviceable Location', async ({ page }) => {

  // Step 1: Open main site
  await page.goto('https://staging.sterlingaccuris.com/');

  // Step 2: Close popup if visible
  await page.locator('.fa.fa-times').click();
  await page.getByRole('button', { name: 'Later' }).click();

  // Step 3: Click Instatest and wait for new tab
  const [newPage] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('button', { name: 'Instatest Instatest' }).click(),
  ]);

  // Step 4: Wait for new page to load
   await newPage.waitForLoadState('domcontentloaded');

  // Step 5: Validate URL
  await expect(newPage).toHaveURL(/staging-qc\.sterlingaccuris\.com/);

  // Step 6: Check if "Unserviceable Location" is visible
  const unserviceableHeading = newPage.getByText('Unserviceable Location', { exact: true });

await expect(unserviceableHeading).toBeVisible({ timeout: 10000 });

console.log('✅ Unserviceable Location is displayed successfully');

});
