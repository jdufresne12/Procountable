CREATE TYPE "draft_status" AS ENUM('intake', 'outlined', 'committed', 'abandoned');--> statement-breakpoint
CREATE TABLE "plan_drafts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"status" "draft_status" DEFAULT 'intake'::"draft_status" NOT NULL,
	"messages" jsonb DEFAULT '[]' NOT NULL,
	"intake" jsonb DEFAULT '{}' NOT NULL,
	"draft" jsonb,
	"plan_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "plan_drafts_user_id_status_index" ON "plan_drafts" ("user_id","status");--> statement-breakpoint
ALTER TABLE "plan_drafts" ADD CONSTRAINT "plan_drafts_plan_id_plans_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE SET NULL;