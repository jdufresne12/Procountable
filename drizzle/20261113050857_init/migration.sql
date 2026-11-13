CREATE TYPE "mastery_outcome" AS ENUM('pass', 'pass-with-gaps', 'retry');--> statement-breakpoint
CREATE TYPE "plan_color" AS ENUM('violet', 'sun', 'coral');--> statement-breakpoint
CREATE TYPE "plan_lifecycle" AS ENUM('active', 'paused', 'completed');--> statement-breakpoint
CREATE TYPE "plan_schedule" AS ENUM('on-track', 'behind');--> statement-breakpoint
CREATE TYPE "section_status" AS ENUM('done', 'current', 'locked');--> statement-breakpoint
CREATE TYPE "section_step" AS ENUM('learn', 'practice', 'check');--> statement-breakpoint
CREATE TABLE "mastery_checks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "mastery_checks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"section_id" uuid NOT NULL,
	"outcome" "mastery_outcome" NOT NULL,
	"rubric" jsonb NOT NULL,
	"tran_script" jsonb,
	"taken_on" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"color" "plan_color" DEFAULT 'violet'::"plan_color" NOT NULL,
	"lifecycle" "plan_lifecycle" DEFAULT 'active'::"plan_lifecycle" NOT NULL,
	"schedule" "plan_schedule" DEFAULT 'on-track'::"plan_schedule" NOT NULL,
	"days_behind" integer DEFAULT 0 NOT NULL,
	"goal" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"hours_per_week" integer NOT NULL,
	"paused_on" date,
	"completed_on" date,
	"rules" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_attempts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "quiz_attempts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"section_id" uuid NOT NULL,
	"question_id" text NOT NULL,
	"choice_id" text NOT NULL,
	"correct" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "redo_items" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "redo_items_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"plan_id" text NOT NULL,
	"section_id" uuid,
	"concept" text NOT NULL,
	"prompt" text NOT NULL,
	"next_review_on" date NOT NULL,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schedule_entries" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "schedule_entries_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"plan_id" text NOT NULL,
	"section_id" uuid,
	"date" date NOT NULL,
	"minutes" integer NOT NULL,
	"done" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"plan_id" text NOT NULL,
	"number" integer NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"week" integer NOT NULL,
	"minutes" integer NOT NULL,
	"status" "section_status" DEFAULT 'locked'::"section_status" NOT NULL,
	"current_step" "section_step",
	"objectives" jsonb DEFAULT '[]' NOT NULL,
	"lesson" jsonb,
	"resources" jsonb DEFAULT '[]' NOT NULL,
	"quiz" jsonb DEFAULT '[]' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sections_plan_id_number_unique" UNIQUE("plan_id","number")
);
--> statement-breakpoint
CREATE INDEX "plans_user_id_index" ON "plans" ("user_id");--> statement-breakpoint
CREATE INDEX "quiz_attempts_section_id_user_id_index" ON "quiz_attempts" ("section_id","user_id");--> statement-breakpoint
CREATE INDEX "redo_items_user_id_next_review_on_index" ON "redo_items" ("user_id","next_review_on");--> statement-breakpoint
CREATE INDEX "schedule_entries_user_id_date_index" ON "schedule_entries" ("user_id","date");--> statement-breakpoint
ALTER TABLE "mastery_checks" ADD CONSTRAINT "mastery_checks_section_id_sections_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_section_id_sections_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "redo_items" ADD CONSTRAINT "redo_items_plan_id_plans_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "redo_items" ADD CONSTRAINT "redo_items_section_id_sections_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "schedule_entries" ADD CONSTRAINT "schedule_entries_plan_id_plans_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "schedule_entries" ADD CONSTRAINT "schedule_entries_section_id_sections_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "sections_plan_id_plans_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE;