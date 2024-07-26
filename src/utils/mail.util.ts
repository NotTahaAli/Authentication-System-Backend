import { createTransport } from "nodemailer";
import { getSMTPHost, getSMTPPass, getSMTPPort, getSMTPSecure, getSMTPService, getSMTPUser } from "../configs/smtp.config";
import { createJWT } from "./jwt.util";
import { randomInt } from "crypto";
import { getMainURL } from "../configs/server.config";

function getTransport() {
    const transporter = createTransport({
        service: getSMTPService(),
        host: getSMTPHost(),
        port: getSMTPPort(),
        secure: getSMTPSecure(),
        auth: {
            user: getSMTPUser(),
            pass: getSMTPPass(),
        }
    });
    return transporter;
}

async function sendMail(from: string, to: string, subject: string, text?: string, html?: string) {
    const transporter = getTransport();
    return await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html
    })
}

async function sendVerificationMail(email: string)
{
    const code = Buffer.from(createJWT({email}, "15m")).toString("base64url");
    await sendMail(getSMTPUser(), email, "Verify Your Email", undefined, `
    <a href="${getMainURL()}/verify?code=${code}">Click This Link to Verify Will Expire in 15 minutes</a>`)
}

async function sendResetMail(email: string, user_id: number)
{
    const code = Buffer.from(createJWT({resetId: user_id}, "15m")).toString("base64url");
    await sendMail(getSMTPUser(), email, "Reset your password", undefined, `
    <a href="${getMainURL()}/change-password?code=${code}">Click This Link to Reset Password Will Expire in 15 minutes</a>`)
}

async function send2FAMail(email: string)
{
    const code = randomInt(100000, 999999);
    await sendMail(getSMTPUser(), email, "Your 2FA Code", undefined, `
    Your 2FA code is ${code}, will expire after 15 minutes.`)
    return code;
}

export {
    sendMail,
    sendVerificationMail,
    sendResetMail,
    send2FAMail
}