import { expect, test } from "@playwright/test";

test("homepage renders the brand name", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Organic Arogya" })).toBeVisible();
});
