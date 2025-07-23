import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    test.beforeEach(async ({ page }) => {
        // Clear any existing authentication
        await page.context().clearCookies();
    });

    test('should display sign-in page', async ({ page }) => {
        await page.goto('/sign-in');

        // Check page title and content
        await expect(page).toHaveTitle("Auth");
        await expect(page.getByText('Bonjour 👋')).toBeVisible();
        await expect(page.getByText('Entrez vos identifiants pour vous connecter')).toBeVisible();

        // Check form elements using robust selectors
        const emailInput = page.locator('input[name="email"]').or(page.getByPlaceholder('name@gmail.com'));
        const passwordInput = page.locator('input[name="password"]').or(page.getByPlaceholder('******'));

        await expect(emailInput).toBeVisible();
        await expect(passwordInput).toBeVisible();
        await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible();

        // Check form labels
        await expect(page.getByText('Email')).toBeVisible();
        await expect(page.getByText('Mot de passe')).toBeVisible();
    });

});
