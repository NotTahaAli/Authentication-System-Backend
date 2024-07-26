"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCaptchaSecret = exports.getCaptchaURL = void 0;
const getCaptchaURL = () => {
    if (!process.env.RECAPTCHA_URL) {
        throw new Error("reCaptcha Url Not Configured.");
    }
    if (!process.env.RECAPTCHA_URL.match(/^https?:\/\/[^:]+(:\d+)?(\/.*)?$/i)) {
        throw new Error("Invalid reCaptcha URL");
    }
    return process.env.RECAPTCHA_URL;
};
exports.getCaptchaURL = getCaptchaURL;
const getCaptchaSecret = () => {
    if (!process.env.RECAPTCHA_SECRET) {
        throw new Error("reCaptcha Secret Not Configured.");
    }
    return process.env.RECAPTCHA_SECRET;
};
exports.getCaptchaSecret = getCaptchaSecret;
exports.default = {
    captchaUrl: (0, exports.getCaptchaURL)(),
    captchaSecret: (0, exports.getCaptchaSecret)()
};
