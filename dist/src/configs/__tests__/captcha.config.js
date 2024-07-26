"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const captcha_config_1 = require("../captcha.config");
const previousEnv = Object.assign({}, process.env);
afterAll(() => {
    process.env = Object.assign({}, previousEnv);
});
describe("Getting captcha secret", () => {
    it("should error if secret is undefined", (done) => {
        delete process.env.RECAPTCHA_SECRET;
        expect(captcha_config_1.getCaptchaSecret).toThrow("reCaptcha Secret Not Configured.");
        done();
    });
    it("should error if secret is empty", (done) => {
        process.env.RECAPTCHA_SECRET = "";
        expect(captcha_config_1.getCaptchaSecret).toThrow("reCaptcha Secret Not Configured.");
        done();
    });
    it("should work if secret exists", (done) => {
        process.env.RECAPTCHA_SECRET = "abcde12345";
        expect((0, captcha_config_1.getCaptchaSecret)()).toEqual("abcde12345");
        done();
    });
});
describe("Getting captcha url", () => {
    it("should error if url is undefined", (done) => {
        delete process.env.RECAPTCHA_URL;
        expect(captcha_config_1.getCaptchaURL).toThrow("reCaptcha Url Not Configured.");
        done();
    });
    it("should error if url is empty", (done) => {
        process.env.RECAPTCHA_URL = "";
        expect(captcha_config_1.getCaptchaURL).toThrow("reCaptcha Url Not Configured.");
        done();
    });
    it("should error if url is invalid", (done) => {
        process.env.RECAPTCHA_URL = "abcde12345";
        expect(captcha_config_1.getCaptchaURL).toThrow("Invalid reCaptcha URL");
        done();
    });
    it("should work if url is valid", (done) => {
        process.env.RECAPTCHA_URL = "https://host:8080/database?query=ok&otherQuery=false";
        expect((0, captcha_config_1.getCaptchaURL)()).toEqual(process.env.RECAPTCHA_URL);
        done();
    });
});
