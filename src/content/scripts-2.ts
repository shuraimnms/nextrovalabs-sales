import { mk, type SeedScript } from "./types";

// ───────── D. E-commerce ─────────
const D = mk("ecommerce-development", "ECOMMERCE", "REQUIREMENT_DISCOVERY", "BEGINNER");
const DF = mk("ecommerce-development", "ECOMMERCE", "FEATURE_DISCUSSION", "INTERMEDIATE");

export const ecommerceScripts: SeedScript[] = [
  D("What are you selling?", "Start e-commerce discovery with products and customers.",
`Sir, aap online kya bechna chahte hain, aur aapke products kitne hain — 20-30, ya sau se zyada?

Aur abhi aap offline ya Instagram/WhatsApp par bech rahe hain kya?`,
`Sir, aapke products ke baare mein bataiye — type, quantity aur customers kaun hain. Isse hum store ki structure plan kar payenge.`,
`What will you sell online, and roughly how many products — a few dozen or hundreds? Are you currently selling offline or through Instagram/WhatsApp?`,
"Number of products and variants drive catalogue and admin scope. Existing selling channels tell you how mature the business is.",
"Don't assume a huge catalogue. Don't promise marketplace listing unless scoped."),

  D("Product categories and variants", "Understand sizes, colours and attributes.",
`Sir, kya aapke products mein sizes, colours ya aur options hote hain — jaise T-shirt ke sizes ya mobile ke storage variants?

Aur products kitni categories mein baante hain?`,
`Sir, ek product ke kitne tarah ke options hote hain? Isse inventory aur product page ka design decide hota hai.`,
`Do your products come in sizes, colours or other options? And how many categories do they fall into?`,
"Variants complicate inventory and pricing — capture one example product in detail.",
"Don't say 'variants unlimited ho jayenge' without scoping."),

  DF("Inventory and stock management", "Discuss stock tracking.",
`Sir, stock aap kaise manage karte hain — Excel mein, software mein ya manually?

Website par stock automatically kam ho aur 'Out of stock' dikhe, aisa chahiye kya?`,
`Sir, kya aapke paas stock alag-alag jagah — jaise dukaan aur godown — mein rehta hai? Uske hisaab se inventory system plan karna padega.`,
`How do you manage stock today — Excel, software or manually? Would you like the website to update stock automatically and show 'Out of stock'?`,
"Ask about multi-location stock early — it changes the architecture.",
"Don't promise sync with offline billing software without checking."),

  DF("Checkout and online payments", "Explain checkout flow and payment gateway.",
`Sir, checkout par customer kaunse payment options chahega — UPI, card, net banking ya Cash on Delivery?

Online payment ke liye payment gateway ka account lagta hai, jiske apne charges hote hain jo gateway company leti hai.`,
`Sir, kya aapke paas pehle se Razorpay, PayU ya koi payment account hai? Agar nahi, to hum aapko process samjha denge.`,
`Which payment options should customers see at checkout — UPI, cards, net banking, Cash on Delivery? A payment gateway account is needed, and its fees are set by the gateway provider.`,
"Be explicit that gateway fees and approvals are the provider's. Nextrova does not collect customer money on the business's behalf.",
"Don't name a gateway as 'best' or quote its rates."),

  DF("Shipping and delivery", "Discuss courier, delivery charges and areas.",
`Sir, delivery aap kaise karte hain — apni delivery ya courier partner se?

Shipping charges fixed rakhne hain, weight ke hisaab se, ya free delivery ek minimum order par?`,
`Sir, kya aap poore India mein deliver karenge ya sirf kuch cities mein? Uske hisaab se shipping ka logic set hota hai.`,
`How will you deliver — your own fleet or a courier partner? Should shipping be flat, weight-based, or free above a minimum order?`,
"Courier integrations depend on the courier's tools — verify before promising a specific partner.",
"Don't promise integration with a named courier without checking."),

  DF("Order tracking for customers", "Explain order status updates.",
`Sir, customer ko order ka status — jaise Confirmed, Packed, Shipped, Delivered — dikhna chahiye, aur kya email/WhatsApp par update bhi chahiye?`,
`Sir, order ke baad customers ko baar-baar poochna na pade, isliye status tracking kaafi helpful hoti hai. Aap kya level ki tracking chahenge?`,
`Customers should see order status — Confirmed, Packed, Shipped, Delivered. Would you also like email or WhatsApp updates?`,
"Position tracking as 'fewer support calls' for them. Automated WhatsApp messages typically need an approved provider — mention it needs checking.",
"Don't promise automatic WhatsApp sending without confirming the provider and approvals."),

  DF("Discounts, coupons and offers", "Discuss promotions.",
`Sir, kya aap coupon codes, festival offers ya minimum order discount chalana chahte hain?

Agar haan, to admin panel se aap khud offers bana sakte hain.`,
`Sir, aap kaunse offers sabse zyada chalate hain — percentage discount, flat discount ya free shipping?`,
`Do you plan coupons, festival offers or minimum-order discounts? If so, admin tools can let you create offers yourself.`,
"Offers are a common reason merchants want an admin panel; link them.",
"Don't promise advanced automated offers (like buy-X-get-Y) without scoping."),

  DF("Admin features for the store owner", "Clarify what the owner needs to manage.",
`Sir, store owner ke taur par aapko kya kya control chahiye — products add karna, orders dekhna, refund karna, reports dekhna?

Admin dashboard ek jagah se sab manage karne mein help karta hai.`,
`Sir, aapka staff bhi admin panel use karega kya? Agar haan, to alag-alag access levels bhi rakh sakte hain.`,
`As the store owner, what do you need to manage — products, orders, refunds, reports? An admin dashboard lets you handle all of it in one place.`,
"Ask about staff roles. Reports are scoped — don't promise 'complete analytics'.",
"Don't promise accounting-grade reports unless scoped."),

  D("Existing store or marketplace sellers", "Customer already sells on Amazon/Flipkart/Instagram.",
`Sir, aap pehle se marketplace ya Instagram par bech rahe hain, ye achhi baat hai.

Apni khud ki website ka fayda ye hota hai ki brand aapka hota hai aur customer data aapke control mein rehta hai. Kya aap dono par bechna chahenge?`,
`Sir, kya aap marketplaces se apni website par customers ko laana chahte hain? Hum website ko usi hisaab se plan kar sakte hain.`,
`Since you already sell on marketplaces or Instagram, your own website gives you brand control and ownership of your customer relationships. Do you plan to sell on both?`,
"Respect their current channels; present the website as an addition, not a replacement.",
"Don't criticise marketplaces. Don't promise marketplace sync without scoping."),

  DF("Returns, refunds and policies", "Ensure policy pages and flows are planned.",
`Sir, aapki return aur refund policy kya hai? Website par uske liye alag page aur request form ban sakta hai.

Policy aap decide karenge, hum use website mein properly dikha denge.`,
`Sir, kya aap return accept karte hain, kitne din ke andar? Yeh details customer ka bharosa badhati hain.`,
`What's your returns and refund policy? We can add a policy page and a return request form — the policy itself is yours to decide.`,
"Policies are the business owner's decision. Only implement what they define.",
"Don't write legal policies as legal advice. Suggest they confirm legal wording with their advisor."),

  DF("Invoices and tax details", "Customer asks about GST invoices.",
`Sir, invoice mein kaunse details dikhane hain — business name, address, tax details — yeh aapke CA ya accountant se confirm kar lena better hai.

Jo format wo bataenge, hum usi ke hisaab se invoice setup ko plan kar sakte hain.`,
`Sir, kya aapko order ke baad automatic invoice PDF chahiye? Tax rules ke liye aap apne accountant se confirm kar lijiye, hum technical side dekhenge.`,
`Please confirm the exact invoice and tax details with your accountant; we can plan the technical invoice setup around their format.`,
"Do NOT give tax or GST advice. Position yourself as the technical side only.",
"Never say 'GST automatically sahi ho jayega'. Never advise on tax rates."),

  D("Store launch plan and first products", "Help the customer think about launch readiness.",
`Sir, launch ke liye aapko sabse pehle kaunse 10-20 products live karne hain? Unki photos aur descriptions taiyaar hain?

Chhote se start karke baad mein catalogue badhana ek practical approach hoti hai.`,
`Sir, kya aap soft launch karna chahenge, thode customers ke saath test karke? Isse chhoti galtiyan pehle hi pakad mein aa jaati hain.`,
`Which 10–20 products do you want live first, and are photos and descriptions ready? Starting small and growing the catalogue is practical.`,
"Content (photos, descriptions) is again the bottleneck. Encourage a small, clean first catalogue.",
"Don't promise a launch date before content is available."),
];

