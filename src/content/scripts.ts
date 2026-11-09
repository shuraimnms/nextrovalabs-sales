import { openingScripts, websiteScripts, appScripts } from "./scripts-1";
import { ecommerceScripts, pricingScripts, trustScripts, objectionScripts, closingScripts, followupScripts } from "./scripts-2";
import { advancedScripts } from "./scripts-3";
import type { SeedScript } from "./types";

export const allScripts: SeedScript[] = [
  ...openingScripts, ...websiteScripts, ...appScripts, ...ecommerceScripts, ...pricingScripts,
  ...trustScripts, ...objectionScripts, ...closingScripts, ...followupScripts, ...advancedScripts,
];
