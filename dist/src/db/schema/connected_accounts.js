"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connected_accounts = exports.account_types = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_1 = require("./users");
exports.account_types = (0, pg_core_1.pgEnum)("account_types", ["google_sso", "passkey"]);
exports.connected_accounts = (0, pg_core_1.pgTable)("connected_accounts", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    account_type: (0, exports.account_types)("account_type").notNull(),
    user_id: (0, pg_core_1.integer)("user_id").notNull().references(() => users_1.users.id, { onDelete: 'cascade' }),
    data: (0, pg_core_1.jsonb)("data").notNull()
}, (t) => {
    return {
        "uniqueConnection": (0, pg_core_1.unique)("uniqueConnection").on(t.account_type, t.data)
    };
});
