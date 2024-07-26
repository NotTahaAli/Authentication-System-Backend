"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_util_1 = __importDefault(require("../utils/response.util"));
exports.default = (_req, res) => {
    (0, response_util_1.default)(res, 404, "NOT_FOUND_API");
    return;
};
