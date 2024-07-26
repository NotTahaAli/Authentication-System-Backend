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
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const server_config_1 = require("../configs/server.config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
function createApp() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        // Setting up for JSON Data
        app.use(express_1.default.json({ limit: "50mb" }));
        app.use((0, helmet_1.default)());
        // Setting up for Cookies
        app.use((0, cookie_parser_1.default)());
        // Setting up for URL Encoded Payloads
        app.use(express_1.default.urlencoded({
            limit: "50mb",
            extended: true,
            parameterLimit: 50000,
        }));
        app.use((0, cors_1.default)({
            origin: (0, server_config_1.getCorsURLS)(),
            credentials: true
        }));
        return app;
    });
}
