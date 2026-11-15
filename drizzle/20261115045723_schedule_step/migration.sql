ALTER TABLE "mastery_checks" RENAME COLUMN "tran_script" TO "transcript";--> statement-breakpoint
ALTER TABLE "schedule_entries" ADD COLUMN "step" "section_step" NOT NULL;