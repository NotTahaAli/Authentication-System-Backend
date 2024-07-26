"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostgresURL = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const getPostgresURL = () => {
    if (!process.env.POSTGRES_URL) {
        throw new Error("Database Credentials Not Configured.");
    }
    if (!process.env.POSTGRES_URL.match(/^postgres:\/\/[^:]+:.+@.+(\/.*)?/i)) {
        throw new Error("Invalid Postgres URL");
    }
    return process.env.POSTGRES_URL;
};
exports.getPostgresURL = getPostgresURL;
(0, exports.getPostgresURL)();
exports.default = {
    getPostgresURL: exports.getPostgresURL
};
