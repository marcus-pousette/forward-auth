import { expect } from "chai";
import mailer from 'nodemailer'
import { start } from "../src/smtp";
import { waitForResolved } from "./wait";
import parser from 'mailparser'

describe('Email Server', () => {

    let server: Awaited<ReturnType<typeof start>>;
    let sender: mailer.Transporter;

    afterEach(async () => {
        await server.stop();
        await sender.close();
    })


    it('should receive email', async () => {

        let received: parser.ParsedMail[] = []

        server = await start({
            onMessage(data) {
                received.push(data)
            }
        })

        sender = mailer.createTransport({
            host: 'localhost',
            port: server.port,
            secure: false,
            tls: {
                rejectUnauthorized: false
            }
        });

        await sender.sendMail({
            from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
            to: "bar@example.com, baz@example.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body

        });

        await waitForResolved(() => expect(received.length).to.equal(1), { timeout: 3000 });
        const email = received[0]!
        expect(email.from!.text).to.equal('"Maddison Foo Koch 👻" <maddison53@ethereal.email>')
        expect(email.subject).to.equal("Hello ✔")
        expect(email.text).to.equal("Hello world?")
        expect(email.html).to.equal("<b>Hello world?</b>")

    })
})