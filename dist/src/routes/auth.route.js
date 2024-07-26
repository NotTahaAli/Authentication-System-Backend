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
const checkCaptcha_middleware_1 = __importDefault(require("../middleware/checkCaptcha.middleware"));
const users_1 = __importDefault(require("../db/functions/users"));
const jwt_util_1 = require("../utils/jwt.util");
const bcryptjs_1 = require("bcryptjs");
const oauth_util_1 = require("../utils/oauth.util");
const connected_accounts_1 = __importDefault(require("../db/functions/connected_accounts"));
const authFunctions_util_1 = require("../utils/authFunctions.util");
const mail_util_1 = require("../utils/mail.util");
const rsa_util_1 = require("../utils/rsa.util");
const authenticated_middleware_1 = __importDefault(require("../middleware/authenticated.middleware"));
const authRoute = express_1.default.Router();
authRoute.get("/", (_req, res) => {
    (0, response_util_1.default)(res, 200);
});
authRoute.post("/sign-up", checkCaptcha_middleware_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email } = req.body;
        (0, authFunctions_util_1.checkUsernameRequirements)(username);
        if (typeof (email) != "string")
            throw { status: 400, message: "Email is Missing or Invalid." };
        if (!email.match(/^[\w-_+\.]+@([\w-]+\.)+[\w-]{2,63}$/))
            throw { status: 400, message: "Email is Invalid." };
        (0, authFunctions_util_1.checkPasswordRequirements)(password);
        yield (0, authFunctions_util_1.checkUsernameDoesntExist)(username);
        if (yield users_1.default.getUserDataFromEmail(email)) {
            throw { status: 400, message: "Email already used." };
        }
        const hashedPassword = yield (0, bcryptjs_1.hash)(password, 10);
        const userId = yield users_1.default.addUser(username, email, hashedPassword);
        yield (0, mail_util_1.sendVerificationMail)(email);
        // res.setHeader("Authorization", createJWT({ userId }));
        (0, response_util_1.default)(res, 200);
    }
    catch (err) {
        next(err);
    }
}));
authRoute.post("/verify", checkCaptcha_middleware_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (typeof (email) != "string")
            throw { status: 400, message: "Email is Missing or Invalid." };
        if (!email.match(/^[\w-_+\.]+@([\w-]+\.)+[\w-]{2,63}$/))
            throw { status: 400, message: "Email is Invalid." };
        const user = yield users_1.default.getUserDataFromEmail(email);
        if (user) {
            if (user.verified) {
                throw { status: 400, message: "Already verified" };
            }
            yield (0, mail_util_1.sendVerificationMail)(email);
        }
        (0, response_util_1.default)(res, 200);
    }
    catch (err) {
        next(err);
    }
}));
authRoute.get("/verify", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code } = req.query;
        if (!code || typeof (code) != "string")
            throw { status: 400, message: "Token Missing." };
        try {
            const jwt = Buffer.from(code, "base64url").toString();
            const decoded = (0, jwt_util_1.verifyJWT)(jwt);
            if (!decoded.email) {
                throw new Error();
            }
            return (0, response_util_1.default)(res, (yield users_1.default.setEmailVerified(decoded.email)) ? 200 : 400);
        }
        catch (err) {
            throw { status: 400, message: "Invalid Token." };
        }
    }
    catch (err) {
        next(err);
    }
}));
authRoute.post("/login", checkCaptcha_middleware_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        (0, authFunctions_util_1.checkUsernameRequirements)(username);
        (0, authFunctions_util_1.checkPasswordRequirements)(password);
        const user = yield users_1.default.getUserDataFromUsername(username);
        if (!user) {
            throw { status: 404, message: "Username not found." };
        }
        if (!(yield (0, bcryptjs_1.compare)(password, user.password))) {
            throw { status: 401, message: "Invalid Password." };
        }
        if (!user.verified) {
            throw { status: 400, message: "Email not verified." };
        }
        if (user.twoFactor) {
            const code = yield (0, mail_util_1.send2FAMail)(user.email);
            res.setHeader("TwoFactorCode", (0, rsa_util_1.encrypt)({ jwt: (0, jwt_util_1.createJWT)({ twoFactor: { userId: user.id, code: code } }, '15m') }));
            throw { status: 401, message: "Need 2FA." };
        }
        res.setHeader("Authorization", (0, jwt_util_1.createJWT)({ userId: user.id }));
        (0, response_util_1.default)(res, 200);
    }
    catch (err) {
        next(err);
    }
}));
authRoute.post("/two-factor", checkCaptcha_middleware_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { twofactorcode: TwoFactorCode } = req.headers;
        const { code } = req.body;
        if (!TwoFactorCode || typeof (TwoFactorCode) != "string")
            throw { status: 400, message: "Two Factor Token Missing or Invalid." };
        if (typeof (code) != "number" || code < 100000 || code > 1000000)
            throw { status: 400, message: "Invalid Code." };
        let decoded;
        try {
            const decrypted = (0, rsa_util_1.decrypt)(TwoFactorCode);
            if (!decrypted.jwt)
                throw new Error();
            decoded = (0, jwt_util_1.verifyJWT)(decrypted.jwt);
            if (!decoded.twoFactor || !decoded.twoFactor.userId || !decoded.twoFactor.code)
                throw new Error();
        }
        catch (err) {
            throw { status: 400, message: "Two Factor Token Invalid." };
        }
        const user = yield users_1.default.getUserDataFromId(decoded.twoFactor.userId);
        if (!user) {
            throw { status: 404, message: "User not found." };
        }
        (0, jwt_util_1.checkCreation)(decoded, user.lastChanged);
        if (code != decoded.twoFactor.code) {
            throw { status: 400, message: "Invalid Code." };
        }
        res.setHeader("Authorization", (0, jwt_util_1.createJWT)({ userId: user.id }));
        (0, response_util_1.default)(res, 200);
    }
    catch (err) {
        next(err);
    }
}));
authRoute.patch("/two-factor", authenticated_middleware_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isEnabled } = req.body;
        const user = req.user;
        if (typeof (isEnabled) != "boolean") {
            throw { status: 400, message: "isEnabled is missing or invalid." };
        }
        if (user.twoFactor != isEnabled) {
            yield users_1.default.setTwoFactorEnabled(user.id, isEnabled);
        }
        (0, response_util_1.default)(res, 200);
    }
    catch (err) {
        next(err);
    }
}));
authRoute.post("/google-callback", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { credential, g_csrf_token: csrf_token_query } = req.body;
        if (!csrf_token_query)
            throw { status: 400, message: "CSRF Token Missing" };
        const { g_csrf_token } = req.cookies;
        if (!g_csrf_token)
            throw { status: 400, message: "CSRF Token Missing" };
        if (g_csrf_token != csrf_token_query)
            throw { status: 400, message: "CSRF Token Mismatch" };
        if (typeof (credential) != "string" || credential.length == 0)
            throw { status: 400, message: "Invalid Token." };
        const data = yield (0, oauth_util_1.verify)(credential);
        if (!data)
            throw { status: 400, message: "Invalid Token." };
        const account = yield connected_accounts_1.default.getAccountFromConnection("google_sso", { id: data.googleId });
        let userId = null;
        if (!account) {
            let user = yield users_1.default.getUserDataFromEmail(data.email);
            if (!user) {
                const { username, password } = req.body;
                if (typeof (username) != "string")
                    throw { status: 404, message: "Linked account not found. Create one." };
                (0, authFunctions_util_1.checkUsernameRequirements)(username);
                (0, authFunctions_util_1.checkPasswordRequirements)(password);
                yield (0, authFunctions_util_1.checkUsernameDoesntExist)(username);
                const hashedPassword = yield (0, bcryptjs_1.hash)(password, 10);
                const userId = yield users_1.default.addUser(username, data.email, hashedPassword, true);
                user = { id: userId, username, verified: true, password: hashedPassword, email: data.email, lastChanged: new Date(), twoFactor: false };
            }
            userId = user.id;
            if (!user.verified) {
                yield users_1.default.setEmailVerified(data.email);
            }
            yield connected_accounts_1.default.addConnectedAccount(user.id, "google_sso", { id: data.googleId });
        }
        else {
            userId = account.user_id;
        }
        res.setHeader("Authorization", (0, jwt_util_1.createJWT)({ userId }));
        (0, response_util_1.default)(res, 200);
    }
    catch (err) {
        next(err);
    }
}));
authRoute.post("/reset-password", checkCaptcha_middleware_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (typeof (email) != "string")
            throw { status: 400, message: "Email is Missing or Invalid." };
        if (!email.match(/^[\w-_+\.]+@([\w-]+\.)+[\w-]{2,63}$/))
            throw { status: 400, message: "Email is Invalid." };
        const user = yield users_1.default.getUserDataFromEmail(email);
        if (user) {
            yield (0, mail_util_1.sendResetMail)(email, user.id);
        }
        (0, response_util_1.default)(res, 200);
    }
    catch (err) {
        next(err);
    }
}));
authRoute.post("/change-password", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, code } = req.body;
        if (!code || typeof (code) != "string")
            throw { status: 400, message: "Token Missing." };
        const jwt = Buffer.from(code, "base64url").toString();
        let decoded;
        try {
            decoded = (0, jwt_util_1.verifyJWT)(jwt);
            if (!decoded.resetId)
                throw new Error();
        }
        catch (error) {
            throw { status: 400, message: "Invalid Token." };
        }
        (0, authFunctions_util_1.checkPasswordRequirements)(password);
        const user = yield users_1.default.getUserDataFromId(decoded.resetId);
        if (!user) {
            throw { status: 404, message: "User not found." };
        }
        (0, jwt_util_1.checkCreation)(decoded, user.lastChanged);
        const hashedPassword = yield (0, bcryptjs_1.hash)(password, 10);
        yield users_1.default.changePassword(decoded.resetId, hashedPassword);
        (0, response_util_1.default)(res, 200);
    }
    catch (err) {
        next(err);
    }
}));
exports.default = authRoute;
