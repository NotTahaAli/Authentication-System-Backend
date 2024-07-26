"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const response_util_1 = __importDefault(require("../utils/response.util"));
const authenticated_middleware_1 = __importDefault(require("../middleware/authenticated.middleware"));
const indexRoute = express_1.default.Router();
indexRoute.get("/", (_req, res) => {
    (0, response_util_1.default)(res, 200);
});
indexRoute.get("/user", authenticated_middleware_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    (0, response_util_1.default)(res, 200, { username: user === null || user === void 0 ? void 0 : user.username, id: user === null || user === void 0 ? void 0 : user.id, email: user === null || user === void 0 ? void 0 : user.email, verified: user === null || user === void 0 ? void 0 : user.verified, twoFactor: user === null || user === void 0 ? void 0 : user.twoFactor });
}));
indexRoute.get("/passkey.html", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res
        .set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
        .sendFile(__dirname + "/passkey.html");
}));
exports.default = indexRoute;
