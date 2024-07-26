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
exports.getUserWebAuthnOptions = getUserWebAuthnOptions;
const server_1 = require("@simplewebauthn/server");
const webauthn_config_1 = require("../configs/webauthn.config");
const passkeys_1 = __importDefault(require("../db/functions/passkeys"));
function getUserWebAuthnOptions(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const userPasskeys = yield passkeys_1.default.getUserPasskeys(user);
        return yield (0, server_1.generateRegistrationOptions)({
            rpName: (0, webauthn_config_1.getRPName)(),
            rpID: (0, webauthn_config_1.getRPId)(),
            userName: user.username,
            attestationType: 'none',
            excludeCredentials: userPasskeys.map(passkey => ({
                id: passkey.id,
                transports: passkey.transports,
            })),
            authenticatorSelection: {
                residentKey: 'preferred',
                userVerification: 'preferred',
                authenticatorAttachment: 'platform',
            },
        });
    });
}
