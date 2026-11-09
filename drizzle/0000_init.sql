CREATE TYPE "public"."approval_status" AS ENUM('APPROVED', 'PENDING_ADMIN_CONFIRMATION');--> statement-breakpoint
CREATE TYPE "public"."content_status" AS ENUM('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."difficulty" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED');--> statement-breakpoint
CREATE TYPE "public"."script_language" AS ENUM('HINGLISH', 'ENGLISH');--> statement-breakpoint
CREATE TYPE "public"."lesson_type" AS ENUM('READING', 'EXAMPLE', 'ROLEPLAY', 'KNOWLEDGE_CHECK');--> statement-breakpoint
CREATE TYPE "public"."objection_category" AS ENUM('PRICE', 'COMPETITION', 'URGENCY', 'UNCERTAINTY', 'TRUST', 'TECHNICAL', 'DELAY', 'FOLLOW_UP', 'PROCESS');--> statement-breakpoint
CREATE TYPE "public"."announcement_priority" AS ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT');--> statement-breakpoint
CREATE TYPE "public"."response_variant" AS ENUM('RECOMMENDED', 'SHORT', 'DETAILED', 'ALTERNATIVE');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('SUPER_ADMIN', 'ADMIN', 'EMPLOYEE');--> statement-breakpoint
CREATE TYPE "public"."service_type" AS ENUM('WEBSITE', 'MOBILE_APP', 'ECOMMERCE', 'CUSTOM_SOFTWARE', 'GENERAL');--> statement-breakpoint
CREATE TYPE "public"."call_stage" AS ENUM('OPENING', 'PERMISSION_TO_SPEAK', 'REQUIREMENT_DISCOVERY', 'BUSINESS_UNDERSTANDING', 'FEATURE_DISCUSSION', 'BUDGET_DISCUSSION', 'TIMELINE_DISCUSSION', 'COMPANY_INTRODUCTION', 'OBJECTION_HANDLING', 'MEETING_SCHEDULING', 'CALL_CLOSING');--> statement-breakpoint
CREATE TYPE "public"."template_category" AS ENUM('FIRST_INTRODUCTION', 'COMPANY_INTRODUCTION', 'WEBSITE_ENQUIRY_FOLLOWUP', 'APP_DEVELOPMENT_FOLLOWUP', 'REQUIREMENTS_REQUEST', 'REFERENCE_WEBSITE_REQUEST', 'PROPOSAL_FOLLOWUP', 'MEETING_CONFIRMATION', 'MEETING_REMINDER', 'THANK_YOU', 'NOT_INTERESTED', 'RECONNECTION');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('ACTIVE', 'SUSPENDED');--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"priority" "announcement_priority" DEFAULT 'NORMAL' NOT NULL,
	"status" "content_status" DEFAULT 'DRAFT' NOT NULL,
	"author_id" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid,
	"action" text NOT NULL,
	"resource" text NOT NULL,
	"resource_id" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certificates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"code" text NOT NULL,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "certificates_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "company_settings" (
	"id" text PRIMARY KEY DEFAULT 'singleton' NOT NULL,
	"company_name" text DEFAULT 'Nextrova Labs' NOT NULL,
	"website_url" text DEFAULT 'https://www.nextrovalabs.in' NOT NULL,
	"tagline" text,
	"primary_color" text DEFAULT '#6d4aff' NOT NULL,
	"logo_url" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"number" integer NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"level" "difficulty" DEFAULT 'BEGINNER' NOT NULL,
	"status" "content_status" DEFAULT 'DRAFT' NOT NULL,
	"passing_score" integer DEFAULT 70 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "courses_slug_unique" UNIQUE("slug"),
	CONSTRAINT "courses_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "knowledge_articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"section" text NOT NULL,
	"body" text NOT NULL,
	"status" "content_status" DEFAULT 'DRAFT' NOT NULL,
	"approval" "approval_status" DEFAULT 'APPROVED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "knowledge_articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "lesson_progress" (
	"user_id" uuid NOT NULL,
	"lesson_id" uuid NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lesson_progress_user_id_lesson_id_pk" PRIMARY KEY("user_id","lesson_id")
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" uuid NOT NULL,
	"title" text NOT NULL,
	"type" "lesson_type" DEFAULT 'READING' NOT NULL,
	"body" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"minutes" integer DEFAULT 5 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"title" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "objection_favorites" (
	"user_id" uuid NOT NULL,
	"objection_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "objection_favorites_user_id_objection_id_pk" PRIMARY KEY("user_id","objection_id")
);
--> statement-breakpoint
CREATE TABLE "objection_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"objection_id" uuid NOT NULL,
	"variant" "response_variant" NOT NULL,
	"body" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "objections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"customer_says" text NOT NULL,
	"category" "objection_category" NOT NULL,
	"popular" boolean DEFAULT false NOT NULL,
	"why_it_works" text NOT NULL,
	"dont_say" text NOT NULL,
	"status" "content_status" DEFAULT 'DRAFT' NOT NULL,
	"approval" "approval_status" DEFAULT 'APPROVED' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "objections_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "password_reset_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "quiz_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"quiz_id" uuid NOT NULL,
	"score_pct" integer NOT NULL,
	"passed" boolean NOT NULL,
	"answers" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz_id" uuid NOT NULL,
	"prompt" text NOT NULL,
	"options" text[] NOT NULL,
	"correct_index" integer NOT NULL,
	"explanation" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizzes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"title" text NOT NULL,
	"passing_score" integer DEFAULT 70 NOT NULL,
	CONSTRAINT "quizzes_course_id_unique" UNIQUE("course_id")
);
--> statement-breakpoint
CREATE TABLE "rate_limit_buckets" (
	"key" text PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"window_start" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roleplay_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"personality" text NOT NULL,
	"project_type" text NOT NULL,
	"difficulty" "difficulty" NOT NULL,
	"mode" text NOT NULL,
	"scores" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "script_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "script_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "script_favorites" (
	"user_id" uuid NOT NULL,
	"script_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "script_favorites_user_id_script_id_pk" PRIMARY KEY("user_id","script_id")
);
--> statement-breakpoint
CREATE TABLE "script_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"script_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"snapshot" jsonb NOT NULL,
	"change_note" text,
	"created_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scripts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"category_id" uuid NOT NULL,
	"service" "service_type" DEFAULT 'GENERAL' NOT NULL,
	"stage" "call_stage",
	"difficulty" "difficulty" DEFAULT 'BEGINNER' NOT NULL,
	"language" "script_language" DEFAULT 'HINGLISH' NOT NULL,
	"scenario" text NOT NULL,
	"recommended" text NOT NULL,
	"alternative" text,
	"english_version" text,
	"usage_guidance" text NOT NULL,
	"things_to_avoid" text NOT NULL,
	"status" "content_status" DEFAULT 'DRAFT' NOT NULL,
	"approval" "approval_status" DEFAULT 'APPROVED' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"author_id" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "scripts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_used_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_agent" text,
	CONSTRAINT "sessions_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"theme" text DEFAULT 'system' NOT NULL,
	"script_text_size" integer DEFAULT 20 NOT NULL,
	"display_name" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "role" DEFAULT 'EMPLOYEE' NOT NULL,
	"status" "user_status" DEFAULT 'ACTIVE' NOT NULL,
	"must_change_password" boolean DEFAULT true NOT NULL,
	"failed_login_count" integer DEFAULT 0 NOT NULL,
	"locked_until" timestamp with time zone,
	"last_login_at" timestamp with time zone,
	"created_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "whatsapp_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"category" "template_category" NOT NULL,
	"body_english" text NOT NULL,
	"body_hinglish" text NOT NULL,
	"status" "content_status" DEFAULT 'DRAFT' NOT NULL,
	"approval" "approval_status" DEFAULT 'APPROVED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "whatsapp_templates_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "modules" ADD CONSTRAINT "modules_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "objection_favorites" ADD CONSTRAINT "objection_favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "objection_favorites" ADD CONSTRAINT "objection_favorites_objection_id_objections_id_fk" FOREIGN KEY ("objection_id") REFERENCES "public"."objections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "objection_responses" ADD CONSTRAINT "objection_responses_objection_id_objections_id_fk" FOREIGN KEY ("objection_id") REFERENCES "public"."objections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roleplay_sessions" ADD CONSTRAINT "roleplay_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "script_favorites" ADD CONSTRAINT "script_favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "script_favorites" ADD CONSTRAINT "script_favorites_script_id_scripts_id_fk" FOREIGN KEY ("script_id") REFERENCES "public"."scripts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "script_versions" ADD CONSTRAINT "script_versions_script_id_scripts_id_fk" FOREIGN KEY ("script_id") REFERENCES "public"."scripts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "script_versions" ADD CONSTRAINT "script_versions_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scripts" ADD CONSTRAINT "scripts_category_id_script_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."script_categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scripts" ADD CONSTRAINT "scripts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "announcements_status_pub_idx" ON "announcements" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "audit_created_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audit_actor_idx" ON "audit_logs" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "audit_resource_idx" ON "audit_logs" USING btree ("resource","resource_id");--> statement-breakpoint
CREATE UNIQUE INDEX "certificates_user_course_uq" ON "certificates" USING btree ("user_id","course_id");--> statement-breakpoint
CREATE INDEX "courses_status_level_idx" ON "courses" USING btree ("status","level");--> statement-breakpoint
CREATE INDEX "knowledge_section_status_idx" ON "knowledge_articles" USING btree ("section","status");--> statement-breakpoint
CREATE INDEX "lesson_progress_user_idx" ON "lesson_progress" USING btree ("user_id","completed_at");--> statement-breakpoint
CREATE INDEX "lessons_module_sort_idx" ON "lessons" USING btree ("module_id","sort_order");--> statement-breakpoint
CREATE INDEX "modules_course_sort_idx" ON "modules" USING btree ("course_id","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "objection_responses_uq" ON "objection_responses" USING btree ("objection_id","variant");--> statement-breakpoint
CREATE INDEX "objections_cat_status_idx" ON "objections" USING btree ("category","status");--> statement-breakpoint
CREATE INDEX "objections_popular_idx" ON "objections" USING btree ("popular");--> statement-breakpoint
CREATE INDEX "prt_user_idx" ON "password_reset_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "prt_expires_idx" ON "password_reset_tokens" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "quiz_attempts_user_quiz_idx" ON "quiz_attempts" USING btree ("user_id","quiz_id");--> statement-breakpoint
CREATE INDEX "quiz_questions_quiz_sort_idx" ON "quiz_questions" USING btree ("quiz_id","sort_order");--> statement-breakpoint
CREATE INDEX "roleplay_user_idx" ON "roleplay_sessions" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "script_versions_script_version_uq" ON "script_versions" USING btree ("script_id","version");--> statement-breakpoint
CREATE INDEX "scripts_status_service_stage_idx" ON "scripts" USING btree ("status","service","stage");--> statement-breakpoint
CREATE INDEX "scripts_category_idx" ON "scripts" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "scripts_difficulty_idx" ON "scripts" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "scripts_deleted_idx" ON "scripts" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_expires_idx" ON "sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "users_role_status_idx" ON "users" USING btree ("role","status");--> statement-breakpoint
CREATE INDEX "users_deleted_idx" ON "users" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "wa_templates_cat_status_idx" ON "whatsapp_templates" USING btree ("category","status");