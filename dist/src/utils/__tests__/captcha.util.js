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
const captcha_util_1 = require("../captcha.util");
describe("Recaptcha Response", () => {
    it("should error with invalid URL", () => __awaiter(void 0, void 0, void 0, function* () {
        const url = process.env.RECAPTCHA_URL;
        process.env.RECAPTCHA_URL = "https://www.google.com/recaptcha/api/siteverif";
        yield expect((0, captcha_util_1.verifyCaptcha)("ABCD")).rejects.toThrow("An Error Occured While Trying to Verify The Captcha Response.");
        process.env.RECAPTCHA_URL = url;
    }));
    it("should error with invalid Secret KEY", () => __awaiter(void 0, void 0, void 0, function* () {
        const key = process.env.RECAPTCHA_SECRET;
        process.env.RECAPTCHA_SECRET = "ABCDEFGH";
        yield expect((0, captcha_util_1.verifyCaptcha)("ABCD")).rejects.toThrow("An Error Occured While Trying to Verify The Captcha Response.");
        process.env.RECAPTCHA_SECRET = key;
    }));
    it("should return true with valid response input", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, captcha_util_1.verifyCaptcha)("ABCD")).resolves.toBe(true);
    }));
});
