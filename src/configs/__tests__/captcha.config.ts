import { getCaptchaSecret, getCaptchaURL } from "../captcha.config";

const previousEnv = { ...process.env };

afterAll(() => {
    process.env = { ...previousEnv };
})

describe("Getting captcha secret", () => {
    it("should error if secret is undefined", (done)=>{
        delete process.env.RECAPTCHA_SECRET;
        expect(getCaptchaSecret).toThrow("reCaptcha Secret Not Configured.");
        done();
    })

    it("should error if secret is empty", (done)=>{
        process.env.RECAPTCHA_SECRET = "";
        expect(getCaptchaSecret).toThrow("reCaptcha Secret Not Configured.");
        done();
    })

    it("should work if secret exists", (done)=>{
        process.env.RECAPTCHA_SECRET = "abcde12345";
        expect(getCaptchaSecret()).toEqual("abcde12345");
        done();
    })
})

describe("Getting captcha url", () => {
    it("should error if url is undefined", (done)=>{
        delete process.env.RECAPTCHA_URL;
        expect(getCaptchaURL).toThrow("reCaptcha Url Not Configured.");
        done();
    })

    it("should error if url is empty", (done)=>{
        process.env.RECAPTCHA_URL = "";
        expect(getCaptchaURL).toThrow("reCaptcha Url Not Configured.");
        done();
    })

    it("should error if url is invalid", (done)=>{
        process.env.RECAPTCHA_URL = "abcde12345";
        expect(getCaptchaURL).toThrow("Invalid reCaptcha URL");
        done();
    })

    it("should work if url is valid", (done)=>{
        process.env.RECAPTCHA_URL = "https://host:8080/database?query=ok&otherQuery=false";
        expect(getCaptchaURL()).toEqual(process.env.RECAPTCHA_URL);
        done();
    })
})