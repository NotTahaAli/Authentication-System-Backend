ALTER TABLE "users" RENAME COLUMN "lastChanged" TO "last_changed";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "two_factor" boolean DEFAULT false NOT NULL;