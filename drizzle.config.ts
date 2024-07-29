import type { Config } from "drizzle-kit";

if (!process.env.POSTGRES_URL) {
    throw new Error("Postgres URL Not Configured");
}

export default {
    dialect: "postgresql",
    schema: "./src/db/schema/*.ts",
    out: "./drizzle",
    dbCredentials: {
        url: process.env.POSTGRES_URL
    }
} satisfies Config;