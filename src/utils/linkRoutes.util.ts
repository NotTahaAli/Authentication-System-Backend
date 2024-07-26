import { Express } from "express";
import indexRoute from "../routes/index.route";
import notfoundMiddleware from "../middleware/notfound.middleware";
import errorMiddleware from "../middleware/error.middleware";
import authRoute from "../routes/auth.route";
import webAuthnRoute from "../routes/webauthn.route";

export function linkRoutes(app: Express) {
    app.use('/', indexRoute);
    app.use('/auth/', authRoute);
    app.use('/authn/', webAuthnRoute);

    //Page Not Found
    app.use(notfoundMiddleware);

    //Error Handler
    app.use(errorMiddleware);
    return app;
}