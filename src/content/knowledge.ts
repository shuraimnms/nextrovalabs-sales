import { slugify } from "./types";

export const SECTIONS = [
  "About Nextrova Labs", "Services", "Website Development Basics", "App Development Basics", "E-commerce Basics",
  "Development Process", "Project Timelines", "Common Technical Terms", "Hosting and Domains",
  "Maintenance and Support", "Security", "Frequently Asked Questions", "Approved Company Policies",
] as const;
export type Section = (typeof SECTIONS)[number];
export type SeedArticle = { slug: string; title: string; section: Section; body: string; pending: boolean };

const PENDING = "\n\n> **Pending admin confirmation.** This is a company-specific point that has not been verified. Confirm with your manager before quoting it to a customer.";
const a = (section: Section) => (title: string, body: string, pending = false): SeedArticle => ({
  slug: slugify(`${section}-${title}`), title, section, body: pending ? body + PENDING : body, pending,
});

const AB = a("About Nextrova Labs"), SV = a("Services"), WD = a("Website Development Basics"), AP = a("App Development Basics"),
  EC = a("E-commerce Basics"), DP = a("Development Process"), PT = a("Project Timelines"), TT = a("Common Technical Terms"),
  HD = a("Hosting and Domains"), MS = a("Maintenance and Support"), SE = a("Security"), FQ = a("Frequently Asked Questions"),
  AC = a("Approved Company Policies");

