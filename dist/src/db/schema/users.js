"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.citext = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.citext = (0, pg_core_1.customType)({
    dataType() {
        return 'citext';
    },
});
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    username: (0, exports.citext)("username").notNull().unique(),
    email: (0, exports.citext)("email").notNull().unique(),
    password: (0, pg_core_1.char)("password", { length: 60 }).notNull(),
    verified: (0, pg_core_1.boolean)("verified").notNull().default(false),
    lastChanged: (0, pg_core_1.timestamp)("last_changed").notNull().defaultNow(),
    twoFactor: (0, pg_core_1.boolean)("two_factor").notNull().default(false)
});
