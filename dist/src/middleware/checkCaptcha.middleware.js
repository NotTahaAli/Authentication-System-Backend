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
const captcha_util_1 = require("../utils/captcha.util");
const error_middleware_1 = __importDefault(require("./error.middleware"));
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.method == "POST") {
        const { token } = req.body;
        if (!token)
            return (0, error_middleware_1.default)({ status: 400, message: "Captcha Token Missing." }, req, res, next);
        if (!(yield (0, captcha_util_1.verifyCaptcha)(token))) {
            return (0, error_middleware_1.default)({ status: 400, message: "Invalid Captcha Token." }, req, res, next);
        }
    }
    next();
});
