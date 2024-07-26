"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_middleware_1 = __importDefault(require("./error.middleware"));
const jwt_util_1 = require("../utils/jwt.util");
const users_1 = __importDefault(require("../db/functions/users"));
exports.default = (req, res, next) => {
    const { authorization: token } = req.headers;
    if (!token)
        return (0, error_middleware_1.default)({ status: 401, message: "UnAuthorized" }, req, res, next);
    try {
        const data = (0, jwt_util_1.verifyJWT)(token);
        users_1.default.getUserDataFromId(data.userId).then((user) => {
            if (!user)
                throw new Error();
            (0, jwt_util_1.checkCreation)(data, user.lastChanged);
            req.user = user;
            next();
        }).catch((_err) => {
            return (0, error_middleware_1.default)({ status: 401, message: "UnAuthorized" }, req, res, next);
        });
    }
    catch (err) {
        return (0, error_middleware_1.default)({ status: 401, message: "UnAuthorized" }, req, res, next);
    }
};
