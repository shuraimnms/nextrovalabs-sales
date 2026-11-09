export type Svc = "WEBSITE" | "MOBILE_APP" | "ECOMMERCE" | "CUSTOM_SOFTWARE" | "GENERAL";
export type Stg =
  | "OPENING" | "PERMISSION_TO_SPEAK" | "REQUIREMENT_DISCOVERY" | "BUSINESS_UNDERSTANDING" | "FEATURE_DISCUSSION"
  | "BUDGET_DISCUSSION" | "TIMELINE_DISCUSSION" | "COMPANY_INTRODUCTION" | "OBJECTION_HANDLING" | "MEETING_SCHEDULING" | "CALL_CLOSING";
export type Diff = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type SeedScript = {
  slug: string; title: string; category: string; service: Svc; stage: Stg; difficulty: Diff;
  scenario: string; recommended: string; alternative: string; english: string; use: string; avoid: string;
  pending?: boolean; // contains a company-policy claim that an admin must confirm
};

export const CATEGORIES = [
  ["first-call-opening", "First Call Opening"],
  ["website-development", "Website Development"],
  ["mobile-app-development", "Mobile App Development"],
  ["ecommerce-development", "E-commerce Development"],
  ["pricing-conversations", "Pricing Conversations"],
  ["trust-building", "Trust Building"],
  ["customer-objections", "Customer Objections"],
  ["closing-scripts", "Closing Scripts"],
  ["follow-up-conversations", "Follow-up Conversations"],
  ["advanced-conversations", "Advanced Sales Conversations"],
] as const;

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

/** Compact factory so each script reads as data. */
export function mk(category: string, service: Svc, stage: Stg, difficulty: Diff) {
  return (title: string, scenario: string, recommended: string, alternative: string, english: string, use: string, avoid: string, pending = false): SeedScript => ({
    slug: slugify(`${category}-${title}`), title, category, service, stage, difficulty, scenario, recommended, alternative, english, use, avoid, pending,
  });
}
