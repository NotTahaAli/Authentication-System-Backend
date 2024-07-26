import { Request, Response } from "express";
import errorMiddleware from "./error.middleware";
import { checkCreation, verifyJWT } from "../utils/jwt.util";
import users from "../db/functions/users";
import { User } from "../db/schema/users";

export type AuthenticatedRequest = {
    user?: User
} & Request

export default (req: AuthenticatedRequest, res: Response, next: Function) => {
    const { authorization: token } = req.headers;
    if (!token) return errorMiddleware({ status: 401, message: "UnAuthorized" }, req, res, next);
    try {
        const data = verifyJWT(token);
        users.getUserDataFromId(data.userId).then((user) => {
            if (!user) throw new Error();
            checkCreation(data, user.lastChanged);
            req.user = user;
            next();
        }).catch((_err) => {
            return errorMiddleware({ status: 401, message: "UnAuthorized" }, req, res, next);
        });
    } catch (err) {
        return errorMiddleware({ status: 401, message: "UnAuthorized" }, req, res, next);
    }
};