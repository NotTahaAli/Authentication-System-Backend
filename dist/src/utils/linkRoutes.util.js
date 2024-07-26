"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkRoutes = linkRoutes;
const index_route_1 = __importDefault(require("../routes/index.route"));
const notfound_middleware_1 = __importDefault(require("../middleware/notfound.middleware"));
const error_middleware_1 = __importDefault(require("../middleware/error.middleware"));
const auth_route_1 = __importDefault(require("../routes/auth.route"));
const webauthn_route_1 = __importDefault(require("../routes/webauthn.route"));
function linkRoutes(app) {
    app.use('/', index_route_1.default);
    app.use('/auth/', auth_route_1.default);
    app.use('/authn/', webauthn_route_1.default);
    //Page Not Found
    app.use(notfound_middleware_1.default);
    //Error Handler
    app.use(error_middleware_1.default);
    return app;
}