export const articles: SeedArticle[] = [
  // About
  AB("Who we are", "Nextrova Labs is a software company based in Bengaluru, India. Public website: https://www.nextrovalabs.in.\n\nWe work across web, mobile, AI/ML, cloud and design. When a customer asks 'who are you?', keep it simple, factual and short."),
  AB("How to describe the company on a call", "Use plain, verifiable statements: Bengaluru-based software company; works on websites, mobile apps, AI/ML, cloud and design.\n\nDo not mention years in business, number of projects, client names, team size or awards unless an admin has added them here as approved facts."),
  AB("Official contact details", "Website: https://www.nextrovalabs.in\nPhone listed on the website: 9603315845.\n\nDo not share personal numbers or an office street address. If the customer wants to visit, say you will confirm with the team.", true),
  AB("What we do not do", "Nextrova Sales OS is for employee training only. Employees must not store customer phone numbers, collect customer payments or record customer calls in this tool.\n\nIf a customer asks for something outside our services, say you will check with the team instead of guessing."),

  // Services
  SV("Website development", "We build business websites: company sites, landing pages, portfolios and content sites. Ask about pages, content readiness, features (forms, booking, payments), design preferences and launch date before discussing cost."),
  SV("Mobile app development", "We develop mobile apps. Always clarify: who the users are, the top features, Android / iPhone / both, whether an admin panel is needed and any integrations."),
  SV("E-commerce development", "Online stores need product management, cart and checkout, payments, shipping and an admin panel. Clarify number of products, payment methods, delivery needs and how the owner will manage orders."),
  SV("Custom software", "Custom software covers internal tools, dashboards and business workflows. The most important step is understanding the process the customer wants to improve. Avoid promising features before discovery."),
  SV("AI/ML and cloud", "The company site lists AI/ML and cloud work. Do not promise specific AI outcomes. If a customer asks for AI features, note the use case and pass it to a technical lead for feasibility."),
  SV("Design services", "Design (UI/UX) can be offered with development or on its own. Ask for the number of screens or pages, brand assets, references and the format of deliverables."),

  // Website Basics
  WD("Types of websites", "Brochure/company website, landing page, portfolio, blog/content site, booking site and web application. Help the customer choose by goal: information, enquiries, bookings or sales."),
  WD("What the customer must provide", "Business details, logo, photos, text content, domain/hosting information (if existing), reference websites and timely approvals. Delays in content are the most common reason timelines slip."),
  WD("Pages a business website usually needs", "Home, About, Services, Contact, and optionally Gallery/Portfolio, Blog, FAQ and Policies. Final page count is decided during requirement discovery."),
  WD("Responsive design and SEO foundation", "Responsive means the site adapts to mobile, tablet and desktop. A search-friendly foundation helps search engines read the site, but no one can guarantee a Google ranking."),
  WD("CMS and editing content", "A CMS or admin panel lets the owner update content without coding. Ask early who will update the site and how often; this changes scope."),

  // App Basics
  AP("Android, iPhone or both", "Ask which devices customers use. Building for both increases scope. A phased approach (one platform first) can reduce initial investment."),
  AP("App features and admin panel", "Typical features: login, profiles, listings, search, notifications, payments and an admin panel. Each feature affects scope; capture them in a written list."),
  AP("Publishing to Play Store and App Store", "Apps are published through developer accounts. Recommend the account be in the customer's own name. Fees, review time and approval are decided by Google and Apple; never guarantee approval or a date."),
  AP("MVP and phased delivery", "An MVP is a smaller first version containing only essential features. It lets the customer test the idea before bigger investment. Do not promise success for any idea."),
  AP("App maintenance", "Apps need updates for new OS versions, bug fixes and security. Ongoing maintenance options and terms are quoted separately.", true),

  // E-commerce
  EC("What an online store includes", "Product catalogue, search/filter, cart, checkout, payment gateway, order management, customer accounts and notifications. Scope depends on product count and complexity."),
  EC("Payments and gateways", "Online payments use third-party payment gateways, which have their own fees and onboarding. Never collect or ask for payment details on a sales call; refer to the written quotation."),
  EC("Shipping and delivery", "Ask how orders will be delivered and whether integration with a courier service is needed. Do not promise integrations before the technical team confirms."),
  EC("Product data and images", "Customers usually provide product names, descriptions, prices and images. Bulk upload possibilities depend on the scope; confirm with the team."),

  // Process
  DP("Standard project stages", "1) Requirement discovery 2) Written quotation and plan 3) Design 4) Development 5) Testing 6) Launch 7) Support. Describe the flow in simple words and avoid claiming proprietary methods.", true),
  DP("Requirement discovery", "Understand the business, goal, audience, features, content, references, budget range and timeline. Write everything down and share a summary with the customer."),
  DP("Written quotation", "Quotations should state scope, deliverables, timeline, payment terms and what is not included. Never quote a number from memory; use the team's official quotation.", true),
  DP("Feedback and change requests", "Feedback during the project is welcome. Large additions change scope and timeline and must be confirmed in writing. Do not promise unlimited revisions.", true),
  DP("Launch and handover", "At launch the customer should know what they receive: access, documentation and support options. Specific handover terms are pending admin confirmation.", true),

  // Timelines
  PT("How to talk about timelines", "Never quote a fixed number of days or weeks on your own. Explain that timelines depend on scope, features and how fast the customer provides content and feedback, then confirm a date with the team.", true),
  PT("Public website timeline vs. internal guidance", "The public website and internal guidance may not match. Until an admin publishes an approved timeline, treat every timeline as pending and confirm before quoting.", true),
  PT("Factors that affect timelines", "Number of pages/screens, features, integrations, custom design, content readiness, feedback speed and third-party approvals (payment gateways, app stores)."),
  PT("Urgent requests", "If a customer needs something quickly, offer to prioritise essential features first and confirm feasibility with the team. Never agree to an impossible date to win a call."),

  // Technical terms
  TT("Frontend and backend", "Frontend is what users see and click. Backend is the logic and database behind it. A simple website may mostly be frontend; an app with accounts needs both."),
  TT("API and integration", "An API lets two software systems talk to each other, e.g. a website sending an order to a delivery system. Integration is possible only if the other system offers one."),
  TT("Database", "A database stores information such as users, products and orders. Explain it as a very organised digital register."),
  TT("Responsive, UI and UX", "UI is how it looks. UX is how it feels to use. Responsive means it adapts to different screen sizes."),
  TT("SEO", "Search Engine Optimisation helps search engines understand your site. It improves the foundation, but rankings depend on competition, content and time. Never guarantee rankings."),
  TT("Admin panel", "A private area where the owner manages content, orders or users without writing code."),

  // Hosting
  HD("Domain vs. hosting", "The domain is the address (like nextrovalabs.in). Hosting is the place where the website files live. Both usually need yearly renewal."),
  HD("Ownership of domain and hosting", "Best practice is to register domain and hosting in the customer's name. Whether Nextrova arranges them, and on what terms, is pending admin confirmation.", true),
  HD("Renewals and ongoing costs", "Domain, hosting and third-party services have recurring costs. Tell customers these exist and that exact figures will be in the quotation. Do not quote prices.", true),
  HD("SSL and website address", "SSL makes the site use https:// and show a secure lock. It is a standard expectation for modern websites."),

  // Maintenance
  MS("Why maintenance matters", "Websites and apps need updates, backups and fixes after launch. Customers often forget this; mention it early and honestly."),
  MS("What support may include", "Bug fixes, small content changes, security updates and monitoring are common. Exact inclusions, response times and charges for Nextrova are pending admin confirmation.", true),
  MS("Warranty and guarantees", "Do not promise free lifetime support, warranties or response times unless the admin has published them in Approved Company Policies.", true),

  // Security
  SE("What to say about security", "Say: 'We follow secure development practices.' Do not say: 'hack-proof', '100% secure' or mention certifications. No honest company can guarantee absolute security."),
  SE("Customer data and privacy", "Never ask for or record customer passwords, OTPs, bank details or payment card numbers in any message or note."),
  SE("Your own account security", "Use a strong unique password, never share your login, sign out on shared devices and report suspected misuse to your admin."),

  // FAQ
  FQ("Customer asks: How much will it cost?", "Do not guess. Say cost depends on scope and offer a short discovery to prepare a written quotation. See the 'Price kitna hoga?' item in the Objection Center."),
  FQ("Customer asks: Will I get the source code?", "This is company policy and is pending admin confirmation. Say you will confirm and add the answer to the quotation.", true),
  FQ("Customer asks: Can you show past work?", "Share only admin-approved samples. Never make up client names, screenshots or testimonials.", true),
  FQ("Customer asks: Will my site rank on Google?", "No one can guarantee rankings. Explain that you build a search-friendly foundation and that results depend on many factors."),
  FQ("Customer asks: Can I meet the team?", "Offer a video call. Do not promise an in-person meeting or visit unless confirmed."),

  // Policies
  AC("Call conduct", "Be polite, honest and clear. Introduce yourself and the company. Respect a 'not interested' or 'do not call' immediately."),
  AC("No false promises", "Never promise prices, discounts, timelines, rankings, sales results, refunds, warranties or 'lifetime' anything without a published approval."),
  AC("Customer data rule", "This platform does not store customer data. Do not enter customer names, phone numbers or details into scripts, notes or roleplays."),
  AC("Escalation", "When a customer asks something you cannot verify, say 'Main team se confirm karke batata hoon' and follow up. Do not improvise answers."),
];
