import { test, expect } from '@playwright/test';

test('Verify Instatest navigation and check Unserviceable Location', async ({ page }) => {

  await test.step('Open main site and handle popups', async () => {
    await page.goto('https://staging.sterlingaccuris.com/');
    await page.locator('.fa.fa-times').click();
    await page.getByRole('button', { name: 'Later' }).click();
  });

  await test.step('Click Instatest and wait for new tab', async () => {
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('button', { name: 'Instatest Instatest' }).click(),
    ]);

    await newPage.waitForLoadState('domcontentloaded');
    await expect(newPage).toHaveURL(/staging-qc\.sterlingaccuris\.com/);

    // Pass newPage context forward implicitly by working on it here
    const unserviceableHeading = newPage.getByText('Unserviceable Location', { exact: true });
    await expect(unserviceableHeading).toBeVisible({ timeout: 10000 });
    console.log('✅ Unserviceable Location is displayed successfully');
  });

});
