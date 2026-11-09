/**
 * Roleplay engine. Pure functions, no I/O — unit-testable.
 * RULE_BASED mode is a scripted simulator with heuristic scoring; it is NOT AI and the UI says so.
 */
export const PERSONALITIES = {
  PRICE_SENSITIVE: { label: "Price-sensitive owner", blurb: "Keeps coming back to cost." },
  SKEPTICAL: { label: "Sceptical customer", blurb: "Doubts the company and wants proof." },
  BUSY: { label: "Busy executive", blurb: "Short on time; wants crisp answers." },
  CONFUSED: { label: "Confused beginner", blurb: "Doesn't know what they need." },
  COMPARING: { label: "Comparison shopper", blurb: "Has other quotations." },
  DELAYER: { label: "Indecisive delayer", blurb: "Always 'will think'." },
  VAGUE: { label: "Friendly but vague", blurb: "Warm, but won't commit to details." },
} as const;
export type PersonalityKey = keyof typeof PERSONALITIES;

export const PROJECTS = { WEBSITE: "Business website", MOBILE_APP: "Mobile app", ECOMMERCE: "E-commerce store", CUSTOM_SOFTWARE: "Custom software" } as const;
export type ProjectKey = keyof typeof PROJECTS;
export type Level = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type Turn = { role: "user" | "customer"; text: string };
export const MAX_USER_TURNS = 6;

const LINES: Record<PersonalityKey, string[]> = {
  PRICE_SENSITIVE: ["Haan bolo. {project} chahiye, par pehle batao price kitna hoga?", "Itna zyada? Mera budget bahut kam hai.", "Dusri company isse sasta de rahi hai. Discount milega?", "Theek hai, par main kuch compromise nahi kar sakta budget par. Kya options hain?", "Achha, phased approach theek lagta hai. Aage kya karna hoga?", "Theek hai, bhej dijiye details."],
  SKEPTICAL: ["Haan, kaun bol raha hai? Aap {project} ke liye call kar rahe ho?", "Mujhe aapki company ke baare mein kuch pata nahi. Bharosa kaise karun?", "Pehle bhi ek company ne paise lekar kaam adhura chhod diya tha.", "Koi kaam dikha sakte ho? Reviews hain?", "Hmm, video call par team se mil sakta hoon?", "Theek hai, soch ke dekhta hoon."],
  BUSY: ["Haan, jaldi bolo, meeting mein jaana hai. {project} ki baat hai na?", "Mere paas bas 1 minute hai. Mujhe kya milega?", "Itna detail nahi chahiye. Seedha batao next step kya hai.", "Theek hai, par abhi time nahi. Baad mein baat karte hain.", "Achha, kal ka time bata do.", "Theek hai, WhatsApp pe bhej do."],
  CONFUSED: ["Haan hello... {project} chahiye lekin mujhe samajh nahi aata kya chahiye.", "Ye domain, hosting kya hota hai? Mujhe technical nahi aata.", "Website banegi to meri dukaan ko kya faida hoga?", "Mujhe app chahiye ya website, pata nahi.", "Achha samajh aaya. Ab kya karna hoga?", "Theek hai, aap guide karo."],
  COMPARING: ["Haan boliye. Main kuch companies se {project} ke liye baat kar raha hoon.", "Dusri company ne kam price bataya hai. Aap kyon zyada loge?", "Unka kaam bhi accha dikhta hai. Aap alag kya karte ho?", "Support aur ownership ke baare mein kya terms hain?", "Hmm, theek hai, main compare karke batata hoon.", "Aap apna proposal bhej dijiye."],
  DELAYER: ["Haan, {project} ki baat chal rahi thi... bolo.", "Mujhe sochna padega.", "Abhi thoda early hai, 2-3 mahine baad dekhte hain.", "Ghar mein baat karke bataunga.", "Theek hai, bata do kya zaroori hai abhi.", "Achha, kal baat karte hain."],
  VAGUE: ["Hello ji! Haan {project} chahiye, bas achha sa ho.", "Bas modern aur sundar ho, aur kya? Aap hi dekh lo.", "Features? Wo to jo sab mein hota hai wahi.", "Timeline? Jab ho jaye tab theek hai.", "Haan haan sab theek hai, aap bata do kya karna hai.", "Theek hai, aage badhte hain."],
};

const FORBIDDEN = /\b(guarantee|guaranteed|100\s*%|hack[- ]?proof|lifetime|cheapest|sabse sasta|no risk|pakka|top rank|number\s*1)\b/i;
const PRICE_NUM = /(?:₹|rs\.?|inr)\s*\d|\d+\s*(?:k|hazaar|hajar|lakh|lac)\b/i;
const DAYS_NUM = /\b\d+\s*(?:din|days?|weeks?|hafte|hafta|mahine|months?)\b/i;
const POLITE = /\b(sir|madam|ji|aap|please|kripya|dhanyavaad|thank|shukriya)\b/i;
const EMPATHY = /(samajh|understand|maafi|sorry|valid|aapki baat|makes sense|bilkul|zaroor)/i;
const NEXT_STEP = /(meeting|call|whatsapp|kal|parson|tomorrow|summary|proposal|quotation|checklist|schedule|video)/i;
const CONFIRM = /(confirm|team se|verify|check karke|baad mein bata)/i;
const SOCIAL = /\b(bhai|yaar|bro|dude)\b/i;

