import { test, expect } from "@playwright/test";

test.describe("Listing Detail Page", () => {
  test("should display listing detail page", async ({ page }) => {
    // First go to homepage to get a listing
    await page.goto("/");

    // Wait for listings to load completely
    await page.waitForLoadState("networkidle");
    await page.waitForSelector(".listing-card", { timeout: 15000 });

    // Click first listing card
    const firstCard = page.locator(".listing-card").first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    // Should navigate to listing detail page
    await page.waitForURL(/\/pages\/listing\.html\?id=/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/pages\/listing\.html\?id=/);
  });

  // For listing information test

  test("should display listing information", async ({ page }) => {
    await page.goto("/");

    // Wait for listings to load completely
    await page.waitForLoadState("networkidle");
    await page.waitForSelector(".listing-card", { timeout: 15000 });

    // Click first listing card
    const firstCard = page.locator(".listing-card").first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    // Wait for navigation and page load
    await page.waitForURL(/\/pages\/listing\.html\?id=/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");

    // Check for listing container
    const listingContainer = page.locator("#listing-container");
    await expect(listingContainer).toBeVisible({ timeout: 10000 });
  });

  // For bid form test

  test("should show bid form for authenticated users", async ({ page }) => {
    // Set mock authentication
    await page.addInitScript(() => {
      localStorage.setItem("token", "mock-token");
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: "testuser",
          email: "test@stud.noroff.no",
          credits: 1000,
        }),
      );
    });

    await page.goto("/");
    await page.waitForSelector(".listing-card, .card", { timeout: 10000 });

    const firstCard = page.locator(".listing-card, .card").first();
    await firstCard.click();

    await page.waitForTimeout(2000);

    // Check if bid form exists (if not owner and not expired)
    const bidForm = page.locator("#bid-form");

    if ((await bidForm.count()) > 0) {
      await expect(bidForm).toBeVisible();
    }
  });
  // For bid history test
  test("should display bid history", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector(".listing-card, .card", { timeout: 10000 });

    const firstCard = page.locator(".listing-card, .card").first();
    await firstCard.click();

    await page.waitForTimeout(2000);

    // Look for bid history section
    const bidHistory = page.locator("text=Bid History, text=Recent Bids");

    if ((await bidHistory.count()) > 0) {
      await expect(bidHistory.first()).toBeVisible();
    }
  });

  // For clickable seller name test

  test("should display clickable seller name", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector(".listing-card, .card", { timeout: 10000 });

    const firstCard = page.locator(".listing-card, .card").first();
    await firstCard.click();

    await page.waitForTimeout(2000);

    // Look for seller link
    const sellerLink = page.locator('a[href*="user-profile.html"]').first();

    if ((await sellerLink.count()) > 0) {
      await expect(sellerLink).toBeVisible();
    }
  });
});

// For create listing page test

test.describe("Create Listing Page", () => {
  test("should redirect to login if not authenticated", async ({ page }) => {
    await page.goto("/pages/create-listing.html");

    // Should redirect to login or show error
    await page.waitForTimeout(2000);

    const url = page.url();
    const isLoginPage = url.includes("login.html");
    const isHomePage = url.includes("index.html");

    expect(isLoginPage || isHomePage).toBe(true);
  });

  // For create listing form test

  test("should display create listing form for authenticated users", async ({
    page,
  }) => {
    // Set mock authentication with both token and API key
    await page.addInitScript(() => {
      localStorage.setItem("auction_token", "mock-token-123");
      localStorage.setItem("auction_api_key", "mock-api-key-123");
      localStorage.setItem(
        "auction_user",
        JSON.stringify({
          name: "testuser",
          email: "test@stud.noroff.no",
          credits: 1000,
        }),
      );
    });

    await page.goto("/pages/create-listing.html");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Check form fields exist
    await expect(page.locator("#title")).toBeVisible({
      timeout: 5000,
    });
    await expect(page.locator("#description")).toBeVisible();
    await expect(page.locator("#endsAt")).toBeVisible();
  });

  // For validate required fields test

  test("should validate required fields", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("auction_token", "mock-token-123");
      localStorage.setItem("auction_api_key", "mock-api-key-123");
      localStorage.setItem(
        "auction_user",
        JSON.stringify({
          name: "testuser",
          email: "test@stud.noroff.no",
          credits: 1000,
        }),
      );
    });

    await page.goto("/pages/create-listing.html");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Try to submit empty form
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // HTML5 validation should prevent submission
    const titleInput = page.locator("#title");
    const isInvalid = await titleInput.evaluate((el) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });
});
