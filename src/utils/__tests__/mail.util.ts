import MailosaurClient from "mailosaur";
import { sendMail } from "../mail.util";
import { getSMTPUser } from "../../configs/smtp.config";
import { createTestAccount } from "nodemailer";

let client: MailosaurClient | null = null;
process.env.NODE_TLS_REJECT_UNAUTHORIZED="0"
beforeAll(async () => {
    if (!process.env.MAILOSAUR_KEY) {
        throw Error("Invalid Key")
    }
    client = new MailosaurClient(process.env.MAILOSAUR_KEY)
    const account = await createTestAccount();
}, 15000)

describe("Sending Email",()=>{
    it("should send",async()=>{
        if (!client) throw Error("No Client");
        await sendMail(getSMTPUser(),"test@cg86beqr.mailosaur.net","Test Mail", "Test Mail 2");
        const email = await client.messages.get("cg86beqr", {
            sentTo: "test@cg86beqr.mailosaur.net"
        })
        expect(email.subject).toEqual("Test Mail");
        expect(email.text?.body).toEqual("Test Mail 2");
    }, 15000)
})