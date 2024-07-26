import { Response } from "express";

export default function sendResponse(res: Response, status: number, response?: any) {
    let success = (status == 200);
    return res.status(status).json({ success: success, message: success ? response : undefined, error: success ? undefined : response });
};