"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_config_1 = require("../jwt.config");
const previousEnv = Object.assign({}, process.env);
afterAll(() => {
    process.env = Object.assign({}, previousEnv);
});
describe("Getting JWT Secret", () => {
    it("should error if secret is undefined", (done) => {
        delete process.env.JWT_SECRET;
        expect(jwt_config_1.getJWTSecret).toThrow("JWT Secret Not Configured.");
        done();
    });
    it("should error if secret is empty", (done) => {
        process.env.JWT_SECRET = "";
        expect(jwt_config_1.getJWTSecret).toThrow("JWT Secret Not Configured.");
        done();
    });
    it("should error if secret is less than 10 characters", (done) => {
        process.env.JWT_SECRET = "abcde";
        expect(jwt_config_1.getJWTSecret).toThrow("JWT Secret must be atleast 10 characters.");
        done();
    });
    it("should work if secret is 10 characters", (done) => {
        process.env.JWT_SECRET = "abcde12345";
        expect((0, jwt_config_1.getJWTSecret)()).toEqual("abcde12345");
        done();
    });
});
