import type { Diff } from "./types";
import { slugify } from "./types";

export type LessonType = "READING" | "EXAMPLE" | "ROLEPLAY" | "KNOWLEDGE_CHECK";
export type SeedLesson = { title: string; type: LessonType; minutes: number; body: string };
export type SeedModule = { title: string; lessons: SeedLesson[] };
export type SeedQuestion = { prompt: string; options: string[]; correct: number; why: string };
export type SeedCourse = {
  slug: string; number: number; title: string; summary: string; level: Diff; passing: number;
  modules: SeedModule[]; questions: SeedQuestion[];
};

const L = (title: string, type: LessonType, minutes: number, body: string): SeedLesson => ({ title, type, minutes, body });
const Q = (prompt: string, options: string[], correct: number, why: string): SeedQuestion => ({ prompt, options, correct, why });
const C = (number: number, title: string, level: Diff, summary: string, modules: SeedModule[], questions: SeedQuestion[]): SeedCourse => ({
  slug: slugify(title), number, title, level, summary, passing: 70, modules, questions,
});

export const courses: SeedCourse[] = [
  C(1, "Introduction to Nextrova Labs", "BEGINNER", "Learn who Nextrova Labs is, what it offers, and how to describe it honestly to customers.",
    [
      { title: "Know the company", lessons: [
        L("Who we are", "READING", 6, "Nextrova Labs is a Bengaluru-based software company. Its public website is https://www.nextrovalabs.in.\n\n**Say only what is verified:** location, services (web, mobile, AI/ML, cloud, design) and the website.\n\n**Do not say:** years in business, number of projects, client names or awards unless an admin has approved them in the Knowledge Base."),
        L("The services in simple words", "READING", 7, "- **Website:** an online address for the business.\n- **Mobile app:** software on the customer's phone.\n- **E-commerce:** an online store.\n- **Custom software:** a tool built for one business process.\n\nPractise explaining each in one sentence a shopkeeper would understand."),
      ]},
      { title: "Speak about the company", lessons: [
        L("A good 20-second introduction", "EXAMPLE", 5, "**Example:**\n\n'Namaste sir, main {{your name}}, Nextrova Labs se bol raha hoon — hum Bengaluru-based software company hain jo websites aur mobile apps banate hain. Kya aapke paas 2 minute hain?'\n\nNotice: name, company, what we do, permission to continue."),
        L("Roleplay: customer asks 'kaun si company hai?'", "ROLEPLAY", 8, "**Customer:** 'Aap kaun si company se ho?'\n\nPractise answering in under 20 seconds using only verified facts, then offer the website link. Record your best version in your own notes (not in this tool)."),
        L("Knowledge check", "KNOWLEDGE_CHECK", 3, "Re-read the two lessons above and attempt the course quiz."),
      ]},
    ],
    [
      Q("Where is Nextrova Labs based?", ["Mumbai", "Bengaluru", "Delhi", "Hyderabad"], 1, "The public website identifies Nextrova Labs as Bengaluru-based."),
      Q("Which of these should you NOT claim without admin approval?", ["The company website address", "The company is Bengaluru-based", "We have completed 500 projects", "We build websites"], 2, "Numbers of projects, clients and awards are unverified unless an admin approves them."),
      Q("A customer asks for the company's street address. What do you do?", ["Make one up", "Say you will confirm with the team", "Give your home address", "Refuse to talk"], 1, "Only verified facts are shared; otherwise confirm with the team."),
      Q("What should a good introduction include?", ["Only the price", "Name, company, what we do, permission to continue", "A long list of clients", "A guarantee"], 1, "A clear short introduction builds trust and respects the customer's time."),
      Q("Which phrase is honest and safe?", ["We are the best in India", "We are a Bengaluru-based software company", "We never fail", "We are the cheapest"], 1, "It is verifiable and non-exaggerated."),
    ]),

  C(2, "Understanding Website Development", "BEGINNER", "Understand what a website project involves so you can ask better questions and set honest expectations.",
    [
      { title: "How websites work", lessons: [
        L("Domain, hosting and website", "READING", 6, "The **domain** is the address. **Hosting** is where files live. The **website** is the content customers see. Domain and hosting have recurring renewals; do not quote prices."),
        L("Frontend, backend and CMS", "READING", 7, "Frontend = what users see. Backend = logic and data. A CMS/admin panel lets owners edit content without coding — ask who will update the site and how often."),
      ]},
      { title: "Scoping a website", lessons: [
        L("Questions to ask", "EXAMPLE", 6, "1. Business and goal?\n2. Pages needed?\n3. Features: forms, booking, payments?\n4. Content and logo ready?\n5. Reference websites?\n6. Launch date?\n\nWrite answers down; they become the scope."),
        L("Roleplay: a shop owner wants 'a simple website'", "ROLEPLAY", 8, "Customer: 'Mujhe ek simple website chahiye.'\n\nAsk 4 questions to understand what 'simple' means. Avoid quoting any price or timeline."),
        L("Knowledge check", "KNOWLEDGE_CHECK", 3, "Complete the quiz."),
      ]},
    ],
    [
      Q("What is a domain?", ["Where files are stored", "The website's address", "A type of design", "A payment method"], 1, "A domain is the address like example.in."),
      Q("Who should ideally own the domain and hosting account?", ["The employee", "The customer", "A random third party", "No one"], 1, "Ownership in the customer's name is best practice; specific Nextrova terms are pending admin confirmation."),
      Q("Why ask who will update the website?", ["It is not important", "It affects scope (CMS/admin panel)", "To collect personal data", "To increase price"], 1, "Editing needs change the technology and scope."),
      Q("Can anyone guarantee a Google ranking?", ["Yes", "No", "Only large companies", "Only with an app"], 1, "Rankings depend on many factors; never guarantee."),
      Q("What is a CMS used for?", ["Editing content without coding", "Making phone calls", "Collecting payments only", "Recording calls"], 0, "A CMS lets owners manage content easily."),
    ]),

  C(3, "Understanding Mobile Applications", "BEGINNER", "Learn the basics of mobile apps, platforms, publishing and phased delivery.",
    [
      { title: "App fundamentals", lessons: [
        L("Android, iPhone and both", "READING", 6, "Ask which devices the customer's users use. Both platforms increase scope. Starting with one can reduce initial investment."),
        L("Features, admin panel and integrations", "READING", 7, "Login, profiles, listings, notifications and payments are common features. An admin panel lets the owner manage the app. Every feature adds scope."),
      ]},
      { title: "Publishing and MVP", lessons: [
        L("Publishing to Play Store and App Store", "READING", 6, "Developer accounts are best in the customer's name. Fees, review and approval are decided by Google/Apple. Never promise approval or a date."),
        L("Roleplay: 'Mujhe Uber jaisa app chahiye'", "ROLEPLAY", 9, "Break a big idea into a first version. Ask: who are the users, what are the top 3 features, which platform first?"),
        L("Knowledge check", "KNOWLEDGE_CHECK", 3, "Complete the quiz."),
      ]},
    ],
    [
      Q("What is an MVP?", ["A final product with all features", "A smaller first version with essential features", "A paid advertisement", "A bug"], 1, "An MVP lets the customer test before bigger investment."),
      Q("Can you guarantee Play Store approval?", ["Yes", "No — stores decide", "Yes, within 1 day", "Only for Android"], 1, "Approval is decided by the store."),
      Q("Which question helps scope an app?", ["Who will use it and what are the top features?", "What is your salary?", "Which city do you live in?", "Do you like blue?"], 0, "Users and features define scope."),
      Q("An admin panel is for…", ["Playing games", "Managing the app's content and data", "Recording calls", "Collecting customer phone numbers for the CRM"], 1, "It lets the owner manage the product."),
      Q("A customer wants both Android and iPhone. This…", ["Does not affect scope", "Increases scope", "Reduces scope", "Is impossible"], 1, "Supporting both platforms increases work."),
    ]),

  C(4, "How to Speak Professionally with Customers", "BEGINNER", "Build respectful, clear and honest communication habits for every customer interaction.",
    [
      { title: "Tone and language", lessons: [
        L("Respect, clarity and pace", "READING", 6, "Use 'aap', 'ji' and 'sir/madam'. Speak slowly, one idea at a time, and avoid jargon. Check understanding: 'Kya yeh clear hai?'"),
        L("Mixing Hindi and English naturally", "EXAMPLE", 6, "Good: 'Hum aapki requirement samajh ke ek written quotation bhejenge.'\nAvoid heavy English technical words unless the customer uses them."),
      ]},
      { title: "Handling difficult moments", lessons: [
        L("When you don't know the answer", "READING", 5, "Say: 'Main team se confirm karke aapko batata hoon.' Then actually follow up. Honesty builds more trust than a confident guess."),
        L("Roleplay: an irritated customer", "ROLEPLAY", 8, "Customer: 'Aap baar-baar call kyon karte ho?'\n\nApologise briefly, ask for their preference, and respect a 'no' immediately."),
        L("Knowledge check", "KNOWLEDGE_CHECK", 3, "Complete the quiz."),
      ]},
    ],
    [
      Q("You don't know an answer. What is best?", ["Guess confidently", "Say you will confirm with the team and follow up", "Change the subject", "End the call"], 1, "Honest follow-up builds trust."),
      Q("Which is more professional?", ["'Arre sir, sab ho jayega'", "'Sir, main confirm karke bataunga'", "'Pata nahi'", "'Aap samajhte nahi'"], 1, "It is polite and honest."),
      Q("A customer says 'don't call me again'. You…", ["Call again tomorrow", "Apologise and note the request", "Argue", "Send ten messages"], 1, "Respect their choice."),
      Q("Heavy technical jargon with a non-technical owner…", ["Impresses them", "Confuses them", "Is required", "Speeds up the call"], 1, "Use simple everyday examples."),
      Q("What is a good habit during explanation?", ["Speak very fast", "Check understanding", "Interrupt", "Read the script monotonically"], 1, "Checking understanding keeps the conversation two-way."),
    ]),

  C(5, "First Call Mastery", "INTERMEDIATE", "Handle the opening of a call: introduction, permission to speak and a smooth move into discovery.",
    [
      { title: "The first 60 seconds", lessons: [
        L("Opening structure", "READING", 6, "1. Greet\n2. Name + company\n3. Reason for call (one line)\n4. Ask permission\n\nExample: 'Namaste sir, main {{name}}, Nextrova Labs se. Kya abhi 2 minute baat kar sakte hain?'"),
        L("Using the Live Call Companion", "EXAMPLE", 6, "Choose the service type and call stage in the Live Call Companion. Use the large script text as a guide, not a script to read robotically. No customer data is stored."),
      ]},
      { title: "Practice", lessons: [
        L("Roleplay: 'Abhi busy hoon'", "ROLEPLAY", 8, "Offer a specific callback time. Do not pitch on a busy call."),
        L("Roleplay: 'Kaun bol raha hai?'", "ROLEPLAY", 8, "Re-introduce calmly and give a one-line reason."),
        L("Knowledge check", "KNOWLEDGE_CHECK", 3, "Complete the quiz."),
      ]},
    ],
    [
      Q("What should come right after your introduction?", ["Price", "Reason for the call and permission to continue", "A guarantee", "A long pitch"], 1, "Permission respects their time."),
      Q("A customer says they are busy. Best response?", ["Continue pitching", "Offer a specific callback time", "Hang up silently", "Ask for a discount"], 1, "A specific time converts 'busy' into a commitment."),
      Q("Should you read the script word-for-word?", ["Always", "No — use it as a guide in your own voice", "Only on Fridays", "Never look at it"], 1, "Natural delivery is more trustworthy."),
      Q("Does the Live Call Companion store customer data?", ["Yes", "No", "Only phone numbers", "Only names"], 1, "It is designed not to record or store customer data."),
      Q("Which opening is best?", ["'Price kitna chahiye?'", "'Namaste, main X, Nextrova Labs se; kya 2 minute baat kar sakte hain?'", "'Sir buy now'", "'Hello hello'"], 1, "It has name, company and permission."),
    ]),

  C(6, "Requirement Discovery", "INTERMEDIATE", "Ask the right questions to understand what the customer actually needs before discussing price or solutions.",
    [
      { title: "Discovery basics", lessons: [
        L("Why discovery comes first", "READING", 6, "Price and timeline are meaningless without scope. Discovery shows the customer you care and protects you from wrong promises."),
        L("Open vs. closed questions", "READING", 6, "Open: 'Aap website se kya hasil karna chahte hain?'\nClosed: 'Kya aapko contact form chahiye?'\nStart open, then narrow with closed questions."),
      ]},
      { title: "Practice discovery", lessons: [
        L("A discovery question bank", "EXAMPLE", 7, "- Business and customers\n- Goal of the project\n- Must-have vs nice-to-have features\n- Content readiness\n- Budget range (ask gently)\n- Launch date and reason"),
        L("Roleplay: vague customer", "ROLEPLAY", 9, "Customer: 'Bas achhi si website chahiye.' Ask five questions to make it specific. Summarise at the end: 'Toh main sahi samjha ki aapko…'"),
        L("Knowledge check", "KNOWLEDGE_CHECK", 3, "Complete the quiz."),
      ]},
    ],
    [
      Q("Why is discovery done before quoting?", ["To waste time", "Scope decides cost and timeline", "To avoid answering", "To ask personal questions"], 1, "Without scope, quotes are guesses."),
      Q("An open question is…", ["Yes/no only", "One that invites a detailed answer", "A rude question", "A price question"], 1, "Open questions reveal needs."),
      Q("After discovery, what is a good move?", ["Summarise what you understood", "End the call abruptly", "Quote a random price", "Change topic"], 0, "Summaries prevent misunderstandings."),
      Q("Which is a must-have vs nice-to-have question?", ["'Kaunse 3 features zaroori hain?'", "'Aap kahan rehte hain?'", "'Kya aap thak gaye?'", "'Kitna kamate hain?'"], 0, "It prioritises scope."),
      Q("The customer says 'something nice'. You…", ["Accept it and quote", "Ask clarifying questions", "Argue", "Hang up"], 1, "Vague requirements need clarification."),
    ]),

  C(7, "Pricing and Budget Conversations", "INTERMEDIATE", "Discuss cost honestly without quoting unapproved numbers, and handle budget concerns with scope-based options.",
    [
      { title: "Principles", lessons: [
        L("Never guess a price", "READING", 6, "Quotations come from the team, based on written scope. On a call: explain that cost depends on requirement and offer to prepare a written quotation."),
        L("Budget questions", "READING", 6, "Ask gently: 'Aapka comfortable budget range kya rahega?' If the budget is small, propose a phased approach instead of cutting quality."),
      ]},
      { title: "Practice", lessons: [
        L("Example: 'Price kitna hoga?'", "EXAMPLE", 5, "'Sir, requirement ke hisaab se quotation banta hai — pehle 2-3 sawal puch sakta hoon?' See the Objection Center for more variants."),
        L("Roleplay: 'Discount milega?'", "ROLEPLAY", 9, "Do not promise a percentage. Redirect to scope and confirm with the team."),
        L("Knowledge check", "KNOWLEDGE_CHECK", 3, "Complete the quiz."),
      ]},
    ],
    [
      Q("The customer asks for the price immediately. Best?", ["Quote from memory", "Explain cost depends on requirement, ask a few questions", "Refuse", "Offer 50% off"], 1, "Scope first, price second."),
      Q("The budget is low. A good option is…", ["Ignore it", "Phase the project", "Promise everything", "Hang up"], 1, "Phasing fits scope to budget."),
      Q("Can you promise a discount?", ["Yes, any amount", "No — confirm with the team", "Only on weekends", "Only for friends"], 1, "Discounts are management decisions."),
      Q("Where do approved prices come from?", ["Your memory", "The team's written quotation", "A competitor", "A guess"], 1, "Only approved quotes should be shared."),
      Q("A hidden cost…", ["Is acceptable", "Damages trust; be transparent about ongoing costs", "Is required", "Is good practice"], 1, "Explain recurring costs like hosting/domain exist."),
    ]),

  C(8, "Objection Handling", "INTERMEDIATE", "Respond to objections with empathy, honesty and a next step instead of arguments.",
    [
      { title: "A simple framework", lessons: [
        L("Listen, acknowledge, clarify, respond", "READING", 6, "1. Let them finish.\n2. Acknowledge: 'Aapki baat samajh sakta hoon.'\n3. Clarify the real concern.\n4. Respond honestly with a next step."),
        L("Categories of objections", "READING", 6, "Price, competition, urgency, uncertainty, trust, technical, delay, follow-up and process. The Objection Center groups them this way."),
      ]},
      { title: "Practice", lessons: [
        L("Example: 'Mujhe sochna padega'", "EXAMPLE", 5, "'Bilkul sir. Kya aap bata sakte hain kaunsi baat sochne par majboor kar rahi hai?' It uncovers the real concern."),
        L("Roleplay: competitor is cheaper", "ROLEPLAY", 9, "Do not criticise the competitor. Ask them to share scope and compare support and ownership."),
        L("Knowledge check", "KNOWLEDGE_CHECK", 3, "Complete the quiz."),
      ]},
    ],
    [
      Q("First step when facing an objection?", ["Argue", "Listen and acknowledge", "Offer a discount", "Interrupt"], 1, "Acknowledging lowers resistance."),
      Q("A customer says a competitor is cheaper. You…", ["Criticise the competitor", "Compare scope, support and ownership respectfully", "Match the price", "End the call"], 1, "Respectful comparison keeps credibility."),
      Q("'Mujhe sochna padega' often means…", ["Yes", "There is an unspoken concern", "No forever", "Wrong number"], 1, "Ask what is holding them back."),
      Q("Can you guarantee results to overcome an objection?", ["Yes", "No — never promise results or rankings", "Yes, with a bonus", "Only in writing"], 1, "Honesty beats overpromising."),
      Q("Where can you find ready answers?", ["Objection Center", "Social media", "Personal notes only", "Nowhere"], 0, "The Objection Center has approved responses."),
    ]),

  C(9, "Customer Psychology and Listening", "ADVANCED", "Understand motivations, build rapport and use active listening.",
    [
      { title: "Listening", lessons: [
        L("Active listening", "READING", 6, "Pause, paraphrase, ask follow-ups. Notice the customer's words and reuse them. Take brief notes on a paper, not in this tool."),
        L("Understanding motivation", "READING", 7, "Customers buy outcomes: more enquiries, less manual work, trust. Ask 'Iska aapke business ko kya fayda hoga?'"),
      ]},
      { title: "Rapport", lessons: [
        L("Matching pace and respect", "EXAMPLE", 6, "A hurried customer gets short crisp answers; a curious one gets more detail. Never mimic mockingly."),
        L("Roleplay: a sceptical customer", "ROLEPLAY", 9, "Customer: 'Pehle bhi do log ne dhokha diya.' Acknowledge, don't promise, offer verification."),
        L("Knowledge check", "KNOWLEDGE_CHECK", 3, "Complete the quiz."),
      ]},
    ],
    [
      Q("Active listening includes…", ["Interrupting", "Paraphrasing what you heard", "Reading the script", "Talking more"], 1, "Paraphrasing shows understanding."),
      Q("Customers mainly buy…", ["Features", "Outcomes", "Jargon", "Discounts only"], 1, "Outcomes motivate decisions."),
      Q("A customer had a bad experience before. You…", ["Promise it will never happen", "Acknowledge and offer verification", "Ignore it", "Argue"], 1, "Trust grows by acknowledgement."),
      Q("Where should you take notes?", ["In this tool with customer details", "On your own paper", "In a public chat", "Nowhere"], 1, "Do not store customer data in this tool."),
      Q("A hurried customer needs…", ["A long lecture", "Short, crisp answers", "Silence", "Jokes"], 1, "Match their pace."),
    ]),

  C(10, "Closing and Meeting Scheduling", "ADVANCED", "Move the conversation to a clear next step: a meeting, a proposal or a decision.",
    [
      { title: "Closing with clarity", lessons: [
        L("What closing really means", "READING", 6, "Closing is agreeing on a clear next step, not pressure. Examples: schedule a meeting, share a proposal, send requirements checklist."),
        L("Scheduling a meeting", "EXAMPLE", 6, "'Sir, kal shaam 5 baje ya parson subah 11 baje — kaunsa time theek rahega?' Offer two options, confirm on WhatsApp."),
      ]},
      { title: "Practice", lessons: [
        L("Roleplay: 'Baad mein baat karte hain'", "ROLEPLAY", 8, "Convert it into a specific time."),
        L("Roleplay: closing after a proposal", "ROLEPLAY", 9, "Ask what remains unclear and offer a short review call."),
        L("Knowledge check", "KNOWLEDGE_CHECK", 3, "Complete the quiz."),
      ]},
    ],
    [
      Q("Closing means…", ["Pressure", "Agreeing a clear next step", "Ending the relationship", "Offering a gift"], 1, "A clear next step moves things forward."),
      Q("To schedule a meeting, offer…", ["One vague time", "Two specific options", "No options", "Your home address"], 1, "Two options make a choice easy."),
      Q("After scheduling, you should…", ["Do nothing", "Send a confirmation message", "Forget it", "Call ten times"], 1, "Confirmation reduces no-shows."),
      Q("The customer wants more time. You…", ["Push for a decision today", "Agree a follow-up time and offer a summary", "Invent a deadline", "Offer an expiring discount"], 1, "No fake urgency."),
      Q("Which is a valid next step?", ["Share a requirements checklist", "Collect advance on the call", "Record the call", "Store customer phone in this tool"], 0, "Collecting payments or storing customer data is out of scope."),
    ]),

  C(11, "WhatsApp Communication", "INTERMEDIATE", "Use WhatsApp messages professionally with the template library, respecting privacy and consent.",
    [
      { title: "WhatsApp etiquette", lessons: [
        L("When to message", "READING", 6, "Message only when the customer agreed or asked. Keep messages short, polite and in the customer's language. Respect 'do not contact'."),
        L("Using templates safely", "READING", 6, "Templates contain placeholders like {{customer_name}}. Copy, replace placeholders, and send yourself. The platform never sends messages or stores phone numbers."),
      ]},
      { title: "Practice", lessons: [
        L("Example: after a call", "EXAMPLE", 5, "Short thank-you, the promised next step, and a clear ask. No long paragraphs."),
        L("Roleplay: customer replies 'not interested'", "ROLEPLAY", 7, "Reply politely, thank them and stop."),
        L("Knowledge check", "KNOWLEDGE_CHECK", 3, "Complete the quiz."),
      ]},
    ],
    [
      Q("Does Nextrova Sales OS send WhatsApp messages for you?", ["Yes automatically", "No — you copy and send", "Only at night", "Only to VIPs"], 1, "It never auto-sends."),
      Q("A customer says 'not interested'. You…", ["Keep messaging", "Reply politely and stop", "Send offers daily", "Call them"], 1, "Respect consent."),
      Q("Placeholders like {{customer_name}} should be…", ["Left as is", "Replaced before sending", "Deleted from the library", "Sent as is"], 1, "Replace placeholders."),
      Q("Good WhatsApp messages are…", ["Long essays", "Short, polite, clear", "All caps", "Full of emojis only"], 1, "Brevity respects attention."),
      Q("Should you store customer phone numbers in this platform?", ["Yes", "No", "Sometimes", "Always"], 1, "The platform does not store customer data."),
    ]),

  C(12, "Advanced Consultative Selling", "ADVANCED", "Act as a trusted adviser: diagnose, recommend honestly and manage long decisions.",
    [
      { title: "Consultative mindset", lessons: [
        L("Diagnose before you prescribe", "READING", 7, "Ask about business problems before solutions. Recommend the simplest solution that fits, even if it is smaller than what the customer first asked for."),
        L("Honest recommendations", "READING", 6, "Sometimes a template or a phased plan is right. Saying so builds long-term trust. Never overpromise results."),
      ]},
      { title: "Complex conversations", lessons: [
        L("Multiple decision makers", "EXAMPLE", 7, "Ask who else is involved, offer a short overview they can forward, and propose a joint call."),
        L("Roleplay: a long, indecisive customer", "ROLEPLAY", 10, "Keep contact light, summarise options and agree a next checkpoint without pressure."),
        L("Knowledge check", "KNOWLEDGE_CHECK", 3, "Complete the quiz."),
      ]},
    ],
    [
      Q("Consultative selling begins with…", ["A price list", "Diagnosing the customer's problem", "A discount", "A long pitch"], 1, "Diagnosis ensures a fit."),
      Q("A smaller solution fits the customer's need. You…", ["Push the bigger one", "Recommend the right-sized one honestly", "Say nothing", "Hide it"], 1, "Honesty builds long-term trust."),
      Q("Multiple decision makers are involved. You…", ["Ignore them", "Offer a forwardable overview and a joint call", "Call them without permission", "Pressure the contact"], 1, "Help the champion sell internally."),
      Q("Which is a promise you must NOT make?", ["We will confirm and revert", "We guarantee more sales", "We will send a summary", "We will share a checklist"], 1, "Never guarantee business results."),
      Q("An indecisive customer needs…", ["Pressure", "Clear options and a next checkpoint", "Silence forever", "A fake deadline"], 1, "Structure helps decisions."),
    ]),
];
