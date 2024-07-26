import { getCorsURLS, getHttpPort, getHttpsPort, getMainURL } from "../server.config";

const previousEnv = { ...process.env };

afterAll(() => {
    process.env = { ...previousEnv };
})

describe("Getting Http Port", () => {
    it("should be 3000 when empty", done => {
        delete process.env.PORT;
        expect(getHttpPort()).toBe(3000);
        done();
    })

    it("should be 80 when process.env.PORT = 80", done => {
        process.env.PORT = "80";
        expect(getHttpPort()).toBe(80);
        done();
    })

    it("should error if process.env.HTTP_PORT is not a number", done => {
        process.env.PORT = "a";
        expect(getHttpPort).toThrow("Http Port should be a positive Integer");
        done();
    })
})

describe("Getting Https Port", () => {
    it("should be undefined when empty", done => {
        delete process.env.HTTPS_PORT;
        expect(getHttpsPort()).toBeUndefined();
        done();
    })

    it("should be 443 when process.env.HTTPS_PORT = 443", done => {
        process.env.HTTPS_PORT = "443";
        expect(getHttpsPort()).toBe(443);
        done();
    })

    it("should be undefined if process.env.HTTPS_PORT is not a number", done => {
        process.env.HTTPS_PORT = "a";
        expect(getHttpsPort()).toBeUndefined();
        done();
    })
})

describe("Getting CORS Urls", () => {
    it("should be localhost:HTTP_PORT if only http port", done => {
        process.env.PORT = "3000";
        delete process.env.HTTPS_PORT;
        delete process.env.CORS_URLS;
        expect(getCorsURLS()).toStrictEqual([
            "http://localhost:" + getHttpPort()
        ])
        done();
    })

    it("should be localhost:HTTP_PORT and localhost:HTTPS_PORT if only ports present", done => {
        process.env.PORT = "3000";
        process.env.HTTPS_PORT = "3001";
        delete process.env.CORS_URLS;
        expect(getCorsURLS()).toStrictEqual([
            "http://localhost:" + getHttpPort(),
            "https://localhost:" + getHttpsPort()
        ])
        done();
    })

    it("should add localhost:HTTP_PORT if only http port present", done => {
        process.env.PORT = "3000";
        delete process.env.HTTPS_PORT;
        process.env.CORS_URLS = "https://hello.com";
        expect(getCorsURLS()).toStrictEqual([
            "https://hello.com",
            "http://localhost:" + getHttpPort()
        ])
        done();
    })

    it("should add localhost:HTTP_PORT and localhost:HTTPS_PORT if ports present", done => {
        process.env.PORT = "3000";
        process.env.HTTPS_PORT = "3001";
        process.env.CORS_URLS = "https://hello.com";
        expect(getCorsURLS()).toStrictEqual([
            "https://hello.com",
            "http://localhost:" + getHttpPort(),
            "https://localhost:" + getHttpsPort()
        ])
        done();
    })

    it("should split urls if multiple present", done => {
        process.env.PORT = "3000";
        delete process.env.HTTPS_PORT;
        process.env.CORS_URLS = "https://hello.com https://abc.com";
        expect(getCorsURLS()).toStrictEqual([
            "https://hello.com",
            "https://abc.com",
            "http://localhost:" + getHttpPort(),
        ])
        done();
    })
})

describe("Getting Http Port", () => {
    it("should be http://localhost:3000 when port and url empty", done => {
        delete process.env.PORT;
        delete process.env.MAIN_DOMAIN;
        expect(getMainURL()).toEqual("http://localhost:3000");
        done();
    })

    it("should be http://localhost:80 when process.env.PORT = 80", done => {
        delete process.env.MAIN_DOMAIN;
        process.env.PORT = "80";
        expect(getMainURL()).toEqual("http://localhost:80");
        done();
    })

    it("should be https://google.com if main url is given as that.", done => {
        process.env.MAIN_DOMAIN = "https://google.com";
        expect(getMainURL()).toEqual("https://google.com");
        done();
    })
})