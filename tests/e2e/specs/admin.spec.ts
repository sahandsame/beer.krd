import { expect, type Page, test } from "@playwright/test";
import { ADMIN, OWNER, WEB } from "../env";

// A 96x64 lime PNG (generated with sharp), used for the upload tests.
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAGAAAABACAIAAABqVuVZAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAwElEQVR4nO3ZwQnDQADEQNeqYq+JNJN/IP6EsH4MXAVCK5/t67xyzncIFzrnVhGAAqhfVsKgAIpB/e9RY2IBFIMysVYXWg0KoBiUiaVBPfO7gkgHUAzKxNKg5j0W6QCKQZlY8+64KAZQDMrEmgfIy2oAxaBMLA1qHmORDqAYlIk1j46LYgDFoEyshxx/VgMoBmViaVDzHot0AMWgTKx5d1wUAygGZWLNA+RlNYBiUCaWBjWPsUgHUAzKxJpH5+O8AeEoStHVFsY4AAAAAElFTkSuQmCC",
  "base64",
);

test.describe.configure({ mode: "serial" });

async function signIn(page: Page, email: string, password: string) {
  await page.goto(`${ADMIN}/login`);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
}

/** Sign in and wait until the admin has loaded. */
async function login(page: Page, email: string, password: string) {
  await signIn(page, email, password);
  await page.waitForURL((u) => !u.pathname.startsWith("/login"));
}

test("admin pages require a session", async ({ page }) => {
  await page.goto(`${ADMIN}/leads`);
  await expect(page).toHaveURL(`${ADMIN}/login?next=%2Fleads`);
});

test("wrong password is rejected", async ({ page }) => {
  await signIn(page, OWNER.email, "not-the-password");
  await expect(page.getByText(/Wrong email or password/)).toBeVisible();
  await expect(page).toHaveURL(/\/login/);
});

test("a lead from a pricing package shows up in the admin inbox and can be worked", async ({
  page,
}) => {
  // Start on the Kurdish pricing page and pick the highlighted "Pro" package.
  await page.goto(`${WEB}/ckb/pricing`);
  await page
    .getByRole("article")
    .filter({ hasText: "باوترین" })
    .getByRole("link", { name: "دەست پێبکە" })
    .click();
  await expect(page).toHaveURL(/\/ckb\/contact\?service=web-software&package=4&budget=500-2000$/);
  // Service and budget arrive preselected.
  await expect(page.getByLabel("پێویستت بە چییە؟")).toHaveValue("web-software");
  await expect(page.getByLabel("بودجە")).toHaveValue("500-2000");
  await page.getByLabel("ناوت").fill("ئارامی تاقیکردنەوە");
  await page.getByLabel("ژمارەی تەلەفۆن").fill("0773 418 7963");
  await page.getByLabel("باسی پڕۆژەکەت بکە").fill("ماڵپەڕێکی نوێمان دەوێت بۆ چێشتخانەکەمان.");
  await page.getByRole("button", { name: "ناردنی نامە" }).click();
  await expect(page.getByRole("status")).toContainText("سوپاس!");

  await login(page, OWNER.email, OWNER.password);
  await expect(page).toHaveURL(`${ADMIN}/`);
  await expect(page.getByRole("heading", { name: "Hello, E2E" })).toBeVisible();
  await page
    .getByRole("navigation", { name: "Admin" })
    .getByRole("link", { name: /Leads/ })
    .click();
  await page.getByRole("link", { name: "ئارامی تاقیکردنەوە" }).click();
  await expect(page.getByText("Websites, Systems & Software")).toBeVisible();
  await expect(page.getByText("$500 – $2,000")).toBeVisible();
  await expect(page.getByText("package 4 (Pro)")).toBeVisible();

  await page.getByLabel("Status").selectOption("contacted");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Lead updated.")).toBeVisible();
  await page.getByLabel("New note").fill("Called back, meeting on Sunday.");
  await page.getByRole("button", { name: "Add note" }).click();
  await expect(page.getByText("Called back, meeting on Sunday.")).toBeVisible();

  const csv = await page.request.get(`${ADMIN}/leads/export`);
  expect(csv.status()).toBe(200);
  expect(await csv.text()).toContain("ئارامی تاقیکردنەوە");
});

test("editing a service updates the public site immediately", async ({ page }) => {
  await login(page, OWNER.email, OWNER.password);
  await page.goto(`${ADMIN}/services`);
  await page.getByRole("link", { name: "Branding & Design" }).click();
  const nameField = page.getByRole("group", { name: /Name/ });
  await nameField.getByRole("tab", { name: "en" }).click();
  await nameField.locator('input[name="name.en"]').fill("Brand Identity & Design");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Service saved.")).toBeVisible();

  await page.goto(`${WEB}/en/services`);
  await expect(page.getByRole("heading", { name: "Brand Identity & Design" })).toBeVisible();
});

