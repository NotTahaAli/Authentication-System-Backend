import { AccountTypes } from "../../schema/connected_accounts";
import connected_accounts from "../connected_accounts";
const mockedAccounts = jest.createMockFromModule<typeof connected_accounts>("../connected_accounts");

async function getConnectedAccount(id: number) {
    switch (id) {
        case 1:
            return { id, data: { id: 1 }, account_type: "google_sso" as AccountTypes, user_id: 1 }
        default:
            return null;
    }
}

async function getConnectedAccounts(user_id: number, account_type: AccountTypes) {
    if (account_type == "google_sso") {
        switch(user_id) {
            case 1:
                return [{id: 1, data: {id: 1}, account_type, user_id}]
        }
    }
    return [];
}

async function getAccountFromConnection(account_type: AccountTypes, data: Record<string | number, any>) {
    if (account_type == 'google_sso') {
        if (data && data.id) {
            if (data.id == 1) {
                return { id: 1, data, account_type, user_id: 1 }
            }
        }
    }
    return null;
}

async function deleteConnectedAccount(id: number) {
    return true;
}

async function addConnectedAccount(user_id: number, account_type: AccountTypes, data: Record<string | number, any>) {
    return 3;
}

mockedAccounts.addConnectedAccount = jest.fn(addConnectedAccount);
mockedAccounts.deleteConnectedAccount = jest.fn(deleteConnectedAccount);
mockedAccounts.getAccountFromConnection = jest.fn(getAccountFromConnection);
mockedAccounts.getConnectedAccounts = jest.fn(getConnectedAccounts);
mockedAccounts.getConnectedAccount = jest.fn(getConnectedAccount);

export default mockedAccounts