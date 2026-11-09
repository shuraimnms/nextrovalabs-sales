// Nextrova Sales OS — PostgreSQL schema (Drizzle ORM).
// Scope: employee sales enablement + training ONLY. No leads, CRM, customer data or call recordings.
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// ───────────── Enums ─────────────
export const roleEnum = pgEnum("role", ["SUPER_ADMIN", "ADMIN", "EMPLOYEE"]);
export const userStatusEnum = pgEnum("user_status", ["ACTIVE", "SUSPENDED"]);
export const contentStatusEnum = pgEnum("content_status", ["DRAFT", "PENDING_REVIEW", "PUBLISHED", "ARCHIVED"]);
export const approvalEnum = pgEnum("approval_status", ["APPROVED", "PENDING_ADMIN_CONFIRMATION"]);
export const difficultyEnum = pgEnum("difficulty", ["BEGINNER", "INTERMEDIATE", "ADVANCED"]);
export const serviceEnum = pgEnum("service_type", ["WEBSITE", "MOBILE_APP", "ECOMMERCE", "CUSTOM_SOFTWARE", "GENERAL"]);
export const stageEnum = pgEnum("call_stage", [
  "OPENING",
  "PERMISSION_TO_SPEAK",
  "REQUIREMENT_DISCOVERY",
  "BUSINESS_UNDERSTANDING",
  "FEATURE_DISCUSSION",
  "BUDGET_DISCUSSION",
  "TIMELINE_DISCUSSION",
  "COMPANY_INTRODUCTION",
  "OBJECTION_HANDLING",
  "MEETING_SCHEDULING",
  "CALL_CLOSING",
]);
export const languageEnum = pgEnum("script_language", ["HINGLISH", "ENGLISH"]);
export const objectionCategoryEnum = pgEnum("objection_category", [
  "PRICE",
  "COMPETITION",
  "URGENCY",
  "UNCERTAINTY",
  "TRUST",
  "TECHNICAL",
  "DELAY",
  "FOLLOW_UP",
  "PROCESS",
]);
export const responseVariantEnum = pgEnum("response_variant", ["RECOMMENDED", "SHORT", "DETAILED", "ALTERNATIVE"]);
export const lessonTypeEnum = pgEnum("lesson_type", ["READING", "EXAMPLE", "ROLEPLAY", "KNOWLEDGE_CHECK"]);
export const priorityEnum = pgEnum("announcement_priority", ["LOW", "NORMAL", "HIGH", "URGENT"]);
export const templateCategoryEnum = pgEnum("template_category", [
  "FIRST_INTRODUCTION",
  "COMPANY_INTRODUCTION",
  "WEBSITE_ENQUIRY_FOLLOWUP",
  "APP_DEVELOPMENT_FOLLOWUP",
  "REQUIREMENTS_REQUEST",
  "REFERENCE_WEBSITE_REQUEST",
  "PROPOSAL_FOLLOWUP",
  "MEETING_CONFIRMATION",
  "MEETING_REMINDER",
  "THANK_YOU",
  "NOT_INTERESTED",
  "RECONNECTION",
]);

const id = () => uuid("id").primaryKey().defaultRandom();
const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());

