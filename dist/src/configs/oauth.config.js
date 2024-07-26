"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOAuthID = void 0;
const getOAuthID = () => {
    if (!process.env.OAUTH_CLIENT_ID) {
        throw new Error("oAuth Client ID Not Configured.");
    }
    return process.env.OAUTH_CLIENT_ID;
};
exports.getOAuthID = getOAuthID;
exports.default = {
    oAuthID: (0, exports.getOAuthID)(),
};
