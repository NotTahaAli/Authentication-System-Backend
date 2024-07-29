import { and, count, eq } from "drizzle-orm";
import getDB from "../connector";
import { AccountTypes, connected_accounts } from "../schema/connected_accounts";

async function getConnectedAccount(id: number) {
    const account = (await getDB().select().from(connected_accounts).where(eq(connected_accounts.id, id))).at(0);
    if (!account) return null;
    return account;
}

async function getConnectedAccounts(user_id: number, account_type: AccountTypes) {
    return await getDB().select().from(connected_accounts)
        .where(
            and(eq(connected_accounts.user_id, user_id),
                eq(connected_accounts.account_type, account_type)));
}

async function getAccountFromConnection(account_type: AccountTypes, data: Record<string | number, any>) {
    const account = (await getDB().select().from(connected_accounts).where(
        and(eq(connected_accounts.account_type, account_type),
            eq(connected_accounts.data, data)))).at(0);
    if (!account) return null;
    return account;
}

async function deleteConnectedAccount(id: number) {
    return (await getDB().delete(connected_accounts).where(eq(connected_accounts.id, id)).returning({ id: connected_accounts.id })).length != 0;
}

async function addConnectedAccount(user_id: number, account_type: AccountTypes, data: Record<string | number, any>) {
    return (await getDB().insert(connected_accounts).values({ user_id, account_type, data }).returning({ id: connected_accounts.id }))[0].id;
}

export default {
    addConnectedAccount,
    deleteConnectedAccount,
    getAccountFromConnection,
    getConnectedAccounts,
    getConnectedAccount
}