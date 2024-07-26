"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_config_1 = require("../oauth.config");
const previousEnv = Object.assign({}, process.env);
afterAll(() => {
    process.env = Object.assign({}, previousEnv);
});
describe("Getting oAuth ID", () => {
    it("should error if id is undefined", (done) => {
        delete process.env.OAUTH_CLIENT_ID;
        expect(oauth_config_1.getOAuthID).toThrow("oAuth Client ID Not Configured.");
        done();
    });
    it("should error if id is empty", (done) => {
        process.env.OAUTH_CLIENT_ID = "";
        expect(oauth_config_1.getOAuthID).toThrow("oAuth Client ID Not Configured.");
        done();
    });
    it("should work if id exists", (done) => {
        process.env.OAUTH_CLIENT_ID = "abcde12345";
        expect((0, oauth_config_1.getOAuthID)()).toEqual("abcde12345");
        done();
    });
});
