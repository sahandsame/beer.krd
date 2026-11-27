import { expect, test } from "@playwright/test";
import { WEB } from "../env";

test.describe("public site", () => {
  test("Kurdish home page is right-to-left with the brand tagline", async ({ page }) => {
    await page.goto(`${WEB}/ckb`);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ckb");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "بۆ ئەوانەی بە قووڵی بیر دەکەنەوە.",
    );
    await expect(page).toHaveTitle(/ئاژانسی بیر/);
  });

  test("language switcher moves between ckb, en and ar on the same page", async ({ page }) => {
    await page.goto(`${WEB}/ckb/services`);
    await page
      .getByRole("navigation", { name: "زمان" })
      .first()
      .getByRole("link", { name: "English" })
      .click();
    await expect(page).toHaveURL(`${WEB}/en/services`);
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Everything your brand needs, under one roof",
    );
    await page
      .getByRole("navigation", { name: "Language" })
      .first()
      .getByRole("link", { name: "العربية" })
      .click();
    await expect(page).toHaveURL(`${WEB}/ar/services`);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  });

  test("root redirects to a locale", async ({ page }) => {
    await page.goto(WEB);
    await expect(page).toHaveURL(/\/(ckb|en|ar)$/);
  });

  test("all five services are listed and each has a page", async ({ page }) => {
    await page.goto(`${WEB}/en/services`);
    await expect(page.locator("main li h2")).toHaveCount(5);
    for (const name of [
      "Websites, Systems & Software",
      "Social Media Management",
      "Branding & Design",
      "Paid Advertising",
      "Photo & Video Production",
    ]) {
      await expect(page.getByRole("heading", { name, level: 2 })).toBeVisible();
    }
    await page.getByRole("link", { name: /Paid Advertising/ }).click();
    await expect(page).toHaveURL(`${WEB}/en/services/paid-ads`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Paid Advertising");
    await expect(page.getByText("Google Ads")).toBeVisible();
  });

  test("unknown pages show the branded 404", async ({ page }) => {
    const res = await page.goto(`${WEB}/en/services/does-not-exist`);
    expect(res?.status()).toBe(404);
    await expect(page.getByText("This page got lost in thought.")).toBeVisible();
    const res2 = await page.goto(`${WEB}/en/nope/nothing`);
    expect(res2?.status()).toBe(404);
  });

  test("Work section is hidden until enabled in the admin", async ({ page }) => {
    await page.goto(`${WEB}/en`);
    await expect(
      page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Work" }),
    ).toHaveCount(0);
    const res = await page.goto(`${WEB}/en/work`);
    expect(res?.status()).toBe(404);
  });

  test("contact form validates in the visitor's language", async ({ page }) => {
    await page.goto(`${WEB}/en/contact`);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByText("Please enter a valid phone number.")).toBeVisible();

    await page.goto(`${WEB}/ckb/contact`);
    await page.getByRole("button", { name: "ناردنی نامە" }).click();
    await expect(page.getByText("تکایە ناوت بنووسە.")).toBeVisible();
  });

  test("service CTA preselects the service on the contact form", async ({ page }) => {
    await page.goto(`${WEB}/en/services/branding`);
    await page.getByRole("link", { name: "Start a project" }).last().click();
    await expect(page).toHaveURL(`${WEB}/en/contact?service=branding`);
    await expect(page.getByLabel("What do you need?")).toHaveValue("branding");
  });

  test("pricing page lists the six packages from $100 to $5,000", async ({ page }) => {
    await page.goto(`${WEB}/en`);
    await page
      .getByRole("navigation", { name: "Main" })
      .getByRole("link", { name: "Prices" })
      .click();
    await expect(page).toHaveURL(`${WEB}/en/pricing`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Websites and systems, from $100 to $5,000",
    );
    const cards = page.getByRole("article");
    await expect(cards).toHaveCount(6);
    for (const [name, price] of [
      ["Starter", "$100 – $150"],
      ["Pro", "From $800"],
      ["Custom System", "From $3,000"],
    ] as const) {
      const card = cards.filter({ has: page.getByRole("heading", { name, exact: true }) });
      await expect(card).toContainText(price);
    }
    await expect(cards.filter({ hasText: "Most popular" })).toHaveCount(1);
    await expect(page.getByText("Pay in stages")).toBeVisible();

    // Arabic version is right-to-left with translated packages.
    await page.goto(`${WEB}/ar/pricing`);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("heading", { name: "متجر إلكتروني" })).toBeVisible();
  });

  test("home page shows the price range and links to pricing", async ({ page }) => {
    await page.goto(`${WEB}/en`);
    await page.getByRole("link", { name: "See all prices" }).click();
    await expect(page).toHaveURL(`${WEB}/en/pricing`);
  });

  test("SEO: hreflang, sitemap, robots and social image", async ({ page, request }) => {
    await page.goto(`${WEB}/en/about`);
    await expect(page.locator('link[rel="alternate"][hreflang="ckb"]')).toHaveAttribute(
      "href",
      `${WEB}/ckb/about`,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${WEB}/en/about`);
    const sitemap = await (await request.get(`${WEB}/sitemap.xml`)).text();
    expect(sitemap).toContain(`${WEB}/ckb/services/web-software`);
    expect(sitemap).toContain('hreflang="ar"');
    expect(sitemap).not.toContain("/work");
    expect(await (await request.get(`${WEB}/robots.txt`)).text()).toContain(
      `Sitemap: ${WEB}/sitemap.xml`,
    );
    const og = await request.get(`${WEB}/en/opengraph-image`);
    expect(og.status()).toBe(200);
    expect(og.headers()["content-type"]).toContain("image/png");
  });

  test("security: revalidate needs the secret, media blocks traversal", async ({ request }) => {
    expect(
      (await request.post(`${WEB}/api/revalidate`, { data: { tags: ["services"] } })).status(),
    ).toBe(401);
    expect((await request.get(`${WEB}/media/..%2F..%2Fpackage.json`)).status()).toBe(404);
    expect((await request.get(`${WEB}/api/health`)).status()).toBe(200);
  });
});