// ───────── E. Pricing Conversations ─────────
const E = mk("pricing-conversations", "GENERAL", "BUDGET_DISCUSSION", "INTERMEDIATE");

export const pricingScripts: SeedScript[] = [
  E("Explaining that quotes are custom", "Customer asks 'Rate kitna hai?' at the start.",
`Sir, har project ki requirement alag hoti hai — pages, features, design aur integrations ke hisaab se cost badalti hai.

Isliye main fix rate batane ki bajay pehle aapki requirement samajh lena chahta hoon, phir hamari team aapko clear quotation degi. 2-3 sawal puch sakta hoon?`,
`Sir, jaise ghar banane ka cost design par depend karta hai, waise hi website/app ka cost bhi scope par depend karta hai. Aap bata dijiye kya chahiye, main sahi quotation arrange karwa dunga.`,
`Every project is different — cost depends on pages, features, design and integrations. Rather than a random figure, I'd like to understand your needs so our team can give a proper quotation. May I ask two or three questions?`,
"NEVER state a price from memory. Convert the price question into a discovery question. Use the home-building analogy once.",
"Do not say 'sasta hai' or 'bahut kam mein ho jayega'. Do not quote 'starting from' numbers — none are approved."),

  E("Asking for budget range politely", "You need an idea of budget to scope realistically.",
`Sir, taaki main aapko aisi suggestion dun jo aapke budget mein fit ho, kya aap bata sakte hain ki aap kis range ke aas-paas sochkar chal rahe hain?

Agar abhi clear nahi hai, to koi baat nahi — hum multiple options bana sakte hain.`,
`Sir, aapne is project ke liye kuch budget socha hua hai? Ek approximate range bhi chalega, isse hum waste nahi karenge aur sahi plan denge.`,
`To suggest something that fits, may I ask roughly what budget range you have in mind? If it isn't clear yet, we can prepare a few options.`,
"Frame the question as helping THEM. Offer 'approximate range'. If they refuse, move on gracefully and offer options.",
"Don't push or insist on a number. Don't reveal other clients' budgets."),

  E("When the customer says 'You tell me the price first'", "Customer refuses to share budget.",
`Sir, bilkul theek hai. Main ek chhota sa sawal puchta hoon — agar do tarah ke options hon, ek basic aur ek advanced, to aap kis direction mein sochna pasand karenge?

Uske baad hamari team aapko detailed quotation bhejegi, jisme options clearly honge.`,
`Sir, main aapko ek hi fix number bata dunga to wo aapke liye shayad sahi na ho. Isliye hum 2 options ka quotation denge — aap compare kar sakte hain.`,
`That's fine, Sir. If there were two options — a basic and an advanced one — which direction appeals to you? Our team will then send a quotation with clear options you can compare.`,
"Switch from 'one price' to 'options'. Options let the customer self-select a budget level without revealing it.",
"Don't invent a ballpark number to 'break the ice'."),

  E("Explaining why cost varies", "Customer compares with someone's cheaper quote.",
`Sir, cost kai cheezon par depend karti hai — design ki quality, features, security, testing aur support.

Do quotations compare karte waqt dekhna zaroori hai ki dono mein kya-kya shamil hai. Agar aap chahein to main aapko ek checklist de sakta hoon.`,
`Sir, do websites bahar se ek jaisi dikh sakti hain par andar ki quality alag ho sakti hai. Isliye scope compare karna zyada important hai.`,
`Cost depends on design quality, features, security, testing and support. When comparing quotes, check what each includes. I can share a checklist if you'd like.`,
"Be factual, not defensive or negative about competitors. A comparison checklist positions you as helpful.",
"Do not trash other companies. Do not claim 'hum best quality dete hain' without substance."),

  E("Phased approach to fit a budget", "Budget is lower than the full requirement.",
`Sir, main samajh sakta hoon. Ek tareeka yeh hai ki hum pehle phase mein sirf zaroori features banayein, aur baaki features baad mein add karein.

Isse aapki shuruaati investment kam rehti hai aur kaam bhi shuru ho jata hai.`,
`Sir, aap hume 3-4 sabse zaroori features bataiye. Unse hum Phase 1 design kar denge, aur baaki Phase 2 mein rakhenge.`,
`I understand. One approach is to build only the essential features first and add the rest later. That keeps the initial investment lower and gets you started.`,
"This mirrors the approved objection-handling pattern: essential features first, additional features later.",
"Don't say 'discount dunga'. Phasing is about scope, not price cuts."),

  E("Setting expectations before sending a quote", "Prepare the customer for the quotation process.",
`Sir, requirement samajhne ke baad hamari team ek written quotation tayaar karegi jisme scope, features aur timeline clearly likhi hongi.

Aapko kis format mein chahiye — WhatsApp par ya email par?`,
`Sir, quotation ke baad aap koi bhi sawal puch sakte hain. Hum chahte hain ki aap poori tarah clear hokar decision lein.`,
`Once I understand your needs, our team will prepare a written quotation with scope, features and timeline. Would you like it on WhatsApp or email?`,
"Promise only what the team will actually do, and by when. Confirm delivery channel.",
"Don't promise a quote within a specific time unless you've checked with the team."),

  E("Payment terms and milestones", "Customer asks how payments are made.",
`Sir, payment ka structure project ke scope par depend karta hai, aur woh quotation mein clearly likha hota hai.

Main aapko exact terms quotation ke saath confirm kar dunga, taaki koi confusion na rahe.`,
`Sir, payment terms hamari team finalise karti hai aur woh written mein hote hain. Aapko kisi bhi stage par kuch unclear lage to aap puch sakte hain.`,
`Payment structure depends on project scope and is written clearly in the quotation. I'll confirm the exact terms with the quote so there's no confusion.`,
"Payment terms are a company policy — do not invent milestones or percentages. Defer to the written quotation.",
"Never state advance percentages, refund terms or GST unless admin has approved them.", true),

  E("Customer asks for a ballpark price", "Customer insists: 'Approx to bata do'.",
`Sir, main aapki baat samajhta hoon. Bina requirement jaane main koi number bataunga to wo galat ho sakta hai — kabhi bahut kam, kabhi bahut zyada.

Agar aap 5 minute dein to main requirements note karke senior team se ek realistic range confirm karwa deta hoon.`,
`Sir, main galat figure nahi dena chahta. Aap chahein to hum 10 minute ki ek short meeting kar lein, usme hum aapko clear picture de denge.`,
`I understand, Sir. Without knowing your requirements, any number I give could be wrong — too low or too high. If you give me five minutes, I'll note the requirements and get a realistic range confirmed by our senior team.`,
"Offer a path to a real number (senior team / short meeting) rather than guessing. Customers respect honesty.",
"Don't throw out an 'approx' figure to end the pressure."),

  E("Quotation validity and changes", "Customer asks whether the quote can change.",
`Sir, agar requirement change hoti hai — jaise naye features ya pages — to scope ke hisaab se quotation update hoti hai.

Isliye shuru mein hi requirement jitni clear ho, utna better hai.`,
`Sir, scope fix hone par quotation fix rehti hai. Kuch add hota hai to uska alag estimate hum pehle batate hain.`,
`If requirements change — new features or pages — the quotation is updated to match. The clearer the scope up front, the fewer surprises later.`,
"Explain scope-change handling transparently; this is a trust-builder.",
"Don't promise 'koi extra charge nahi lagega'."),

  E("Comparing quotes from multiple companies", "Customer holds other quotations.",
`Sir, achha hai ki aap compare kar rahe hain. Aap un quotations ka scope share kar sakte hain? Hum dekh sakte hain ki features, support aur timeline mein kya difference hai.

Aapko jo sabse zyada value de, wohi choose karna chahiye.`,
`Sir, sirf price nahi, ye bhi dekhiye ki launch ke baad support, source/ownership aur communication kaisi hogi. Main aapko puchne ke liye kuch sawal de deta hoon.`,
`It's good that you're comparing. If you share their scope, we can look at differences in features, support and timeline. Choose whoever offers you the most value.`,
"Help the customer evaluate — don't just compete on price. Offer a short list of questions to ask any vendor.",
"No negative talk about competitors. No last-minute price drops."),
];

