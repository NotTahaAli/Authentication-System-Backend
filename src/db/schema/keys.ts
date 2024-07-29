import { customType, pgTable, text } from "drizzle-orm/pg-core";

export const citext = customType<{ data: string }>({
    dataType() {
        return 'citext';
    },
});

export const keys = pgTable("keys", {
    type: citext("type").primaryKey(),
    key: text("key").notNull()
})