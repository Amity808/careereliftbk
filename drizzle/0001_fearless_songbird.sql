ALTER TABLE "interview_reports" ALTER COLUMN "outcome" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."interview_outcome_enum";--> statement-breakpoint
CREATE TYPE "public"."interview_outcome_enum" AS ENUM('offer', 'rejected', 'pending');--> statement-breakpoint
ALTER TABLE "interview_reports" ALTER COLUMN "outcome" SET DATA TYPE "public"."interview_outcome_enum" USING "outcome"::"public"."interview_outcome_enum";