import { getSMTPHost, getSMTPPass, getSMTPPort, getSMTPSecure, getSMTPService, getSMTPUser } from "../smtp.config";

const previousEnv = { ...process.env };

afterAll(() => {
    process.env = { ...previousEnv };
})

describe("Getting SMTP Service", () => {
    it("should be undefined if service is undefined", (done)=>{
        delete process.env.SMTP_SERVICE;
        expect(getSMTPService()).toBeUndefined();
        done();
    })

    it("should be undefined if service is empty", (done)=>{
        process.env.SMTP_SERVICE = "";
        expect(getSMTPService()).toBeUndefined();
        done();
    })

    it("should work if service exists", (done)=>{
        process.env.SMTP_SERVICE = "abcde12345";
        expect(getSMTPService()).toEqual("abcde12345");
        done();
    })
})

describe("Getting SMTP Host", () => {
    it("should error if Host is undefined", (done)=>{
        delete process.env.SMTP_HOST;
        expect(getSMTPHost).toThrow("SMTP Host not Configured.");
        done();
    })

    it("should error if Host is empty", (done)=>{
        process.env.SMTP_HOST = "";
        expect(getSMTPHost).toThrow("SMTP Host not Configured.");
        done();
    })

    it("should work if Host exists", (done)=>{
        process.env.SMTP_HOST = "abcde12345";
        expect(getSMTPHost()).toEqual("abcde12345");
        done();
    })
})

describe("Getting SMTP Port", () => {
    it("should error when empty", done => {
        delete process.env.SMTP_PORT;
        expect(getSMTPPort).toThrow("SMTP Port not Configured.");
        done();
    })

    it("should work if a number", done => {
        process.env.SMTP_PORT = "443";
        expect(getSMTPPort()).toBe(443);
        done();
    })

    it("should error if not a number", done => {
        process.env.SMTP_PORT = "a";
        expect(getSMTPPort).toThrow("SMTP Port incorrect.");
        done();
    })
})

describe("Getting SMTP Secure", () => {
    it("should error when empty", done => {
        delete process.env.SMTP_SECURE;
        expect(getSMTPSecure).toThrow("SMTP Secure not Configured.");
        done();
    })

    it("should work if true", done => {
        process.env.SMTP_SECURE = "true";
        expect(getSMTPSecure()).toBe(true);
        done();
    })

    it("should work if TruE", done => {
        process.env.SMTP_SECURE = "TruE";
        expect(getSMTPSecure()).toBe(true);
        done();
    })

    it("should work if False", done => {
        process.env.SMTP_SECURE = "False";
        expect(getSMTPSecure()).toBe(false);
        done();
    })

    it("should work if falSE", done => {
        process.env.SMTP_SECURE = "falSE";
        expect(getSMTPSecure()).toBe(false);
        done();
    })

    it("should error if not True or False", done => {
        process.env.SMTP_SECURE = "a";
        expect(getSMTPSecure).toThrow("SMTP Secure incorrect.");
        done();
    })
})

describe("Getting SMTP User", () => {
    it("should error if User is undefined", (done)=>{
        delete process.env.SMTP_USER;
        expect(getSMTPUser).toThrow("SMTP User not Configured.");
        done();
    })

    it("should error if User is empty", (done)=>{
        process.env.SMTP_USER = "";
        expect(getSMTPUser).toThrow("SMTP User not Configured.");
        done();
    })

    it("should work if User exists", (done)=>{
        process.env.SMTP_USER = "abcde12345";
        expect(getSMTPUser()).toEqual("abcde12345");
        done();
    })
})

describe("Getting SMTP Pass", () => {
    it("should error if Pass is undefined", (done)=>{
        delete process.env.SMTP_PASS;
        expect(getSMTPPass).toThrow("SMTP Pass not Configured.");
        done();
    })

    it("should error if Pass is empty", (done)=>{
        process.env.SMTP_PASS = "";
        expect(getSMTPPass).toThrow("SMTP Pass not Configured.");
        done();
    })

    it("should work if Pass exists", (done)=>{
        process.env.SMTP_PASS = "abcde12345";
        expect(getSMTPPass()).toEqual("abcde12345");
        done();
    })
})
