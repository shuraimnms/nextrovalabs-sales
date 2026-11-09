import { expect, type Page } from "@playwright/test";

export const ADMIN = { email: process.env.E2E_ADMIN_EMAIL ?? "", password: process.env.E2E_ADMIN_PASSWORD ?? "" };
export const EMP_PASSWORD = "E2e-Passw0rd-Strong1";

export async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
}
export async function loginAdmin(page: Page) {
  if (!ADMIN.email || !ADMIN.password) throw new Error("Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD");
  await login(page, ADMIN.email, ADMIN.password);
  await expect(page).toHaveURL(/dashboard/);
}

export const ADMIN_STATE = "tests/e2e/.auth/admin.json";
