import express from "express";
import sendResponse from "../utils/response.util";
import authenticatedMiddleware, { AuthenticatedRequest } from "../middleware/authenticated.middleware";
import { User } from "../db/schema/users";
import { getUserWebAuthnOptions } from "../utils/webauthn.util";
import { generateAuthenticationOptions, verifyAuthenticationResponse, verifyRegistrationResponse } from "@simplewebauthn/server";
import { getRPId, getRPOrigin } from "../configs/webauthn.config";
import { Passkey } from "../db/schema/passkeys";
import { createJWT, strippedPayload, verifyJWT } from "../utils/jwt.util";
import { PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/server/script/deps";
import passkeys from "../db/functions/passkeys";
import { checkUsernameRequirements } from "../utils/authFunctions.util";
import users from "../db/functions/users";
const webAuthnRoute = express.Router();

webAuthnRoute.get("/", authenticatedMiddleware, (_req, res) => {
    sendResponse(res, 200);
});

webAuthnRoute.get("/register/generate-options", authenticatedMiddleware, async (req: AuthenticatedRequest, res, next) => {
    try {
        const options = await getUserWebAuthnOptions(req.user as User)
        res.setHeader("Webauthn-Options", createJWT({ challengeOptions: options }, "15m"));
        sendResponse(res, 200, options);
    } catch (error) {
        if (error && typeof(error) == "object" && !Array.isArray(error) && "status" in error)
            return next(error);
        if (error instanceof Error)
            return next({ status: 400, message: error.message });
        console.log(error);
        return next({ status: 400, message: "Unknown Error Occured" });
    }
})

webAuthnRoute.post("/register/verify", authenticatedMiddleware, async (req: AuthenticatedRequest, res, next) => {
    try {
        const { body } = req;

        const user = req.user as User;
        const optionsHeader = req.header("Webauthn-Options")
        if (!optionsHeader || typeof (optionsHeader) != "string") {
            throw { status: 400, message: "Options Missing" };
        }
        let currentOptions: { challengeOptions?: PublicKeyCredentialCreationOptionsJSON } & strippedPayload;
        try {
            currentOptions = verifyJWT(optionsHeader);
            if (currentOptions.challengeOptions == undefined) throw new Error();
        } catch (error) {
            throw { status: 400, message: "Options Header invalid" };
        }

        let verification;
        verification = await verifyRegistrationResponse({
            response: body,
            expectedChallenge: currentOptions.challengeOptions.challenge,
            expectedOrigin: getRPOrigin(),
            expectedRPID: getRPId(),
        });
        const { verified, registrationInfo } = verification;
        if (verified && registrationInfo) {
            const {
                credentialID,
                credentialPublicKey,
                counter,
                credentialDeviceType,
                credentialBackedUp
            } = registrationInfo;
            const newPasskey: Passkey = {
                user,
                webauthnUserID: currentOptions.challengeOptions.user.id,
                id: credentialID,
                publicKey: credentialPublicKey,
                counter,
                deviceType: credentialDeviceType,
                backed_up: credentialBackedUp,
                transports: body.response.transports,
            };
            await passkeys.addPasskeytoDatabase(newPasskey);
        }
        sendResponse(res, 200, { verified })
    } catch (error) {
        if (error && typeof(error) == "object" && !Array.isArray(error) && "status" in error)
            return next(error);
        if (error instanceof Error)
            return next({ status: 400, message: error.message });
        console.log(error);
        return next({ status: 400, message: "Unknown Error Occured" });
    }
})

webAuthnRoute.post("/auth/get-options", async (req, res, next) => {
    try {
        const {username} = req.body;
        checkUsernameRequirements(username);
        const user = await users.getUserDataFromUsername(username);
        if (!user) {
            throw { status: 404, message: "Username not found." }
        }
        const userPasskeys = await passkeys.getUserPasskeys(user);

        const options: PublicKeyCredentialRequestOptionsJSON = await generateAuthenticationOptions({
            rpID: getRPId(),
            allowCredentials: userPasskeys.map(passkey => ({
                id: passkey.id,
                transports: passkey.transports,
            })),
        });

        res.setHeader("Webauthn-Options", createJWT({ authOptions: options, user: {id: user.id} }, "15m"));
        sendResponse(res, 200, options);
    } catch (error) {
        if (error && typeof(error) == "object" && !Array.isArray(error) && "status" in error)
            return next(error);
        if (error instanceof Error)
            return next({ status: 400, message: error.message });
        console.log(error);
        return next({ status: 400, message: "Unknown Error Occured" });
    }
})

webAuthnRoute.post("/auth/verify", async (req, res, next) => {
    try {
        const { body } = req;

        const optionsHeader = req.header("Webauthn-Options")
        if (!optionsHeader || typeof (optionsHeader) != "string") {
            throw { status: 400, message: "Options Missing" };
        }
        let currentOptions: { authOptions?: PublicKeyCredentialCreationOptionsJSON, user?: {id: number} } & strippedPayload;
        try {
            currentOptions = verifyJWT(optionsHeader);
            if (currentOptions.authOptions == undefined) throw new Error();
            if (currentOptions.user == undefined) throw new Error();
        } catch (error) {
            throw { status: 400, message: "Options Header invalid" };
        }
        const user = await users.getUserDataFromId(currentOptions.user.id);
        if (!user) {
            throw { status: 404, message: "User not found." }
        }

        const passkey = await passkeys.getUserPasskey(user, body.id);

        if (!passkey) {
            throw new Error(`Passkey does not match user.`);
        }

        let verification;
        verification = await verifyAuthenticationResponse({
            response: body,
            expectedChallenge: currentOptions.authOptions.challenge,
            expectedOrigin: getRPOrigin(),
            expectedRPID: getRPId(),
            authenticator: {
                credentialID: passkey.id,
                credentialPublicKey: passkey.publicKey,
                counter: passkey.counter,
                transports: passkey.transports,
            },
        });

        const { verified, authenticationInfo } = verification;
        if (verified && authenticationInfo) {
            await passkeys.updateCounter(passkey, authenticationInfo.newCounter);
        }
        res.setHeader("Authorization", createJWT({userId: user.id}))
        sendResponse(res, 200, {verified});
    } catch (error) {
        if (error && typeof(error) == "object" && !Array.isArray(error) && "status" in error)
            return next(error);
        if (error instanceof Error)
            return next({ status: 400, message: error.message });
        return next({ status: 400, message: "Unknown Error Occured" });
    }
})

export default webAuthnRoute;