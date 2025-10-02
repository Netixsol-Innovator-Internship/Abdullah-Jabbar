import { test, expect } from "@playwright/test";

test.describe("Task Management", () => {
  test.beforeEach(async ({ page }) => {
    // Mock login API
    await page.route("**/api/users/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ token: "mock-jwt-token" }),
      });
    });

    // Mock tasks API
    let tasks = [
      {
        _id: "1",
        title: "Sample Task 1",
        description: "Description 1",
        completed: false,
      },
      {
        _id: "2",
        title: "Sample Task 2",
        description: "Description 2",
        completed: true,
      },
    ];

    await page.route("**/api/tasks", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(tasks),
        });
      } else if (route.request().method() === "POST") {
        const newTask = {
          _id: Date.now().toString(),
          ...JSON.parse(route.request().postData()),
          completed: false,
        };
        tasks.push(newTask);
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(newTask),
        });
      }
    });

    await page.route("**/api/tasks/*", async (route) => {
      const url = route.request().url();
      const id = url.split("/").pop();
      if (route.request().method() === "PUT") {
        const update = JSON.parse(route.request().postData());
        const index = tasks.findIndex((t) => t._id === id);
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...update };
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(tasks[index]),
          });
        } else {
          await route.fulfill({ status: 404 });
        }
      } else if (route.request().method() === "DELETE") {
        tasks = tasks.filter((t) => t._id !== id);
        await route.fulfill({ status: 204 });
      }
    });

    // Login first
    await page.goto("/login");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/");
  });

  test("should display tasks on dashboard", async ({ page }) => {
    await expect(page.locator("text=Sample Task 1")).toBeVisible();
    await expect(page.locator("text=Sample Task 2")).toBeVisible();
  });

  test("should add a new task", async ({ page }) => {
    await page.fill('input[placeholder="Task title"]', "New Task");
    await page.fill('textarea[placeholder*="Description"]', "New Description");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=New Task")).toBeVisible();
  });

  test("should edit a task", async ({ page }) => {
    // Click edit button (assuming there's an edit button)
    await page.locator('button:has-text("Edit")').first().click();

    // Update title
    await page.fill('input[placeholder="Task title"]', "Updated Task");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Updated Task")).toBeVisible();
  });

  test("should delete a task", async ({ page }) => {
    // Click delete button
    await page.locator('button:has-text("Delete")').first().click();

    // Check that the first task is no longer visible
    await expect(page.locator("text=Sample Task 1")).not.toBeVisible();
  });

  test("should logout", async ({ page }) => {
    await page.click('button:has-text("Logout")');
    await expect(page).toHaveURL("/login");
  });
});
