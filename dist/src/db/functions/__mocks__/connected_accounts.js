"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mockedAccounts = jest.createMockFromModule("../connected_accounts");
function getConnectedAccount(id) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (id) {
            case 1:
                return { id, data: { id: 1 }, account_type: "google_sso", user_id: 1 };
            default:
                return null;
        }
    });
}
function getConnectedAccounts(user_id, account_type) {
    return __awaiter(this, void 0, void 0, function* () {
        if (account_type == "google_sso") {
            switch (user_id) {
                case 1:
                    return [{ id: 1, data: { id: 1 }, account_type, user_id }];
            }
        }
        return [];
    });
}
function getAccountFromConnection(account_type, data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (account_type == 'google_sso') {
            if (data && data.id) {
                if (data.id == 1) {
                    return { id: 1, data, account_type, user_id: 1 };
                }
            }
        }
        return null;
    });
}
function deleteConnectedAccount(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return true;
    });
}
function addConnectedAccount(user_id, account_type, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return 3;
    });
}
mockedAccounts.addConnectedAccount = jest.fn(addConnectedAccount);
mockedAccounts.deleteConnectedAccount = jest.fn(deleteConnectedAccount);
mockedAccounts.getAccountFromConnection = jest.fn(getAccountFromConnection);
mockedAccounts.getConnectedAccounts = jest.fn(getConnectedAccounts);
mockedAccounts.getConnectedAccount = jest.fn(getConnectedAccount);
exports.default = mockedAccounts;
