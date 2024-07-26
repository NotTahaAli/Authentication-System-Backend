import { generateRegistrationOptions } from "@simplewebauthn/server";
import { getRPId, getRPName } from "../configs/webauthn.config";
import passkeys from "../db/functions/passkeys";
import { User } from "../db/schema/users";

export async function getUserWebAuthnOptions(user: User) {
    const userPasskeys = await passkeys.getUserPasskeys(user);

    return await generateRegistrationOptions({
        rpName: getRPName(),
        rpID: getRPId(),
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
}