import { slugify } from "./types";

export type TplCat =
  | "FIRST_INTRODUCTION" | "COMPANY_INTRODUCTION" | "WEBSITE_ENQUIRY_FOLLOWUP" | "APP_DEVELOPMENT_FOLLOWUP"
  | "REQUIREMENTS_REQUEST" | "REFERENCE_WEBSITE_REQUEST" | "PROPOSAL_FOLLOWUP" | "MEETING_CONFIRMATION"
  | "MEETING_REMINDER" | "THANK_YOU" | "NOT_INTERESTED" | "RECONNECTION";

export type SeedTemplate = { slug: string; title: string; category: TplCat; en: string; hi: string; pending: boolean };

/** Placeholders: {{customer_name}} {{employee_name}} {{service}} {{date}} {{time}} {{meeting_link}} {{website_url}} */
const t = (category: TplCat) => (title: string, en: string, hi: string, pending = false): SeedTemplate => ({
  slug: slugify(`${category}-${title}`), title, category, en, hi, pending,
});

const FI = t("FIRST_INTRODUCTION"), CI = t("COMPANY_INTRODUCTION"), WE = t("WEBSITE_ENQUIRY_FOLLOWUP"),
  AD = t("APP_DEVELOPMENT_FOLLOWUP"), RR = t("REQUIREMENTS_REQUEST"), RW = t("REFERENCE_WEBSITE_REQUEST"),
  PF = t("PROPOSAL_FOLLOWUP"), MC = t("MEETING_CONFIRMATION"), MR = t("MEETING_REMINDER"), TY = t("THANK_YOU"),
  NI = t("NOT_INTERESTED"), RC = t("RECONNECTION");

