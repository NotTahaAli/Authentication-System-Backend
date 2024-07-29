import { count, eq, sql } from "drizzle-orm";
import getDB from "../connector";
import { users } from "../schema/users";

async function getUserDataFromId(user_id: number) {
    const user = (await getDB().select().from(users).where(eq(users.id, user_id))).at(0);
    if (!user) return null;
    return user;
}

async function getUserDataFromUsername(username: string) {
    const user = (await getDB().select().from(users).where(eq(users.username, username))).at(0);
    if (!user) return null;
    return user;
}

async function getUserDataFromEmail(email: string) {
    const user = (await getDB().select().from(users).where(eq(users.email, email))).at(0);
    if (!user) return null;
    return user;
}

async function setEmailVerified(email: string) {
    return (await getDB().update(users).set({
        verified: true
    }).where(eq(users.email, email)).returning({id: users.id})).length != 0;
}

async function addUser(username: string, email: string, passwordHash: string, verified?: boolean) {
    return (await getDB().insert(users).values({
        username,
        email,
        password: passwordHash,
        verified
    }).returning({ id: users.id }))[0].id
}

async function changePassword(user_id: number, passwordHash: string) {
    return (await getDB().update(users).set({password: passwordHash, lastChanged: sql`now()`}).where(eq(users.id, user_id)).returning({id: users.id})).length != 0;
}

async function setTwoFactorEnabled(user_id: number, twoFactor: boolean) {
    return (await getDB().update(users).set({twoFactor}).where(eq(users.id, user_id)).returning({id: users.id})).length != 0;
}

export default {
    addUser,
    changePassword,
    getUserDataFromId,
    getUserDataFromUsername,
    getUserDataFromEmail,
    setEmailVerified,
    setTwoFactorEnabled
}