import express from "express";
import sendResponse from "../utils/response.util";
import checkCaptchaMiddleware from "../middleware/checkCaptcha.middleware";
import users from "../db/functions/users";
import { checkCreation, createJWT, strippedPayload, verifyJWT } from "../utils/jwt.util";
import { hash, compare } from "bcryptjs";
import { verify } from "../utils/oauth.util";
import connected_accounts from "../db/functions/connected_accounts";
import { checkPasswordRequirements, checkUsernameDoesntExist, checkUsernameRequirements } from "../utils/authFunctions.util";
import { send2FAMail, sendResetMail, sendVerificationMail } from "../utils/mail.util";
import { JwtPayload } from "jsonwebtoken";
import { decrypt, encrypt } from "../utils/rsa.util";
import authenticatedMiddleware, { AuthenticatedRequest } from "../middleware/authenticated.middleware";
import { User } from "../db/schema/users";
import { boolean } from "drizzle-orm/mysql-core";

const authRoute = express.Router();

authRoute.get("/", (_req, res) => {
    sendResponse(res, 200);
});

authRoute.post("/sign-up", checkCaptchaMiddleware, async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        checkUsernameRequirements(username);
        if (typeof (email) != "string")
            throw { status: 400, message: "Email is Missing or Invalid." };
        if (!email.match(/^[\w-_+\.]+@([\w-]+\.)+[\w-]{2,63}$/))
            throw { status: 400, message: "Email is Invalid." }
        checkPasswordRequirements(password);

        await checkUsernameDoesntExist(username);
        if (await users.getUserDataFromEmail(email)) {
            throw { status: 400, message: "Email already used." }
        }
        const hashedPassword = await hash(password, 10);

        const userId = await users.addUser(username, email, hashedPassword);
        await sendVerificationMail(email);
        // res.setHeader("Authorization", createJWT({ userId }));
        sendResponse(res, 200);
    } catch (err) {
        next(err);
    }
})

authRoute.post("/verify", checkCaptchaMiddleware, async (req, res, next) => {
    try {
        const { email } = req.body;
        if (typeof (email) != "string")
            throw { status: 400, message: "Email is Missing or Invalid." };
        if (!email.match(/^[\w-_+\.]+@([\w-]+\.)+[\w-]{2,63}$/))
            throw { status: 400, message: "Email is Invalid." }
        const user = await users.getUserDataFromEmail(email)
        if (user) {
            if (user.verified) {
                throw { status: 400, message: "Already verified" }
            }
            await sendVerificationMail(email);
        }
        sendResponse(res, 200);
    } catch (err) {
        next(err);
    }
})

authRoute.get("/verify", async (req, res, next) => {
    try {
        const { code } = req.query;
        if (!code || typeof (code) != "string")
            throw { status: 400, message: "Token Missing." };
        try {
            const jwt = Buffer.from(code, "base64url").toString();
            const decoded = verifyJWT(jwt);
            if (!decoded.email) {
                throw new Error();
            }
            return sendResponse(res, (await users.setEmailVerified(decoded.email)) ? 200 : 400);
        } catch (err) {
            throw { status: 400, message: "Invalid Token." };
        }
    } catch (err) {
        next(err);
    }
})

authRoute.post("/login", checkCaptchaMiddleware, async (req, res, next) => {
    try {
        const { username, password } = req.body;
        checkUsernameRequirements(username);
        checkPasswordRequirements(password);

        const user = await users.getUserDataFromUsername(username);
        if (!user) {
            throw { status: 404, message: "Username not found." }
        }
        if (!await compare(password, user.password)) {
            throw { status: 401, message: "Invalid Password." }
        }
        if (!user.verified) {
            throw { status: 400, message: "Email not verified." }
        }
        if (user.twoFactor) {
            const code = await send2FAMail(user.email);
            res.setHeader("TwoFactorCode", encrypt({jwt: createJWT({twoFactor: {userId: user.id, code: code}}, '15m')}));
            throw {status: 401, message: "Need 2FA."}
        }
        res.setHeader("Authorization", createJWT({ userId: user.id }));
        sendResponse(res, 200);
    } catch (err) {
        next(err);
    }
})

