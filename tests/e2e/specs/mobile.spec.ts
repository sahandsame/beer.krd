import { expect, test } from "@playwright/test";
import { ADMIN, OWNER, WEB } from "../env";

test("admin on a phone: compact top bar with a working menu", async ({ page }) => {
  await page.goto(`${ADMIN}/login`);
  await page.getByLabel("Email").fill(OWNER.email);
  await page.getByLabel("Password").fill(OWNER.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(`${ADMIN}/`);
  // The page content is visible straight away instead of being pushed below the sidebar.
  const heading = page.getByRole("heading", { name: /Hello/ });
  await expect(heading).toBeInViewport();
  const nav = page.getByRole("navigation", { name: "Admin" });
  await expect(nav).toBeHidden();
  await page.getByRole("button", { name: "Menu" }).click();
  await nav.getByRole("link", { name: /Leads/ }).click();
  await expect(page).toHaveURL(`${ADMIN}/leads`);
  await expect(nav).toBeHidden();
});

test("mobile menu opens, navigates and fits the screen", async ({ page }) => {
  await page.goto(`${WEB}/en`);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  await page.getByRole("button", { name: "Menu" }).click();
  // The panel must actually cover the screen (it used to collapse to 1px inside the header).
  const box = await page.locator("#mobile-menu").boundingBox();
  expect(box?.height ?? 0).toBeGreaterThan(400);
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
