import { expect, test } from "@playwright/test";
import { WEB } from "../env";

test("mobile menu opens, navigates and fits the screen", async ({ page }) => {
  await page.goto(`${WEB}/en`);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  await page.getByRole("button", { name: "Menu" }).click();
  await page.locator("#mobile-menu").getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL(`${WEB}/en/about`);
  await expect(page.locator("#mobile-menu")).toHaveCount(0);
});

test("Kurdish pages don't scroll sideways on phones", async ({ page }) => {
  for (const path of ["/ckb", "/ckb/services", "/ckb/contact", "/ar/about"]) {
    await page.goto(`${WEB}${path}`);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});
