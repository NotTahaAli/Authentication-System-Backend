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
const passkeys_1 = require("../schema/passkeys");
function parseKey(key, user) {
    var _a;
    return {
        id: key.id,
        publicKey: new Uint8Array(key.public_key),
        user,
        webauthnUserID: key.webauthn_user_id,
        counter: key.counter,
        deviceType: key.device_type,
        backed_up: key.backed_up,
        transports: (_a = key.transports) === null || _a === void 0 ? void 0 : _a.split(",")
    };
}
function addPasskeytoDatabase(key) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        yield connector_1.default.insert(passkeys_1.passkeys).values({
            id: key.id,
            public_key: Buffer.from(key.publicKey),
            user_id: key.user.id,
            webauthn_user_id: key.webauthnUserID,
            counter: key.counter,
            device_type: key.deviceType,
            backed_up: key.backed_up,
            transports: (_a = key.transports) === null || _a === void 0 ? void 0 : _a.join(","),
        });
    });
}
function updateCounter(key, counter) {
    return __awaiter(this, void 0, void 0, function* () {
        yield connector_1.default.update(passkeys_1.passkeys).set({ counter }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passkeys_1.passkeys.user_id, key.user.id), (0, drizzle_orm_1.eq)(passkeys_1.passkeys.id, key.id)));
    });
}
function getUnparsedKeysFromUser(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield connector_1.default.select().from(passkeys_1.passkeys).where((0, drizzle_orm_1.eq)(passkeys_1.passkeys.user_id, user_id));
    });
}
function getUnparsedKey(user_id, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const key = (yield connector_1.default.select().from(passkeys_1.passkeys).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(passkeys_1.passkeys.id, id), (0, drizzle_orm_1.eq)(passkeys_1.passkeys.user_id, user_id)))).at(0);
        if (!key)
            return null;
        return key;
    });
}
function getUserPasskey(user, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const key = yield getUnparsedKey(user.id, id);
        if (!key)
            return null;
        return parseKey(key, user);
    });
}
function getUserPasskeys(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const parsedKeys = (yield getUnparsedKeysFromUser(user.id)).map(key => parseKey(key, user));
        return parsedKeys;
    });
}
exports.default = {
    getUserPasskey,
    getUserPasskeys,
    parseKey,
    updateCounter,
    addPasskeytoDatabase
};
