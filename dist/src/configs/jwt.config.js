"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJWTSecret = void 0;
const getJWTSecret = () => {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length == 0) {
        throw new Error("JWT Secret Not Configured.");
    }
    if (process.env.JWT_SECRET.length < 10)
        throw new Error("JWT Secret must be atleast 10 characters.");
    return process.env.JWT_SECRET;
};
exports.getJWTSecret = getJWTSecret;
exports.default = {
    JWTSecret: (0, exports.getJWTSecret)(),
};
