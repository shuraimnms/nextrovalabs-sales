import { test as setup } from "@playwright/test";
import { ADMIN_STATE, loginAdmin } from "./helpers";

// Sign in once and reuse the session, so the suite does not trip the app's own login rate limit.
setup("sign in as admin", async ({ page }) => {
  await loginAdmin(page);
  await page.context().storageState({ path: ADMIN_STATE });
});
