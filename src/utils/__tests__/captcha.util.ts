import { verifyCaptcha } from "../captcha.util"

describe("Recaptcha Response", () => {
    it("should error with invalid URL", async () => {
        const url = process.env.RECAPTCHA_URL;
        process.env.RECAPTCHA_URL = "https://www.google.com/recaptcha/api/siteverif";
        await expect(verifyCaptcha("ABCD")).rejects.toThrow("An Error Occured While Trying to Verify The Captcha Response.")
        process.env.RECAPTCHA_URL = url;
    })

    it("should error with invalid Secret KEY", async () => {
        const key = process.env.RECAPTCHA_SECRET;
        process.env.RECAPTCHA_SECRET = "ABCDEFGH";
        await expect(verifyCaptcha("ABCD")).rejects.toThrow("An Error Occured While Trying to Verify The Captcha Response.")
        process.env.RECAPTCHA_SECRET = key;
    })

    it("should return true with valid response input", async () => {
        await expect(verifyCaptcha("ABCD")).resolves.toBe(true);
    })
})