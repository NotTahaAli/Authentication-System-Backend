import { JwtPayload, sign, verify } from "jsonwebtoken";
import { getJWTSecret } from "../configs/jwt.config";

export type strippedPayload = {
    iss?: string | undefined;
    sub?: string | undefined;
    aud?: string | string[] | undefined;
    exp?: number | undefined;
    nbf?: number | undefined;
    iat?: number | undefined;
    jti?: string | undefined;
}

export function createJWT(data: Record<string, any>, expiry: string = '1d') {
    return sign(data, getJWTSecret(), {
        expiresIn: expiry
    })
}

export function verifyJWT(token: string) {
    const decoded = verify(token, getJWTSecret());
    if (typeof (decoded) == "string") {
        throw new Error("Invalid JWT");
    }
    return decoded;
}

export function checkCreation(decoded: JwtPayload, createdBefore: Date)
{
    if (decoded.iat && createdBefore.getTime() + createdBefore.getTimezoneOffset() * 60000 > decoded.iat * 1000) {
        throw {status: 401, message: "Token Expired."};
    }
}