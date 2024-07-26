import { integer, jsonb, pgEnum, pgTable, serial, unique } from "drizzle-orm/pg-core";
import { users } from "./users";

export const account_types = pgEnum("account_types", ["google_sso", "passkey"])
export type AccountTypes = "google_sso" | "passkey";

export const connected_accounts = pgTable("connected_accounts",{
    id: serial("id").primaryKey(),
    account_type: account_types("account_type").notNull(),
    user_id: integer("user_id").notNull().references(()=>users.id, {onDelete: 'cascade'}),
    data: jsonb("data").notNull()
}, (t)=>{
    return {
        "uniqueConnection": unique("uniqueConnection").on(t.account_type, t.data)
    }
})