// ───────── F. Trust Building ─────────
const F = mk("trust-building", "GENERAL", "COMPANY_INTRODUCTION", "BEGINNER");

export const trustScripts: SeedScript[] = [
  F("Introducing Nextrova Labs", "Short, verified company introduction.",
`Sir, Nextrova Labs Bengaluru-based technology company hai. Hum websites, mobile apps, AI aur cloud solutions ke saath design bhi karte hain.

Aapki requirement ke hisaab se hum ek suitable solution suggest karte hain.`,
`Sir, hum Bengaluru se kaam karte hain — web development, mobile apps, AI aur cloud mein. Hamari website nextrovalabs.in par aap overview dekh sakte hain.`,
`Nextrova Labs is a Bengaluru-based technology company working on web, mobile apps, AI/ML, cloud and design. We recommend a solution based on your requirement.`,
"Use ONLY verified facts from the official website. Keep it 2 sentences; invite them to look at the website.",
"Do not claim years of experience, number of clients/projects, awards or certifications — none are verified."),

  F("Sharing the company website", "Customer wants to verify the company.",
`Zaroor Sir, hamari website nextrovalabs.in hai — aap dekh sakte hain. Main abhi aapko WhatsApp par link bhej deta hoon.

Aap dekhkar mujhe bata dijiye ki aapko kya samajh aaya, aur koi sawal ho to puch lijiye.`,
`Sir, aap hamari official website aur contact number se verify kar sakte hain. Hum chahte hain ki aap poori tarah comfortable hokar aage badhein.`,
`Of course, Sir. Our website is nextrovalabs.in — I'll send you the link on WhatsApp right away. Please take a look and ask me anything.`,
"Welcome verification — confident people invite it. Send the link immediately.",
"Don't be offended by the request. Don't send anything you aren't sure is public and approved."),

  F("Offering a video call", "Customer wants to see the team/face.",
`Bilkul Sir, hum ek short video call fix kar sakte hain jisme aap hamari team se mil sakte hain aur apni requirement discuss kar sakte hain.

Aapko kaunsa time suit karega?`,
`Sir, aamne-saamne baat karne se clarity zyada hoti hai. Aap bataiye kal ya parson, kaunsa slot theek rahega?`,
`Absolutely, Sir. We can arrange a short video call so you can meet the team and discuss your requirement. What time suits you?`,
"A video call converts 'unknown vendor' into 'known people'. Confirm availability with a senior colleague before fixing a slot.",
"Don't promise a specific person will attend unless confirmed."),

  F("Past work and portfolio requests", "Customer asks for previous projects.",
`Sir, aapki requirement ke hisaab se relevant kaam main aapko dikhana chahunga. Main team se confirm karke approved samples aapko share kar dunga.

Taaki aapko pata chale hum kis tarah ka kaam karte hain.`,
`Sir, kaunse tarah ka project aapko dekhna hai — website, app ya e-commerce? Uske hisaab se main sahi sample arrange karta hoon.`,
`I'd like to show work relevant to your requirement. I'll confirm with the team and share approved samples so you can see our style.`,
"Only share portfolio items the admin has approved for sharing. Ask what type they want to see.",
"Do NOT name clients or show anything unapproved. Do not invent projects.", true),

  F("Explaining the working process", "Customer asks 'Kaam kaise hota hai?'",
`Sir, hum pehle aapki requirement samajhte hain, phir quotation aur plan dete hain, uske baad design aur development hota hai, aur aapke feedback ke saath final launch.

Har stage par aap hamari team se baat kar sakte hain.`,
`Sir, simple samjhaun — requirement, plan, design, development, testing aur launch. Har stage par aapki approval ke saath aage badhte hain.`,
`We start by understanding your requirement, then share a quotation and plan, followed by design and development, then testing and launch — with your feedback along the way.`,
"Keep it generic and honest. A detailed internal process is not verified — describe the typical flow only.",
"Don't promise weekly meetings, specific tools or dashboards unless confirmed.", true),

  F("Communication and who they will talk to", "Customer worries about being ignored after payment.",
`Sir, aapka yeh concern bilkul valid hai. Hum chahte hain ki aapko hamesha pata ho ki kaam kahan tak pahuncha hai.

Aapko ek point of contact milega jisse aap WhatsApp ya call par baat kar sakte hain. Exact communication process main aapko meeting mein clearly bata dunga.`,
`Sir, aap kabhi bhi apni team se poochh sakte hain ki update kya hai. Hum transparency ko priority dete hain.`,
`That's a valid concern. You'll always know where the work stands. You'll have a point of contact for WhatsApp or calls; I'll explain the exact communication process in the meeting.`,
"Acknowledge the fear before answering. Promise only a point of contact and transparency; details come from the team.",
"Don't promise 24/7 support or specific response times.", true),

  F("Confidentiality of the customer's idea", "Customer fears idea theft.",
`Sir, aapka idea aapka hai, aur hum use professionally handle karte hain.

Agar aapko formal confidentiality agreement chahiye to main team se confirm karke aapko bata dunga ki iske liye kya process hai.`,
`Sir, aap apni requirement jitni comfortable ho utni share kar sakte hain. Agar NDA zaroori lagta hai to hum us par baat kar sakte hain.`,
`Your idea is yours and we handle it professionally. If you need a formal confidentiality agreement, I'll confirm the process with the team.`,
"Take the worry seriously. Don't promise an NDA until you know the company's policy; say you'll confirm.",
"Don't promise legal protections you can't deliver.", true),

  F("'Is this a real company?' (skeptical customer)", "Customer doubts legitimacy.",
`Sir, aapka puchna bilkul sahi hai — online kaam mein check karna zaroori hai.

Aap hamari website nextrovalabs.in dekh sakte hain aur official number se confirm kar sakte hain. Main chahunga ki aap pura satisfied hokar hi aage badhein.`,
`Sir, aap koi bhi decision jaldi mat lijiye. Pehle humse video call par mil lijiye ya website dekh lijiye, phir aap tay kijiye.`,
`That's a sensible question. You can check our website, nextrovalabs.in, and confirm via our official number. I'd like you to be fully satisfied before moving ahead.`,
"Never argue. Encourage verification and give them time. Honesty beats persuasion here.",
"Don't say 'Humpe trust karo'. Don't pressure with limited-time offers."),
];

