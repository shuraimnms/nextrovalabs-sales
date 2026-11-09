export const SERVICES: Record<string, string> = { WEBSITE: "Website", MOBILE_APP: "Mobile App", ECOMMERCE: "E-commerce", CUSTOM_SOFTWARE: "Custom Software", GENERAL: "General" };
export const STAGES: Record<string, string> = {
  OPENING: "Opening", PERMISSION_TO_SPEAK: "Permission to Speak", REQUIREMENT_DISCOVERY: "Requirement Discovery",
  BUSINESS_UNDERSTANDING: "Business Understanding", FEATURE_DISCUSSION: "Feature Discussion", BUDGET_DISCUSSION: "Budget Discussion",
  TIMELINE_DISCUSSION: "Timeline Discussion", COMPANY_INTRODUCTION: "Company Introduction", OBJECTION_HANDLING: "Objection Handling",
  MEETING_SCHEDULING: "Meeting Scheduling", CALL_CLOSING: "Call Closing",
};
export const STAGE_ORDER = Object.keys(STAGES);
export const DIFFICULTY: Record<string, string> = { BEGINNER: "Beginner", INTERMEDIATE: "Intermediate", ADVANCED: "Advanced" };
export const OBJ_CATEGORIES: Record<string, string> = {
  PRICE: "Price", COMPETITION: "Competition", URGENCY: "Urgency", UNCERTAINTY: "Uncertainty", TRUST: "Trust",
  TECHNICAL: "Technical", DELAY: "Delay", FOLLOW_UP: "Follow-up", PROCESS: "Process",
};
export const TEMPLATE_CATEGORIES: Record<string, string> = {
  FIRST_INTRODUCTION: "First introduction", COMPANY_INTRODUCTION: "Company introduction", WEBSITE_ENQUIRY_FOLLOWUP: "Website enquiry follow-up",
  APP_DEVELOPMENT_FOLLOWUP: "App development follow-up", REQUIREMENTS_REQUEST: "Requirements request", REFERENCE_WEBSITE_REQUEST: "Reference website request",
  PROPOSAL_FOLLOWUP: "Proposal follow-up", MEETING_CONFIRMATION: "Meeting confirmation", MEETING_REMINDER: "Meeting reminder",
  THANK_YOU: "Thank you", NOT_INTERESTED: "Not interested", RECONNECTION: "Reconnection",
};
export const VARIANTS: Record<string, string> = { RECOMMENDED: "Recommended", SHORT: "Short", DETAILED: "Detailed", ALTERNATIVE: "Alternative" };
