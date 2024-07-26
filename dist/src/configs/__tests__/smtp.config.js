"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const smtp_config_1 = require("../smtp.config");
const previousEnv = Object.assign({}, process.env);
afterAll(() => {
    process.env = Object.assign({}, previousEnv);
});
describe("Getting SMTP Service", () => {
    it("should be undefined if service is undefined", (done) => {
        delete process.env.SMTP_SERVICE;
        expect((0, smtp_config_1.getSMTPService)()).toBeUndefined();
        done();
    });
    it("should be undefined if service is empty", (done) => {
        process.env.SMTP_SERVICE = "";
        expect((0, smtp_config_1.getSMTPService)()).toBeUndefined();
        done();
    });
    it("should work if service exists", (done) => {
        process.env.SMTP_SERVICE = "abcde12345";
        expect((0, smtp_config_1.getSMTPService)()).toEqual("abcde12345");
        done();
    });
});
describe("Getting SMTP Host", () => {
    it("should error if Host is undefined", (done) => {
        delete process.env.SMTP_HOST;
        expect(smtp_config_1.getSMTPHost).toThrow("SMTP Host not Configured.");
        done();
    });
    it("should error if Host is empty", (done) => {
        process.env.SMTP_HOST = "";
        expect(smtp_config_1.getSMTPHost).toThrow("SMTP Host not Configured.");
        done();
    });
    it("should work if Host exists", (done) => {
        process.env.SMTP_HOST = "abcde12345";
        expect((0, smtp_config_1.getSMTPHost)()).toEqual("abcde12345");
        done();
    });
});
describe("Getting SMTP Port", () => {
    it("should error when empty", done => {
        delete process.env.SMTP_PORT;
        expect(smtp_config_1.getSMTPPort).toThrow("SMTP Port not Configured.");
        done();
    });
    it("should work if a number", done => {
        process.env.SMTP_PORT = "443";
        expect((0, smtp_config_1.getSMTPPort)()).toBe(443);
        done();
    });
    it("should error if not a number", done => {
        process.env.SMTP_PORT = "a";
        expect(smtp_config_1.getSMTPPort).toThrow("SMTP Port incorrect.");
        done();
    });
});
describe("Getting SMTP Secure", () => {
    it("should error when empty", done => {
        delete process.env.SMTP_SECURE;
        expect(smtp_config_1.getSMTPSecure).toThrow("SMTP Secure not Configured.");
        done();
    });
    it("should work if true", done => {
        process.env.SMTP_SECURE = "true";
        expect((0, smtp_config_1.getSMTPSecure)()).toBe(true);
        done();
    });
    it("should work if TruE", done => {
        process.env.SMTP_SECURE = "TruE";
        expect((0, smtp_config_1.getSMTPSecure)()).toBe(true);
        done();
    });
    it("should work if False", done => {
        process.env.SMTP_SECURE = "False";
        expect((0, smtp_config_1.getSMTPSecure)()).toBe(false);
        done();
    });
    it("should work if falSE", done => {
        process.env.SMTP_SECURE = "falSE";
        expect((0, smtp_config_1.getSMTPSecure)()).toBe(false);
        done();
    });
    it("should error if not True or False", done => {
        process.env.SMTP_SECURE = "a";
        expect(smtp_config_1.getSMTPSecure).toThrow("SMTP Secure incorrect.");
        done();
    });
});
describe("Getting SMTP User", () => {
    it("should error if User is undefined", (done) => {
        delete process.env.SMTP_USER;
        expect(smtp_config_1.getSMTPUser).toThrow("SMTP User not Configured.");
        done();
    });
    it("should error if User is empty", (done) => {
        process.env.SMTP_USER = "";
        expect(smtp_config_1.getSMTPUser).toThrow("SMTP User not Configured.");
        done();
    });
    it("should work if User exists", (done) => {
        process.env.SMTP_USER = "abcde12345";
        expect((0, smtp_config_1.getSMTPUser)()).toEqual("abcde12345");
        done();
    });
});
describe("Getting SMTP Pass", () => {
    it("should error if Pass is undefined", (done) => {
        delete process.env.SMTP_PASS;
        expect(smtp_config_1.getSMTPPass).toThrow("SMTP Pass not Configured.");
        done();
    });
    it("should error if Pass is empty", (done) => {
        process.env.SMTP_PASS = "";
        expect(smtp_config_1.getSMTPPass).toThrow("SMTP Pass not Configured.");
        done();
    });
    it("should work if Pass exists", (done) => {
        process.env.SMTP_PASS = "abcde12345";
        expect((0, smtp_config_1.getSMTPPass)()).toEqual("abcde12345");
        done();
    });
});
