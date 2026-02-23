import { test, expect } from '@playwright/test';
import testData from './fixtures/test-data.json' with { type: 'json' };

test('Dashboard workflow test', async ({ page }) => {
    // Login first to reach the dashboard
    await page.goto('/');
    await page.locator('#username').fill(testData.testUser.username);
    await page.locator('#password').fill(testData.testUser.password);
    await page.locator('#login-button').click();

    // Verify we are on the dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('h2')).toContainText('Dashboard Overview');

    // Verify navigation to User page
    await page.getByRole('link', { name: 'Manage Users' }).click();
    await expect(page).toHaveURL(/.*user/);

    // Take a screenshot of the dashboard
    await page.goto('/dashboard');
    await page.screenshot({ path: 'screenshots/dashboard.png' });
});
