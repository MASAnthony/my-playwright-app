import { test, expect } from '@playwright/test';

test.describe('Home Sample Collection - First Login Flow', () => {

  test('User can login and complete a fresh booking', async ({ page }) => {

    await test.step('Navigate to application', async () => {
      await page.goto('https://staging-qc.sterlingaccuris.com/');
      await expect(page).toHaveURL(/sterlingaccuris/);
    });

    await test.step('Initiate login with mobile number', async () => {
      await page.getByRole('button', { name: 'Login' }).click();
      const mobileInput = page.getByRole('textbox', { name: 'Mobile Number *' });
      await expect(mobileInput).toBeVisible();
      await mobileInput.click();
      await mobileInput.fill('9363564962');
      await page.getByRole('button', { name: 'Send OTP' }).click();
    });

    await test.step('Enter OTP and submit', async () => {
      const otpBoxes = page.getByRole('textbox');
      // Wait for the mobile screen to transition to the 4 OTP boxes
      await expect(otpBoxes).toHaveCount(4, { timeout: 15000 });

      for (let i = 0; i < 4; i++) {
        await otpBoxes.nth(i).fill('1');
      }
      await page.getByRole('button', { name: 'Login' }).click();
    });

    await test.step('Select address and navigate to healthy packages', async () => {
      const selectBtn = page.getByRole('button', { name: 'Select' }).nth(1);
      await expect(selectBtn).toBeVisible({ timeout: 20000 });
      await selectBtn.click();

      const navBtn = page.getByRole('button', { name: 'Navigate to Health Packages' });
      await expect(navBtn).toBeVisible();
      await navBtn.click();
    });

    await test.step('Add package and view cart', async () => {
      await page.getByRole('button', { name: 'Add' }).first().click();
      await page.getByRole('button', { name: 'View Cart' }).click();
      await expect(page.getByRole('button', { name: 'Review Cart' })).toBeVisible();
    });

    await test.step('Select member and review cart', async () => {
      await page.locator('.cursor-pointer.text-indigo-200').first().click();
      await page.getByRole('button', { name: 'Review Cart' }).click();
    });

    await test.step('Choose payment and confirm booking', async () => {
      const paymentOption = page.getByText('Cash/Card on Sample Pickup');
      await expect(paymentOption).toBeVisible();
      await paymentOption.click();

      await page.getByRole('button', { name: 'Confirm Booking' }).click();
      await expect(page.getByRole('button', { name: 'My Bookings' })).toBeVisible({ timeout: 15000 });
      await page.getByRole('button', { name: 'My Bookings' }).click();
    });

  });

});