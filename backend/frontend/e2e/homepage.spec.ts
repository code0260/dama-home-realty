// @ts-nocheck - Playwright types are optional
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/Dama Home Realty/);
    
    // Check main heading
    await expect(page.getByRole('heading', { name: /find your safe haven/i })).toBeVisible();
  });

  test('should navigate to properties page', async ({ page }) => {
    await page.goto('/');
    
    // Click on Properties link in navbar
    await page.getByRole('link', { name: /properties|buy|rent/i }).first().click();
    
    // Should navigate to properties page
    await expect(page).toHaveURL(/\/properties/);
  });

  test('should search for properties', async ({ page }) => {
    await page.goto('/');
    
    // Find search input
    const searchInput = page.getByPlaceholder(/location|search/i).first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('Damascus');
      await searchInput.press('Enter');
      
      // Should navigate to properties with search query
      await expect(page).toHaveURL(/\/properties/);
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Check that mobile navigation is visible
    const mobileNav = page.locator('[data-testid="mobile-navigation"]');
    if (await mobileNav.count() > 0) {
      await expect(mobileNav).toBeVisible();
    }
  });
});
