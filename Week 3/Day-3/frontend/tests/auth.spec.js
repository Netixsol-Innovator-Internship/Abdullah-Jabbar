import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route("**/api/users/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ token: "mock-jwt-token" }),
      });
    });

    await page.route("**/api/users/register", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ token: "mock-jwt-token" }),
      });
    });
  });

  test("should login successfully", async ({ page }) => {
    await page.goto("/login");

    // Fill login form
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "password123");

    // Submit form
    await page.click('button[type="submit"]');

    // Should navigate to dashboard
    await expect(page).toHaveURL("/");
  });

  test("should register successfully", async ({ page }) => {
    await page.goto("/register");

    // Fill register form
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "password123");

    // Submit form
    await page.click('button[type="submit"]');

    // Should navigate to dashboard
    await expect(page).toHaveURL("/");
  });

  test("should navigate between login and register", async ({ page }) => {
    await page.goto("/login");

    // Click register link
    await page.click("text=Need an account? Register");

    // Should be on register page
    await expect(page).toHaveURL("/register");

    // Click login link
    await page.click("text=Already have an account? Login");

    // Should be on login page
    await expect(page).toHaveURL("/login");
  });
});
