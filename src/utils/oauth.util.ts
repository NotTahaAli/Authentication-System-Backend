import { OAuth2Client } from 'google-auth-library';
import { getOAuthID } from '../configs/oauth.config';

const client = new OAuth2Client();

export async function verify(token: string) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: getOAuthID(),
    });
    const payload = ticket.getPayload();
    if (!payload) return null;
    const googleId = payload.sub;
    const email = payload.email as string
    return {googleId, email}
}