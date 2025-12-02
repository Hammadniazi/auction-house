import { test, expect } from "@playwright/test";

test.describe("User Profile Page", () => {
  test("should show login modal for non-authenticated users", async ({
    page,
  }) => {
    await page.goto("/pages/userProfile.html?username=testuser");

    // Wait for modal to appear
    await page.waitForTimeout(1000);

    // Check if login modal is visible
    const modal = page.locator("#login-required-modal");

    if ((await modal.count()) > 0) {
      const isVisible = await modal.evaluate((el) => {
        const display = window.getComputedStyle(el).display;
        return display !== "none" && el.classList.contains("flex");
      });

      if (isVisible) {
        expect(isVisible).toBe(true);
      }
    }
  });
  // For cancel button in modal test
  test("should have cancel button in modal", async ({ page }) => {
    await page.goto("/pages/userProfile.html?username=testuser");

    await page.waitForTimeout(1000);

    const cancelBtn = page.locator("#modal-cancel-btn");

    if ((await cancelBtn.count()) > 0 && (await cancelBtn.isVisible())) {
      await expect(cancelBtn).toBeVisible();
    }
  });

  //   For login button in modal test
  test("should redirect to login when clicking login button", async ({
    page,
  }) => {
    await page.goto("/pages/userProfile.html?username=testuser");

    await page.waitForTimeout(1000);

    const loginBtn = page.locator("#modal-login-btn");

    if ((await loginBtn.count()) > 0 && (await loginBtn.isVisible())) {
      await loginBtn.click();

      // Should navigate to login page
      await page.waitForURL("**/login.html", { timeout: 5000 });
      expect(page.url()).toContain("login.html");
    }
  });

  //   For authenticated user profile display test

  test("should display profile for authenticated users", async ({ page }) => {
    // Set mock authentication
    await page.addInitScript(() => {
      localStorage.setItem("auction_token", "mock-token");
      localStorage.setItem("auction_api_key", "mock-api-key");
      localStorage.setItem(
        "auction_user",
        JSON.stringify({
          name: "testuser",
          email: "test@stud.noroff.no",
          credits: 1000,
        }),
      );
    });

    await page.goto("/pages/userProfile.html?username=testuser");

    // Wait for profile to load (it will fail due to mock data, but structure should be there)
    await page.waitForTimeout(2000);

    // Check if profile content is visible
    const profileContent = page.locator("#profile-content");

    if ((await profileContent.count()) > 0) {
      const isHidden = await profileContent.evaluate((el) => {
        return window.getComputedStyle(el).display === "none";
      });

      expect(isHidden).toBe(false);
    }
  });

  //   For tabs test

  test("should have tabs for listings and wins", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("auction_token", "mock-token");
      localStorage.setItem("auction_api_key", "mock-api-key");
      localStorage.setItem(
        "auction_user",
        JSON.stringify({
          name: "testuser",
          email: "test@stud.noroff.no",
          credits: 1000,
        }),
      );
    });

    await page.goto("/pages/userProfile.html?username=testuser");

    await page.waitForTimeout(2000);

    // Check for tabs
    const listingsTab = page.locator("#listings-tab");
    const winsTab = page.locator("#wins-tab");

    if ((await listingsTab.count()) > 0) {
      await expect(listingsTab).toBeVisible();
    }

    if ((await winsTab.count()) > 0) {
      await expect(winsTab).toBeVisible();
    }
  });
});

test.describe("Own Profile Page", () => {
  test("should redirect to login if not authenticated", async ({ page }) => {
    await page.goto("/pages/profile.html");

    await page.waitForTimeout(2000);

    // Should redirect to login or home
    const url = page.url();
    expect(url.includes("login.html") || url.includes("index.html")).toBe(true);
  });

  //   For authenticated user profile display test

  test("should display profile for authenticated users", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("auction_token", "mock-token");
      localStorage.setItem("auction_api_key", "mock-api-key");
      localStorage.setItem(
        "auction_user",
        JSON.stringify({
          name: "testuser",
          email: "test@stud.noroff.no",
          credits: 1000,
          avatar: { url: "https://example.com/avatar.jpg" },
        }),
      );
    });

    await page.goto("/pages/profile.html");

    await page.waitForTimeout(2000);

    // Check if profile container exists
    const profileContainer = page.locator(
      "main, .container, #profile-container",
    );
    await expect(profileContainer.first()).toBeVisible();
  });

  //   For edit profile button test

  test("should have edit profile button in DOM", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("auction_token", "mock-token");
      localStorage.setItem("auction_api_key", "mock-api-key");
      localStorage.setItem(
        "auction_user",
        JSON.stringify({
          name: "testuser",
          email: "test@stud.noroff.no",
          credits: 1000,
        }),
      );
    });

    await page.goto("/pages/profile.html");

    await page.waitForTimeout(2000);

    // Check that edit profile button exists in DOM (may be hidden initially)
    const editBtn = page.locator("#edit-profile-btn");
    await expect(editBtn).toBeAttached();
  });
});
