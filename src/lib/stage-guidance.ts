/** Static, reviewed guidance shown beside the script at each call stage. Contains no company claims. */
export const STAGE_GUIDANCE: Record<string, { questions: string[]; knowledge: string; tip: string }> = {
  OPENING: { questions: ["Kya main [Name] ji se baat kar raha hoon?", "Kya abhi 2 minute baat karne ka sahi time hai?"], knowledge: "company", tip: "Name, company, reason, permission — in 20 seconds." },
  PERMISSION_TO_SPEAK: { questions: ["Kya main aapka 2 minute le sakta hoon?", "Agar abhi busy hain to kab call karun?"], knowledge: "call conduct", tip: "A specific callback time beats 'baad mein'." },
  REQUIREMENT_DISCOVERY: { questions: ["Aapko website/app se kya hasil karna hai?", "Aapke customers kaun hain?", "Koi reference website jo pasand ho?"], knowledge: "requirements", tip: "Open questions first, then narrow." },
  BUSINESS_UNDERSTANDING: { questions: ["Aapka business kya karta hai?", "Abhi customers aap tak kaise pahunchte hain?", "Sabse badi dikkat kya aa rahi hai?"], knowledge: "website basics", tip: "Repeat their words back to show you listened." },
  FEATURE_DISCUSSION: { questions: ["Kaunse 3 features sabse zaroori hain?", "Admin panel se aap kya manage karna chahenge?", "Kya payment ya booking chahiye?"], knowledge: "app basics", tip: "Separate must-have from nice-to-have." },
  BUDGET_DISCUSSION: { questions: ["Aapka comfortable budget range kya hoga?", "Kya hum phase-wise plan karein?"], knowledge: "pricing", tip: "Never quote a number from memory." },
  TIMELINE_DISCUSSION: { questions: ["Aapko kab tak live chahiye?", "Koi event ya launch date hai?", "Content kab tak ready ho jayega?"], knowledge: "timelines", tip: "Do not promise days or weeks — confirm with the team." },
  COMPANY_INTRODUCTION: { questions: ["Kya main hamari website ka link bhej doon?", "Kya aap video call par team se milna chahenge?"], knowledge: "who we are", tip: "Only verified facts about the company." },
  OBJECTION_HANDLING: { questions: ["Aapko sabse zyada kaunsi baat pareshaan kar rahi hai?", "Kya aap bata sakte hain ki kya clear nahi hai?"], knowledge: "objection", tip: "Acknowledge first. Do not argue." },
  MEETING_SCHEDULING: { questions: ["Kal shaam ya parson subah — kaunsa time theek rahega?", "Meeting WhatsApp par confirm kar doon?"], knowledge: "meeting", tip: "Offer two specific options." },
  CALL_CLOSING: { questions: ["Kya main ek summary WhatsApp par bhej doon?", "Koi aur sawal jo abhi poochna ho?"], knowledge: "follow-up", tip: "End with a clear next step and thanks." },
};