export type Scores = Record<"professionalism" | "clarity" | "empathy" | "objectionHandling" | "discovery" | "closing", number> & { overall: number };
export const CRITERIA: { key: keyof Omit<Scores, "overall">; label: string }[] = [
  { key: "professionalism", label: "Professionalism" }, { key: "clarity", label: "Clarity" }, { key: "empathy", label: "Empathy" },
  { key: "objectionHandling", label: "Objection handling" }, { key: "discovery", label: "Discovery" }, { key: "closing", label: "Closing" },
];

export function openingLine(p: PersonalityKey, project: ProjectKey) {
  return LINES[p][0].replace("{project}", PROJECTS[project].toLowerCase());
}

/** Deterministic customer reply. Harder levels do not let go of an objection unless the last answer was good. */
export function customerReply(p: PersonalityKey, level: Level, history: Turn[]): { text: string; ended: boolean } {
  const userTurns = history.filter((t) => t.role === "user");
  const last = userTurns[userTurns.length - 1]?.text ?? "";
  const n = userTurns.length;
  if (n >= MAX_USER_TURNS) return { text: "Theek hai, abhi ke liye itna kaafi hai. Dhanyavaad.", ended: true };
  const bad = FORBIDDEN.test(last) || PRICE_NUM.test(last) || DAYS_NUM.test(last);
  const good = (EMPATHY.test(last) || CONFIRM.test(last)) && last.trim().length > 25;
  if (bad) return { text: level === "BEGINNER" ? "Hmm, itni jaldi pakka kaise bol sakte ho? Mujhe thoda doubt hai." : "Aap itne pakke se kaise bol rahe ho bina meri requirement jaane? Mujhe bharosa nahi ho raha.", ended: false };
  const hold = level === "ADVANCED" ? !good : level === "INTERMEDIATE" ? last.trim().length < 15 : false;
  const idx = Math.max(1, Math.min(hold ? n - 1 : n, LINES[p].length - 1));
  return { text: LINES[p][idx].replace("{project}", "project"), ended: false };
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export function evaluate(history: Turn[]): { scores: Scores; feedback: string[] } {
  const u = history.filter((t) => t.role === "user").map((t) => t.text);
  const all = u.join(" \n");
  const n = Math.max(1, u.length);
  const avgLen = all.length / n;
  const has = (re: RegExp) => u.filter((t) => re.test(t)).length;
  const forbidden = has(FORBIDDEN) + has(PRICE_NUM) + has(DAYS_NUM);

  const professionalism = clamp(55 + 30 * (has(POLITE) / n) - 25 * (has(SOCIAL) / n) - 20 * (forbidden / n) + (avgLen > 20 ? 10 : 0));
  const clarity = clamp(40 + (avgLen >= 30 && avgLen <= 400 ? 40 : avgLen > 400 ? 15 : 10) + (u.every((t) => t.trim().length > 8) ? 15 : 0));
  const empathy = clamp(35 + 55 * (has(EMPATHY) / n) + (has(POLITE) ? 10 : 0));
  const objectionHandling = clamp(30 + 35 * (has(EMPATHY) / n) + 25 * (has(CONFIRM) / n) + 15 * (u.filter((t) => /\?/.test(t)).length ? 1 : 0) - 35 * (forbidden / n));
  const discovery = clamp(25 + 70 * Math.min(1, u.filter((t) => /\?/.test(t)).length / Math.max(2, n * 0.6)));
  const closing = clamp(20 + 80 * Math.min(1, has(NEXT_STEP) / 2));
  const overall = clamp((professionalism + clarity + empathy + objectionHandling + discovery + closing) / 6);

  const feedback: string[] = [];
  if (forbidden) feedback.push("You quoted a price, a number of days or a guarantee. Only approved information should be promised — say you will confirm with the team.");
  if (has(SOCIAL)) feedback.push("Avoid casual words like 'bhai' with customers; use 'sir/madam' and 'aap'.");
  if (empathy < 60) feedback.push("Acknowledge the customer's concern first (for example, 'Aapki baat samajh sakta hoon') before responding.");
  if (discovery < 60) feedback.push("Ask more open questions about their business, goals and must-have features.");
  if (closing < 60) feedback.push("End with a clear next step — a callback time, a WhatsApp summary or a meeting.");
  if (clarity < 60) feedback.push("Keep answers clear and complete: one or two short sentences per idea.");
  if (!feedback.length) feedback.push("Good conversation. Keep acknowledging, asking and confirming next steps.");
  return { scores: { professionalism, clarity, empathy, objectionHandling, discovery, closing, overall }, feedback };
}