authRoute.post("/two-factor", checkCaptchaMiddleware, async (req, res, next)=>{
    try {
        const {twofactorcode: TwoFactorCode} = req.headers;
        const {code} = req.body;
        if (!TwoFactorCode || typeof(TwoFactorCode) != "string")
            throw {status: 400, message: "Two Factor Token Missing or Invalid."};
        if (typeof(code) != "number" || code < 100000 || code > 1000000)
            throw {status: 400, message: "Invalid Code."};
        let decoded: {twoFactor?: {userId?: number, code?: number}} & strippedPayload;
        try {
            const decrypted = decrypt<{jwt?: string}>(TwoFactorCode);
            if (!decrypted.jwt)
                throw new Error();
            decoded = verifyJWT(decrypted.jwt);
            if (!decoded.twoFactor || !decoded.twoFactor.userId || !decoded.twoFactor.code)
                throw new Error();
        } catch(err) {
            throw {status: 400, message: "Two Factor Token Invalid."};
        }
        const user = await users.getUserDataFromId(decoded.twoFactor.userId);
        if (!user) {
            throw {status: 404, message: "User not found."}
        }
        checkCreation(decoded, user.lastChanged);
        if (code != decoded.twoFactor.code) {
            throw {status: 400, message: "Invalid Code."};
        }
        res.setHeader("Authorization", createJWT({ userId: user.id }));
        sendResponse(res, 200);
    } catch (err) {
        next(err);
    }
})

authRoute.patch("/two-factor", authenticatedMiddleware, async (req: AuthenticatedRequest, res, next)=>{
    try {
        const { isEnabled } = req.body;

        const user = req.user as User;
        if (typeof(isEnabled) != "boolean") {
            throw {status: 400, message: "isEnabled is missing or invalid."};
        }
        if (user.twoFactor != isEnabled) {
            await users.setTwoFactorEnabled(user.id, isEnabled);
        }
        sendResponse(res, 200);
    } catch (err) {
        next(err);
    }
})

authRoute.post("/google-callback", async (req, res, next) => {
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
        const data = await verify(credential);
        if (!data)
            throw { status: 400, message: "Invalid Token." };
        const account = await connected_accounts.getAccountFromConnection("google_sso", { id: data.googleId });
        let userId: number | null = null;
        if (!account) {
            let user = await users.getUserDataFromEmail(data.email);
            if (!user) {
                const { username, password } = req.body;
                if (typeof (username) != "string")
                    throw { status: 404, message: "Linked account not found. Create one." };
                checkUsernameRequirements(username);
                checkPasswordRequirements(password);
                await checkUsernameDoesntExist(username);
                const hashedPassword = await hash(password, 10);

                const userId = await users.addUser(username, data.email, hashedPassword, true);
                user = { id: userId, username, verified: true, password: hashedPassword, email: data.email, lastChanged: new Date(), twoFactor: false };
            }
            userId = user.id;
            if (!user.verified) {
                await users.setEmailVerified(data.email);
            }
            await connected_accounts.addConnectedAccount(user.id, "google_sso", { id: data.googleId });
        } else {
            userId = account.user_id;
        }
        res.setHeader("Authorization", createJWT({ userId }));
        sendResponse(res, 200);
    } catch (err) {
        next(err);
    }
})

authRoute.post("/reset-password", checkCaptchaMiddleware, async (req, res, next) => {
    try {
        const { email } = req.body;
        if (typeof (email) != "string")
            throw { status: 400, message: "Email is Missing or Invalid." };
        if (!email.match(/^[\w-_+\.]+@([\w-]+\.)+[\w-]{2,63}$/))
            throw { status: 400, message: "Email is Invalid." }
        const user = await users.getUserDataFromEmail(email)
        if (user) {
            await sendResetMail(email, user.id);
        }
        sendResponse(res, 200);
    } catch (err) {
        next(err);
    }
})

authRoute.post("/change-password", async (req, res, next) => {
    try {
        const {password, code} = req.body;
        if (!code || typeof (code) != "string")
            throw { status: 400, message: "Token Missing." };
        const jwt = Buffer.from(code, "base64url").toString();
        let decoded: JwtPayload;
        try {
            decoded = verifyJWT(jwt);
            if (!decoded.resetId) throw new Error();
        } catch (error) {
            throw {status: 400, message: "Invalid Token."};
        }
        checkPasswordRequirements(password);
        const user = await users.getUserDataFromId(decoded.resetId);
        if (!user) {
            throw {status: 404, message: "User not found."};
        }
        checkCreation(decoded, user.lastChanged);
        const hashedPassword = await hash(password, 10);
        await users.changePassword(decoded.resetId as number, hashedPassword);
        sendResponse(res, 200);
    } catch (err) {
        next(err);
    }
})

export default authRoute;