// ───────── G. Customer Objections (scripted conversations) ─────────
const G = mk("customer-objections", "GENERAL", "OBJECTION_HANDLING", "INTERMEDIATE");

export const objectionScripts: SeedScript[] = [
  G("'Price bahut zyada hai'", "Customer feels the price is high.",
`Sir, main samajh sakta hoon ki budget important hai.

Hum aapki requirements ko priority ke according plan kar sakte hain. Pehle essential features develop kar sakte hain aur additional features future mein add kiye ja sakte hain.

Sir, aapka comfortable budget range kya rahega?`,
`Sir, aapki baat sahi hai. Aap batayein kaunse features sabse zaroori hain, hum unhi par focus karke ek optimised plan banate hain.`,
`I understand budget matters. We can plan by priority: build the essential features first and add the rest later. What budget range would be comfortable for you?`,
"Acknowledge → offer phasing → ask a budget question. Stay calm; do not rush to discount.",
"Don't instantly offer a discount. Don't say 'aur kahin se sasta nahi milega'."),

  G("'Mujhe sochna padega'", "Customer wants time to think.",
`Bilkul Sir, soch samajhkar decision lena achhi baat hai.

Sir, kya aap bata sakte hain ki kaunsi baat aapko sochne par majboor kar rahi hai — budget, timeline ya kuch aur? Taaki main usme aapki madad kar sakun.`,
`Sir, theek hai. Main aapko aaj hi ek short summary WhatsApp par bhej deta hoon. Kya main kal shaam ko dobara call kar sakta hoon?`,
`Of course, Sir. May I ask what you'd like to think over — budget, timeline or something else? I may be able to help clarify.`,
"Respect the need to think but uncover the real concern gently, then fix a follow-up time.",
"Don't say 'offer kal khatam ho jayega'. Don't pressure."),

  G("'Dusri company saste mein bana rahi hai'", "Customer cites a cheaper competitor.",
`Sir, ho sakta hai. Price ke saath ye bhi dekhna zaroori hota hai ki scope mein kya-kya included hai.

Agar aap unki quotation share karein to hum features, support aur timeline compare karke aapko honest suggestion de sakte hain.`,
`Sir, har company ka scope aur quality alag hoti hai. Aap decision lene se pehle ek baar comparison kar lijiye, hum help kar denge.`,
`That may be so, Sir. Beyond price, it's important to see what's included. If you share their quotation, we can compare features, support and timeline honestly.`,
"Calmly shift from price to scope/value. Offer a fair comparison.",
"Don't speak ill of competitors. Don't match their price just to win."),

  G("'WhatsApp par details bhej do'", "Customer tries to end the call by asking for details on WhatsApp.",
`Zaroor Sir, main abhi bhej deta hoon.

Sir, details aapki requirement ke hisaab se bhejun to zyada useful rahega. Kya main 2 minute mein aapki requirement samajh loon, phir customised details bhejun?`,
`Sir, main bhej deta hoon. Aur kya main kal ek baar call karke puch sakta hoon ki details aapko kaisi lagi?`,
`Sure, Sir — I'll send it now. It would be more useful if I first understand your requirement for two minutes, then send customised details.`,
"Agree immediately, then earn two minutes by making the details relevant. If they decline, send it and fix a callback.",
"Don't refuse to send details. Don't send a generic wall of text."),

  G("'Discount milega?'", "Customer asks for a discount.",
`Sir, discount ka decision project ke scope aur final quotation par depend karta hai. Pehle hum requirement final kar lein, phir team se jo bhi possible hoga main aapko clearly bataunga.

Aapki priority kya hai — features ya budget?`,
`Sir, main koi galat promise nahi karunga. Pehle scope clear ho jaye, phir hum dekh lenge ki aapke budget ke hisaab se kya adjust ho sakta hai.`,
`Discounts depend on scope and the final quotation. Let's finalise requirements first, then I'll tell you clearly what's possible from the team. What's your priority — features or budget?`,
"Do not promise a discount; discount authority sits with management. Keep the conversation on scope.",
"Never say 'main apne level par kar dunga'. Don't create fake urgency."),

  G("'Demo dikha sakte hain?'", "Customer wants to see a demo before deciding.",
`Zaroor Sir, aapko samajhna chahiye ki hum kis tarah ka kaam karte hain.

Main team se confirm karke aapki requirement ke hisaab se relevant sample ya walkthrough arrange karwa deta hoon. Kaunsa type — website, app ya e-commerce?`,
`Sir, demo ke liye ek short meeting fix kar lete hain jisme hum approved samples dikhayenge aur aapke sawalon ke jawab denge.`,
`Of course, Sir. I'll confirm with the team and arrange a relevant sample or walkthrough. Which type — website, app or e-commerce?`,
"Say yes to the goal (seeing the quality), but confirm what's shareable with the team first.",
"Don't show unapproved work. Don't promise a custom demo for free.", true),

  G("'Abhi nahi, baad mein dekhenge'", "Customer says not now.",
`Koi baat nahi Sir, main samajh sakta hoon.

Kya main 2-3 weeks baad ek baar check kar sakta hoon? Tab tak agar aapko koi sawal ho to aap mujhe seedha call ya WhatsApp kar sakte hain.`,
`Sir, theek hai. Aap bas ek baat bata dijiye — kya abhi priority kam hai ya budget ka issue hai? Isse main sahi time par aapse sampark karunga.`,
`No problem, Sir. May I check back in two to three weeks? Until then, feel free to call or WhatsApp me with any questions.`,
"Leave the door open with a specific, light follow-up date. Understand whether it's priority or budget.",
"Don't argue, don't push. Don't promise to 'hold the price'."),

  G("'Mujhe apne partner se poochna hai'", "Customer needs a co-decision-maker.",
`Bilkul Sir, aise decisions mil kar lena achha hota hai.

Kya aap chahenge ki hum teeno ek short call ya meeting kar lein? Taaki sab ke sawal ek hi baar mein clear ho jayein.`,
`Sir, aapke partner ko kya cheezein sabse zyada important lagti hain? Main uske hisaab se ek chhota summary bhej deta hoon.`,
`Of course, Sir — shared decisions work best. Would you like a short joint call so all questions are answered at once?`,
"Invite the other decision-maker to the conversation. A joint call prevents message-distortion.",
"Don't treat it as a stall. Don't bypass the customer to contact the partner."),
];

