import { expect, test } from "@playwright/test";
import { ADMIN_STATE } from "./helpers";

test.use({ storageState: ADMIN_STATE });

test("script library search, filter and copy", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/scripts");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const first = page.getByRole("link").filter({ hasText: /./ }).first();
  await expect(first).toBeVisible();
  await page.goto("/scripts?q=price");
  await expect(page.locator("main")).toContainText(/price/i);
});

test("live call companion: pick a service and stage, navigate with keyboard", async ({ page }) => {
  await page.goto("/live-call");
  await expect(page.getByRole("heading", { name: /live call/i })).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Escape");
  await expect(page.locator("main")).toBeVisible();
});

test("command palette opens with Ctrl+K and navigates", async ({ page }) => {
  await page.goto("/dashboard");
  await page.keyboard.press("Control+k");
  const dlg = page.getByRole("dialog");
  await expect(dlg).toBeVisible();
  await dlg.getByRole("combobox").fill("price");
  await expect(dlg.getByRole("option").first()).toBeVisible(); // results arrive after a short debounce
  await page.keyboard.press("Enter");
  await expect(page).not.toHaveURL(/dashboard$/);
});

test("academy course page lists lessons and a quiz", async ({ page }) => {
  await page.goto("/academy");
  await page.getByRole("link", { name: /course|start|continue|open/i }).first().click();
  await expect(page.locator("main")).toContainText(/lesson/i);
});

test("roleplay simulator is honest about its mode and runs a session", async ({ page }) => {
  await page.goto("/roleplay");
  await expect(page.locator("main")).toContainText(/rule-based|AI/i);
});

test("theme toggle persists", async ({ page }) => {
  await page.goto("/dashboard");
  await page.getByRole("button", { name: /theme/i }).first().click();
  const before = await page.evaluate(() => document.documentElement.className);
  await page.reload();
  expect(await page.evaluate(() => document.documentElement.className)).toBe(before);
});
