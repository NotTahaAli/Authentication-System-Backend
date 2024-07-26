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
const express_1 = __importDefault(require("express"));
const response_util_1 = __importDefault(require("../utils/response.util"));
const authenticated_middleware_1 = __importDefault(require("../middleware/authenticated.middleware"));
const webauthn_util_1 = require("../utils/webauthn.util");
const server_1 = require("@simplewebauthn/server");
const webauthn_config_1 = require("../configs/webauthn.config");
const jwt_util_1 = require("../utils/jwt.util");
const passkeys_1 = __importDefault(require("../db/functions/passkeys"));
const authFunctions_util_1 = require("../utils/authFunctions.util");
const users_1 = __importDefault(require("../db/functions/users"));
const webAuthnRoute = express_1.default.Router();
webAuthnRoute.get("/", authenticated_middleware_1.default, (_req, res) => {
    (0, response_util_1.default)(res, 200);
});
webAuthnRoute.get("/register/generate-options", authenticated_middleware_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = yield (0, webauthn_util_1.getUserWebAuthnOptions)(req.user);
        res.setHeader("webauthn_options", (0, jwt_util_1.createJWT)({ challengeOptions: options }, "15m"));
        (0, response_util_1.default)(res, 200, options);
    }
    catch (error) {
        if (error && typeof (error) == "object" && !Array.isArray(error) && "status" in error)
            return next(error);
        if (error instanceof Error)
            return next({ status: 400, message: error.message });
        console.log(error);
        return next({ status: 400, message: "Unknown Error Occured" });
    }
}));
webAuthnRoute.post("/register/verify", authenticated_middleware_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        const user = req.user;
        const optionsHeader = req.headers["webauthn_options"];
        if (!optionsHeader || typeof (optionsHeader) != "string") {
            throw { status: 400, message: "Options Missing" };
        }
        let currentOptions;
        try {
            currentOptions = (0, jwt_util_1.verifyJWT)(optionsHeader);
            if (currentOptions.challengeOptions == undefined)
                throw new Error();
        }
        catch (error) {
            throw { status: 400, message: "Options Header invalid" };
        }
        let verification;
        verification = yield (0, server_1.verifyRegistrationResponse)({
            response: body,
            expectedChallenge: currentOptions.challengeOptions.challenge,
            expectedOrigin: (0, webauthn_config_1.getRPOrigin)(),
            expectedRPID: (0, webauthn_config_1.getRPId)(),
        });
        const { verified, registrationInfo } = verification;
        if (verified && registrationInfo) {
            const { credentialID, credentialPublicKey, counter, credentialDeviceType, credentialBackedUp } = registrationInfo;
            const newPasskey = {
                user,
                webauthnUserID: currentOptions.challengeOptions.user.id,
                id: credentialID,
                publicKey: credentialPublicKey,
                counter,
                deviceType: credentialDeviceType,
                backed_up: credentialBackedUp,
                transports: body.response.transports,
            };
            yield passkeys_1.default.addPasskeytoDatabase(newPasskey);
        }
        (0, response_util_1.default)(res, 200, { verified });
    }
    catch (error) {
        if (error && typeof (error) == "object" && !Array.isArray(error) && "status" in error)
            return next(error);
        if (error instanceof Error)
            return next({ status: 400, message: error.message });
        console.log(error);
        return next({ status: 400, message: "Unknown Error Occured" });
    }
}));
webAuthnRoute.post("/auth/get-options", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        (0, authFunctions_util_1.checkUsernameRequirements)(username);
        const user = yield users_1.default.getUserDataFromUsername(username);
        if (!user) {
            throw { status: 404, message: "Username not found." };
        }
        const userPasskeys = yield passkeys_1.default.getUserPasskeys(user);
        const options = yield (0, server_1.generateAuthenticationOptions)({
            rpID: (0, webauthn_config_1.getRPId)(),
            allowCredentials: userPasskeys.map(passkey => ({
                id: passkey.id,
                transports: passkey.transports,
            })),
        });
        res.setHeader("webauthn_options", (0, jwt_util_1.createJWT)({ authOptions: options, user: { id: user.id } }, "15m"));
        (0, response_util_1.default)(res, 200, options);
    }
    catch (error) {
        if (error && typeof (error) == "object" && !Array.isArray(error) && "status" in error)
            return next(error);
        if (error instanceof Error)
            return next({ status: 400, message: error.message });
        console.log(error);
        return next({ status: 400, message: "Unknown Error Occured" });
    }
}));
webAuthnRoute.post("/auth/verify", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        const optionsHeader = req.headers["webauthn_options"];
        if (!optionsHeader || typeof (optionsHeader) != "string") {
            throw { status: 400, message: "Options Missing" };
        }
        let currentOptions;
        try {
            currentOptions = (0, jwt_util_1.verifyJWT)(optionsHeader);
            if (currentOptions.authOptions == undefined)
                throw new Error();
            if (currentOptions.user == undefined)
                throw new Error();
        }
        catch (error) {
            throw { status: 400, message: "Options Header invalid" };
        }
        const user = yield users_1.default.getUserDataFromId(currentOptions.user.id);
        if (!user) {
            throw { status: 404, message: "User not found." };
        }
        const passkey = yield passkeys_1.default.getUserPasskey(user, body.id);
        if (!passkey) {
            throw new Error(`Passkey does not match user.`);
        }
        let verification;
        verification = yield (0, server_1.verifyAuthenticationResponse)({
            response: body,
            expectedChallenge: currentOptions.authOptions.challenge,
            expectedOrigin: (0, webauthn_config_1.getRPOrigin)(),
            expectedRPID: (0, webauthn_config_1.getRPId)(),
            authenticator: {
                credentialID: passkey.id,
                credentialPublicKey: passkey.publicKey,
                counter: passkey.counter,
                transports: passkey.transports,
            },
        });
        const { verified, authenticationInfo } = verification;
        if (verified && authenticationInfo) {
            yield passkeys_1.default.updateCounter(passkey, authenticationInfo.newCounter);
        }
        res.setHeader("Authorization", (0, jwt_util_1.createJWT)({ userId: user.id }));
        (0, response_util_1.default)(res, 200, { verified });
    }
    catch (error) {
        if (error && typeof (error) == "object" && !Array.isArray(error) && "status" in error)
            return next(error);
        if (error instanceof Error)
            return next({ status: 400, message: error.message });
        return next({ status: 400, message: "Unknown Error Occured" });
    }
}));
exports.default = webAuthnRoute;
