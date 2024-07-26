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
const users_1 = require("../schema/users");
function getUserDataFromId(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = (yield connector_1.default.select().from(users_1.users).where((0, drizzle_orm_1.eq)(users_1.users.id, user_id))).at(0);
        if (!user)
            return null;
        return user;
    });
}
function getUserDataFromUsername(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = (yield connector_1.default.select().from(users_1.users).where((0, drizzle_orm_1.eq)(users_1.users.username, username))).at(0);
        if (!user)
            return null;
        return user;
    });
}
function getUserDataFromEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = (yield connector_1.default.select().from(users_1.users).where((0, drizzle_orm_1.eq)(users_1.users.email, email))).at(0);
        if (!user)
            return null;
        return user;
    });
}
function setEmailVerified(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield connector_1.default.update(users_1.users).set({
            verified: true
        }).where((0, drizzle_orm_1.eq)(users_1.users.email, email)).returning({ id: users_1.users.id })).length != 0;
    });
}
function addUser(username, email, passwordHash, verified) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield connector_1.default.insert(users_1.users).values({
            username,
            email,
            password: passwordHash,
            verified
        }).returning({ id: users_1.users.id }))[0].id;
    });
}
function changePassword(user_id, passwordHash) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield connector_1.default.update(users_1.users).set({ password: passwordHash, lastChanged: (0, drizzle_orm_1.sql) `now()` }).where((0, drizzle_orm_1.eq)(users_1.users.id, user_id)).returning({ id: users_1.users.id })).length != 0;
    });
}
function setTwoFactorEnabled(user_id, twoFactor) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield connector_1.default.update(users_1.users).set({ twoFactor }).where((0, drizzle_orm_1.eq)(users_1.users.id, user_id)).returning({ id: users_1.users.id })).length != 0;
    });
}
exports.default = {
    addUser,
    changePassword,
    getUserDataFromId,
    getUserDataFromUsername,
    getUserDataFromEmail,
    setEmailVerified,
    setTwoFactorEnabled
};
