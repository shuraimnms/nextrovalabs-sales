import { slugify } from "./types";

export type ObjCat = "PRICE" | "COMPETITION" | "URGENCY" | "UNCERTAINTY" | "TRUST" | "TECHNICAL" | "DELAY" | "FOLLOW_UP" | "PROCESS";
export type SeedObjection = {
  slug: string; customerSays: string; category: ObjCat; popular: boolean; quick: boolean; pending: boolean;
  recommended: string; short: string; detailed: string; alternative: string; why: string; dont: string;
};

type Opt = { popular?: boolean; quick?: boolean; pending?: boolean };
const o = (category: ObjCat) => (customerSays: string, short: string, recommended: string, detailed: string, alternative: string, why: string, dont: string, opt: Opt = {}): SeedObjection => ({
  slug: slugify(customerSays), customerSays, category, popular: !!opt.popular, quick: !!opt.quick, pending: !!opt.pending,
  short, recommended, detailed, alternative, why, dont,
});

const P = o("PRICE"), C = o("COMPETITION"), U = o("URGENCY"), N = o("UNCERTAINTY"), T = o("TRUST"), X = o("TECHNICAL"), D = o("DELAY"), F = o("FOLLOW_UP"), R = o("PROCESS");

export const objections: SeedObjection[] = [
  // ───────── PRICE ─────────
  P("Price kitna hoga?", "Sir, requirement ke hisaab se quotation banta hai — pehle 2-3 sawal puch sakta hoon?",
`Sir, cost aapki requirement par depend karti hai — pages, features aur design ke hisaab se. Main pehle aapki requirement samajh leta hoon, phir hamari team ek clear quotation degi.

Kya main 2-3 sawal puch sakta hoon?`,
`Sir, har project alag hota hai, isliye ek fix rate dena sahi nahi hoga. Jaise ghar ka cost uske design aur size par depend karta hai, waise hi website ya app ka cost uske scope par.

Agar aap mujhe bata dein ki aapko kya chahiye — kitne pages, kaunse features, aur kab tak — to hamari team uske hisaab se ek written quotation tayaar karegi, jisme sab clearly hoga.`,
`Sir, main galat number nahi bolna chahta. Aap 5 minute dein, main requirement note karke senior team se realistic estimate arrange karwa deta hoon.`,
"Converts a premature price question into discovery and shows you will not guess — builds credibility.",
"Never quote a number from memory. Never say 'bahut kam mein ho jayega'.", { popular: true, quick: true }),
  P("Website ka price bahut zyada hai.", "Hum priority ke hisaab se plan kar sakte hain — pehle zaroori features.",
`Sir, main samajh sakta hoon ki budget important hai.

Hum aapki requirements ko priority ke according plan kar sakte hain. Pehle essential features develop kar sakte hain aur additional features future mein add kiye ja sakte hain.

Sir, aapka comfortable budget range kya rahega?`,
`Sir, aapki baat sahi hai ki budget ek important factor hai. Hum price kam karne ki bajay scope ko optimise karte hain — jo features aapke business ke liye sabse zaroori hain, unhe pehle phase mein rakhte hain, aur baaki baad mein jodte hain.

Isse aapki shuruaati investment kam rehti hai, aur website jaldi live bhi ho jati hai. Aap bata sakte hain ki aapke liye 3-4 sabse zaroori features kaunse hain?`,
`Sir, kya aap quotation ke kaunse hisse se uncomfortable hain? Main dekhta hoon ki kya adjust ho sakta hai.`,
"Validates the concern, offers a concrete path (phasing) and ends with a budget question to move forward.",
"Don't say 'ye to sasta hai'. Don't offer a discount immediately.", { popular: true }),
  P("Discount milega?", "Discount scope aur final quotation par depend karta hai — pehle requirement final karein.",
`Sir, discount ka decision project ke scope aur final quotation par depend karta hai. Pehle hum requirement final kar lein, phir team se jo bhi possible hoga main aapko clearly bataunga.`,
`Sir, main koi galat promise nahi karna chahta. Pehle humein scope clear karna hoga — kitne pages, kaunse features aur timeline. Uske baad main team se baat karunga ki aapke budget ke hisaab se kya adjust ho sakta hai.

Aapki priority kya hai — kam budget ya zyada features?`,
`Sir, discount se pehle ye dekhte hain ki aapke liye kaunse features abhi zaroori hain — shayad scope adjust karke aapka budget achhe se fit ho jaye.`,
"Keeps authority with management, avoids false promises and redirects to scope — where real savings come from.",
"Never promise a percentage. Never say 'main apne level par kar dunga'.", { quick: true, popular: true }),
  P("Advance payment kitna dena hoga?", "Payment terms quotation mein clearly likhe hote hain.",
`Sir, payment structure project ke scope par depend karta hai aur woh written quotation mein clearly hota hai. Main exact terms confirm karke aapko bata dunga.`,
`Sir, payment ke terms hamari team finalise karti hai aur woh written mein hote hain taaki dono taraf clarity rahe. Main aapko quotation ke saath payment ka poora schedule bhej dunga.

Aapko kisi bhi cheez par doubt ho to aap quotation se pehle puch sakte hain.`,
`Sir, kya aap chahte hain ki payment milestones ke hisaab se ho? Main team se confirm karke aapko batata hoon ki kya option available hai.`,
"Defers to written terms so nothing is promised verbally; reduces fear of the unknown.",
"Never state an advance percentage, refund or milestone split unless admin has approved it.", { pending: true }),
  P("Payment kaise karna hoga?", "Payment ka tareeka aur schedule quotation ke saath confirm hota hai.",
`Sir, payment ka method aur schedule quotation ke saath clearly bataya jata hai. Aap bank transfer ya UPI jaise common options mein se jo comfortable ho, uske baare mein hamari team confirm kar degi.`,
`Sir, payment ki poori details hamari team written mein share karti hai, taaki aap ko pata ho ki kab, kitna aur kis tarah dena hai. Main aapko quotation ke saath yeh sab bhej dunga.

Koi bhi sawal ho to aap pehle hi puch sakte hain.`,
`Sir, aap kaunsa payment method prefer karte hain? Main team se confirm karke aapko bata dunga.`,
"Gives a calm, process-based answer; never improvises payment details.",
"Don't mention bank accounts, UPI IDs or collect any money on the call. Don't promise refunds.", { quick: true, pending: true }),
  P("Itna kharcha nahi kar sakta, budget kam hai.", "Phase 1 mein sirf zaroori features rakhte hain.",
`Sir, main samajh sakta hoon. Hum ek chhote, focused first version se shuru kar sakte hain jisme sirf zaroori features hon, aur baaki aage chalke add karein.

Aap bata sakte hain ki aapka comfortable range kya hoga?`,
`Sir, budget ki limit hona bilkul normal hai. Hum aksar clients ko aise plan dete hain jahan pehle phase mein basic version live hota hai aur jaise-jaise business badhta hai, features jude jate hain.

Isse aap bhari investment ke bina shuru kar sakte hain. Kya aap bata sakte hain ki kaunse 3 features aapke liye must-have hain?`,
`Sir, kya aap chahenge ki hum 2 options banayein — ek basic aur ek advanced — taaki aap compare kar sakein?`,
"Respects the limit without devaluing the work; shows a path to start small.",
"Don't say 'itna to lagega hi'. Don't pressure to stretch the budget."),
  P("Pehle price batao, phir baat karenge.", "Main galat figure nahi dena chahta — 2 minute mein requirement samajh lun?",
`Sir, aapka time bachane ke liye main seedha number batana chahta hoon, lekin bina requirement jaane woh galat ho sakta hai. Agar aap 2 minute dein to main sahi estimate arrange karwa sakta hoon.`,
`Sir, main samajhta hoon ki aap price jaanna chahte hain. Ek hi website ka cost 10 pages aur 3 pages mein bahut alag ho sakta hai. Isliye mujhe thoda scope samajhna padega.

Main 3 chhote sawal puchta hoon, uske baad main aapko batata hoon ki quotation kab tak mil sakti hai.`,
`Sir, main team se confirm karke aapko ek written quotation bhejta hoon. Aap bas yeh bata dijiye ki mujhe kaunse 3 cheezein jaan'ni hain.`,
"Honest and respectful; reframes the order — scope first, price second — without refusing to help.",
"Don't give a 'starting from' price. Don't get defensive."),
  P("Aapke rates dusre se zyada kyon hain?", "Scope aur support compare karke dekhna chahiye.",
`Sir, rate ki tulna se pehle ye dekhna zaroori hai ki dono mein kya included hai — design, features, testing aur support. Aap unki quotation share karein, hum compare karke honestly bata denge.`,
`Sir, mujhe pata nahi ki aapko dusre ne kya diya hai, isliye main unse compare nahi karunga. Lekin main yeh keh sakta hoon ki hum scope, quality aur communication ko clear rakhte hain.

Agar aap unka scope share karte hain to hum dekh sakte hain ki dono mein features aur support mein kya farak hai.`,
`Sir, aap decision lene se pehle sirf price nahi, ye bhi dekhiye ki launch ke baad kaun support karega aur ownership kis ke paas rahegi.`,
"Moves the conversation to comparable scope; avoids defending a price you haven't seen compared.",
"Never attack the competitor. Never claim to be 'cheapest' or 'best'."),
  P("Sirf ek simple website chahiye, itna kyon lagega?", "Simple website ho to scope chhota hoga — details jaan lun?",
`Sir, agar aapko ek simple website chahiye to scope bhi chhota hoga aur cost bhi uske hisaab se hogi. Kitne pages aur kaunse features chahiye, yeh batayein to main sahi plan bana dunga.`,
`Sir, aap bilkul sahi keh rahe hain ki simple chahiye to simple banega. Hum jaanna chahte hain ki 'simple' ka matlab aapke liye kya hai — 4-5 pages, contact form, ya kuch aur?

Jab humein exact pata hoga, tab hum aapko unnecessary cheezon ke bina ek focused quotation de sakte hain.`,
`Sir, kya aap bata sakte hain ki kaunsi cheez aapko zyada lag rahi hai? Main uska reason samjha sakta hoon ya scope adjust kar sakta hoon.`,
"Agrees with the customer's own wish for simplicity and uses it to define a smaller scope.",
"Don't upsell features. Don't imply the customer doesn't understand."),
  P("Monthly kuch aur charge to nahi lagega?", "Ongoing costs quotation mein clearly bataye jaate hain.",
`Sir, achha sawal hai. Jaise hosting, domain renewal ya maintenance jaise ongoing kharche project ke hisaab se alag ho sakte hain. Hum quotation mein ye sab clearly likh denge taaki koi surprise na ho.`,
`Sir, kisi bhi project mein ek-baar ka development cost aur ongoing kharche — jaise hosting, domain renewal aur third-party services — alag hote hain. Hum chahte hain ki aapko shuru mein hi sab pata ho.

Main team se confirm karke aapko quotation mein yeh sab separately dikhane ko kahunga.`,
`Sir, aap kisi bhi hidden cost ke bare mein pehle hi puch sakte hain. Hum transparency ko priority dete hain.`,
"Transparency about running costs builds trust; the customer fears surprises.",
"Don't say 'koi extra charge nahi'. Don't quote hosting prices.", { pending: true }),

  // ───────── COMPETITION ─────────
  C("Dusri company saste mein bana rahi hai.", "Price ke saath scope aur support bhi compare karein.",
`Sir, ho sakta hai. Price ke saath ye bhi dekhna zaroori hai ki scope mein kya-kya included hai. Agar aap unki quotation share karein, to hum features, support aur timeline compare karke aapko honest suggestion de sakte hain.`,
`Sir, achha hai ki aap options compare kar rahe hain. Do quotations ki tulna karte waqt ye dekhiye ki design customised hai ya template, testing aur security shamil hai ya nahi, aur launch ke baad support kaisa hoga.

Main aapko ek chhoti checklist bhej deta hoon jisse aap kisi bhi company se yeh sawal puch sakte hain.`,
`Sir, main yeh nahi kahunga ki wo galat hain. Bas aap kisi bhi company ko choose karne se pehle ownership aur support ki baat zaroor clear kar lijiye.`,
"Respects the customer's comparison, avoids bad-mouthing, and gives them a helpful framework.",
"Never criticise another company. Never match a price immediately.", { quick: true, popular: true }),
  C("Mere dost ka bhai bhi website banata hai.", "Achha hai — main aapko compare karne ke liye checklist de deta hoon.",
`Sir, achha hai ki aapke paas ek option hai. Kisi bhi developer ke saath kaam karne se pehle ye dekhna achha rehta hai ki support, timeline aur ownership ki baat clear ho.

Hum bhi aapko apna proposal denge, aap dono compare kar sakte hain.`,
`Sir, personal relation mein kaam karna comfortable hota hai, aur kai baar achha bhi rehta hai. Hum sirf itna kehna chahte hain ki kisi bhi project ke liye written scope aur timeline hona zaroori hai.

Aap hamara proposal bhi dekh lijiye, phir aap jo behtar samjhen woh choose kijiye.`,
`Sir, ek baar hamari quotation dekhkar compare kar lijiye — humein koi jaldi nahi hai.`,
"Never competes with the 'friend' option; positions Nextrova as a professional benchmark.",
"Don't say 'dost se kaam karwana risky hota hai'."),
  C("Freelancer se karwa lunga, wo sasta padega.", "Freelancer aur company dono ke fayde-nuksan hote hain; aap compare kar lein.",
`Sir, freelancers kai baar achhe aur sasta option hote hain. Company aur freelancer ke beech difference mostly team, continuity aur support ka hota hai. Aap dono ko compare kar sakte hain.`,
`Sir, freelancer aur company dono ke apne fayde hain. Freelancer mein cost kam ho sakta hai; company mein ek poori team hoti hai jo design, development aur support dekhti hai.

Aapki priority kya hai — kam cost ya continuity aur team support? Uske hisaab se sahi decision lena aasan ho jayega.`,
`Sir, agar aap freelancer chunte hain to bhi ye zaroor poochiye ki source code, hosting aur domain ki ownership kiske paas rahegi.`,
"Gives a fair comparison, positions Nextrova on team and continuity without insulting freelancers.",
"Don't call freelancers unreliable. Don't claim a large team size (unverified)."),
  C("Ready-made template se bana lunga.", "Template ek option hai; aapki zaroorat ke hisaab se compare karein.",
`Sir, templates simple zaroorton ke liye ek achha option ho sakte hain. Agar aapko unique design ya custom features chahiye hote hain, to custom development better hota hai. Aapko kaunsi zaroorat hai?`,
`Sir, template jaldi aur kam kharche mein tayar ho jata hai, jabki custom development aapke business ke hisaab se banaya jata hai. Kaun sa behtar hai woh aapki requirement par depend karta hai.

Agar aap bata dein ki aapko kya chahiye, main honestly suggest kar sakta hoon ki template theek rahega ya nahi.`,
`Sir, hum aapko bata sakte hain ki aapki zaroorat template se pooori ho sakti hai ya nahi. Is par hamari taraf se koi pressure nahi hai.`,
"Honest advice earns trust — sometimes a template is truly enough.",
"Don't dismiss templates. Don't oversell custom work."),
  C("AI se khud bana lunga.", "AI se prototype ban sakta hai; production aur support alag baat hai.",
`Sir, AI tools se shuruaati draft jaldi ban jaata hai, ye sach hai. Lekin security, testing, performance aur long-term maintenance ke liye professional help ki zaroorat padti hai. Aap pehle try bhi kar sakte hain, aur zaroorat par hum madad kar denge.`,
`Sir, aajkal AI tools kaafi powerful hain aur hum khud bhi unka upyog karte hain. Fark yeh hota hai ki live business ke liye security, payments, data aur support ki zimmedari kaun lega.

Agar aap chahein to aap apna prototype banakar hamein dikha sakte hain, hum review karke bata denge ki live karne se pehle kya improve karna padega.`,
`Sir, aap try kijiye. Agar kabhi atak jaayein to hum yahin hain.`,
"Acknowledges reality (AI tools are useful) and focuses on responsibility, not fear.",
"Don't dismiss AI tools. Don't claim they 'never work'."),
  C("Aapse bada koi aur bhi to hai.", "Bade names ke apne fayde hain; hum focus aur personal attention dete hain.",
`Sir, bilkul, market mein kai bade naam hain. Hum aapki requirement par focus karte hain aur aapko seedha communication dene ki koshish karte hain. Aap compare zaroor kijiye.`,
`Sir, har company ka apna size aur approach hota hai. Hum aapko seedhe humari team se baat karne ka mauka dete hain aur aapki requirement ke hisaab se kaam karte hain.

Aap jis bhi company se baat kar rahe hain, unse puchiye ki aapka project kaun dekhega aur aapko kaun update dega.`,
`Sir, agar aap chahein to hum ek short video call kar lein, aap khud decide kar sakte hain ki aapko hamari team se comfort aata hai ya nahi.`,
"Moves the comparison to communication and attention — areas where a smaller team can compete honestly.",
"Don't claim better quality than named companies. Don't invent client names."),
  C("Aapki company naayi lagti hai.", "Hum Bengaluru-based hain; aap verify kar sakte hain.",
`Sir, aapki baat samajh sakta hoon. Hum Bengaluru se kaam karte hain, aap hamari website nextrovalabs.in dekh sakte hain. Hum chahte hain ki aap comfortable hokar hi decide karein.`,
`Sir, naye hone ka matlab yeh nahi ki kaam kam ho — lekin aapka sandeh bhi valid hai. Hum aapko website, official number aur video call ke zariye hamse milne aur verify karne ka mauka dete hain.

Aap chahein to chhote project ya phased approach se shuru kar sakte hain taaki risk kam rahe.`,
`Sir, aap pehle ek chhota discovery meeting kar lijiye. Pasand aaye to aage badhiye.`,
"Honesty about limits and offering verification beats claiming experience you can't prove.",
"Never invent years of experience, project counts or clients.", { pending: true }),

  // ───────── URGENCY ─────────
  U("Mujhe jaldi chahiye, 1 hafte mein.", "Pehle scope dekhna hoga, phir realistic timeline bataunga.",
`Sir, aapki urgency main samajhta hoon. Timeline scope par depend karti hai; ek simple version jaldi ho sakta hai. Main team se confirm karke aapko realistic date bataunga.`,
`Sir, jaldi chahiye to hum ek first version ko priority de sakte hain jisme sirf zaroori pages aur features ho, aur baaki baad mein jodein. Isse aapki date bhi meet ho sakti hai aur quality par bhi asar nahi padega.

Aap bata sakte hain ki us date tak kaunse features zaroori hain?`,
`Sir, kya koi event ya launch date hai jiske liye aapko chahiye? Hum us date ko dhyan mein rakhkar plan karenge.`,
"Accepts the urgency, offers phasing as the honest way to meet a date, and checks with the team.",
"Never agree to a date without checking. Never quote a fixed number of days.", { pending: true }),
  U("Website kitne din mein banegi?", "Timeline requirement par depend karti hai — scope clear karke bataunga.",
`Sir, timeline website ke size aur features par depend karti hai. Requirement samajhne ke baad main aapko realistic timeline confirm karunga. Aapko kab tak chahiye?`,
`Sir, simple website mein kam time lagta hai, aur jisme zyada features ya customisation ho usme zyada. Content jaldi milne par bhi timeline par asar padta hai.

Main aapse 4-5 cheezein jaan leta hoon, phir hamari team se confirm karke aapko ek clear date batata hoon.`,
`Sir, aapki taraf se kab tak chahiye? Us hisaab se hum feasibility check kar lete hain.`,
"Asks for THEIR deadline and gives a factor-based answer instead of a number that may be wrong.",
"Do not quote any specific number of days or weeks; official timelines are pending admin confirmation.", { quick: true, popular: true, pending: true }),
  U("App kitne din mein banega?", "App ki timeline scope par depend karti hai — pehle features samajh lun.",
`Sir, app ki timeline features, platforms aur integrations par depend karti hai. Pehle main requirement samajh leta hoon, phir team se realistic estimate confirm karwa dunga.`,
`Sir, ek simple app aur ek complex app ki timeline mein kaafi fark hota hai. Android ya iPhone ya dono, admin panel, payments — in sab se time badhta hai.

Agar aap batayein ki aapko pehle version mein kya zaroori hai, to main ek phased plan suggest kar sakta hoon.`,
`Sir, kya aapka koi launch date hai? Uske hisaab se hum pehle version ka scope decide kar sakte hain.`,
"Same logic as websites: honest factors, ask for the date, offer phasing.",
"No fixed week count. Don't promise store approval dates.", { pending: true }),
  U("Aaj hi final karo, kal chahiye.", "Main sahi aur realistic commitment dena chahta hoon.",
`Sir, main aapki jaldi samajhta hoon. Lekin jaldbaazi mein galat commitment karna aapke liye sahi nahi hoga. Main abhi senior team se baat karke aapko aaj hi jawab deta hoon.`,
`Sir, kuch cheezein jaldi ho sakti hain — jaise requirement lena aur proposal. Lekin pura kaam ek din mein hona realistic nahi hoga.

Main aaj hi team se baat karke aapko batata hoon ki kya jaldi ho sakta hai.`,
`Sir, aap bata dijiye ki kal tak kya hona sabse zaroori hai. Hum uske hisaab se priority set karenge.`,
"Protects the relationship by being honest about speed, while giving a same-day action.",
"Never promise impossible delivery. Never say 'ho jayega' without checking."),
  U("Ek mahine baad shuru karna hai, abhi kya baat karni.", "Abhi baat karne se planning aur quotation tayar rahegi.",
`Sir, theek hai. Abhi baat karne se aapko planning aur budget clear ho jayega, aur jab aap shuru karna chahein, tab sab kuch tayar hoga. Kya main aapko ek quotation bhej doon?`,
`Sir, kai clients planning pehle se kar lete hain taaki shuruat ke time par koi delay na ho. Abhi hum requirement, content aur design ki direction final kar sakte hain.

Aap jab chahein tab kaam shuru kar sakte hain. Kya main 10 minute mein basic requirement note kar loon?`,
`Sir, theek hai. Main ek mahine baad aapko reminder call kar dunga. Tab tak agar kuch poochna ho to aap puch sakte hain.`,
"Treats an early enquiry as valuable without forcing a start.",
"Don't invent price-lock or time-limited offers."),
  U("Festival se pehle chahiye.", "Festival date ke hisaab se scope tay karte hain.",
`Sir, festival ke time ek fixed date hoti hai, isliye hum us date ko dhyan mein rakhkar planning karte hain. Aap bataiye festival kab hai, main team se feasibility check kar leta hoon.`,
`Sir, festival ke liye hum ek focused page ya campaign website ko priority de sakte hain. Isse chhote scope mein jaldi launch ho sakta hai.

Aap mujhe exact date aur kya chahiye bata dijiye, hum realistic jawab denge.`,
`Sir, agar poora project us date tak possible na ho to hum ek chhota pehla version us date tak target kar sakte hain.`,
"Date-driven requests need a smaller first scope; this is honest and workable.",
"Don't promise to meet a festival date before verification.", { pending: true }),

  // ───────── UNCERTAINTY ─────────
  N("Mujhe sochna padega.", "Bilkul Sir, kaunsi baat sochne par majboor kar rahi hai?",
`Bilkul Sir, soch samajhkar decision lena achha hai. Kya aap bata sakte hain ki kaunsi baat aapko sochne par majboor kar rahi hai — budget, timeline ya kuch aur? Main usme help kar sakta hoon.`,
`Sir, main aapko jaldbaazi mein nahi daalna chahta. Aap sochiye, lekin agar aap bata dein ki aapko kaunsi cheez abhi clear nahi hai, to main uske baare mein aapko information bhej sakta hoon.

Kya main kal shaam ko ek baar follow-up kar sakta hoon?`,
`Sir, main aapko ek short summary WhatsApp par bhej deta hoon taaki sochne mein aasani ho.`,
"Respects the need to think while gently surfacing the hidden concern.",
"Don't say 'offer kal khatam ho jayega'. Don't pressure.", { quick: true, popular: true }),
  N("Pata nahi mujhe app chahiye ya website.", "Aapke goal ke hisaab se honestly suggest karunga.",
`Sir, koi baat nahi, bahut se log yahi sochte hain. Aap bata dein ki aapka goal kya hai aur customers kaun hain, main honestly bata dunga ki website, app ya dono mein se kya sahi rahega.`,
`Sir, website ko koi bhi browser se khol sakta hai aur naye customers tak pahunchne ke liye achhi hoti hai. App tab useful hota hai jab aapke customers baar-baar use karein.

Aapke customers ko aap kaise judte hue dekhna chahte hain? Uske baad hum decide kar lenge.`,
`Sir, kai baar pehle website banakar baad mein app banana practical hota hai. Aapki situation ke hisaab se hum dono option dikha sakte hain.`,
"Honest advice instead of pushing the larger product — builds trust.",
"Don't default to the costlier option."),
  N("Mujhe technical kuch samajh nahi aata.", "Koi baat nahi, hum aasan bhasha mein samjha denge.",
`Sir, koi baat nahi, aapko technical samajhne ki zaroorat nahi. Aap bas apna business aur goal bataiye, technical side hum aasan bhasha mein samjha denge.`,
`Sir, bahut saare business owners technical nahi hote, aur yeh bilkul theek hai. Hum jargon se bachkar, simple examples se baat karte hain.

Aap sirf yeh batayein ki aapko kya result chahiye, baaki hum guide karenge.`,
`Sir, aap jab bhi koi term samajh na aaye, bas poochh lijiye. Main roz-marra ki misaal se samjhaunga.`,
"Removes fear of ignorance and positions you as a guide.",
"Never use jargon. Never imply the customer should 'already know'."),
  N("Mujhe yeh sab pata nahi, aap hi decide kar do.", "Main suggest karunga, final decision aapka rahega.",
`Sir, main aapko suggestion de sakta hoon, lekin final decision aapka hoga. Pehle main aapke business ke baare mein samajh leta hoon, phir aapko 2-3 options simple bhasha mein bataunga.`,
`Sir, aap bharosa karte hain, yeh achhi baat hai. Hum aapko aisi recommendation denge jo aapke goal aur budget ke hisaab se sahi ho, aur uske reasons bhi samjhayenge.

Main sirf aapse 4-5 sawal puchta hoon taaki sahi suggestion de sakun.`,
`Sir, hum aapko ek simple comparison de denge — kya milega, kya nahi — taaki aap khud bhi comfortable ho sakein.`,
"Accepts the delegation of trust and responsibly keeps the customer in control.",
"Don't decide silently. Don't upsell because they gave you freedom."),
  N("Mujhe pata nahi ye project chalega ya nahi.", "Chhota shuru karke test kar sakte hain.",
`Sir, aapka sandeh valid hai. Isi liye hum chhote first version se shuru karne ka suggestion dete hain, jisse aap bina bade risk ke test kar sakein.`,
`Sir, har nayi cheez mein uncertainty hoti hai. Ek MVP ya chhoti website se aap dekh sakte hain ki customers ka response kaisa hai, aur uske baad aage badh sakte hain.

Main aapko bata sakta hoon ki pehle phase mein sirf kya-kya rakhna chahiye.`,
`Sir, aap kisi bhi decision ke liye data dekhkar aage badhiye. Hum phased approach mein help kar sakte hain.`,
"Reduces perceived risk with a small, testable step. No promises about success.",
"Don't promise that the project will succeed or earn money."),
  N("Bahut saare options hain, confuse ho gaya hoon.", "Chaliye teen simple sawalon se clear karte hain.",
`Sir, confusion natural hai. Main aapse teen simple sawal puchta hoon — aapka goal, budget aur timeline. Uske baad main aapko sirf 2 options suggest karunga.`,
`Sir, bahut options hone par decision mushkil lagta hai. Hum sab kuch ek saath nahi dekhte; pehle sirf aapka goal clear karte hain aur uske baad hi options dikhate hain.

Kya main aapko ek chhoti comparison sheet WhatsApp par bhej doon?`,
`Sir, hum ek short call mein sab clear kar sakte hain. Kal 15 minute mil sakte hain?`,
"Reduces cognitive load by narrowing choices.",
"Don't add more options. Don't use technical terms."),
  N("Kya guarantee hai ki kaam sahi hoga?", "Hum written scope aur milestones ke saath kaam karte hain.",
`Sir, aap sahi sawal puch rahe hain. Hum written scope aur clear communication ke saath kaam karte hain, taaki aapko pata ho ki aapko kya milega. Specific terms main aapko quotation mein confirm karunga.`,
`Sir, koi bhi imandaar company results ya business success ki guarantee nahi de sakti. Lekin hum clear scope, regular updates aur aapke feedback ke saath kaam karte hain taaki aap tak sahi cheez pahunche.

Exact commitments aur terms quotation mein likhe jate hain.`,
`Sir, aap hamari team se video call par milkar apne sawal puch lijiye, uske baad aap comfortable ho jayenge.`,
"Replaces a vague 'guarantee' with concrete, verifiable commitments.",
"Never promise sales, ranking, results or lifetime warranty.", { pending: true }),

  // ───────── TRUST ─────────
  T("Aapki company kahan hai?", "Hum Bengaluru-based hain; website nextrovalabs.in par details hain.",
`Sir, Nextrova Labs Bengaluru-based hai. Aap hamari website nextrovalabs.in par details dekh sakte hain. Main aapko WhatsApp par link bhi bhej deta hoon.`,
`Sir, hum Bengaluru se kaam karte hain, aur aap hamari website tatha official phone number se verify kar sakte hain. Hum remote bhi kaam karte hain, aur video call par aapse mil sakte hain.

Agar aapko kisi bhi cheez par doubt ho to aap seedha puch lijiye.`,
`Sir, hamari website par company ki information hai. Chahein to hum ek video call bhi arrange kar sakte hain.`,
"Gives only verified facts (location, website) and invites verification.",
"Do not give a street address (none verified). Do not claim an office you can't confirm.", { quick: true, popular: true, pending: true }),
  T("Mujhe aap par bharosa nahi hai.", "Aapka sandeh valid hai; aap verify kijiye.",
`Sir, aapka sandeh bilkul valid hai. Aap hamari website dekh sakte hain, official number par baat kar sakte hain, aur video call par bhi mil sakte hain. Main chahta hoon ki aap poori tarah comfortable hokar hi aage badhein.`,
`Sir, trust ek baar mein nahi banta. Isi liye hum aapko jaldbaazi mein koi decision lene ke liye nahi kehte. Aap hamari team se milein, sawal puchein aur tab decide karein.

Aap chahein to hum ek chhote phase se shuru kar sakte hain.`,
`Sir, aap mujhe bataiye ki aapko kis cheez se sabse zyada darr lagta hai — payment, quality ya delay? Main uske baare mein clearly bataunga.`,
"Acknowledges distrust without defensiveness and invites verification at no cost.",
"Never say 'humpe bharosa karo'. Never pressure for advance."),
  T("Advance dene ke baad aap gayab to nahi ho jayenge?", "Aapka darr samajh sakta hoon; communication aur milestones clear honge.",
`Sir, aapka concern bilkul sahi hai. Hum chahte hain ki aapko hamesha pata ho ki kaam kahan tak pahuncha hai. Payment aur milestone terms quotation mein written hote hain.`,
`Sir, kayi logon ko aisa experience hua hai, isliye aapka darr samajh aata hai. Hum written agreement, clear milestones aur ek point of contact ke saath kaam karte hain.

Agar aap chahein to hum payment ko milestones mein baantne ke options team se confirm karke bata sakte hain.`,
`Sir, aap hamari website aur official number ko verify kar lijiye, aur video call par team se mil lijiye.`,
"Addresses the fear head-on with process, not slogans.",
"Don't promise refund terms. Don't say 'hum aisa kabhi nahi karte'.", { pending: true }),
  T("Mere idea ko chura to nahi lenge?", "Aapka idea aapka hai; NDA ke liye team se confirm karunga.",
`Sir, aapka idea aapka hai aur hum use professionally handle karte hain. Agar aapko NDA ya confidentiality agreement chahiye to main team se confirm karke aapko process bata dunga.`,
`Sir, yeh chinta bahut common hai aur valid bhi. Aap shuru mein apna idea utna hi share kijiye jitna aap comfortable hon. Detailed discussion se pehle agar aap confidentiality agreement chahte hain to hum us par baat kar sakte hain.`,
`Sir, aapka idea execute karne mein zyada mehnat lagti hai, par fir bhi agar aap NDA chahte hain, main team se confirm karta hoon.`,
"Takes the fear seriously and offers a process without legal promises.",
"Don't promise legal protection or NDA before confirming.", { pending: true }),
  T("Pehle koi kaam dikhao.", "Relevant approved samples team se confirm karke dikhata hoon.",
`Zaroor Sir, main aapki requirement ke hisaab se relevant approved samples team se confirm karke aapko bhejta hoon. Aap kaunsa type dekhna chahte hain — website, app ya e-commerce?`,
`Sir, aap kaam dekhna chahte hain, yeh bilkul sahi hai. Main aapko approved examples aur, jahan possible ho, live links bhejunga. Jo cheezein confidential hain woh hum share nahi kar sakte.`,
`Sir, aap hamari website par bhi hamara kaam aur style dekh sakte hain. Phir aap batayein ki aapko kya pasand aaya.`,
"Agrees to show proof but only with approved material.",
"Never show unapproved projects or invent a client list.", { pending: true }),
  T("Reviews ya testimonials dikhao.", "Verified reviews hi share karunga; team se confirm karta hoon.",
`Sir, main aapko sirf verified aur approved feedback hi dikhana chahta hoon. Main team se confirm karke aapko batata hoon ki kya share kiya ja sakta hai.`,
`Sir, hum chahte hain ki aap jo bhi dekhein woh real ho. Isliye main aapko tab hi reviews bhejunga jab team confirm kare ki woh approved hain.

Tab tak aap hamari website aur video call se hamare kaam ka andaza le sakte hain.`,
`Sir, aap hamari team se baat karke direct pooch sakte hain ki hum kaise kaam karte hain.`,
"Honesty about not inventing reviews is itself trust-building.",
"NEVER fabricate testimonials or ratings.", { pending: true }),
  T("Aap logon ka koi contract hota hai ya sirf zubaani?", "Hum written quotation aur terms ke saath kaam karte hain.",
`Sir, hum written quotation aur terms ke saath kaam karte hain, taaki scope aur payment clearly likha ho. Contract ke exact format ke baare mein main team se confirm karke bata dunga.`,
`Sir, zubaani commitment se bachna sahi hai. Humari taraf se scope, timeline aur payment written mein hote hain.

Main aapko process aur document ki details team se confirm karke bhejta hoon.`,
`Sir, aap agreement ka draft pehle dekhna chahenge to hum arrange kar sakte hain.`,
"Written agreements protect both sides; you commit only to what is confirmed.",
"Don't promise legal documents you haven't verified.", { pending: true }),

  // ───────── TECHNICAL ─────────
  X("Source code milega?", "Source code ownership quotation mein clearly bataya jata hai.",
`Sir, source code aur ownership ke terms project ke hisaab se quotation mein clearly likhe jate hain. Main team se confirm karke aapko exact terms bata dunga.`,
`Sir, yeh important sawal hai. Ownership ke terms — jaise source code, domain aur hosting — hum shuru mein hi written mein clear karte hain taaki baad mein koi confusion na ho.

Main aapko team se confirm karke batata hoon ki aapke project mein kya milega.`,
`Sir, aap shuru mein hi ownership clear karna chahte hain, yeh bahut samajhdari hai.`,
"Treats ownership as a legitimate concern and commits only to written clarity.",
"Do NOT say yes or no — source-code handover is a company policy to be confirmed.", { quick: true, popular: true, pending: true }),
  X("Maintenance milega?", "Support aur maintenance options quotation mein bataye jaate hain.",
`Sir, launch ke baad support aur maintenance ki zaroorat hoti hai. Options aur terms hum quotation mein clearly bata denge. Aapko kis tarah ka support chahiye?`,
`Sir, website ya app live hone ke baad bhi updates, bug fixes aur security ki zaroorat padti hai. Hum aapko maintenance ke options aur unka scope written mein dikhayenge.

Aap bata dein ki aap ek-baar ka support chahte hain ya regular maintenance.`,
`Sir, maintenance ka exact structure team se confirm karke bhejta hoon.`,
"Shows you plan for life after launch without improvising terms.",
"Don't promise free lifetime support or response times.", { quick: true, popular: true, pending: true }),
  X("App Play Store par publish hoga?", "Haan Sir, publishing mein guidance denge; store ke rules ke hisaab se.",
`Ji Sir, hum app ko Play Store aur App Store par publish karne mein aapki help kar sakte hain. Store ki fees aur review process Google aur Apple ke apne rules par hote hain.`,
`Sir, publishing ke liye aapko developer account chahiye hota hai, jo aapke naam par hona best hai taaki app ki ownership aapke paas rahe.

Hum process mein guide karenge. Approval ka time aur final decision stores ka hota hai.`,
`Sir, kya aapke paas Google Play ya Apple developer account pehle se hai?`,
"Answers yes to the goal while being clear about what is outside your control.",
"Never guarantee approval, dates or store fees.", { quick: true, popular: true }),
  X("Website mobile par bhi chalegi?", "Haan, website mobile-friendly design ke saath banti hai.",
`Ji Sir, hum website ko aise design karte hain ki woh mobile, tablet aur laptop teeno par theek se dikhe.`,
`Sir, aajkal zyada tar log phone se hi website dekhte hain, isliye responsive design zaroori hai. Hum design aur testing mein yeh dhyan rakhte hain.

Specific devices ya browsers ki koi special requirement ho to aap bata dijiye.`,
`Sir, aap apne customers ke device ke baare mein bataiye, uske hisaab se hum zyada dhyan denge.`,
"A simple yes plus a reason; customers care about their audience.",
"Don't promise pixel-perfect on every device."),
  X("Admin panel milega kya?", "Zaroorat ke hisaab se admin panel scope mein rakha ja sakta hai.",
`Ji Sir, agar aap khud content ya orders manage karna chahte hain to admin panel scope mein rakha ja sakta hai. Aapko admin panel par kya-kya control chahiye?`,
`Sir, admin panel se aap bina coding ke apna content ya orders update kar sakte hain. Isse features ke hisaab se scope aur cost mein farak padta hai, isliye hum pehle hi decide kar lete hain ki aapko kya control chahiye.`,
`Sir, kya aapka staff bhi admin panel use karega? Uske hisaab se access levels plan karenge.`,
"Says yes to the capability but ties it to scope.",
"Don't say 'admin panel free hai'."),
  X("Website secure hogi na? Hack to nahi hogi?", "Hum secure development practices follow karte hain; 100% ki guarantee koi nahi deta.",
`Sir, hum secure development practices follow karte hain. 100% hack-proof ki guarantee koi bhi imandaar company nahi de sakti, lekin hum risk kam karne ke liye sahi tareeke apnate hain.`,
`Sir, security ek continuous process hai. Hum secure login, access control aur updates jaise basic practices follow karte hain. Aapke project ke hisaab se kya zaroori hai woh hum quotation mein define karte hain.

Aapke paas koi specific security requirement ho to bataiye.`,
`Sir, aapki website par kya sensitive data aayega? Usse hum security ki zaroorat samajh sakte hain.`,
"Honest about limits; shows practice rather than absolute claims.",
"Never claim 'hack-proof' or cite security certifications.", { popular: true }),
  X("Kya aap WordPress use karte hain?", "Technology aapki requirement ke hisaab se choose karte hain; main team se confirm karta hoon.",
`Sir, technology hum aapki requirement ke hisaab se choose karte hain. Main aapko technical team se confirm karke bata dunga ki aapke project ke liye kya suitable rahega.`,
`Sir, kaun si technology use hogi yeh aapke project ke features, aapke content update karne ke tareeke aur future growth par depend karta hai.

Main team se confirm karke aapko likhit mein bhej deta hoon.`,
`Sir, aapko kisi specific technology ki zaroorat ya preference hai kya?`,
"Avoids claiming a tech stack that has not been verified.",
"Don't state technologies as company policy.", { pending: true }),
  X("Mere pehle se software chal rahe hain, connect honge?", "Integration possible hai ya nahi, yeh software par depend karta hai.",
`Sir, integration possible hoga ya nahi, yeh us software ke API par depend karta hai. Aap software ka naam bata dijiye, hum check karke honestly bata denge.`,
`Sir, kai software API ke zariye connect ho jate hain, aur kai nahi. Main technical team se check karwa leta hoon, aur uske baad aapko clear jawab dunga.

Aap bata dein ki aap kaunsa software kis kaam ke liye use kar rahe hain.`,
`Sir, kya aap us software ki vendor details share kar sakte hain?`,
"Honest verification instead of overpromising.",
"Never say 'koi bhi software connect ho jayega'."),
  X("Hosting aur domain aap dilwaoge?", "Hum guide karenge; ownership aapke naam par honi chahiye.",
`Sir, hum domain aur hosting lene mein aapki guidance karenge. Best practice yeh hai ki dono aapke naam par register hon taaki ownership aapke paas rahe.`,
`Sir, hosting aur domain ke options project ki zaroorat par depend karte hain. Hum aapko batayenge ki kya suitable hai.

Kya hum yeh sab quotation mein include karenge ya alag se, yeh main team se confirm karke aapko bataunga.`,
`Sir, kya aapke paas pehle se domain ya hosting hai?`,
"Promises guidance, not specific inclusions.",
"Don't promise free hosting or domain.", { pending: true }),
  X("Meri website Google par top par aayegi na?", "Ranking ki guarantee koi nahi de sakta; search-friendly foundation denge.",
`Sir, Google ranking ki guarantee koi bhi imandaar company nahi de sakti. Hum website ko search-friendly banate hain, lekin ranking Google aur competition par depend karti hai.`,
`Sir, achhi SEO foundation se aapki website ko search engines ke liye samajhna aasan hota hai. Lekin top par aana time, content aur competition par depend karta hai.

Agar aap chahein to hum SEO ke baare mein aur detail mein baat kar sakte hain.`,
`Sir, kaun se keywords ya area mein aapko visibility chahiye? Usse hum realistic expectations set kar sakte hain.`,
"Honesty here avoids the most common source of future disputes.",
"NEVER guarantee rankings, traffic or leads.", { popular: true }),

  // ───────── DELAY ─────────
  D("Abhi nahi, 2-3 mahine baad dekhte hain.", "Theek hai Sir, main 2 mahine baad ek baar check karunga.",
`Koi baat nahi Sir, main samajh sakta hoon. Kya main 2 mahine baad ek baar aapse connect kar sakta hoon? Tab tak aap jab chahein humein call kar sakte hain.`,
`Sir, theek hai. Agar aap chahein to main abhi aapki requirement note kar leta hoon, taaki jab aap shuru karna chahein to hum wahin se continue kar sakein.

Aap bata dein ki kya abhi priority kam hai ya budget ka issue hai?`,
`Sir, main aapko ek WhatsApp par hamari details bhej deta hoon, aap jab chahein humein contact kar sakte hain.`,
"Preserves the relationship with a light, specific follow-up.",
"Don't invent expiring offers. Don't push.", { popular: true }),
  D("Abhi busy hoon, baad mein call karo.", "Bilkul, aap kaunsa time prefer karenge?",
`Bilkul Sir. Aap kaunsa time prefer karenge — aaj shaam ya kal subah? Main usi time par call karunga.`,
`Sir, aapka time important hai. Main sirf 5 minute lunga. Aap bata dein ki kab free honge, main apne calendar mein note kar leta hoon.`,
`Sir, kya main aapko WhatsApp par ek message bhej doon, aur aap jab free hon tab reply kar dein?`,
"Turns 'baad mein' into a specific time.",
"Don't continue pitching on a busy call."),
  D("Content ready nahi hai, ruk jao.", "Koi baat nahi, hum content ki checklist bhej dete hain.",
`Sir, koi baat nahi. Main aapko ek simple checklist bhej deta hoon ki kaunsa content kab tak chahiye. Jab aap taiyaar hon, hum shuru kar denge.`,
`Sir, content ke liye hum aapko guide kar sakte hain ki kya-kya chahiye — logo, photos, text. Aap apne speed se tayar kijiye.

Is beech hum design ki direction aur structure final kar sakte hain.`,
`Sir, main 1 hafte baad ek baar reminder call kar dunga.`,
"Turns a delay into a helpful next step.",
"Don't promise to write all content free."),
  D("Pehle ek project khatam kar lun, phir.", "Theek hai, main aapke project ke baad baat karunga.",
`Bilkul Sir, aapka current project important hai. Aap bata dein ki lagbhag kab tak free honge, main usi hisaab se aapse connect karunga.`,
`Sir, theek hai. Agar aap chahein to planning abhi kar lete hain aur kaam baad mein shuru karte hain, taaki aap ready rahein.`,
`Sir, kya main aapko ek reminder call 3-4 hafte baad kar sakta hoon?`,
"Respects priorities; maintains contact without pressure.",
"Don't compete with their current work."),
  D("Ghar mein baat karke bataunga.", "Bilkul Sir, aap sabse baat karke bata dijiye.",
`Bilkul Sir, family ya partners ke saath discuss karna achha hota hai. Main aapko ek chhoti summary bhej deta hoon, jisse sabko samajhna aasan ho.`,
`Sir, agar aap chahein to hum ek short joint call arrange kar sakte hain jisme aapke family ya partners ke sawal bhi clear ho jayen.`,
`Sir, kya main kal ya parson ek baar aapse connect kar sakta hoon?`,
"Offers a summary and a joint call to help the real decision.",
"Don't pressure or bypass the person."),
  D("Pehle company mein baat karni padegi, tab batata hoon.", "Theek hai, kya main un decision makers ke liye ek proposal bhej doon?",
`Sir, bilkul. Main ek chhota proposal ya overview bhej deta hoon jo aap apne team ke saath share kar sakte hain. Kya main us meeting mein jud sakta hoon?`,
`Sir, company decisions mein time lagta hai. Agar aap chahein to hum ek presentation tayar kar sakte hain jo aapke decision makers ke liye clear ho.

Kisko-kisko approval dena hota hai, kya aap bata sakte hain?`,
`Sir, aap hamari taraf se kya information chahenge jisse aapka internal approval aasan ho?`,
"Helps a champion sell internally.",
"Don't contact other stakeholders without permission."),

  // ───────── FOLLOW_UP ─────────
  F("WhatsApp par details bhejo.", "Zaroor, aur main aapki requirement ke hisaab se details bhejunga.",
`Zaroor Sir, main abhi bhej deta hoon. Aapki requirement ke hisaab se bhejun to zyada useful rahega — kya main 2 minute mein aapki requirement samajh loon?`,
`Sir, main WhatsApp par details bhej deta hoon. Sath hi ek baat — kya main kal ek baar call karke puch sakta hoon ki details aapko kaisi lagi aur koi sawal hai ya nahi?`,
`Sir, aap kaunsa number WhatsApp ke liye prefer karenge?`,
"Say yes immediately; earn conversation time by customising.",
"Don't refuse. Don't send a generic brochure.", { quick: true, popular: true }),
  F("Email kar do.", "Zaroor Sir, aap apna email bata dijiye.",
`Zaroor Sir, aap apna email address bata dijiye. Main aapko summary bhej deta hoon, aur kal ek chhota follow-up bhi karunga.`,
`Sir, email par main details bhejta hoon. Aap mujhe bata dein ki aap kya dekhna chahte hain — company details, process ya sample — taaki main wahi bhejun.`,
`Sir, kya main WhatsApp par bhi ek short message bhej doon taaki email miss na ho?`,
"Gets the email and a follow-up commitment.",
"Don't spell out the email incorrectly; repeat it back."),
  F("Aap baar-baar call kyon kar rahe hain?", "Maafi Sir, aap batayein ki kab call karna theek rahega.",
`Maafi chahta hoon Sir, agar aapko disturb hua. Aap bata dijiye ki call karna theek hai ya nahi, aur agar hai to kab.`,
`Sir, mera iraada aapko pareshaan karne ka nahi tha. Agar aap interested nahi hain to main aap ko dobara call nahi karunga. Agar interested hain to aap time batayein.`,
`Sir, agar aap pasand karein to main sirf WhatsApp par hi baat karunga.`,
"A genuine apology and control returned to the customer reduce annoyance.",
"Don't defend yourself. Respect a firm 'no' immediately and note it."),
  F("Mujhe call nahi chahiye, message karo.", "Bilkul Sir, main WhatsApp par message bhej deta hoon.",
`Bilkul Sir, main ab se sirf message karunga. Aap kab chahein to bata dijiye.`,
`Sir, aapki preference ka main respect karta hoon. Main WhatsApp par aapko ek short intro bhejta hoon, aur aap jab chahein jawab de sakte hain.`,
`Sir, kya aapko WhatsApp theek rahega ya email?`,
"Honours channel preference — builds trust.",
"Don't call again. Don't send long messages."),
  F("Meeting se pehle kuch bhej do.", "Bilkul, meeting se pehle ek short overview bhejta hoon.",
`Bilkul Sir, main meeting se pehle ek short overview bhej deta hoon, taaki aapko pata ho meeting mein kya discuss hoga.`,
`Sir, main agenda aur kuch sawal bhej deta hoon jo aapko meeting se pehle sochne hain. Isse meeting ka time bachega.`,
`Sir, kya aap koi specific cheez dekhna chahenge meeting se pehle?`,
"Prepares both sides; the meeting is more productive.",
"Don't overload with documents."),
  F("Proposal dekha, abhi decide nahi hua.", "Theek hai Sir, kya main proposal ko saath mein samjha doon?",
`Sir, theek hai. Kya aap chahenge ki hum 10 minute ke call mein proposal ko saath mein dekh lein? Isse aapke sawal clear ho sakte hain.`,
`Sir, proposal mein kaunsa hissa aapko samajh nahi aaya ya kaunsi cheez change karni hai? Main team se discuss karke aapko jawab deta hoon.`,
`Sir, aap decision lene mein jitna time chahein le sakte hain. Main aapko apni taraf se kuch bhi pending nahi chhodunga.`,
"Moves from silent waiting to a collaborative review.",
"Don't ask 'kab final karenge?' repeatedly."),

  // ───────── PROCESS ─────────
  R("Kaam kaise hota hai?", "Requirement, quotation, design, development, testing, launch.",
`Sir, hum pehle requirement samajhte hain, phir quotation aur plan dete hain, uske baad design aur development hota hai, aur aapke feedback ke saath testing aur launch.`,
`Sir, simple tareeke se: pehle hum aapki requirement samajhte hain, phir ek written plan dete hain. Uske baad design, development aur testing hoti hai, har stage par aapki feedback ke saath. Launch ke baad support ke options bhi hum batate hain.

Exact process hum meeting mein detail se samjha sakte hain.`,
`Sir, aap kisi stage ke baare mein jaanna chahte hain? Main usse detail mein bata deta hoon.`,
"Gives a simple, true-to-industry flow without claiming proprietary processes.",
"Don't promise weekly demos or a dashboard unless confirmed.", { pending: true }),
  R("Mujhe kya-kya dena padega?", "Requirement, content aur approvals.",
`Sir, aapko requirement, content — jaise logo, photos aur text — aur samay par feedback dena hoga. Hum aapko ek checklist bhej denge.`,
`Sir, hum chahte hain ki aapko kam se kam zimmedari ho, lekin kuch cheezein aapse hi aati hain: business details, content, aur design/functionality par approval.

Main aapko ek simple checklist WhatsApp par bhej deta hoon.`,
`Sir, kya aapke paas logo aur photos tayar hain?`,
"Sets expectations about the customer's role.",
"Don't say 'aapko kuch nahi karna padega'."),
  R("Kya main beech mein changes bata sakta hoon?", "Haan, feedback ke liye jagah hoti hai; bade changes scope par depend karte hain.",
`Ji Sir, kaam ke dauran feedback dena aapka haq hai. Chote improvements aur bade scope changes ke liye process alag ho sakta hai, jo hum shuru mein clear kar denge.`,
`Sir, hum feedback ko welcome karte hain. Lekin agar naye features ya bade changes aate hain, to uska scope aur timeline par asar padta hai, jise hum written mein confirm karte hain.

Isliye shuru mein hi requirement jitni clear ho, utna behtar hai.`,
`Sir, aap shuru mein jitna detail dein, hum utna acchi tarah plan kar sakenge.`,
"Honest about the change process; avoids later disputes.",
"Don't promise unlimited revisions.", { pending: true }),
  R("Mujhe baar-baar update kaun dega?", "Aapko ek point of contact milega.",
`Sir, aapko ek point of contact milega jo aapko updates dega. Communication ka exact process hum meeting mein clearly bata denge.`,
`Sir, communication ek bahut important cheez hai. Hum chahte hain ki aapko hamesha pata ho ki kaam kahan tak pahuncha hai. Aapko ek person milega jisse aap WhatsApp ya call par baat kar sakte hain.

Update ka frequency aur format hum project ke start mein tay kar sakte hain.`,
`Sir, aap kis tarah ke updates prefer karenge — call, WhatsApp ya email?`,
"Addresses a classic fear: being ignored.",
"Don't promise daily updates or 24/7 contact.", { pending: true }),
  R("Meeting ke liye office aana padega?", "Aap video ya phone par bhi meeting kar sakte hain.",
`Nahi Sir, aapko office aane ki zaroorat nahi. Hum video call ya phone par meeting kar sakte hain, jo aapko convenient ho.`,
`Sir, kaafi saare clients video call par hi kaam karte hain, aur isse aapka time aur travel bachta hai. Agar aap in-person milna chahte hain to hum availability check karke bata denge.`,
`Sir, aapko video call par Zoom ya Google Meet jaisa kaunsa platform comfortable lagta hai?`,
"Removes a friction point.",
"Don't promise an in-person meeting without confirmation."),
  R("Kya aap meri Hindi/regional language mein website banaoge?", "Multi-language website possible hai; scope mein define hoga.",
`Ji Sir, multi-language website possible hai. Kaunsi language aur kitne pages, uske hisaab se scope tay hoga.`,
`Sir, hum multiple languages ke saath website plan kar sakte hain. Content aapki taraf se hota hai ya translation ki zaroorat hai, yeh batana zaroori hoga.

Aap kaunsi languages chahte hain, bata dijiye.`,
`Sir, kya aapke customers mostly kaunsi language use karte hain?`,
"Positive answer tied to scope.",
"Don't promise translation services without scoping."),
  R("Mujhe sirf design chahiye, development nahi.", "Design alag service hai; scope dekhna padega.",
`Sir, hum design bhi karte hain. Aapko sirf design chahiye ya baad mein development bhi, yeh jaan lun to sahi quotation bana sakta hoon.`,
`Sir, UI/UX design ek alag service ki tarah ho sakti hai. Hum aapse puchenge ki aapko kitni screens ya pages chahiye aur output kis format mein chahiye.

Aap apni requirement share kijiye, hum scope tay kar lenge.`,
`Sir, kya design ke baad development bhi aap hi se karwana chahenge?`,
"Matches a verified service (design) to a clear next step.",
"Don't quote design-only prices."),
];
