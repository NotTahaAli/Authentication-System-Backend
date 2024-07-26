"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJWT = createJWT;
exports.verifyJWT = verifyJWT;
exports.checkCreation = checkCreation;
const jsonwebtoken_1 = require("jsonwebtoken");
const jwt_config_1 = require("../configs/jwt.config");
function createJWT(data, expiry = '1d') {
    return (0, jsonwebtoken_1.sign)(data, (0, jwt_config_1.getJWTSecret)(), {
        expiresIn: expiry
    });
}
function verifyJWT(token) {
    const decoded = (0, jsonwebtoken_1.verify)(token, (0, jwt_config_1.getJWTSecret)());
    if (typeof (decoded) == "string") {
        throw new Error("Invalid JWT");
    }
    return decoded;
}
function checkCreation(decoded, createdBefore) {
    if (decoded.iat && createdBefore.getTime() + createdBefore.getTimezoneOffset() * 60000 > decoded.iat * 1000) {
        throw { status: 401, message: "Token Expired." };
    }
}
