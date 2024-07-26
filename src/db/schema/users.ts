import { boolean, char, customType, pgTable, serial, timestamp } from "drizzle-orm/pg-core";

export type User = {
    id: number;
    username: string;
    email: string;
    password?: string;
    verified: boolean;
    lastChanged: Date,
    twoFactor: boolean
};

export const citext = customType<{ data: string }>({
    dataType() {
        return 'citext';
    },
});

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: citext("username").notNull().unique(),
    email: citext("email").notNull().unique(),
    password: char("password", { length: 60 }).notNull(),
    verified: boolean("verified").notNull().default(false),
    lastChanged: timestamp("last_changed").notNull().defaultNow(),
    twoFactor: boolean("two_factor").notNull().default(false)
})