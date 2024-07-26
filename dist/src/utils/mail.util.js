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
exports.sendMail = sendMail;
exports.sendVerificationMail = sendVerificationMail;
exports.sendResetMail = sendResetMail;
exports.send2FAMail = send2FAMail;
const nodemailer_1 = require("nodemailer");
const smtp_config_1 = require("../configs/smtp.config");
const jwt_util_1 = require("./jwt.util");
const crypto_1 = require("crypto");
const server_config_1 = require("../configs/server.config");
function getTransport() {
    const transporter = (0, nodemailer_1.createTransport)({
        service: (0, smtp_config_1.getSMTPService)(),
        host: (0, smtp_config_1.getSMTPHost)(),
        port: (0, smtp_config_1.getSMTPPort)(),
        secure: (0, smtp_config_1.getSMTPSecure)(),
        auth: {
            user: (0, smtp_config_1.getSMTPUser)(),
            pass: (0, smtp_config_1.getSMTPPass)(),
        }
    });
    return transporter;
}
function sendMail(from, to, subject, text, html) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporter = getTransport();
        return yield transporter.sendMail({
            from,
            to,
            subject,
            text,
            html
        });
    });
}
function sendVerificationMail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const code = Buffer.from((0, jwt_util_1.createJWT)({ email }, "15m")).toString("base64url");
        yield sendMail((0, smtp_config_1.getSMTPUser)(), email, "Verify Your Email", undefined, `
    <a href="${(0, server_config_1.getMainURL)()}/verify?code=${code}">Click This Link to Verify Will Expire in 15 minutes</a>`);
    });
}
function sendResetMail(email, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const code = Buffer.from((0, jwt_util_1.createJWT)({ resetId: user_id }, "15m")).toString("base64url");
        yield sendMail((0, smtp_config_1.getSMTPUser)(), email, "Reset your password", undefined, `
    <a href="${(0, server_config_1.getMainURL)()}/change-password?code=${code}">Click This Link to Reset Password Will Expire in 15 minutes</a>`);
    });
}
function send2FAMail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const code = (0, crypto_1.randomInt)(100000, 999999);
        yield sendMail((0, smtp_config_1.getSMTPUser)(), email, "Your 2FA Code", undefined, `
    Your 2FA code is ${code}, will expire after 15 minutes.`);
        return code;
    });
}
