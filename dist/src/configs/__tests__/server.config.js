"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_config_1 = require("../server.config");
const previousEnv = Object.assign({}, process.env);
afterAll(() => {
    process.env = Object.assign({}, previousEnv);
});
describe("Getting Http Port", () => {
    it("should be 3000 when empty", done => {
        delete process.env.PORT;
        expect((0, server_config_1.getHttpPort)()).toBe(3000);
        done();
    });
    it("should be 80 when process.env.PORT = 80", done => {
        process.env.PORT = "80";
        expect((0, server_config_1.getHttpPort)()).toBe(80);
        done();
    });
    it("should error if process.env.HTTP_PORT is not a number", done => {
        process.env.PORT = "a";
        expect(server_config_1.getHttpPort).toThrow("Http Port should be a positive Integer");
        done();
    });
});
describe("Getting Https Port", () => {
    it("should be undefined when empty", done => {
        delete process.env.HTTPS_PORT;
        expect((0, server_config_1.getHttpsPort)()).toBeUndefined();
        done();
    });
    it("should be 443 when process.env.HTTPS_PORT = 443", done => {
        process.env.HTTPS_PORT = "443";
        expect((0, server_config_1.getHttpsPort)()).toBe(443);
        done();
    });
    it("should be undefined if process.env.HTTPS_PORT is not a number", done => {
        process.env.HTTPS_PORT = "a";
        expect((0, server_config_1.getHttpsPort)()).toBeUndefined();
        done();
    });
});
describe("Getting CORS Urls", () => {
    it("should be localhost:HTTP_PORT if only http port", done => {
        process.env.PORT = "3000";
        delete process.env.HTTPS_PORT;
        delete process.env.CORS_URLS;
        expect((0, server_config_1.getCorsURLS)()).toStrictEqual([
            "http://localhost:" + (0, server_config_1.getHttpPort)()
        ]);
        done();
    });
    it("should be localhost:HTTP_PORT and localhost:HTTPS_PORT if only ports present", done => {
        process.env.PORT = "3000";
        process.env.HTTPS_PORT = "3001";
        delete process.env.CORS_URLS;
        expect((0, server_config_1.getCorsURLS)()).toStrictEqual([
            "http://localhost:" + (0, server_config_1.getHttpPort)(),
            "https://localhost:" + (0, server_config_1.getHttpsPort)()
        ]);
        done();
    });
    it("should add localhost:HTTP_PORT if only http port present", done => {
        process.env.PORT = "3000";
        delete process.env.HTTPS_PORT;
        process.env.CORS_URLS = "https://hello.com";
        expect((0, server_config_1.getCorsURLS)()).toStrictEqual([
            "https://hello.com",
            "http://localhost:" + (0, server_config_1.getHttpPort)()
        ]);
        done();
    });
    it("should add localhost:HTTP_PORT and localhost:HTTPS_PORT if ports present", done => {
        process.env.PORT = "3000";
        process.env.HTTPS_PORT = "3001";
        process.env.CORS_URLS = "https://hello.com";
        expect((0, server_config_1.getCorsURLS)()).toStrictEqual([
            "https://hello.com",
            "http://localhost:" + (0, server_config_1.getHttpPort)(),
            "https://localhost:" + (0, server_config_1.getHttpsPort)()
        ]);
        done();
    });
    it("should split urls if multiple present", done => {
        process.env.PORT = "3000";
        delete process.env.HTTPS_PORT;
        process.env.CORS_URLS = "https://hello.com https://abc.com";
        expect((0, server_config_1.getCorsURLS)()).toStrictEqual([
            "https://hello.com",
            "https://abc.com",
            "http://localhost:" + (0, server_config_1.getHttpPort)(),
        ]);
        done();
    });
});
describe("Getting Http Port", () => {
    it("should be http://localhost:3000 when port and url empty", done => {
        delete process.env.PORT;
        delete process.env.MAIN_DOMAIN;
        expect((0, server_config_1.getMainURL)()).toEqual("http://localhost:3000");
        done();
    });
    it("should be http://localhost:80 when process.env.PORT = 80", done => {
        delete process.env.MAIN_DOMAIN;
        process.env.PORT = "80";
        expect((0, server_config_1.getMainURL)()).toEqual("http://localhost:80");
        done();
    });
    it("should be https://google.com if main url is given as that.", done => {
        process.env.MAIN_DOMAIN = "https://google.com";
        expect((0, server_config_1.getMainURL)()).toEqual("https://google.com");
        done();
    });
});
