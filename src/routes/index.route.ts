import express, { Response } from "express";
import sendResponse from "../utils/response.util";
import authenticatedMiddleware, { AuthenticatedRequest } from "../middleware/authenticated.middleware";
import users from "../db/functions/users";

const indexRoute = express.Router();

indexRoute.get("/", (_req, res) => {
    sendResponse(res, 200);
});

indexRoute.get("/user", authenticatedMiddleware, async (req: AuthenticatedRequest, res: Response, next) => {
    const user = req.user;
    sendResponse(res, 200, { username: user?.username, id: user?.id, email: user?.email, verified: user?.verified, twoFactor: user?.twoFactor });
})

export default indexRoute;