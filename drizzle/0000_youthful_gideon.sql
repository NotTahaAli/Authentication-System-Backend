DO $$ BEGIN
 CREATE TYPE "public"."account_types" AS ENUM('google_sso', 'passkey');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "connected_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"account_type" "account_types" NOT NULL,
	"user_id" integer NOT NULL,
	"data" jsonb NOT NULL,
	CONSTRAINT "uniqueConnection" UNIQUE("account_type","data")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "passkeys" (
	"id" text NOT NULL,
	"public_key" "bytea" NOT NULL,
	"user_id" integer NOT NULL,
	"webauthn_user_id" text NOT NULL,
	"counter" bigint NOT NULL,
	"device_type" varchar(32) NOT NULL,
	"backed_up" boolean NOT NULL,
	"transports" varchar(255),
	CONSTRAINT "passkeys_id_user_id_pk" PRIMARY KEY("id","user_id"),
	CONSTRAINT "uniqueUserWebAuthn" UNIQUE("user_id","webauthn_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "used_codes" (
	"code" char(10) NOT NULL,
	"user_id" integer NOT NULL,
	CONSTRAINT "used_codes_code_user_id_pk" PRIMARY KEY("code","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" char(60) NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "connected_accounts" ADD CONSTRAINT "connected_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "passkeys" ADD CONSTRAINT "passkeys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "used_codes" ADD CONSTRAINT "used_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
