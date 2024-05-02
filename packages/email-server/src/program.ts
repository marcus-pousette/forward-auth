import { Program, type ProgramEvents } from '@peerbit/program'
import { field, variant } from '@dao-xyz/borsh'
import { VerifiedEmailStore, Email } from 'forward-auth-verified-emails'
import { start as startEmailServer } from './smtp.js'

@variant("email-server")
export class EmailServerAndCredentialIssuer extends Program {

    @field({ type: VerifiedEmailStore })
    emails: VerifiedEmailStore

    private emailServer: Awaited<ReturnType<typeof startEmailServer>>

    constructor() {
        super()
        this.emails = new VerifiedEmailStore()
    }

    async open(args?: any): Promise<void> {
        this.emailServer = await startEmailServer({
            onMessage: async (message) => {
                console.log("GOT MESSAGE")
                const email = message.from!.value[0].address!
                await this.emails.add(new Email({ body: message.html || "", publicKey: this.node.identity.publicKey, from: email }))
            }
        })
        await this.emails.open()
    }

    async close(from?: Program<any, ProgramEvents>): Promise<boolean> {
        await this.emailServer.stop()
        return super.close(from)
    }

    async drop(from?: Program<any, ProgramEvents>): Promise<boolean> {
        await this.emailServer.stop()
        return super.drop(from)
    }
}