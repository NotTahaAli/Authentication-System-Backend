import { and, eq } from "drizzle-orm";
import getDB from "../connector";
import { Passkey, passkeys } from "../schema/passkeys";
import { User } from "../schema/users";
import { AuthenticatorTransportFuture, CredentialDeviceType } from "@simplewebauthn/server/script/deps";

function parseKey(key: {
    id: string;
    public_key: Buffer;
    user_id: number;
    webauthn_user_id: string;
    counter: number;
    device_type: string;
    backed_up: boolean;
    transports: string | null;
}, user:User): Passkey {
    return {
        id: key.id,
        publicKey: new Uint8Array(key.public_key),
        user,
        webauthnUserID: key.webauthn_user_id,
        counter: key.counter,
        deviceType: key.device_type as CredentialDeviceType,
        backed_up: key.backed_up,
        transports: key.transports?.split(",") as AuthenticatorTransportFuture[] | undefined
    }
}

async function addPasskeytoDatabase(key: Passkey) {
    await getDB().insert(passkeys).values({
        id: key.id,
        public_key: Buffer.from(key.publicKey),
        user_id: key.user.id,
        webauthn_user_id: key.webauthnUserID,
        counter: key.counter,
        device_type: key.deviceType,
        backed_up: key.backed_up,
        transports: key.transports?.join(","),
    })
}

async function updateCounter(key: Passkey, counter: number) {
    await getDB().update(passkeys).set({counter}).where(and(eq(passkeys.user_id, key.user.id), eq(passkeys.id, key.id)))
}

async function getUnparsedKeysFromUser(user_id: number) {
    return await getDB().select().from(passkeys).where(eq(passkeys.user_id, user_id))
}

async function getUnparsedKey(user_id: number, id: string) {
    const key = (await getDB().select().from(passkeys).where(and(eq(passkeys.id, id), eq(passkeys.user_id, user_id)))).at(0)
    if (!key) return null;
    return key;
}

async function getUserPasskey(user: User, id: string) {
    const key = await getUnparsedKey(user.id, id);
    if (!key) return null;
    return parseKey(key, user);
}

async function getUserPasskeys(user: User) {
    const parsedKeys: Passkey[] = (await getUnparsedKeysFromUser(user.id)).map(key => parseKey(key, user));
    return parsedKeys;
}

export default {
    getUserPasskey,
    getUserPasskeys,
    parseKey,
    updateCounter,
    addPasskeytoDatabase
}