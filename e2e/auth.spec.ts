import { expect, test } from "@playwright/test";

test("a new user can register, land on their account page, and sign out", async ({ page }) => {
  const email = `e2e-test-${Date.now()}@example.com`;

  await page.goto("/register");
  await page.getByLabel("Full name").fill("E2E Test User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("password123");
  await page.getByLabel("Confirm password").fill("password123");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/account/);
  await expect(page.getByRole("heading", { name: /Welcome/ })).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL("/");
});

test("unauthenticated visitors are redirected to login from protected pages", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login/);

  await page.goto("/account");
  await expect(page).toHaveURL(/\/login/);

  await page.goto("/account/orders");
  await expect(page).toHaveURL(/\/login/);
});

test("login rejects an invalid password", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("nonexistent@example.com");
  await page.getByLabel("Password").fill("wrongpassword");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByText("Invalid email or password.")).toBeVisible();
});