// ───────────── Identity ─────────────
export const users = pgTable(
  "users",
  {
    id: id(),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: roleEnum("role").notNull().default("EMPLOYEE"),
    status: userStatusEnum("status").notNull().default("ACTIVE"),
    mustChangePassword: boolean("must_change_password").notNull().default(true),
    failedLoginCount: integer("failed_login_count").notNull().default(0),
    lockedUntil: timestamp("locked_until", { withTimezone: true }),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdById: uuid("created_by_id"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [index("users_role_status_idx").on(t.role, t.status), index("users_deleted_idx").on(t.deletedAt)],
);

export const sessions = pgTable(
  "sessions",
  {
    id: id(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    // SHA-256 of the opaque cookie token; the raw token is never stored.
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: createdAt(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }).notNull().defaultNow(),
    userAgent: text("user_agent"),
  },
  (t) => [index("sessions_user_idx").on(t.userId), index("sessions_expires_idx").on(t.expiresAt)],
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: id(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [index("prt_user_idx").on(t.userId), index("prt_expires_idx").on(t.expiresAt)],
);

// Login throttling. Keys are hashed identifiers — no raw PII.
export const rateLimitBuckets = pgTable("rate_limit_buckets", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
  windowStart: timestamp("window_start", { withTimezone: true }).notNull().defaultNow(),
});

export const userSettings = pgTable("user_settings", {
  id: id(),
  userId: uuid("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  theme: text("theme").notNull().default("system"),
  scriptTextSize: integer("script_text_size").notNull().default(20),
  displayName: text("display_name"),
  updatedAt: updatedAt(),
});

export const companySettings = pgTable("company_settings", {
  id: text("id").primaryKey().default("singleton"),
  companyName: text("company_name").notNull().default("Nextrova Labs"),
  websiteUrl: text("website_url").notNull().default("https://www.nextrovalabs.in"),
  tagline: text("tagline"),
  primaryColor: text("primary_color").notNull().default("#6d4aff"),
  logoUrl: text("logo_url"),
  updatedAt: updatedAt(),
});

// ───────────── Scripts ─────────────
export const scriptCategories = pgTable("script_categories", {
  id: id(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: createdAt(),
});

export const scripts = pgTable(
  "scripts",
  {
    id: id(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    categoryId: uuid("category_id").notNull().references(() => scriptCategories.id, { onDelete: "restrict" }),
    service: serviceEnum("service").notNull().default("GENERAL"),
    stage: stageEnum("stage"),
    difficulty: difficultyEnum("difficulty").notNull().default("BEGINNER"),
    language: languageEnum("language").notNull().default("HINGLISH"),
    scenario: text("scenario").notNull(),
    recommended: text("recommended").notNull(),
    alternative: text("alternative"),
    englishVersion: text("english_version"),
    usageGuidance: text("usage_guidance").notNull(),
    thingsToAvoid: text("things_to_avoid").notNull(),
    status: contentStatusEnum("status").notNull().default("DRAFT"),
    approval: approvalEnum("approval").notNull().default("APPROVED"),
    version: integer("version").notNull().default(1),
    authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    index("scripts_status_service_stage_idx").on(t.status, t.service, t.stage),
    index("scripts_category_idx").on(t.categoryId),
    index("scripts_difficulty_idx").on(t.difficulty),
    index("scripts_deleted_idx").on(t.deletedAt),
  ],
);

export const scriptVersions = pgTable(
  "script_versions",
  {
    id: id(),
    scriptId: uuid("script_id").notNull().references(() => scripts.id, { onDelete: "cascade" }),
    version: integer("version").notNull(),
    snapshot: jsonb("snapshot").notNull(),
    changeNote: text("change_note"),
    createdById: uuid("created_by_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("script_versions_script_version_uq").on(t.scriptId, t.version)],
);

export const scriptFavorites = pgTable(
  "script_favorites",
  {
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    scriptId: uuid("script_id").notNull().references(() => scripts.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.scriptId] })],
);

// ───────────── Objections ─────────────
export const objections = pgTable(
  "objections",
  {
    id: id(),
    slug: text("slug").notNull().unique(),
    customerSays: text("customer_says").notNull(),
    category: objectionCategoryEnum("category").notNull(),
    popular: boolean("popular").notNull().default(false),
    whyItWorks: text("why_it_works").notNull(),
    dontSay: text("dont_say").notNull(),
    status: contentStatusEnum("status").notNull().default("DRAFT"),
    approval: approvalEnum("approval").notNull().default("APPROVED"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [index("objections_cat_status_idx").on(t.category, t.status), index("objections_popular_idx").on(t.popular)],
);

export const objectionResponses = pgTable(
  "objection_responses",
  {
    id: id(),
    objectionId: uuid("objection_id").notNull().references(() => objections.id, { onDelete: "cascade" }),
    variant: responseVariantEnum("variant").notNull(),
    body: text("body").notNull(),
  },
  (t) => [uniqueIndex("objection_responses_uq").on(t.objectionId, t.variant)],
);

export const objectionFavorites = pgTable(
  "objection_favorites",
  {
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    objectionId: uuid("objection_id").notNull().references(() => objections.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.objectionId] })],
);

// ───────────── Academy ─────────────
export const courses = pgTable(
  "courses",
  {
    id: id(),
    slug: text("slug").notNull().unique(),
    number: integer("number").notNull().unique(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    level: difficultyEnum("level").notNull().default("BEGINNER"),
    status: contentStatusEnum("status").notNull().default("DRAFT"),
    passingScore: integer("passing_score").notNull().default(70),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [index("courses_status_level_idx").on(t.status, t.level)],
);

export const modules = pgTable(
  "modules",
  {
    id: id(),
    courseId: uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("modules_course_sort_idx").on(t.courseId, t.sortOrder)],
);

export const lessons = pgTable(
  "lessons",
  {
    id: id(),
    moduleId: uuid("module_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    type: lessonTypeEnum("type").notNull().default("READING"),
    body: text("body").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    minutes: integer("minutes").notNull().default(5),
  },
  (t) => [index("lessons_module_sort_idx").on(t.moduleId, t.sortOrder)],
);

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    lessonId: uuid("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
    completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.lessonId] }), index("lesson_progress_user_idx").on(t.userId, t.completedAt)],
);

export const quizzes = pgTable("quizzes", {
  id: id(),
  courseId: uuid("course_id").notNull().unique().references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  passingScore: integer("passing_score").notNull().default(70),
});

export const quizQuestions = pgTable(
  "quiz_questions",
  {
    id: id(),
    quizId: uuid("quiz_id").notNull().references(() => quizzes.id, { onDelete: "cascade" }),
    prompt: text("prompt").notNull(),
    options: text("options").array().notNull(),
    correctIndex: integer("correct_index").notNull(),
    explanation: text("explanation").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("quiz_questions_quiz_sort_idx").on(t.quizId, t.sortOrder)],
);

export const quizAttempts = pgTable(
  "quiz_attempts",
  {
    id: id(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    quizId: uuid("quiz_id").notNull().references(() => quizzes.id, { onDelete: "cascade" }),
    scorePct: integer("score_pct").notNull(),
    passed: boolean("passed").notNull(),
    answers: jsonb("answers").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("quiz_attempts_user_quiz_idx").on(t.userId, t.quizId)],
);

export const certificates = pgTable(
  "certificates",
  {
    id: id(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    courseId: uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    code: text("code").notNull().unique(),
    issuedAt: timestamp("issued_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("certificates_user_course_uq").on(t.userId, t.courseId)],
);

// ───────────── Roleplay (scores only; no transcripts or customer data stored) ─────────────
export const roleplaySessions = pgTable(
  "roleplay_sessions",
  {
    id: id(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    personality: text("personality").notNull(),
    projectType: text("project_type").notNull(),
    difficulty: difficultyEnum("difficulty").notNull(),
    mode: text("mode").notNull(), // "RULE_BASED" | "AI"
    scores: jsonb("scores").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("roleplay_user_idx").on(t.userId, t.createdAt)],
);

// ───────────── Templates, Knowledge, Announcements ─────────────
export const whatsappTemplates = pgTable(
  "whatsapp_templates",
  {
    id: id(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    category: templateCategoryEnum("category").notNull(),
    bodyEnglish: text("body_english").notNull(),
    bodyHinglish: text("body_hinglish").notNull(),
    status: contentStatusEnum("status").notNull().default("DRAFT"),
    approval: approvalEnum("approval").notNull().default("APPROVED"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [index("wa_templates_cat_status_idx").on(t.category, t.status)],
);

export const knowledgeArticles = pgTable(
  "knowledge_articles",
  {
    id: id(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    section: text("section").notNull(),
    body: text("body").notNull(),
    status: contentStatusEnum("status").notNull().default("DRAFT"),
    approval: approvalEnum("approval").notNull().default("APPROVED"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [index("knowledge_section_status_idx").on(t.section, t.status)],
);

export const announcements = pgTable(
  "announcements",
  {
    id: id(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    priority: priorityEnum("priority").notNull().default("NORMAL"),
    status: contentStatusEnum("status").notNull().default("DRAFT"),
    authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("announcements_status_pub_idx").on(t.status, t.publishedAt)],
);

// ───────────── Audit ─────────────
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: id(),
    actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    resource: text("resource").notNull(),
    resourceId: text("resource_id"),
    // Sanitised before write: never contains passwords, tokens or secrets.
    metadata: jsonb("metadata"),
    createdAt: createdAt(),
  },
  (t) => [
    index("audit_created_idx").on(t.createdAt),
    index("audit_actor_idx").on(t.actorId),
    index("audit_resource_idx").on(t.resource, t.resourceId),
  ],
);

// ───────────── Relations ─────────────
export const usersRelations = relations(users, ({ many, one }) => ({
  sessions: many(sessions),
  settings: one(userSettings, { fields: [users.id], references: [userSettings.userId] }),
  favorites: many(scriptFavorites),
  progress: many(lessonProgress),
  attempts: many(quizAttempts),
}));
export const scriptsRelations = relations(scripts, ({ one, many }) => ({
  category: one(scriptCategories, { fields: [scripts.categoryId], references: [scriptCategories.id] }),
  versions: many(scriptVersions),
  favorites: many(scriptFavorites),
}));
export const scriptCategoriesRelations = relations(scriptCategories, ({ many }) => ({ scripts: many(scripts) }));
export const scriptVersionsRelations = relations(scriptVersions, ({ one }) => ({
  script: one(scripts, { fields: [scriptVersions.scriptId], references: [scripts.id] }),
}));
export const objectionsRelations = relations(objections, ({ many }) => ({ responses: many(objectionResponses) }));
export const objectionResponsesRelations = relations(objectionResponses, ({ one }) => ({
  objection: one(objections, { fields: [objectionResponses.objectionId], references: [objections.id] }),
}));
export const coursesRelations = relations(courses, ({ many, one }) => ({
  modules: many(modules),
  quiz: one(quizzes, { fields: [courses.id], references: [quizzes.courseId] }),
}));
export const modulesRelations = relations(modules, ({ one, many }) => ({
  course: one(courses, { fields: [modules.courseId], references: [courses.id] }),
  lessons: many(lessons),
}));
export const lessonsRelations = relations(lessons, ({ one }) => ({
  module: one(modules, { fields: [lessons.moduleId], references: [modules.id] }),
}));
export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  course: one(courses, { fields: [quizzes.courseId], references: [courses.id] }),
  questions: many(quizQuestions),
}));
export const quizQuestionsRelations = relations(quizQuestions, ({ one }) => ({
  quiz: one(quizzes, { fields: [quizQuestions.quizId], references: [quizzes.id] }),
}));

export const nowSql = sql`now()`;
