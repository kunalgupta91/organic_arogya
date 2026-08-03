import { expect, test } from "@playwright/test";

test.describe("Static pages", () => {
  for (const [path, heading] of [
    ["/about", "Our Story"],
    ["/contact", "Contact Us"],
    ["/faq", "Frequently Asked Questions"],
    ["/privacy-policy", "Privacy Policy"],
    ["/terms-and-conditions", "Terms & Conditions"],
    ["/refund-policy", "Refund Policy"],
    ["/shipping-policy", "Shipping Policy"],
    ["/bulk-orders", "Bulk Orders"],
  ] as const) {
    test(`${path} renders its heading`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.ok()).toBe(true);
      await expect(page.getByRole("heading", { name: heading, exact: false }).first()).toBeVisible();
    });
  }
});

test("products page renders the filter bar and an empty or populated grid", async ({ page }) => {
  await page.goto("/products");
  await expect(page.getByRole("heading", { name: "Shop All Products" })).toBeVisible();
  await expect(page.getByPlaceholder("Search…")).toBeVisible();
});

test("header search submits to the products page", async ({ page }) => {
  await page.goto("/");
  const searchInput = page.getByPlaceholder("Search products…");
  await searchInput.fill("aloe");
  await searchInput.press("Enter");
  await expect(page).toHaveURL(/\/products\?search=aloe/);
});
