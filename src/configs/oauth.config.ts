export const getOAuthID = ()=>{
    if (!process.env.OAUTH_CLIENT_ID) {
        throw new Error("oAuth Client ID Not Configured.");
    }
    return process.env.OAUTH_CLIENT_ID;
}

export default {
    oAuthID: getOAuthID(),
}