CREATE TYPE "public"."challenge_category_enum" AS ENUM('component', 'interaction', 'form', 'layout');--> statement-breakpoint
CREATE TYPE "public"."submission_status_enum" AS ENUM('draft', 'completed');--> statement-breakpoint
CREATE TABLE "challenge_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"challenge_id" uuid NOT NULL,
	"user_code" text NOT NULL,
	"status" "submission_status_enum" DEFAULT 'draft' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "unique_user_challenge_submission" UNIQUE("user_id","challenge_id")
);
--> statement-breakpoint
CREATE TABLE "design_challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"difficulty" "question_difficulty_enum" NOT NULL,
	"category" "challenge_category_enum" NOT NULL,
	"estimated_time_minutes" integer NOT NULL,
	"specs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"image_url" varchar(500) NOT NULL,
	"starter_code" text NOT NULL,
	"reference_solution_code" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "figma_designs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(100) NOT NULL,
	"difficulty" "question_difficulty_enum" NOT NULL,
	"figma_embed_url" varchar(1000) NOT NULL,
	"specs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "challenge_submissions" ADD CONSTRAINT "challenge_submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_submissions" ADD CONSTRAINT "challenge_submissions_challenge_id_design_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."design_challenges"("id") ON DELETE cascade ON UPDATE no action;