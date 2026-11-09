import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { ADMIN_STATE } from "./helpers";

const PAGES = ["/dashboard", "/scripts", "/live-call", "/objections", "/templates", "/knowledge", "/academy", "/roleplay", "/settings", "/admin/dashboard", "/admin/scripts", "/admin/employees", "/admin/analytics"];

for (const scheme of ["light", "dark"] as const) {
  test.describe(`axe (${scheme})`, () => {
    test.use({ colorScheme: scheme, storageState: ADMIN_STATE });
    for (const path of PAGES) {
      test(`${path} has no WCAG 2.2 AA violations`, async ({ page }) => {
        await page.goto(path);
        const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
        expect(r.violations.map((v) => `${v.id}:${v.nodes.length}`)).toEqual([]);
      });
    }
  });
}
