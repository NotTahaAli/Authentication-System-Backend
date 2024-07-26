import { bigint, boolean, customType, integer, pgTable, primaryKey, text, unique, varchar } from "drizzle-orm/pg-core";
import { User, users } from "./users";

import type {
    AuthenticatorTransportFuture,
    CredentialDeviceType,
    Base64URLString,
} from '@simplewebauthn/types';

export type Passkey = {
    id: Base64URLString;
    publicKey: Uint8Array;
    user: User;
    webauthnUserID: Base64URLString;
    counter: number;
    deviceType: CredentialDeviceType;
    backed_up: boolean;
    transports?: AuthenticatorTransportFuture[];
};

const bytea = customType<{ data: Buffer;}>({
    dataType() {
        return "bytea";
    },
});

export const passkeys = pgTable("passkeys", {
    id: text("id").notNull(),
    public_key: bytea("public_key").notNull(),
    user_id: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    webauthn_user_id: text("webauthn_user_id").notNull(),
    counter: bigint("counter", {mode: "number"}).notNull(),
    device_type: varchar("device_type", {length: 32}).notNull(),
    backed_up: boolean("backed_up").notNull(),
    transports: varchar("transports", {length: 255})
}, (t)=>{
    return {
        uniqueUserWebAuthn: unique("uniqueUserWebAuthn").on(t.user_id, t.webauthn_user_id),
        primaryIdUserKey: primaryKey({columns: [t.id, t.user_id]})
    }
})