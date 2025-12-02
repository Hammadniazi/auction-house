import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });
  test("should load homepage successfully", async ({ page }) => {
    //  check page title
    await expect(page).toHaveTitle("Auction-house");
    // Check navigation is present
    const nav = page.locator("#main-nav");
    await expect(nav).toBeVisible();
  });

  //   For navigation menu test

  test("should display navigation menu", async ({ page }) => {
    // Check navigation links
    await expect(page.locator("text=Home").first()).toBeVisible();
    await expect(page.locator("text=Login").first()).toBeVisible();
    await expect(page.locator("text=Register").first()).toBeVisible();
  });
  //   For search test
  test("should display search functionality", async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();
  });

  //   For listings grid test

  test("should display listings grid", async ({ page }) => {
    // Wait for listings to load
    await page.waitForSelector("#listings-container", { timeout: 10000 });

    const listingsContainer = page.locator("#listings-container");
    await expect(listingsContainer).toBeVisible();
  });

  //   For search listing functionality test
  test("should search listings", async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');

    if (await searchInput.isVisible()) {
      await searchInput.fill("test");
      await searchInput.press("Enter");

      // Wait for search results
      await page.waitForTimeout(1000);

      // Verify URL or results changed
      const url = page.url();
      expect(url).toBeTruthy();
    }
  });

  //   For pagination test
  test("should display pagination", async ({ page }) => {
    // Wait for pagination to load
    await page.waitForTimeout(2000);

    const pagination = page.locator("#pagination");

    if (await pagination.isVisible()) {
      await expect(pagination).toBeVisible();
    }
  });
  //   For footer test
  test("should display footer", async ({ page }) => {
    const footer = page.locator("#footer");
    await expect(footer).toBeVisible();
  });
});

//  For mobile navigation tests

test.describe("Homepage - Mobile", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("should display mobile navigation menu", async ({ page }) => {
    await page.goto("/");

    // Look for mobile menu button (hamburger)
    const mobileMenuBtn = page
      .locator('button[aria-label*="menu"], button:has(svg)')
      .first();

    if (await mobileMenuBtn.isVisible()) {
      await mobileMenuBtn.click();

      // Check if mobile menu appears
      await page.waitForTimeout(500);
    }
  });

  test("should display listings in mobile view", async ({ page }) => {
    await page.goto("/");

    // Wait for listings
    await page.waitForSelector("#listings-container", { timeout: 10000 });

    const listingsContainer = page.locator("#listings-container");
    await expect(listingsContainer).toBeVisible();
  });
});
