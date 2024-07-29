import { eq} from "drizzle-orm";
import getDB from "../connector";
import { keys } from "../schema/keys";

async function getKey(type: string) {
    const user = (await getDB().select().from(keys).where(eq(keys.type, type))).at(0);
    if (!user) return null;
    return user;
}

async function removeKey(type: string) {
    return (await getDB().delete(keys).where(eq(keys.type, type)).returning({type: keys.type})).length != 0;
}

async function setKey(type: string, key: string) {
    return (await getDB().insert(keys).values({
        type,
        key
    }).returning({ type: keys.type }).onConflictDoUpdate({
        target: keys.type,
        set: {key}
    })).length != 0
}

export default {
    setKey,
    getKey,
    removeKey
}