// ───────── H. Closing ─────────
const H = mk("closing-scripts", "GENERAL", "MEETING_SCHEDULING", "INTERMEDIATE");
const HC = mk("closing-scripts", "GENERAL", "CALL_CLOSING", "BEGINNER");

export const closingScripts: SeedScript[] = [
  H("Inviting for a detailed meeting", "Discovery is done and you want a proper meeting.",
`Sir, jo aapne bataya uske hisaab se main ek detailed meeting suggest karunga jisme hamari team aapki requirement ko dekhegi aur aapko clear plan degi.

Meeting 20-30 minute ki hogi — aap kal ya parson mein se kaunsa din prefer karenge?`,
`Sir, call par hum itna hi samajh paye. Ek short video ya phone meeting se aur clarity milegi. Aap kaunsa time batayenge?`,
`Based on what you've told me, I'd suggest a detailed meeting where our team reviews your requirement and shares a clear plan. It will be 20–30 minutes — tomorrow or the day after?`,
"Offer two specific slots (alternative close). State the duration and purpose. Confirm availability of the colleague before promising.",
"Don't ask open-endedly 'kab free honge?'. Don't schedule without confirming internal availability."),

  H("Confirming the meeting details", "Customer agreed; confirm date, time and mode.",
`Sir, to hum [Date] ko [Time] par [Mode — call/video] meeting kar rahe hain.

Main aapko abhi WhatsApp par confirmation bhej deta hoon. Kya mujhe aapka best contact number wahi rakhna chahiye jis par abhi baat ho rahi hai?`,
`Sir, meeting [Date], [Time] par fix hai. Ek din pehle aapko reminder bhi bhej dunga.`,
`So we're set for [Date] at [Time] by [call/video]. I'll send a confirmation on WhatsApp now, and a reminder the day before.`,
"Repeat date, time and mode out loud. Send the WhatsApp confirmation immediately.",
"Don't leave details vague. Don't forget the reminder."),

  H("Handing over to a senior consultant", "A senior colleague will continue the conversation.",
`Sir, aapki requirement kaafi detailed hai, isliye main chahta hoon ki hamari senior team ka ek member aapse baat kare.

Main unhe aapki sari details bata dunga taaki aapko dobara sab kuch na samjhana pade.`,
`Sir, hamare [Name] aapko call karenge [Time] par. Main unhe aapki requirement ka summary de deta hoon.`,
`Your requirement is detailed, so I'd like a senior colleague to speak with you. I'll brief them so you won't need to repeat yourself.`,
"A warm handoff includes a verbal summary to the colleague. Tell the customer who and when.",
"Don't hand over cold. Don't promise a specific senior person without confirming."),

  H("Proposal handoff", "You'll pass the requirements to the team for a quotation.",
`Sir, ab main aapki requirements ko team ke saath share karta hoon taaki woh aapke liye ek proper proposal bana sake.

Proposal ke baad main aapko call karunga taaki aap ise samajh sakein aur koi sawal ho to puch sakein.`,
`Sir, main aaj hi requirements note karke bhej raha hoon. Proposal aane par aapko WhatsApp/email par bheja jayega, aur main follow-up bhi karunga.`,
`I'll share your requirements with the team so they can prepare a proper proposal. Once ready, I'll call you to walk through it.`,
"Say who does what and when you will call back. Never invent a proposal turnaround time — check with the team.",
"Don't promise a deadline you can't control.", true),

  HC("Polite call closing with next step", "Normal end of a good call.",
`Sir, aapka bahut-bahut dhanyavaad apna time dene ke liye.

To jaisa humne baat ki, main aapko [Next Step] [Time] tak bhej deta hoon. Koi bhi sawal ho to aap mujhe isi number par call ya WhatsApp kar sakte hain. Have a great day, Sir!`,
`Thank you Sir, aapse baat karke achha laga. Hum [Next Step] ke saath jald hi connect karenge.`,
`Thank you for your time, Sir. As discussed, I'll send [Next Step] by [Time]. You can call or WhatsApp me anytime. Have a great day!`,
"End every call with a concrete next step and a warm tone. Say thank you once, sincerely.",
"Don't end abruptly. Don't forget to do the next step you promised."),

  HC("Graceful close when the customer isn't interested", "Customer says no clearly.",
`Koi baat nahi Sir, aapne time diya iske liye dhanyavaad.

Agar future mein kabhi website ya app ki zaroorat ho to aap humein zaroor yaad kijiye. Aapka din shubh ho!`,
`Theek hai Sir, main samajhta hoon. Main aapko ek WhatsApp par hamari details bhej sakta hoon agar aap chahein — warna aur disturb nahi karunga.`,
`No problem, Sir — thank you for your time. If you ever need a website or app in future, please remember us. Have a good day!`,
"A respectful close preserves your reputation and sometimes brings referrals. Respect the no.",
"Don't argue, plead or make last-minute offers."),

  HC("Summary close", "Recap everything agreed before hanging up.",
`Sir, ek quick summary: aapko [requirement] chahiye, budget approx [range] hai aur timeline [time] hai. Agla step [action] hai.

Kya main kuch miss kar raha hoon?`,
`Sir, main apne notes ke hisaab se confirm kar deta hoon: [points]. Agar sab sahi hai to main aage badhta hoon.`,
`Quick recap: you need [requirement], budget about [range], timeline [time], and the next step is [action]. Did I miss anything?`,
"A recap catches misunderstandings while the customer is still on the line.",
"Don't recap things the customer didn't say."),

  HC("Closing a call that turned emotional or tense", "Customer is irritated; end respectfully.",
`Sir, aapko jo bhi inconvenience hua uske liye main maafi chahta hoon.

Main aapka aur zyada time nahi lunga. Agar aap chahein to main kisi senior ko aapse baat karne ke liye keh sakta hoon. Dhanyavaad Sir.`,
`Sir, aapki baat sunkar main samajh gaya. Main call yahin close karta hoon, aur agar aap kabhi chahein to hum phir se baat kar sakte hain.`,
`Sir, I apologise for any inconvenience. I won't take more of your time. If you'd like, I can ask a senior colleague to speak with you. Thank you.`,
"De-escalate: apologise for the experience (not necessarily admit fault), stay calm, offer an exit and a senior contact. Note the issue for your manager.",
"Don't argue back. Don't raise your voice. Don't hang up abruptly."),
];

