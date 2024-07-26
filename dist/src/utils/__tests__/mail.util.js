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
const mailosaur_1 = __importDefault(require("mailosaur"));
const mail_util_1 = require("../mail.util");
const smtp_config_1 = require("../../configs/smtp.config");
const nodemailer_1 = require("nodemailer");
let client = null;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.MAILOSAUR_KEY) {
        throw Error("Invalid Key");
    }
    client = new mailosaur_1.default(process.env.MAILOSAUR_KEY);
    const account = yield (0, nodemailer_1.createTestAccount)();
}), 15000);
describe("Sending Email", () => {
    it("should send", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!client)
            throw Error("No Client");
        yield (0, mail_util_1.sendMail)((0, smtp_config_1.getSMTPUser)(), "test@cg86beqr.mailosaur.net", "Test Mail", "Test Mail 2");
        const email = yield client.messages.get("cg86beqr", {
            sentTo: "test@cg86beqr.mailosaur.net"
        });
        expect(email.subject).toEqual("Test Mail");
        expect((_a = email.text) === null || _a === void 0 ? void 0 : _a.body).toEqual("Test Mail 2");
    }), 15000);
});
