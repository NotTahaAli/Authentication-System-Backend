"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSMTPPass = exports.getSMTPUser = exports.getSMTPSecure = exports.getSMTPPort = exports.getSMTPHost = exports.getSMTPService = void 0;
const getSMTPService = () => {
    if (!process.env.SMTP_SERVICE) {
        return undefined;
    }
    return process.env.SMTP_SERVICE;
};
exports.getSMTPService = getSMTPService;
const getSMTPHost = () => {
    if (!process.env.SMTP_HOST) {
        throw new Error("SMTP Host not Configured.");
    }
    return process.env.SMTP_HOST;
};
exports.getSMTPHost = getSMTPHost;
const getSMTPPort = () => {
    if (!process.env.SMTP_PORT) {
        throw new Error("SMTP Port not Configured.");
    }
    if (isNaN(parseInt(process.env.SMTP_PORT))) {
        throw new Error("SMTP Port incorrect.");
    }
    return parseInt(process.env.SMTP_PORT);
};
exports.getSMTPPort = getSMTPPort;
const getSMTPSecure = () => {
    if (!process.env.SMTP_SECURE) {
        throw new Error("SMTP Secure not Configured.");
    }
    const isSecure = process.env.SMTP_SECURE.toUpperCase();
    switch (isSecure) {
        case "TRUE":
            return true;
        case "FALSE":
            return false;
        default:
            throw new Error("SMTP Secure incorrect.");
    }
};
exports.getSMTPSecure = getSMTPSecure;
const getSMTPUser = () => {
    if (!process.env.SMTP_USER) {
        throw new Error("SMTP User not Configured.");
    }
    return process.env.SMTP_USER;
};
exports.getSMTPUser = getSMTPUser;
const getSMTPPass = () => {
    if (!process.env.SMTP_PASS) {
        throw new Error("SMTP Pass not Configured.");
    }
    return process.env.SMTP_PASS;
};
exports.getSMTPPass = getSMTPPass;
exports.default = {
    smtpService: (0, exports.getSMTPService)(),
    smtpHost: (0, exports.getSMTPHost)(),
    smtpPort: (0, exports.getSMTPPort)(),
    smtpSecure: (0, exports.getSMTPSecure)(),
    smtpUser: (0, exports.getSMTPUser)(),
    smtpPass: (0, exports.getSMTPPass)()
};
