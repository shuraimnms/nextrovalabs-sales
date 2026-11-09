import { mk, type SeedScript } from "./types";

// ───────── A. First Call Opening ─────────
const A = mk("first-call-opening", "GENERAL", "OPENING", "BEGINNER");
const A2 = mk("first-call-opening", "GENERAL", "PERMISSION_TO_SPEAK", "BEGINNER");

export const openingScripts: SeedScript[] = [
  A("Standard first call (ad enquiry)", "Customer submitted an enquiry after seeing a Facebook/Instagram ad. First ever call.",
`Hello Sir, Good Morning!

Kya meri baat [Customer Name] se ho rahi hai?

Sir, main [Your Name] Nextrova Labs se baat kar raha hoon.

Aapne recently hamara Facebook ya Instagram advertisement dekha tha aur website ya application development ke liye enquiry submit ki thi.

Sir, kya abhi aapse 2 minute baat ho sakti hai?`,
`Namaste Sir! Main [Your Name], Nextrova Labs se bol raha hoon.

Aapne hamare ad par website ya app ke liye enquiry daali thi — usi ke baare mein thodi baat karni thi.

Aap abhi 2 minute free hain, ya main aapko baad mein call karun?`,
`Hello Sir, good morning! Am I speaking with [Customer Name]? This is [Your Name] from Nextrova Labs. You recently enquired about website or app development after seeing our ad. Do you have two minutes to talk?`,
"Use on the very first call. Confirm the name first, introduce yourself in one breath, state the reason for the call, then ASK permission. Smile — it is audible. Change 'Good Morning' to Afternoon/Evening as per time.",
"Do not start pitching services. Do not say 'sir aapne mujhe call kiya tha' unless they did. Do not read it like a robot — pause after the name."),

  A("Customer asks 'Kaun bol raha hai?'", "Customer picks up and sounds confused about who is calling.",
`Ji Sir, main [Your Name] Nextrova Labs se bol raha hoon — hum website aur mobile app banate hain.

Aapne kuch din pehle hamare online ad par enquiry submit ki thi, usi ke regarding call kiya hai.

Sir, kya aap 2 minute baat kar sakte hain?`,
`Sir, main Nextrova Labs, Bengaluru se [Your Name] bol raha hoon. Aapne website/app ke liye ek enquiry bheji thi, uske baare mein aapse samajhna chahta tha. Abhi baat karna theek rahega?`,
`I'm [Your Name] from Nextrova Labs — we build websites and mobile apps. You'd submitted an enquiry through our ad a few days ago, which is why I'm calling. Is now a good time?`,
"Stay calm and answer in two lines: who you are, why you called. Then ask for permission. Confusion is normal — ad enquiries are often filled in a hurry.",
"Never sound defensive ('Aapne hi to form bhara tha'). Never say you got their number from somewhere else."),

  A2("Customer is busy — fix a callback time", "Customer says 'Abhi busy hoon' or 'Baad mein call karo'.",
`Koi baat nahi Sir, main samajh sakta hoon.

Sir, aap kaunsa time prefer karenge — aaj shaam ko ya kal subah? Main bilkul usi time par call karunga, sirf 5 minute lunga.`,
`Bilkul Sir, aapka time important hai. Aaj [time] ya kal [time] — kaunsa slot aapke liye aasan rahega? Main usi waqt call karta hoon.`,
`No problem at all, Sir. Which time suits you better — this evening or tomorrow morning? I'll call exactly then and keep it to five minutes.`,
"Always convert 'busy' into a specific time. A specific time is a commitment; 'baad mein' is a goodbye. Note the time in your own planner and call on time.",
"Don't try to 'quickly explain everything' while they're busy. Don't ask 'kab free honge?' without offering two options."),

  A("Customer does not remember the enquiry", "Customer says 'Maine koi enquiry nahi ki' or 'Yaad nahi'.",
`Koi baat nahi Sir, kai baar form jaldi mein bhara jaata hai.

Hamare paas website ya app development ke liye ek enquiry aayi thi is number se. Agar aapko abhi iski zaroorat nahi hai to bilkul theek hai — kya main bas 30 second mein bata sakta hoon hum kya karte hain?`,
`Sir, shayad aapne ya aapke kisi colleague ne form bhara hoga. Agar aapke business mein kabhi website ya app ki planning hai, to main 1 minute mein introduction de deta hoon — warna main call close kar deta hoon.`,
`That's alright, Sir — forms are often filled in a hurry. We received an enquiry from this number. If you don't need anything right now, that's perfectly fine; may I take 30 seconds to say what we do?`,
"Be graceful: never argue that they did fill the form. Give them an easy exit and a 30-second option. Respect a clear 'no'.",
"Don't insist 'Aapne hi bheji thi'. Don't continue after a firm no. Don't guilt-trip."),

  A("Formal opening for a business owner", "Customer is a business owner/director; you want a respectful, crisp tone.",
`Good Morning Sir. Main [Your Name], Nextrova Labs, Bengaluru se bol raha hoon.

Aapne hamari website/app development service ke liye enquiry bheji thi. Main aapke business ki requirement samajhna chahta hoon taaki sahi suggestion de sakun.

Kya aapke paas abhi 3–4 minute honge?`,
`Sir, namaskar. Nextrova Labs se [Your Name]. Aapki enquiry mili thi — main aapke business ke baare mein thoda samajhkar hi koi suggestion dena chahta hoon. Kya abhi 3–4 minute mil sakte hain?`,
`Good morning, Sir. This is [Your Name] from Nextrova Labs, Bengaluru. We received your enquiry. I'd like to understand your business first so my suggestions are relevant. Do you have three to four minutes?`,
"For owners/directors: be brief, say you want to understand their business (not 'sell'), and respect their time explicitly by quoting a duration.",
"Avoid slang, avoid 'boss/bhai'. Avoid long self-introduction. Don't name-drop clients (none are approved for sharing)."),

  A("Callback after a missed call", "You missed the customer's call, or they missed yours; you're calling back.",
`Hello Sir, main [Your Name] Nextrova Labs se. Aapki ek missed call aayi thi, isliye wapas call kiya hai.

Sir, aap website ya app ke baare mein baat karna chahte the? Abhi 2 minute free hain?`,
`Namaste Sir, [Your Name] — Nextrova Labs. Aapke number se call aaya tha, to maine socha khud call karke puch loon ki main kaise madad kar sakta hoon.`,
`Hello Sir, this is [Your Name] from Nextrova Labs. I saw a missed call from you, so I'm calling back. How can I help — is it about a website or an app?`,
"Calling back quickly shows professionalism. Keep it light and open-ended: let them tell you why they called.",
"Don't assume the reason for their call. Don't say 'aapne call kyun kiya tha?' sharply — ask warmly."),

  A("Speaking to someone other than the enquirer", "A family member/assistant picks up for the enquirer.",
`Namaste ji, main [Your Name] Nextrova Labs se bol raha hoon. Kya [Customer Name] ji se baat ho sakti hai?

Unhone website ya app ke liye enquiry bheji thi — main bas unse 2 minute baat karna chahta hoon.`,
`Ji, aap bata dijiye [Customer Name] ji kab available honge? Main unhi ke time par dobara call kar lunga.`,
`Hello, this is [Your Name] from Nextrova Labs. May I speak with [Customer Name]? They had enquired about a website or app. If they're unavailable, when would be a good time to call back?`,
"Share only what is needed to reach the person. Ask for a better time to call, and be polite to whoever answers — they often influence the decision.",
"Don't discuss the project, budget or business details with a third party. Don't pressure them to hand over the phone."),

  A("Second attempt after no answer", "You called yesterday with no answer; trying once more.",
`Hello Sir, main [Your Name] Nextrova Labs se. Kal aapko call kiya tha, shayad aap busy honge.

Aapki website/app enquiry ke baare mein baat karni thi — kya abhi 2 minute ho sakte hain?`,
`Namaste Sir, kal call nahi lag paya tha, isliye aaj dobara try kiya. Aapki enquiry ke regarding bas 2 minute chahiye — theek rahega?`,
`Hello Sir, I tried you yesterday and it seems you were busy. I'd like to talk briefly about your website/app enquiry — do you have two minutes now?`,
"Mention the earlier attempt lightly, with no blame. Two attempts at different times of day is reasonable; a third can be a WhatsApp message (see templates).",
"Don't say 'Aap phone kyun nahi uthate'. Don't call repeatedly within minutes."),
];

