"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passkeys = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_1 = require("./users");
const bytea = (0, pg_core_1.customType)({
    dataType() {
        return "bytea";
    },
});
exports.passkeys = (0, pg_core_1.pgTable)("passkeys", {
    id: (0, pg_core_1.text)("id").notNull(),
    public_key: bytea("public_key").notNull(),
    user_id: (0, pg_core_1.integer)("user_id").notNull().references(() => users_1.users.id, { onDelete: 'cascade' }),
    webauthn_user_id: (0, pg_core_1.text)("webauthn_user_id").notNull(),
    counter: (0, pg_core_1.bigint)("counter", { mode: "number" }).notNull(),
    device_type: (0, pg_core_1.varchar)("device_type", { length: 32 }).notNull(),
    backed_up: (0, pg_core_1.boolean)("backed_up").notNull(),
    transports: (0, pg_core_1.varchar)("transports", { length: 255 })
}, (t) => {
    return {
        uniqueUserWebAuthn: (0, pg_core_1.unique)("uniqueUserWebAuthn").on(t.user_id, t.webauthn_user_id),
        primaryIdUserKey: (0, pg_core_1.primaryKey)({ columns: [t.id, t.user_id] })
    };
});
