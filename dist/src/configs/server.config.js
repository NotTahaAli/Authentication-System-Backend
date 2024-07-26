"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMainURL = exports.getCorsURLS = exports.getHttpsPort = exports.getHttpPort = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const getHttpPort = () => {
    const port = parseInt(process.env.PORT || "3000");
    if (Number.isNaN(port) || port <= 0) {
        throw new Error("Http Port should be a positive Integer");
    }
    return port;
};
exports.getHttpPort = getHttpPort;
const getHttpsPort = () => {
    let port = (process.env.HTTPS_PORT != undefined) ? parseInt(process.env.HTTPS_PORT) : undefined;
    if (!port || port <= 0 || Number.isNaN(port)) {
        port = undefined;
    }
    return port;
};
exports.getHttpsPort = getHttpsPort;
const getCorsURLS = () => {
    const corsURLS = (process.env.CORS_URLS) ? process.env.CORS_URLS.split(" ") : [];
    corsURLS.push("http://localhost:" + (0, exports.getHttpPort)());
    if ((0, exports.getHttpsPort)())
        corsURLS.push("https://localhost:" + (0, exports.getHttpsPort)());
    return corsURLS;
};
exports.getCorsURLS = getCorsURLS;
const getMainURL = () => {
    return (process.env.MAIN_DOMAIN) ? process.env.MAIN_DOMAIN : "http://localhost:" + (0, exports.getHttpPort)();
};
exports.getMainURL = getMainURL;
exports.default = {
    getHttpPort: exports.getHttpPort,
    getHttpsPort: exports.getHttpsPort,
    getCorsURLS: exports.getCorsURLS,
    getMainURL: exports.getMainURL
};
