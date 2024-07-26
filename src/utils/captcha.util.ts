import { getCaptchaSecret, getCaptchaURL } from "../configs/captcha.config";

type reCaptchaErrorCode = "missing-input-secret" | "invalid-input-secret"
    | "missing-input-response" | "invalid-input-response"
    | "bad-request" | "timeout-or-duplicate"

type reCaptchaResponse = {
    success: true
    challenge_ts: string,
    hostname: string,
} | { success: false, ["error-codes"]: reCaptchaErrorCode[] };

export async function verifyCaptcha(response: string) {
    const url = getCaptchaURL();
    const parameters = new URLSearchParams({ secret: getCaptchaSecret(), response });
    const resp = await fetch(url + ((url.indexOf("?") == -1) ? "?" : "&") + parameters, {
        method: "POST"
    })
    if (!resp.ok) {
        throw new Error("An Error Occured While Trying to Verify The Captcha Response.");
    }
    const data: reCaptchaResponse = await resp.json();
    if (!data.success) {
        if (data["error-codes"].includes("timeout-or-duplicate") ||
            data["error-codes"].includes("invalid-input-response") ||
            data["error-codes"].includes("missing-input-response"))
            return false;
        throw new Error("An Error Occured While Trying to Verify The Captcha Response.");
    }
    return true;
}