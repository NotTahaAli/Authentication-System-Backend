import { Request, Response } from "express";
import { verifyCaptcha } from "../utils/captcha.util";
import errorMiddleware from "./error.middleware";

export default async (req: Request, res: Response, next: Function) => {
    if (req.method == "POST") {
        const { token } = req.body;
        if (!token) return errorMiddleware({status: 400, message: "Captcha Token Missing."}, req, res, next);
        if (!(await verifyCaptcha(token))) {
            return errorMiddleware({status: 400, message: "Invalid Captcha Token."}, req, res, next);
        }
    }
    next();
};