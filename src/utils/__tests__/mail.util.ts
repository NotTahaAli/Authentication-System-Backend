import MailosaurClient from "mailosaur";
import { sendMail } from "../mail.util";
import { getSMTPPort, getSMTPUser } from "../../configs/smtp.config";
import { createTestAccount } from "nodemailer";
import { Server } from "mailosaur/lib/models";

const maybe = process.env.MAILOSAUR_KEY ? describe : describe.skip;

let client: MailosaurClient;
let server: Server | undefined = undefined;
let emailAddress: string;
process.env.NODE_TLS_REJECT_UNAUTHORIZED="0"
beforeAll(async () => {
    if (!process.env.MAILOSAUR_KEY) {
        throw Error("Invalid Key")
    }
    client = new MailosaurClient(process.env.MAILOSAUR_KEY)
    server = (await client.servers.list()).items?.at(0);
    if (!server || !server.id) throw Error("No Server");
    emailAddress = client.servers.generateEmailAddress(server.id);
    process.env.SMTP_SERVICE="Mailosaur"
    process.env.SMTP_HOST="smtp.mailosaur.net";
    process.env.SMTP_PORT="587"
    process.env.SMTP_SECURE="FALSE"
    process.env.SMTP_USER=server.id+"@mailosaur.net"
}, 15000)

maybe("Sending Email",()=>{
    it("should send",async()=>{
        if (!server || !server.id) throw Error("No Server");
        await sendMail(getSMTPUser(),emailAddress,"Test Mail", "Test Mail 2");
        const email = await client.messages.get(server.id, {
            sentTo: emailAddress
        })
        expect(email.subject).toEqual("Test Mail");
        expect(email.text?.body).toEqual("Test Mail 2");
    }, 15000)
})