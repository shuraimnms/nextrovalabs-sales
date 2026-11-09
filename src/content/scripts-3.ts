import { mk, type SeedScript } from "./types";

// ───────── J. Advanced Sales Conversations ─────────
const J = mk("advanced-conversations", "GENERAL", "BUSINESS_UNDERSTANDING", "ADVANCED");
const JB = mk("advanced-conversations", "GENERAL", "BUDGET_DISCUSSION", "ADVANCED");
const JO = mk("advanced-conversations", "GENERAL", "OBJECTION_HANDLING", "ADVANCED");
const JF = mk("advanced-conversations", "GENERAL", "FEATURE_DISCUSSION", "ADVANCED");

export const advancedScripts: SeedScript[] = [
  J("Consultative opener: diagnose before you prescribe", "Customer already has a solution in mind ('Mujhe app chahiye').",
`Sir, app ek achha option ho sakta hai. Main pehle samajhna chahta hoon ki aapke customers abhi kis tarah se aapse judte hain aur kahan dikkat aa rahi hai.

Uske baad hum dekhenge ki app, website ya dono mein se kya aapke liye sahi hai.`,
`Sir, kabhi kabhi website se hi kaam ho jata hai aur kabhi app ki zaroorat padti hai. Aapki problem jaanne ke baad main honestly suggest karunga.`,
`An app can be a good option. First I'd like to understand how customers reach you today and where the friction is. Then we can see whether an app, a website or both are right.`,
"Consultative selling = diagnose first. Being willing to recommend the smaller solution builds deep trust.",
"Don't automatically sell the bigger option. Don't criticise their idea."),

  J("Value-based framing without making promises", "Explain value in the customer's own terms.",
`Sir, aapne bataya ki abhi aapko roz kai orders WhatsApp par manually sambhalne padte hain.

Ek system se wahi kaam organised ho sakta hai, jisse aapka time bachega aur galtiyan kam hongi. Aapke hisaab se aapka sabse bada time kahan jaata hai?`,
`Sir, hum feature nahi, aapka problem solve karna chahte hain. Aap bataiye abhi kaunsa kaam sabse zyada time leta hai?`,
`You mentioned handling many orders manually on WhatsApp. A system could organise that, saving time and reducing errors. Where does most of your time go today?`,
"Use the customer's own words and pain. Say 'can help' and 'could save' — never state numbers you can't prove.",
"No invented ROI figures, no revenue claims, no 'aapki sales double ho jayegi'."),

  J("Requirement clarification loop", "The customer's requirement is vague.",
`Sir, main apni samajh confirm karna chahta hoon. Aapne kaha 'ek aisa system jo sab handle kare'. Kya aap ek example de sakte hain ki ek din mein kya hota hai — start se end tak?

Main wahi step-by-step likh leta hoon.`,
`Sir, chaliye ek real example lete hain — kal aapne kya kya kiya jo is software se aasan ho sakta tha?`,
`Let me confirm my understanding. You said 'a system to handle everything'. Could you walk me through a typical day, start to finish? I'll note each step.`,
"Ask for a real example. Concrete stories reveal real requirements. Write while they speak.",
"Don't say 'samajh gaya' when you haven't. Don't fill gaps with assumptions."),

  JB("Budget alignment: the three-option approach", "Customer's budget and expectation don't match.",
`Sir, main aapko teen options dikhata hoon: ek essentials-only, ek balanced, aur ek full-featured. Har option mein kya milega aur kya baad mein add ho sakta hai, woh clearly hoga.

Isse aap apne budget ke hisaab se choose kar payenge.`,
`Sir, ek hi quotation dene ki bajay hum options dete hain taaki aap comfortable decision le sakein.`,
`I'll show you three options — essentials, balanced and full-featured — with what's included and what can be added later. You can choose what fits your budget.`,
"Options give the customer control and reduce price resistance. The team prepares the numbers; you present the structure.",
"Don't invent option prices. Don't make the cheapest option look useless."),

  J("Technical explanation in simple language: API", "Customer asks 'API kya hota hai?'",
`Sir, API ko aap waiter samajhiye. Aap restaurant mein khana order karte hain, waiter kitchen tak aapka order pahunchata hai aur khana wapas laata hai.

Waise hi API ek software ka order doosre software tak pahunchati hai — jaise aapke app ka payment gateway se jodna.`,
`Sir, API ek bridge hai jo do systems ko aapas mein baat karne deta hai. Isse aapki website payment ya courier jaise services use kar pati hai.`,
`Think of an API as a waiter: it carries your order to the kitchen and brings the food back. Likewise it carries a request from one software to another — like connecting your app to a payment gateway.`,
"Analogy first, definition second. Stop talking after the analogy and check understanding.",
"Don't use jargon-heavy answers. Don't talk down to the customer."),

  J("Technical explanation: hosting and domain", "Customer confuses hosting, domain and website.",
`Sir, domain aapka address hai, hosting aapka plot, aur website aapka ghar. Teeno milkar aapki online presence banate hain.

Hum aapko batayenge ki kaunsa plot aur address aapke ghar ke liye sahi hai.`,
`Sir, domain ko number plate, hosting ko parking aur website ko car samajhiye. Teeno alag hote hain par saath mein chalte hain.`,
`The domain is your address, hosting is the plot, and the website is the house. Together they make your online presence.`,
"Pick the analogy the customer relates to best (property, vehicle, shop).",
"Don't promise hosting prices or specifications."),

  JO("Professional negotiation: trade scope, not worth", "Customer pushes hard for a lower price.",
`Sir, main aapki budget ki limit samajhta hoon. Price ko kam karne ke liye hum scope adjust kar sakte hain — jaise kuch features baad mein ya kam pages.

Aap bataiye kaunsi cheez aapke liye sabse kam important hai, hum usse shuru karenge.`,
`Sir, main team se baat karta hoon ki aapke budget mein sabse zyada value kaise di ja sakti hai. Aap bas priority batayein.`,
`I understand your budget limit. To lower the price we can adjust scope — some features later, or fewer pages. Tell me what matters least to you and we'll begin there.`,
"Negotiate by trading scope. Any actual price concession needs management approval — say you'll check.",
"Don't concede on the spot. Don't devalue the work ('woh to easy hai')."),

  J("Handling an indecisive customer", "Customer keeps changing mind or delaying.",
`Sir, lagta hai aap kuch options ke beech soch rahe hain. Chaliye main ek chhota decision framework deta hoon: aapka goal, aapka budget aur aapki timeline.

Teeno ko dekhkar hum ek simple next step decide kar sakte hain — jaise ek paid ya free discovery meeting.`,
`Sir, sab kuch ek saath decide karna zaroori nahi. Sabse chhota agla step kya ho sakta hai jo aapko comfortable lage?`,
`It sounds like you're weighing a few options. Let's use goal, budget and timeline to find one small next step you're comfortable with.`,
"Reduce the decision to a small, low-risk next step. Don't offer a 'paid' step unless the company has that policy.",
"Don't pressure. Don't say 'jaldi decide kijiye'."),

  J("Website or app — honest comparison", "Customer unsure whether they need a website or an app.",
`Sir, website ko koi bhi browser se khol sakta hai, jabki app phone par install karna padta hai. Agar aapka goal naye customers tak pahunchna hai to website pehle better rehti hai.

Agar aapke paas pehle se regular customers hain jo baar-baar aate hain, to app helpful ho sakta hai. Aapka case kaunsa hai?`,
`Sir, mere hisaab se pehle website se shuru karke baad mein app add karna kai businesses ke liye practical hota hai. Aapki situation ke hisaab se hum decide karenge.`,
`A website opens in any browser; an app must be installed. If you want to reach new customers, a website usually comes first. If you have repeat customers, an app can help. Which fits you?`,
"This is the 'honest advisor' moment. Customers remember when you recommend the smaller option.",
"Don't push the costlier option. Don't say one is 'outdated'."),

  JF("Phased roadmap for a big idea", "Customer wants a large, complex product.",
`Sir, aapka idea kaafi bada hai, jo achha hai. Ek bada project ek saath banane ki bajay hum use phases mein baant sakte hain: Phase 1 mein core features, Phase 2 mein advanced, Phase 3 mein growth features.

Isse risk kam hota hai aur har phase ke baad aap feedback le sakte hain.`,
`Sir, hum ek roadmap bana lete hain jisme har phase ka goal clear ho. Aap pehle phase ko approve karke aage badh sakte hain.`,
`Your idea is substantial, which is great. Instead of building everything at once, we can split it into phases — core first, then advanced, then growth. That lowers risk and lets you learn from users.`,
"Large scopes need a roadmap. Ask the customer to describe Phase 1 only.",
"Don't promise the whole vision in one go. Don't give timelines per phase without team input.", true),

  JO("Handling a technical customer", "Customer is an engineer/IT person and asks deep questions.",
`Sir, aapke technical sawal valid hain. Main aapko sahi aur detailed jawab dene ke liye apne technical team member ko is call mein judna chahunga.

Kya aap apne questions ek list mein bhej sakte hain? Hum aapko written answers denge.`,
`Sir, aap jo technology stack ya architecture jaanna chahte hain, uske baare mein hamare technical lead se baat karwa deta hoon.`,
`Those are valid technical questions. To give accurate answers I'd like our technical team member to join. Could you send your questions as a list? We'll answer in writing.`,
"Never bluff on technical detail. Offering a technical colleague earns respect. Don't claim technologies not verified.",
"Never invent technical specifications. Never claim certifications."),

  JO("Handling an unrealistic timeline demand", "Customer wants a big project in a very short time.",
`Sir, aapki urgency main samajhta hoon. Ek quality product jaldbaazi mein banane se baad mein problems aa sakti hain.

Agar aapki date fixed hai to hum core features ke saath ek first version us date tak target kar sakte hain, aur baaki baad mein. Main team se confirm karke bataunga ki kya possible hai.`,
`Sir, main galat commitment nahi karna chahta. Aap bataiye kaunse features us date tak zaroori hain, uske hisaab se hum realistic plan banayenge.`,
`I understand the urgency. Rushing can create problems later. If your date is fixed, we could target a first version with core features by then and add the rest later — I'll confirm with the team what's possible.`,
"Hold the line on honesty. Offer a phased first release. Verify with the team before promising a date.",
"Never agree to an impossible date to win the deal.", true),

  J("Handling a very skeptical or negative customer", "Customer had a bad experience with another developer.",
`Sir, aapke saath jo hua uske liye mujhe afsos hai. Aise experience ke baad shak hona natural hai.

Main chahunga ki aap kam se kam ek baar humse puchkar dekhein ki hum kaise kaam karte hain. Aapko sabse zyada kya dikkat aayi thi pichhli baar? Hum us par khaas dhyaan denge.`,
`Sir, aapki pichhli problem kya thi — delay, communication ya quality? Main aapko honestly bataunga ki hum us par kya kar sakte hain.`,
`I'm sorry about your experience; skepticism is natural. I'd like to hear what went wrong last time — delays, communication or quality — and explain honestly how we'd handle it.`,
"Listen fully before responding. Turn their bad experience into a checklist of what you'll do differently — only promise what is true.",
"Never badmouth the previous vendor. Never over-promise to 'make up' for them."),

  J("Re-anchoring on business outcomes", "Conversation is stuck on features and tools.",
`Sir, features ki list kaafi lambi ho gayi hai. Ek second ruk kar main puchna chahta hoon — agar yeh project successful ho gaya to aapke business mein kya badlega?

Main us outcome ko dhyan mein rakhkar hi features suggest karunga.`,
`Sir, success ka matlab aapke liye kya hai — kam time lagna, zyada customers ya behtar organisation?`,
`Our feature list has grown long. If this project succeeds, what changes in your business? I'll keep that outcome in mind when suggesting features.`,
"Pull the conversation back to the outcome. It makes the later prioritisation easy.",
"Don't promise the outcome — you are clarifying their goal, not guaranteeing results."),
];