// ───────── I. Follow-up ─────────
const I = mk("follow-up-conversations", "GENERAL", "CALL_CLOSING", "BEGINNER");

export const followupScripts: SeedScript[] = [
  I("Day-after follow-up call", "Follow-up after the first conversation.",
`Hello Sir, main [Your Name] Nextrova Labs se. Kal humari baat hui thi aapki [website/app] requirement ke baare mein.

Sir, maine socha ek baar check kar loon ki aapne jo details bheji thi woh mil gayi ya koi sawal hai?`,
`Namaste Sir, kal ki baat ke baad kuch sawal bache hon to puchne ke liye call kiya hai. Abhi 2 minute ho sakte hain?`,
`Hello Sir, this is [Your Name] from Nextrova Labs. We spoke yesterday about your requirement. I wanted to check that you received the details and see if you have any questions.`,
"Reference something specific from yesterday. Offer help rather than 'pushing for a decision'.",
"Don't ask 'kya decide kiya?' on the first follow-up."),

  I("Proposal follow-up", "You sent a proposal and want feedback.",
`Hello Sir, [Your Name] Nextrova Labs se. Maine aapko proposal bheja tha — kya aapne dekha?

Agar koi cheez samajh na aayi ho ya kuch change karna ho, to main team ke saath discuss karke aapko bata sakta hoon.`,
`Sir, proposal ke baare mein aapke kya vichar hain? Kya hum ek 10 minute ka call karke use saath mein padh lein?`,
`Hello Sir, I sent the proposal — have you had a chance to review it? If anything is unclear or needs changes, I can discuss with the team and get back to you.`,
"Offer to walk through it together; most prospects don't read long documents.",
"Don't send multiple follow-ups on the same day."),

  I("Gentle nudge after silence", "Customer hasn't replied for several days.",
`Hello Sir, main [Your Name] Nextrova Labs se. Kuch din ho gaye, socha hal-chal puch loon.

Agar aapka plan badal gaya ho ya abhi priority nahi hai to koi baat nahi — bas bata dijiye taaki main aapko baar-baar disturb na karun.`,
`Namaste Sir, aap busy honge — main bas ek baar poochna chahta tha ki website/app ki planning ab kahan tak hai?`,
`Hello Sir, it's been a few days so I wanted to check in. If your plans have changed or it's not a priority right now, just let me know and I won't disturb you again.`,
"Give permission to say no. This often prompts an honest reply.",
"No guilt, no sarcasm, no 'aap reply kyun nahi kar rahe'."),

  I("Reconnecting after a month", "Reopen an old conversation.",
`Hello Sir, main [Your Name] Nextrova Labs se. Ek mahine pehle humne aapki [requirement] ke baare mein baat ki thi.

Sir, kya ab aapki planning mein koi progress hua hai? Main kisi tarah ki madad kar sakta hoon?`,
`Namaste Sir, kaafi time ho gaya. Agar aapka project ab shuru karne ka plan hai to hum wahin se continue kar sakte hain jahan chhoda tha.`,
`Hello Sir, we spoke about [requirement] a month ago. Has there been any progress on your plans? I'm happy to pick up where we left off.`,
"Lead with their project, not your target. Mention what was discussed to show you remember.",
"Don't pretend there's an expiring offer."),

  I("Post-meeting follow-up", "After a detailed meeting.",
`Sir, aaj ki meeting ke liye dhanyavaad. Maine jo points note kiye hain wo main aapko WhatsApp par bhej raha hoon: [points].

Agar kuch galat ya kuch miss ho gaya ho to aap bata dijiye.`,
`Sir, meeting ke baad hamari team [next step] par kaam kar rahi hai. Aapko [time] tak update milega.`,
`Thank you for today's meeting, Sir. I'm sending the points I noted on WhatsApp — please tell me if anything is wrong or missing.`,
"Send a written recap within a few hours; it proves reliability.",
"Don't promise updates you can't deliver."),

  I("Customer missed the meeting", "Customer didn't attend the fixed meeting.",
`Hello Sir, aaj ki meeting mein aap join nahi kar paye — koi baat nahi, main samajh sakta hoon aap busy honge.

Kya hum ise kal ya parson ke liye reschedule kar sakte hain? Aap batayein kaunsa time aapke liye aasan rahega.`,
`Sir, no problem. Aapki convenience ke hisaab se naya time fix kar lete hain.`,
`Hello Sir, we missed you in today's meeting — no problem, I understand you must be busy. Can we reschedule for tomorrow or the day after?`,
"Be understanding, not accusatory. Offer two new slots.",
"Don't scold. Don't make them feel guilty."),

  I("Closing the loop respectfully", "After 3–4 attempts with no response.",
`Hello Sir, main aapko kuch baar contact kar chuka hoon. Lagta hai abhi aapki priority kuch aur hai, isliye main ab aur disturb nahi karunga.

Agar kabhi bhi website ya app ke liye humari zaroorat ho, to aap seedha mujhe call kar sakte hain. Dhanyavaad!`,
`Namaste Sir, main yeh last message bhej raha hoon. Aapka din shubh ho, aur future mein zaroorat ho to humein zaroor yaad kijiyega.`,
`Hello Sir, I've tried to reach you a few times. It seems your priorities are elsewhere, so I won't disturb you further. If you need us in future, please call me. Thank you!`,
"A polite final message ends the cycle gracefully; many prospects reply to it.",
"Don't send more than 3–4 follow-ups in total. Don't use manipulative 'last chance' wording."),

  I("Follow-up after sending samples/portfolio", "You shared approved samples.",
`Hello Sir, maine kal aapko kuch samples bheje the. Aapko unmein se kaunsa kaam pasand aaya, ya aap kuch alag tarah ka dekhna chahte the?

Aapke feedback ke hisaab se main aur relevant samples dikha sakta hoon.`,
`Sir, samples dekhkar aapko design ya features ke baare mein kya lagta hai? Kya hum ek chhota discussion kar sakte hain?`,
`Hello Sir, I shared a few samples yesterday. Which did you like, or would you like to see something different? I can show more relevant work based on your feedback.`,
"Ask what they liked — it reveals their taste. Only share approved samples.",
"Don't just ask 'koi decision?'.", true),
];