test("editing page content updates the home page", async ({ page }) => {
  await login(page, OWNER.email, OWNER.password);
  await page.goto(`${ADMIN}/content/home.hero`);
  const headline = page.getByRole("group", { name: /Headline/ });
  await headline.getByRole("tab", { name: "en" }).click();
  await headline.locator('textarea[name="title.en"]').fill("Think deeper. Grow faster.");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("The website has been updated.")).toBeVisible();
  await page.goto(`${WEB}/en`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Think deeper. Grow faster.");
  await page.goto(`${WEB}/ckb`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "بۆ ئەوانەی بە قووڵی بیر دەکەنەوە.",
  );
});

test("portfolio: create a project with an image, then switch the Work section on", async ({
  page,
}) => {
  await login(page, OWNER.email, OWNER.password);
  await page.goto(`${ADMIN}/projects/new`);
  await page.getByLabel("URL slug").fill("erbil-cafe");
  await page.getByLabel("Client name").fill("Erbil Cafe");
  await page.locator('input[name="title.ckb"]').fill("کافێی هەولێر");
  const title = page.getByRole("group", { name: /^Title/ });
  await title.getByRole("tab", { name: "en" }).click();
  await title.locator('input[name="title.en"]').fill("Erbil Cafe rebrand");
  await page.getByLabel("Branding & Design").or(page.getByLabel("Brand Identity & Design")).check();
  await page
    .getByLabel("Cover image")
    .setInputFiles({ name: "cover.png", mimeType: "image/png", buffer: PNG });
  await page.getByLabel("Published").check();
  await page.getByLabel("Featured on the home page").check();
  await page.getByRole("button", { name: "Create project" }).click();
  await expect(page.getByText("Project created.")).toBeVisible();

  await page.goto(`${ADMIN}/settings`);
  await page.getByLabel("Show the Work / portfolio section").check();
  await page.getByRole("button", { name: "Save settings" }).click();
  await expect(page.getByText("Settings saved.")).toBeVisible();

  await page.goto(`${WEB}/en/work`);
  await expect(
    page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Work" }),
  ).toBeVisible();
  await page.getByRole("link", { name: /Erbil Cafe rebrand/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Erbil Cafe rebrand");
  const img = page.locator("main img").first();
  await expect(img).toHaveAttribute("src", /\/media\/\d{4}\/\d{2}\/.+\.webp$/);
  const imgRes = await page.request.get((await img.getAttribute("src"))!);
  expect(imgRes.status()).toBe(200);
  expect(imgRes.headers()["content-type"]).toBe("image/webp");
});

test("invite an editor; editors can't manage users or settings; deactivation signs them out", async ({
  page,
  browser,
}) => {
  await login(page, OWNER.email, OWNER.password);
  await page.goto(`${ADMIN}/users`);
  await page.getByLabel("Email").fill("editor@e2e.test");
  await page.getByRole("button", { name: "Create invite" }).click();
  const link = await page.getByLabel("Invitation link").inputValue();
  expect(link).toMatch(/\/invite\/[\w-]+$/);

  const editorCtx = await browser.newContext();
  const editor = await editorCtx.newPage();
  await editor.goto(link);
  await editor.getByLabel("Your name").fill("Eda Editor");
  await editor.getByLabel("Password", { exact: true }).fill("editor-password-1");
  await editor.getByLabel("Confirm password").fill("editor-password-1");
  await editor.getByRole("button", { name: "Create account" }).click();
  await expect(editor).toHaveURL(/\/login\?welcome=1/);

  // The link is single-use.
  await editor.goto(link);
  await expect(editor.getByText("Invitation not valid")).toBeVisible();

  await login(editor, "editor@e2e.test", "editor-password-1");
  await expect(editor.getByRole("heading", { name: "Hello, Eda" })).toBeVisible();
  await expect(
    editor.getByRole("navigation", { name: "Admin" }).getByRole("link", { name: "Users" }),
  ).toHaveCount(0);
  await editor.goto(`${ADMIN}/users`);
  await expect(editor.getByText("You don't have access to this page.")).toBeVisible();
  await editor.goto(`${ADMIN}/settings`);
  await expect(editor.getByText("You don't have access to this page.")).toBeVisible();

  // Owner deactivates the editor → their session stops working.
  await page.reload();
  const row = page.locator("li", { hasText: "editor@e2e.test" });
  await row.getByLabel(/Status for/).selectOption("false");
  await row.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("User deactivated and signed out.")).toBeVisible();
  await editor.goto(`${ADMIN}/leads`);
  await expect(editor).toHaveURL(/\/login/);
  await signIn(editor, "editor@e2e.test", "editor-password-1");
  await expect(editor.getByText(/Wrong email or password/)).toBeVisible();
  await editorCtx.close();
});