// ───────── B. Website Development ─────────
const B = mk("website-development", "WEBSITE", "REQUIREMENT_DISCOVERY", "BEGINNER");
const BB = mk("website-development", "WEBSITE", "BUSINESS_UNDERSTANDING", "BEGINNER");
const BF = mk("website-development", "WEBSITE", "FEATURE_DISCUSSION", "INTERMEDIATE");
const BT = mk("website-development", "WEBSITE", "TIMELINE_DISCUSSION", "INTERMEDIATE");

export const websiteScripts: SeedScript[] = [
  BB("What business do you run?", "Open discovery: understand the business before talking about websites.",
`Sir, sabse pehle main aapke business ko thoda samajhna chahta hoon.

Aap kis tarah ka business karte hain, aur kitne time se? Aapke customers mostly kaun hain — local ya poore India se?`,
`Sir, aapke business ke baare mein bataiye — kya karte hain, kahan karte hain, aur customers kaise aate hain? Isse mujhe sahi website suggest karne mein help milegi.`,
`First, I'd like to understand your business. What do you do, for how long, and who are your customers — local or across India?`,
"Let the customer talk for at least a minute. Take notes of their words (e.g. 'walk-in customers', 'Instagram orders') — reuse these later.",
"Don't jump to features. Don't interrupt. Don't assume they need an e-commerce site."),

  BB("Main goal of the website", "Find out WHY they want a website — leads, sales, credibility or information.",
`Sir, aapko website se mainly kya hasil karna hai?

Jaise — naye customers laana, online orders lena, company ki credibility badhana, ya sirf information dikhana?`,
`Sir, agar website ban jaye to aap kya dekhna chahenge — ki zyada enquiry aaye, ya log online khareedein, ya aapka business professional dikhe?`,
`What is the main outcome you want from the website — more enquiries, online sales, credibility, or simply information for customers?`,
"The goal decides the design, features and budget. Repeat their goal back: 'To matlab priority enquiry generate karna hai, sahi?'",
"Don't offer a list of features before you know the goal. Don't accept 'bas website chahiye' — gently probe once or twice."),

  B("Do you already have a website?", "Check for an existing site, domain or hosting.",
`Sir, kya aapki pehle se koi website hai? Agar hai to uska address bata dijiye, main dekh leta hoon.

Aur kya aapke paas domain name — jaise aapkanaam.com — already hai?`,
`Sir, kya pehle koi website thi jo purani ho gayi hai, ya yeh bilkul pehli website hogi? Domain aur hosting kahin se li hui hai kya?`,
`Do you already have a website? If so, could you share the address? And do you own a domain name already?`,
"Existing site = redesign or migration questions; no site = fresh build. Ask who manages the domain — ownership issues cause delays later.",
"Don't criticise their old website or the developer who built it."),

  B("Type of website needed", "Clarify whether it's a brochure site, catalogue, booking, portal, etc.",
`Sir, aapko kis tarah ki website chahiye?

Kya sirf company ki information dikhani hai, ya products ka catalogue, ya customers appointment/booking karenge, ya login wala portal chahiye?`,
`Sir, simple samjhaun to — kuch websites sirf introduction ke liye hoti hain, kuch mein products dikhte hain, aur kuch mein online payment ya booking hoti hai. Aapko in mein se kaunsa sabse close lagta hai?`,
`What kind of website do you need — an informational company site, a product catalogue, one with bookings/appointments, or a login-based portal?`,
"Use plain categories. Customers often don't know the terminology, so give 3–4 simple examples they recognise.",
"Don't use jargon like 'CMS', 'headless', 'SPA' unless the customer uses it first."),

  B("Pages and content they will need", "Estimate scope by pages and content readiness.",
`Sir, website mein kaun kaun se pages chahiye honge? Jaise Home, About, Services, Gallery, Contact.

Aur kya aapke paas logo, photos aur text content ready hai, ya uske liye bhi help chahiye?`,
`Sir, content ek important cheez hai — kya aapke paas apne products/services ki photos aur details taiyaar hain? Agar nahi, to hum bata sakte hain ki kya-kya tayaar karna padega.`,
`Which pages do you expect — Home, About, Services, Gallery, Contact? And do you already have your logo, photos and text content ready, or will you need help with that?`,
"Content readiness is a top cause of project delays — raise it early and kindly.",
"Don't promise to write all content for free. Don't claim content writing is included — scope is decided in the quotation."),

  BF("Features: forms, WhatsApp, maps, payments", "Walk through common website features.",
`Sir, kuch common features bata deta hoon — aap bataiye kaunse chahiye:

Contact form, WhatsApp chat button, Google Map, photo gallery, blog, online payment, ya enquiry ka email notification.

Inme se aapko kaunse zaroori lagte hain?`,
`Sir, aapke customers website par aakar kya karenge — call karenge, form bharenge, WhatsApp karenge ya payment karenge? Uske hisaab se hum features decide kar sakte hain.`,
`A few common features: contact form, WhatsApp button, Google Map, gallery, blog, online payment, enquiry email alerts. Which of these matter to you?`,
"Tie each feature to a customer action. Mark 'must-have' vs 'nice-to-have' — this prepares a phased quote.",
"Don't tick every feature 'yes'. Don't say 'sab ho jayega' without scoping."),

  BF("Design references and brand colours", "Understand taste and expectation on design.",
`Sir, kya aapko koi aisi website pasand hai jaisi aap apni banwana chahte hain? Link ya naam bata dijiye.

Aur aapke brand ke kuch fixed colours ya logo hain jo hume follow karne hain?`,
`Sir, design ke baare mein — simple aur clean chahiye, ya zyada colourful aur modern? Agar koi reference website ho to WhatsApp par bhej dijiye, hum usse idea le lenge.`,
`Is there a website whose look you like? Please share the link. And do you have brand colours or a logo we should follow?`,
"References tell you more than adjectives. Ask for 2–3 links and what exactly they like (layout, colours, simplicity).",
"Don't agree to 'copy exactly' another company's website — suggest taking inspiration instead."),

  B("Mobile-friendly and speed expectations", "Educate gently on responsive design.",
`Sir, aajkal zyada tar log phone se hi website dekhte hain, isliye website mobile par bhi achhi dikhni chahiye.

Aapke customers mostly mobile use karte hain ya computer? Isse design ki priority decide hoti hai.`,
`Sir, hum website aisi plan karte hain ki phone, tablet aur laptop — teeno par theek se khule. Aapke customers kis device par zyada aate hain, aapko kya lagta hai?`,
`These days most people browse on phones, so the site should look good on mobile too. Do your customers mostly use mobile or desktop?`,
"Frame mobile-friendliness as a customer benefit, not a technical feature. Don't quote speed scores you haven't measured.",
"Don't promise specific Google rankings or speed scores."),

  B("Domain and hosting basics", "Explain domain/hosting simply and ask about ownership.",
`Sir, website ke liye do cheezein lagti hain — domain, yaani website ka naam, aur hosting, yaani jahan website rakhi jaati hai.

Kya inme se kuch aapke paas pehle se hai? Agar nahi, to hum aapko guide kar denge ki kaise lena hai.`,
`Sir, domain ko aap dukaan ka naam samajhiye aur hosting ko dukaan ki jagah. Dono aapke naam par hone chahiye taaki aap hamesha owner rahein.`,
`A website needs a domain (its name) and hosting (where it lives). Do you have either already? If not, we'll guide you — and both should be registered in your own name.`,
"Use the shop analogy. Encourage ownership in the customer's name. Whether Nextrova arranges hosting/domain is a policy detail — say 'hum guide karenge' unless admin has confirmed otherwise.",
"Don't quote hosting prices. Don't claim free domain/hosting — not an approved offer.", true),

  B("SEO and Google visibility", "Customer asks about ranking on Google.",
`Sir, website ko Google par dhoondhna aasan banane ke liye basic SEO setup ho sakta hai — jaise sahi titles, mobile-friendly design aur fast loading.

Lekin Google par number 1 aane ki guarantee koi bhi imandaar company nahi de sakti, kyunki ranking Google ke algorithm par depend karti hai.`,
`Sir, hum website ko search-friendly banate hain. Ranking kitni jaldi aur kitni upar aayegi, yeh competition aur time par depend karta hai — isliye hum guarantee nahi dete, par sahi foundation zaroor dete hain.`,
`We can set up basic SEO so the site is easy for Google to understand. But no honest company can guarantee a #1 ranking — it depends on Google and your competition.`,
"Be honest — this builds trust. Offer 'search-friendly foundation', not rankings. Ongoing SEO work, if any, is scoped separately.",
"NEVER promise first-page ranking, traffic numbers or sales results."),

  BF("Admin panel and content updates", "Customer wants to update the website themselves.",
`Sir, aap website ka content khud badalna chahte hain — jaise photos, prices ya naye products add karna?

Agar haan, to hum ek simple admin panel bana sakte hain jisse aap bina coding ke update kar sakein.`,
`Sir, aap khud update karna chahenge ya hamari team se karwana pasand karenge? Dono tareeke possible hain, par admin panel ki requirement pehle se pata ho to better planning hoti hai.`,
`Would you like to update photos, prices or products yourself? If so, we can include a simple admin panel so you can manage content without coding.`,
"Ask who will maintain the site after launch. This drives CMS/admin-panel scope.",
"Don't promise unlimited free updates after launch — support terms are a company policy."),

  BT("Timeline expectation", "Customer asks how long the website will take.",
`Sir, timeline website ke size aur features par depend karti hai. Ek simple website jaldi ho sakti hai, aur zyada features wali mein thoda zyada time lagta hai.

Requirement samajhne ke baad main aapko realistic timeline bata dunga. Aapko kab tak chahiye, koi specific date hai?`,
`Sir, main abhi koi jaldbaazi wala promise nahi karunga — pehle requirement final hone dijiye, phir hamari team ek clear timeline dengi. Aapke taraf se koi deadline ya event hai kya?`,
`The timeline depends on the number of pages and features. Once I understand your needs I'll confirm a realistic schedule. Do you have a specific date in mind?`,
"Ask for THEIR deadline first. Quote a timeline only after scope is clear and only as confirmed by the team/admin. Mention that content readiness affects timing.",
"Do NOT quote a fixed number of days from memory — company timelines are pending admin confirmation and have changed over time.", true),

  B("Wrap-up of website discovery", "Summarise what you heard before moving to budget/meeting.",
`Sir, main ek baar summarize kar leta hoon: aapka [business] hai, aapko website se [goal] chahiye, [pages/features] chahiye honge, aur aap [timeline] tak chahte hain.

Kya yeh sahi hai, ya kuch aur add karna hai?`,
`Sir, mere notes ke hisaab se aapko [type] website chahiye jisme [features] hon. Kuch miss hua ho to bataiye, main add kar lunga.`,
`Let me summarise: you run [business], want the website to [goal], need [pages/features], and are aiming for [timeline]. Is that right, or should I add anything?`,
"Summaries show you listened and give the customer a chance to correct. Do this before talking money.",
"Don't skip the summary. Don't add things the customer never said."),
];

