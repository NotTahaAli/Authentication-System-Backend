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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_orm_1 = require("drizzle-orm");
const connector_1 = __importDefault(require("../connector"));
const connected_accounts_1 = require("../schema/connected_accounts");
function getConnectedAccount(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const account = (yield connector_1.default.select().from(connected_accounts_1.connected_accounts).where((0, drizzle_orm_1.eq)(connected_accounts_1.connected_accounts.id, id))).at(0);
        if (!account)
            return null;
        return account;
    });
}
function getConnectedAccounts(user_id, account_type) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield connector_1.default.select().from(connected_accounts_1.connected_accounts)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(connected_accounts_1.connected_accounts.user_id, user_id), (0, drizzle_orm_1.eq)(connected_accounts_1.connected_accounts.account_type, account_type)));
    });
}
function getAccountFromConnection(account_type, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const account = (yield connector_1.default.select().from(connected_accounts_1.connected_accounts).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(connected_accounts_1.connected_accounts.account_type, account_type), (0, drizzle_orm_1.eq)(connected_accounts_1.connected_accounts.data, data)))).at(0);
        if (!account)
            return null;
        return account;
    });
}
function deleteConnectedAccount(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield connector_1.default.delete(connected_accounts_1.connected_accounts).where((0, drizzle_orm_1.eq)(connected_accounts_1.connected_accounts.id, id)).returning({ id: connected_accounts_1.connected_accounts.id })).length != 0;
    });
}
function addConnectedAccount(user_id, account_type, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield connector_1.default.insert(connected_accounts_1.connected_accounts).values({ user_id, account_type, data }).returning({ id: connected_accounts_1.connected_accounts.id }))[0].id;
    });
}
exports.default = {
    addConnectedAccount,
    deleteConnectedAccount,
    getAccountFromConnection,
    getConnectedAccounts,
    getConnectedAccount
};
