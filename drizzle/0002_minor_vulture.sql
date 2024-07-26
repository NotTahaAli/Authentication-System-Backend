DROP TABLE "used_codes";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "lastChanged" timestamp DEFAULT now() NOT NULL;