// ───────── C. Mobile App Development ─────────
const C = mk("mobile-app-development", "MOBILE_APP", "REQUIREMENT_DISCOVERY", "BEGINNER");
const CF = mk("mobile-app-development", "MOBILE_APP", "FEATURE_DISCUSSION", "INTERMEDIATE");
const CB = mk("mobile-app-development", "MOBILE_APP", "BUSINESS_UNDERSTANDING", "BEGINNER");

export const appScripts: SeedScript[] = [
  CB("What problem will the app solve?", "Start with purpose, not technology.",
`Sir, app banane ka aapka main purpose kya hai?

Aap kaunsi problem solve karna chahte hain, ya customers ko kaunsi nayi facility dena chahte hain?`,
`Sir, agar aapka app ban jaye to ek customer us app se kya kaam kar payega? Is sawal ka jawab hi app ki direction decide karta hai.`,
`What is the main purpose of the app? What problem will it solve, or what new facility will it give your customers?`,
"A clear purpose prevents scope creep. Ask 'ek customer app mein kya karega?' to get concrete answers.",
"Don't start with 'Android ya iOS?'. Don't suggest an app when a website would do — be honest."),

  C("Android, iOS or both", "Clarify platforms.",
`Sir, app Android par chahiye, iPhone par, ya dono par?

Agar aapke zyada customers Android use karte hain, to pehle Android se shuru kar sakte hain aur baad mein iPhone version add kar sakte hain.`,
`Sir, aapke customers kaunse phone use karte hain? Agar pata na ho to hum aapke target customers ke hisaab se suggest kar denge.`,
`Do you need the app on Android, iPhone or both? If most of your users are on Android, we could start there and add iPhone later.`,
"Phased platform rollout is a legitimate way to align budget. Don't push 'both' by default.",
"Don't claim one platform is 'cheaper' or 'faster' without scope. Don't quote store fees."),

  C("Who will use the app", "Identify user types: customers, staff, vendors, admins.",
`Sir, app ko kaun kaun use karega? Sirf aapke customers, ya aapka staff, delivery partners ya vendors bhi?

Har type ke user ke liye alag screens aur permissions ho sakte hain.`,
`Sir, aapke app mein kitne tarah ke log login karenge? Customer, staff aur admin — in teeno ke liye alag experience banta hai.`,
`Who will use the app — only customers, or also staff, delivery partners and vendors? Each user type may need different screens and permissions.`,
"Counting user roles is the fastest way to estimate scope. Draw it out in your notes.",
"Don't assume only one user type."),

  C("Login and sign-up method", "Discuss authentication options.",
`Sir, users app mein kaise login karenge — mobile number se OTP, email-password se, ya Google se?

Mostly business apps mein OTP wala login simple rehta hai.`,
`Sir, kya aapko user accounts chahiye, ya app bina login ke bhi chalega? Login se personalization aur order history milti hai.`,
`How should users log in — mobile OTP, email and password, or Google sign-in? OTP login is common and simple for business apps.`,
"Authentication choice affects cost: OTP (SMS) usually involves third-party messaging charges — say 'third-party charges alag ho sakte hain'.",
"Don't quote SMS/OTP rates. Don't promise 'unlimited free OTP'."),

  CF("Admin panel for the app", "Explain why an admin panel matters.",
`Sir, app ke saath aapko ek admin panel bhi chahiye hoga — jahan se aap users, orders, content aur notifications manage kar sakein.

Aapko admin panel par kya-kya control chahiye?`,
`Sir, app sirf screen hai; uske peeche ka control admin panel deta hai. Aap kaunsi cheezein khud badalna chahte hain — prices, banners, users ya reports?`,
`Your app will also need an admin panel to manage users, orders, content and notifications. What would you like to control from it?`,
"Admin panel is often forgotten and then added later at extra cost — raising it now is honest and helpful.",
"Don't treat the admin panel as 'free'. Scope it in the quotation."),

  CF("Payments inside the app", "Discuss online payment needs.",
`Sir, kya app ke andar online payment chahiye — UPI, card ya wallet?

Payment gateway ka apna alag setup aur charges hote hain, jo payment company leti hai. Hum us integration mein help kar sakte hain.`,
`Sir, payment ke liye aap kaunsa gateway use karna chahte hain? Agar pehle se koi account hai to bata dijiye, warna hum options samjha denge.`,
`Do you need online payments in the app — UPI, cards or wallets? Payment gateways have their own charges set by the provider; we can help integrate one.`,
"Be clear that gateway fees are the provider's. Ask if the customer already has a merchant account. Nextrova does not collect or hold customer payments.",
"Don't quote gateway percentages. Don't promise instant gateway approval."),

  CF("Push notifications and alerts", "Explain notifications and ask if needed.",
`Sir, kya aap chahte hain ki app users ko offers, order updates ya reminders ke notifications bheje?

Yeh engagement badhane ke liye kaafi useful hota hai.`,
`Sir, kin cheezon par aap users ko notification bhejna chahenge — order status, offers ya appointment reminder?`,
`Would you like the app to send notifications — offers, order updates, or reminders? They're useful for keeping users engaged.`,
"Link notifications to a business outcome the customer cares about (repeat orders, fewer no-shows).",
"Don't promise specific open rates or conversions."),

  C("Integrations with existing systems", "Existing software, APIs, ERP, accounting.",
`Sir, kya aap koi software already use karte hain — jaise billing, accounting ya inventory?

Agar app ko usse connect karna hai to hume dekhna padega ki us software ka API ya integration option hai ya nahi.`,
`Sir, aapke current system ka naam bata dijiye. Hum check karenge ki app usse jud sakta hai ya nahi, phir aapko clear answer denge.`,
`Do you already use software for billing, accounting or inventory? If the app must connect to it, we'll need to check whether it offers an API or integration option.`,
"Integrations are a major source of hidden complexity. Capture the exact software name and version.",
"Don't say 'koi bhi software se connect ho jayega'. Say you'll verify."),

  C("Offline use and low connectivity", "Ask whether the app must work without internet.",
`Sir, kya aapke users aisi jagah app use karenge jahan internet weak ho?

Agar haan, to hume offline-friendly design sochna padega, jo requirement ko thoda badha sakta hai.`,
`Sir, kya app ko bina internet ke bhi kuch kaam karna hoga — jaise data dekhna ya entry karna?`,
`Will users operate where connectivity is weak? If so we need an offline-friendly design, which can widen the scope.`,
"A short, genuinely useful question — field-staff apps often need it.",
"Don't promise full offline sync without technical review."),

  C("App store publishing", "Customer asks if the app will be on Play Store / App Store.",
`Ji Sir, app ko Play Store aur App Store par publish karwane mein hum guide kar sakte hain.

Developer account aapke naam par hona best hota hai taaki app ki ownership aapke paas rahe. Store ki fees aur review process stores ke apne rules par hote hain.`,
`Sir, publishing ke liye Google aur Apple ke developer accounts lagte hain, jinki fees wo companies leti hain. Hum process mein aapki help karenge.`,
`Yes, we can guide you through publishing on the Play Store and App Store. It's best if the developer accounts are in your own name. Store fees and review timelines are set by Google and Apple.`,
"Emphasise ownership and that approval timing is the stores' decision. Whether publishing assistance is included in a quote is a scope matter.",
"Never guarantee approval or a publish date. Never quote store fees as fixed."),

  CF("MVP first, features later", "Customer wants everything in version 1.",
`Sir, ek smart approach hoti hai — pehle sirf zaroori features ke saath ek simple version launch karein, users ka response dekhein, aur phir features badhayein.

Isse aapka risk kam hota hai aur aap jaldi market mein aa sakte hain.`,
`Sir, aapki list mein se kaunse 3–4 features bilkul zaroori hain? Baaki hum phase 2 mein rakh sakte hain.`,
`A smart approach is to launch a simple first version with only the essential features, learn from real users, and then expand.`,
"Position phasing as risk reduction for THEM, not as a way to sell less. Ask them to pick the top 3–4 must-haves.",
"Don't dismiss their ideas. Don't call features 'unnecessary' — call them 'phase 2'."),

  C("Existing app or competitor references", "Learn which apps the customer likes.",
`Sir, kya koi app hai jo aapko pasand hai aur aapke jaisa kaam karta hai? Uska naam bata dijiye.

Isse mujhe samajh aayega ki aap kis level ka experience chahte hain.`,
`Sir, aapke competitors ya industry mein koi app hai jisse aap better banana chahte hain? Kya cheez usmein achhi lagti hai?`,
`Is there an app you like that does something similar? Tell me its name so I understand the experience you expect.`,
"References set expectations. If they name a large, well-known app, gently explain that such apps are built by large teams over years — and that a focused first version is practical.",
"Don't promise to clone a famous app."),

  C("Data security and privacy of the app", "Customer worries about user data.",
`Sir, aapka sawal bilkul sahi hai. Hum user data ko secure tareeke se handle karne ke best practices follow karte hain, jaise secure login aur access control.

Specific security features aapki requirement ke hisaab se quotation mein define kiye jaate hain.`,
`Sir, app mein kitna sensitive data aayega — jaise payment ya personal details? Uske hisaab se hum security ka level plan karenge.`,
`That's a fair concern. We follow secure development practices such as secure login and access control. Specific security features are defined per project in the quotation.`,
"Answer calmly and specifically; avoid absolute claims. Ask what data the app will store so the right level can be planned.",
"Never claim 'hack-proof' or '100% secure'. Don't quote certifications (none are verified)."),

  C("Maintenance after launch", "Customer asks what happens after the app is live.",
`Sir, app live hone ke baad bhi updates, bug fixes aur new Android/iOS versions ke saath compatibility ki zaroorat padti hai.

Support aur maintenance ke options hum quotation ke time clearly bata denge.`,
`Sir, launch ke baad ka support ek important hissa hai. Aap kis tarah ka support expect karte hain — monthly maintenance ya jab zaroorat ho tab?`,
`After launch an app still needs updates, bug fixes and compatibility with new OS versions. We'll explain the support options clearly in the quotation.`,
"Bring up maintenance proactively — it builds trust. Exact support terms are a company policy; don't improvise.",
"Don't promise free lifetime support or specific response times.", true),
];
