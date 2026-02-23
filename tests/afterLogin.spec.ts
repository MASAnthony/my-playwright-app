import { test, expect } from '@playwright/test';

test.describe('QC Add To Cart - End to End Flow', () => {

  test('User should login and complete booking successfully', async ({ page }) => {

    await test.step('Navigate to application', async () => {
      await page.goto('https://staging-qc.sterlingaccuris.com/');
      await expect(page).toHaveURL(/sterlingaccuris/);
    });

    await test.step('Navigate to Health Packages', async () => {
      await page.getByRole('button', { name: 'Navigate to Health Packages' }).click();
      await page.getByRole('button', { name: 'Test Profiles' }).click();
    });

    await test.step('Initiate login by adding package', async () => {
      await page.getByRole('button', { name: 'Add' }).first().click();
      const mobileInput = page.getByRole('textbox', { name: 'Mobile Number *' });
      await expect(mobileInput).toBeVisible();
      await mobileInput.fill('9363564962');
      await page.getByRole('button', { name: 'Send OTP' }).click();
    });

    await test.step('Enter OTP and Login', async () => {
      const otpBoxes = page.getByRole('textbox');
      await expect(otpBoxes).toHaveCount(4, { timeout: 15000 });
      for (let i = 0; i < 4; i++) {
        await otpBoxes.nth(i).fill('1');
      }
      await page.getByRole('button', { name: 'Login' }).click();
    });

    await test.step('Select Address and Package', async () => {
      const selectFirst = page.getByRole('button', { name: 'Select' }).first();
      await expect(selectFirst).toBeVisible({ timeout: 20000 });
      await page.getByRole('button', { name: 'Select' }).nth(1).click();
    });

    await test.step('Add to Cart and View Cart', async () => {
      await page.getByRole('button', { name: 'Add' }).first().click();
      await page.getByRole('button', { name: 'View Cart' }).click();
      await expect(page.getByRole('button', { name: 'Review Cart' })).toBeVisible();
    });

    await test.step('Select Member and Review Cart', async () => {
      await page.locator('div').filter({ hasText: /^Female, 22$/ }).first().click();
      await page.getByRole('button', { name: 'Review Cart' }).click();
    });

    await test.step('Complete Booking and Verify Success', async () => {
      await page.getByText('Cash/Card on Sample Pickup').click();
      await page.getByRole('button', { name: 'Confirm Booking' }).click();
      await expect(page.getByRole('button', { name: 'My Bookings' })).toBeVisible({ timeout: 15000 });
    });

  });

});