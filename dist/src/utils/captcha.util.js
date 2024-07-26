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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCaptcha = verifyCaptcha;
const captcha_config_1 = require("../configs/captcha.config");
function verifyCaptcha(response) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = (0, captcha_config_1.getCaptchaURL)();
        const parameters = new URLSearchParams({ secret: (0, captcha_config_1.getCaptchaSecret)(), response });
        const resp = yield fetch(url + ((url.indexOf("?") == -1) ? "?" : "&") + parameters, {
            method: "POST"
        });
        if (!resp.ok) {
            throw new Error("An Error Occured While Trying to Verify The Captcha Response.");
        }
        const data = yield resp.json();
        if (!data.success) {
            if (data["error-codes"].includes("timeout-or-duplicate") ||
                data["error-codes"].includes("invalid-input-response") ||
                data["error-codes"].includes("missing-input-response"))
                return false;
            throw new Error("An Error Occured While Trying to Verify The Captcha Response.");
        }
        return true;
    });
}
