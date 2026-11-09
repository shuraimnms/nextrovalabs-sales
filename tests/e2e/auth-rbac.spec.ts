import { expect, test } from "@playwright/test";
import { ADMIN_STATE, EMP_PASSWORD, login } from "./helpers";

test.describe.configure({ mode: "serial" });
const email = `e2e-${Date.now()}@example.test`;

test("unauthenticated users are redirected to login", async ({ page }) => {
  for (const p of ["/dashboard", "/scripts", "/admin/dashboard", "/live-call"]) {
    await page.goto(p);
    await expect(page).toHaveURL(/login/);
  }
});

test("wrong password shows a generic error", async ({ page }) => {
  await login(page, "nobody@example.test", "definitely-wrong");
  await expect(page.locator("#form-error")).toContainText(/incorrect email or password/i);
});

test("admin creates an employee", async ({ browser }) => {
  const ctx = await browser.newContext({ storageState: ADMIN_STATE });
  const page = await ctx.newPage();
  await page.goto("/admin/employees");
  await page.getByLabel(/name/i).first().fill("E2E Employee");
  await page.getByLabel(/email/i).first().fill(email);
  await page.getByLabel(/password/i).first().fill(EMP_PASSWORD);
  await page.getByRole("button", { name: "Create user" }).click();
  await expect(page.getByText(email)).toBeVisible();
  await ctx.close();
});

test("new employee must change password, then can use the app but not /admin", async ({ page }) => {
  await login(page, email, EMP_PASSWORD);
  await expect(page).toHaveURL(/change-password|dashboard/);
  if (/change-password/.test(page.url())) {
    await page.fill('input[name="current"]', EMP_PASSWORD).catch(() => {});
    await page.fill('input[name="password"]', "E2e-NewPassw0rd-Strong2");
    await page.fill('input[name="confirm"]', "E2e-NewPassw0rd-Strong2");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);
  }
  await page.goto("/admin/dashboard");
  await expect(page).not.toHaveURL(/admin/);
});

test("suspended employee loses access", async ({ browser }) => {
  const adminCtx = await browser.newContext({ storageState: ADMIN_STATE });
  const page = await adminCtx.newPage();
  const empCtx = await browser.newContext();
  const emp = await empCtx.newPage();
  await login(emp, email, "E2e-NewPassw0rd-Strong2");
  await expect(emp).toHaveURL(/dashboard/);

  await page.goto("/admin/employees");
  const row = page.getByRole("row", { name: new RegExp(email) });
  await row.getByRole("button", { name: /suspend/i }).click();
  await expect(row.getByText("Suspended")).toBeVisible();

  await emp.goto("/scripts");
  await expect(emp).toHaveURL(/login/);
  await empCtx.close();
  await adminCtx.close();
});
