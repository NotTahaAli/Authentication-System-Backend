"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_util_1 = __importDefault(require("../utils/response.util"));
exports.default = (err, _req, res, _next) => {
    const statusCode = err.status || 500;
    (0, response_util_1.default)(res, statusCode, err.message);
    return;
};
