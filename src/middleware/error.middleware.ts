import sendResponse from "../utils/response.util";
import { Request, Response } from "express";

export type ResponseError = {
    status?: number;
    message?: any
}

export default (err: ResponseError, _req: Request, res: Response, _next: Function) => {
    const statusCode = err.status || 500;
    sendResponse(res, statusCode, err.message);
    return;
};