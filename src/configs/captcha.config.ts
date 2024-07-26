export const getCaptchaURL = ()=>{
    if (!process.env.RECAPTCHA_URL) {
        throw new Error("reCaptcha Url Not Configured.");
    }
    if (!process.env.RECAPTCHA_URL.match(/^https?:\/\/[^:]+(:\d+)?(\/.*)?$/i)) {
        throw new Error("Invalid reCaptcha URL");
    }
    return process.env.RECAPTCHA_URL;
}

export const getCaptchaSecret = ()=>{
    if (!process.env.RECAPTCHA_SECRET) {
        throw new Error("reCaptcha Secret Not Configured.");
    }
    return process.env.RECAPTCHA_SECRET;
}

export default {
    captchaUrl: getCaptchaURL(),
    captchaSecret: getCaptchaSecret()
}