export const templates: SeedTemplate[] = [
  FI("Short introduction",
`Hello {{customer_name}}, this is {{employee_name}} from Nextrova Labs. Thank you for taking my call. I'd be happy to share more about how we can help with your {{service}} requirement. When would be a good time to talk further?`,
`Namaste {{customer_name}} ji, main {{employee_name}} bol raha hoon, Nextrova Labs se. Call par baat karne ke liye dhanyavaad. Aapki {{service}} requirement mein hum kaise help kar sakte hain, uske baare mein main aur batana chahunga. Aapko kab convenient rahega?`),
  FI("After a missed call",
`Hello {{customer_name}}, this is {{employee_name}} from Nextrova Labs. I tried calling you just now. Please let me know a convenient time to speak, or reply here with any questions.`,
`Namaste {{customer_name}} ji, main {{employee_name}}, Nextrova Labs se. Maine abhi aapko call kiya tha. Aapko jab convenient ho, bata dijiye ya yahin message karke sawal puch lijiye.`),
  FI("Introduction with website link",
`Hello {{customer_name}}, I'm {{employee_name}} from Nextrova Labs, a Bengaluru-based software company. You can know more about us at {{website_url}}. Happy to answer any questions you have.`,
`Namaste {{customer_name}} ji, main {{employee_name}}, Nextrova Labs se — hum Bengaluru-based software company hain. Hamare baare mein aap {{website_url}} par dekh sakte hain. Koi bhi sawal ho to zaroor puchiye.`),

  CI("Who we are",
`Hello {{customer_name}}, Nextrova Labs is a Bengaluru-based software company working on web, mobile, AI and cloud solutions and design. More details: {{website_url}}. Please tell me about your project and we will guide you on the right approach.`,
`Namaste {{customer_name}} ji, Nextrova Labs Bengaluru-based software company hai jo web, mobile, AI aur cloud solutions tatha design par kaam karti hai. Aur details: {{website_url}}. Aap apne project ke baare mein bataiye, hum sahi approach mein guide karenge.`),
  CI("Services overview",
`Hi {{customer_name}}, thank you for your interest. We help businesses with websites, mobile apps, e-commerce and custom software. Which of these are you looking for? I'll share relevant details.`,
`Namaste {{customer_name}} ji, interest dikhane ke liye dhanyavaad. Hum websites, mobile apps, e-commerce aur custom software mein businesses ki madad karte hain. Aap inmein se kya dhoondh rahe hain? Main relevant details bhej dunga.`),
  CI("Offering a video call to meet the team",
`Hello {{customer_name}}, if you'd like to know our team and way of working before deciding, we can arrange a short video call. Please let me know a time that suits you.`,
`Namaste {{customer_name}} ji, agar aap decide karne se pehle hamari team aur kaam karne ke tareeke ko jaanna chahte hain, to hum ek chhoti video call arrange kar sakte hain. Aapko kaunsa time theek rahega?`),

  WE("Following up on a website enquiry",
`Hello {{customer_name}}, thank you for your enquiry about a website. To prepare the right proposal, could you share what your business does, how many pages you expect, and any features you need?`,
`Namaste {{customer_name}} ji, website ki enquiry ke liye dhanyavaad. Sahi proposal banane ke liye aap bata dijiye ki aapka business kya karta hai, lagbhag kitne pages chahiye aur kaunse features zaroori hain.`),
  WE("Website – gentle follow-up",
`Hi {{customer_name}}, just checking in on your website requirement. Do you have any questions I can help with? I'm happy to arrange a quick call at your convenience.`,
`Namaste {{customer_name}} ji, aapki website requirement ke baare mein follow-up kar raha tha. Koi sawal ho to bataiye. Aapke convenience par ek chhoti call bhi arrange kar sakta hoon.`),
  WE("Website – design preferences",
`Hello {{customer_name}}, to guide the design, could you share 2–3 websites you like and what you like about them? It helps us understand your taste.`,
`Namaste {{customer_name}} ji, design ki direction ke liye aap 2-3 aisi websites share kar dijiye jo aapko pasand hain aur unmein kya pasand hai. Isse hume aapki pasand samajhne mein madad milegi.`),

  AD("App – first follow-up",
`Hello {{customer_name}}, thank you for discussing your app idea. To prepare an estimate, could you share the main things users should be able to do in the app, and whether you need Android, iPhone or both?`,
`Namaste {{customer_name}} ji, app idea ke baare mein baat karne ke liye dhanyavaad. Estimate banane ke liye aap bata dijiye ki users app mein mukhya kya-kya kar sakenge, aur Android, iPhone ya dono chahiye.`),
  AD("App – publishing guidance",
`Hi {{customer_name}}, regarding publishing: we can guide you through the Google Play / App Store process. The developer accounts are best created in your own name. Approval and fees are decided by the stores.`,
`Namaste {{customer_name}} ji, publishing ke baare mein: hum Google Play / App Store ke process mein guide kar sakte hain. Developer account aapke apne naam par banana best rehta hai. Approval aur fees stores tay karte hain.`),
  AD("App – idea confidentiality question",
`Hello {{customer_name}}, thank you for trusting us with your idea. Regarding confidentiality, I'll confirm with our team how we can document this and get back to you.`,
`Namaste {{customer_name}} ji, apna idea hum par bharosa karke share karne ke liye dhanyavaad. Confidentiality ke baare mein main team se confirm karke aapko batata hoon ki hum ise kaise document kar sakte hain.`, true),

  RR("Requirements checklist – website",
`Hello {{customer_name}}, to prepare your quotation, please share: 1) business name and what you do, 2) the pages you need, 3) any features (contact form, payments, booking, etc.), 4) your logo and content if ready, 5) your expected launch date.`,
`Namaste {{customer_name}} ji, quotation banane ke liye kripya share kijiye: 1) business ka naam aur kaam, 2) kaunse pages chahiye, 3) koi features (contact form, payment, booking aadi), 4) logo aur content agar tayar hai, 5) launch ki expected date.`),
  RR("Requirements checklist – app",
`Hello {{customer_name}}, for your app estimate, please share: 1) who will use the app, 2) the top 5 features, 3) Android / iPhone / both, 4) whether you need an admin panel, 5) any apps you like as a reference, 6) your target launch date.`,
`Namaste {{customer_name}} ji, app estimate ke liye kripya share kijiye: 1) app kaun use karega, 2) top 5 features, 3) Android / iPhone / dono, 4) admin panel chahiye ya nahi, 5) koi reference apps jo pasand hain, 6) target launch date.`),
  RR("Requirements checklist – e-commerce",
`Hello {{customer_name}}, for your online store, please share: 1) what products you sell and roughly how many, 2) payment methods you want, 3) shipping/delivery needs, 4) whether you need an admin panel, 5) your launch date.`,
`Namaste {{customer_name}} ji, online store ke liye kripya share kijiye: 1) aap kya products bechte hain aur lagbhag kitne, 2) kaunse payment methods chahiye, 3) shipping/delivery ki zaroorat, 4) admin panel chahiye ya nahi, 5) launch date.`),

  RW("Asking for reference websites",
`Hello {{customer_name}}, could you share 2–3 websites that you like (any industry)? Please also tell me what you like in each — layout, colours, or features.`,
`Namaste {{customer_name}} ji, aap 2-3 aisi websites share kar dijiye jo aapko pasand hain (kisi bhi industry ki). Saath mein bataiye ki unmein kya pasand hai — layout, colours ya features.`),
  RW("Sharing approved samples",
`Hi {{customer_name}}, as discussed, here are some relevant examples from our team: {{website_url}}. Please share your feedback and I'll tailor the suggestion to your needs.`,
`Namaste {{customer_name}} ji, jaisa baat hui thi, hamari team ke kuch relevant examples ye hain: {{website_url}}. Apna feedback bataiye, main aapki zaroorat ke hisaab se suggestion banaunga.`, true),
  RW("Competitor reference request",
`Hello {{customer_name}}, are there any competitor websites you'd like us to look at? It helps us understand what to keep similar and what to do differently.`,
`Namaste {{customer_name}} ji, kya koi competitor websites hain jo aap humein dikhana chahte hain? Isse hum samajh paate hain ki kya similar rakhna hai aur kya alag.`),

  PF("Proposal sent – check-in",
`Hello {{customer_name}}, I've shared the proposal for your {{service}} project. Please let me know if any part needs clarity — I'm happy to walk you through it on a short call.`,
`Namaste {{customer_name}} ji, aapke {{service}} project ka proposal maine share kar diya hai. Koi hissa clear na ho to bataiye — main chhoti call par samjha sakta hoon.`),
  PF("Proposal – second follow-up",
`Hi {{customer_name}}, following up on the proposal. If you'd like any changes in scope or timeline, tell me and I'll take it to the team.`,
`Namaste {{customer_name}} ji, proposal par follow-up kar raha tha. Scope ya timeline mein koi badlav chahiye to bataiye, main team se baat karunga.`),
  PF("Proposal – decision support",
`Hello {{customer_name}}, to help you decide, I can prepare a short comparison of the options we discussed. Shall I send it?`,
`Namaste {{customer_name}} ji, decision mein help ke liye main un options ki ek chhoti comparison bana sakta hoon. Bhej doon?`),

  MC("Meeting confirmation",
`Hello {{customer_name}}, confirming our meeting on {{date}} at {{time}}. Link: {{meeting_link}}. Please reply to confirm. — {{employee_name}}, Nextrova Labs`,
`Namaste {{customer_name}} ji, hamari meeting {{date}} ko {{time}} baje confirm hai. Link: {{meeting_link}}. Kripya confirm kar dijiye. — {{employee_name}}, Nextrova Labs`),
  MC("Meeting rescheduled",
`Hello {{customer_name}}, as requested, our meeting is moved to {{date}} at {{time}}. Link: {{meeting_link}}. Thank you for letting us know.`,
`Namaste {{customer_name}} ji, aapke kehne par hamari meeting ab {{date}} ko {{time}} baje hai. Link: {{meeting_link}}. Batane ke liye dhanyavaad.`),
  MC("Meeting agenda",
`Hello {{customer_name}}, for our meeting on {{date}}, we'll cover: your goals, key features, a rough plan and next steps. Please keep any content, logo or references handy.`,
`Namaste {{customer_name}} ji, {{date}} ki meeting mein hum cover karenge: aapke goals, mukhya features, ek rough plan aur agle steps. Kripya content, logo ya references taiyaar rakhein.`),

  MR("Reminder – day before",
`Hello {{customer_name}}, a gentle reminder about our meeting tomorrow ({{date}}) at {{time}}. Link: {{meeting_link}}. See you then!`,
`Namaste {{customer_name}} ji, kal ({{date}}) {{time}} baje hamari meeting ka yaad dila raha hoon. Link: {{meeting_link}}. Milte hain!`),
  MR("Reminder – 1 hour before",
`Hi {{customer_name}}, our meeting starts in about an hour ({{time}}). Link: {{meeting_link}}.`,
`Namaste {{customer_name}} ji, hamari meeting lagbhag ek ghante mein ({{time}}) shuru hogi. Link: {{meeting_link}}.`),
  MR("Missed meeting – reschedule",
`Hello {{customer_name}}, we missed you in today's meeting. No problem — please share a time that suits you and we'll reschedule.`,
`Namaste {{customer_name}} ji, aaj ki meeting mein aap nahi aa paaye. Koi baat nahi — aap apna suitable time bata dijiye, hum reschedule kar lenge.`),

  TY("Thank you after a call",
`Hello {{customer_name}}, thank you for your time today. As discussed, I'll share the next steps shortly. Please feel free to message me with any questions. — {{employee_name}}`,
`Namaste {{customer_name}} ji, aaj samay dene ke liye dhanyavaad. Jaisa baat hui, main agle steps jaldi share karunga. Koi sawal ho to message kijiye. — {{employee_name}}`),
  TY("Thank you after a meeting",
`Hi {{customer_name}}, thank you for the meeting. I'll send a summary of what we discussed and the next steps today.`,
`Namaste {{customer_name}} ji, meeting ke liye dhanyavaad. Aaj hi main discussion ka summary aur agle steps bhej dunga.`),
  TY("Thank you for sharing requirements",
`Hello {{customer_name}}, thank you for sharing your requirements. Our team will review them and I'll get back to you with the next step.`,
`Namaste {{customer_name}} ji, requirements share karne ke liye dhanyavaad. Hamari team review karegi aur main aapko agle step ke saath wapas contact karunga.`),

  NI("Polite closure – not interested",
`Hello {{customer_name}}, thank you for letting us know. We respect your decision. If you need help in the future, you're always welcome to contact us. Wishing you all the best!`,
`Namaste {{customer_name}} ji, batane ke liye dhanyavaad. Hum aapke decision ka samman karte hain. Future mein kabhi zaroorat ho to zaroor contact kijiye. Aapko shubhkamnayein!`),
  NI("Closure – chose another provider",
`Hello {{customer_name}}, thank you for considering us. We wish you success with your project. If anything changes, we'd be glad to help.`,
`Namaste {{customer_name}} ji, hume consider karne ke liye dhanyavaad. Aapke project ke liye shubhkamnayein. Kuch badle to hum madad ke liye taiyaar hain.`),
  NI("Respecting a do-not-contact request",
`Understood, {{customer_name}}. I will not contact you further. Thank you for your time.`,
`Samajh gaya {{customer_name}} ji. Main aapko ab contact nahi karunga. Samay dene ke liye dhanyavaad.`),

  RC("Reconnecting after a few weeks",
`Hello {{customer_name}}, it's {{employee_name}} from Nextrova Labs. We spoke earlier about your {{service}} project. I wanted to check if you'd like to continue the discussion.`,
`Namaste {{customer_name}} ji, main {{employee_name}}, Nextrova Labs se. Pehle aapke {{service}} project ke baare mein baat hui thi. Maine socha poochun ki kya aap charcha aage badhana chahenge.`),
  RC("Reconnecting – new information",
`Hi {{customer_name}}, I'd like to share a short update that may be relevant to your {{service}} plans. Would you like me to send it?`,
`Namaste {{customer_name}} ji, main ek chhota update share karna chahta hoon jo aapke {{service}} plans ke liye relevant ho sakta hai. Bhej doon?`),
  RC("Reconnecting – project on hold",
`Hello {{customer_name}}, hope all is well. When you had paused your {{service}} project, we agreed to reconnect. Is this a good time to pick it up again?`,
`Namaste {{customer_name}} ji, umeed hai sab theek hoga. Jab aapne {{service}} project rok rakha tha, tab hamne baad mein baat karne ko kaha tha. Kya ab dobara shuru karne ka sahi samay hai?`),
];
