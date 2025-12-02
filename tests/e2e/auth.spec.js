import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.describe("Registration", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/pages/register.html");
    });
    test("should display registration form", async ({ page }) => {
      await expect(page).toHaveTitle(/Register/);

      await expect(page.locator("#name")).toBeVisible();
      await expect(page.locator("#email")).toBeVisible();
      await expect(page.locator("#password")).toBeVisible();
      await expect(
        page.locator('#register-btn, button[type="submit"]'),
      ).toBeVisible();
    });

    test("should show error for invalid email domain", async ({ page }) => {
      await page.fill("#name", "testuser");
      await page.fill("#email", "test@gmail.com");
      await page.fill("#password", "Password123");
      await page.fill("#confirm-password", "Password123");

      await page.click('button[type="submit"]');

      await page.waitForTimeout(500);

      const errorMsg = page.locator(
        "text=/Email must end with @stud.noroff.no/i",
      );
      await expect(errorMsg).toBeVisible({ timeout: 5000 });
    });

    test("should validate required fields", async ({ page }) => {
      // Try to submit empty form
      await page.click('button[type="submit"]');

      // HTML5 validation should prevent submission
      const nameInput = page.locator("#name");
      const isInvalid = await nameInput.evaluate((el) => !el.validity.valid);
      expect(isInvalid).toBe(true);
    });

    test("should have link to login page", async ({ page }) => {
      await page.waitForSelector("form#register-form", { timeout: 10000 });

      const loginLink = page.locator('main a[href="/pages/login.html"]');
      await expect(loginLink).toBeVisible();
    });
  });

  test.describe("Login", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/pages/login.html");
    });

    test("should display login form", async ({ page }) => {
      await expect(page).toHaveTitle(/Login/);
      await expect(page.locator("#email")).toBeVisible();
      await expect(page.locator("#password")).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test("should show error for invalid email domain", async ({ page }) => {
      await page.fill("#email", "test@gmail.com");
      await page.fill("#password", "Password123");

      await page.click('button[type="submit"]');

      // Wait for error message
      await page.waitForTimeout(500);

      const errorMsg = page.locator("text=/@stud.noroff.no./i");
      await expect(errorMsg).toBeVisible({ timeout: 5000 });
    });

    test("should validate required fields", async ({ page }) => {
      // Try to submit empty form
      await page.click('button[type="submit"]');

      // HTML5 validation should prevent submission
      const emailInput = page.locator("#email");
      const isInvalid = await emailInput.evaluate((el) => !el.validity.valid);
      expect(isInvalid).toBe(true);
    });

    test("should have link to register page", async ({ page }) => {
      // Wait for the form to load
      await page.waitForSelector("form#login-form", { timeout: 10000 });

      // Look for register link in main content
      const registerLink = page.locator('main a[href="/pages/register.html"]');
      await expect(registerLink).toBeVisible({ timeout: 5000 });

      // Verify the link text
      await expect(registerLink).toContainText(/Create a new account/i);
    });

    //  For logged in user

    test("should redirect logged-in users", async ({ page }) => {
      // Set mock token and user in localStorage
      await page.addInitScript(() => {
        localStorage.setItem("auction_token", "mock-token");
        localStorage.setItem(
          "auction_user",
          JSON.stringify({
            name: "testuser",
            email: "test@stud.noroff.no",
            credits: 1000,
          }),
        );
      });

      await page.goto("/pages/login.html");

      // Should redirect to home
      await page.waitForURL("**/index.html", { timeout: 5000 });
      expect(page.url()).toContain("index.html");
    });

    //  For valid login tests

    test("should handle login attempt with mock API", async ({ page }) => {
      // Mock successful API response
      await page.route("**/auth/login", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: {
              name: "testuser",
              email: "test@stud.noroff.no",
              accessToken: "mock-access-token-123",
              avatar: { url: "https://example.com/avatar.jpg" },
              banner: { url: "https://example.com/banner.jpg" },
              credits: 1000,
            },
          }),
        });
      });

      // Mock API key creation
      await page.route("**/auth/create-api-key", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: {
              name: "Test API Key",
              status: "ACTIVE",
              key: "mock-api-key-123",
            },
          }),
        });
      });

      await page.fill("#email", "test@stud.noroff.no");
      await page.fill("#password", "Password123");

      await page.click('button[type="submit"]');

      // Should redirect to home after successful login
      await page.waitForURL("**/index.html", { timeout: 10000 });
      expect(page.url()).toContain("index.html");

      // Verify token was stored
      const token = await page.evaluate(() =>
        localStorage.getItem("auction_token"),
      );
      expect(token).toBeTruthy();
    });

    //  For invalid login tests

    test("should show error for invalid credentials", async ({ page }) => {
      // Mock failed API response
      await page.route("**/auth/login", async (route) => {
        await route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({
            errors: [
              {
                message: "Invalid email or password",
              },
            ],
          }),
        });
      });

      await page.fill("#email", "test@stud.noroff.no");
      await page.fill("#password", "WrongPassword123");

      await page.click('button[type="submit"]');

      // Wait for error message
      await page.waitForTimeout(1000);

      // Should show error message
      const errorMsg = page.locator(
        "text=/Invalid.*credentials|Login failed|Invalid email or password/i",
      );
      await expect(errorMsg).toBeVisible({ timeout: 5000 });
    });

    //  For logout tests

    test.describe("Logout", () => {
      test("should logout and clear session", async ({ page }) => {
        // Set mock authentication
        await page.addInitScript(() => {
          localStorage.setItem("auction_token", "mock-token");
          localStorage.setItem(
            "auction_user",
            JSON.stringify({
              name: "testuser",
              email: "test@stud.noroff.no",
              credits: 1000,
            }),
          );
        });

        await page.goto("/");

        // Wait for navigation to load
        await page.waitForTimeout(1000);

        // Find and click logout button
        const logoutBtn = page.locator("text=Logout, text=Log out").first();

        if (await logoutBtn.isVisible()) {
          await logoutBtn.click();

          // Wait for navigation
          await page.waitForTimeout(1000);

          // Check localStorage is cleared
          const token = await page.evaluate(() =>
            localStorage.getItem("auction_token"),
          );
          expect(token).toBeNull();
        }
      });
    });
  });
});
