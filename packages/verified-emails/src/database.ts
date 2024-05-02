import { field, variant, deserialize } from '@dao-xyz/borsh';
import { Program } from '@peerbit/program'
import { ByteMatchQuery, Documents, SearchRequest, Sort, StringMatch } from '@peerbit/document'
import { sha256Sync, Ed25519PublicKey } from '@peerbit/crypto'

@variant(0) // v0
export class Email {

    @field({ type: Uint8Array })
    id: Uint8Array

    @field({ type: 'string' })
    from: string

    @field({ type: Uint8Array })
    publicKey: Uint8Array

    @field({ type: 'string' })
    email: string

    constructor(data: { email: string, publicKey: Ed25519PublicKey, from: string }) {
        this.id = sha256Sync(new TextEncoder().encode(data.email))
        this.from = data.from
        this.publicKey = data.publicKey.bytes
        this.email = data.email
    }
}

@variant("verified-emails") // v0
export class VerifiedEmailStore extends Program {

    @field({ type: Documents })
    emails: Documents<Email>

    constructor() {
        super()
        this.emails = new Documents<Email>({ id: sha256Sync(Buffer.from("verified-emails")) })
    }

    async open(args?: any): Promise<void> {
        return this.emails.open({
            type: Email,

        })
    }

    async add(data: Email): Promise<void> {
        await this.emails.put(data)
    }

    async getPublicKeys(email: string) {
        return (await this.emails.index.search(new SearchRequest({ query: [new StringMatch({ key: 'from', value: email })], sort: new Sort({ key: 'from' }) }))).map(x => deserialize(x.publicKey, Ed25519PublicKey))
    }

    async getEmails(publicKey: Ed25519PublicKey) {
        return (await this.emails.index.search(new SearchRequest({ query: [new ByteMatchQuery({ key: 'publicKey', value: new Uint8Array(publicKey.bytes) })], sort: new Sort({ key: 'from' }) }))).map(x => x.from)
    }

    async getAll() {
        return this.emails.index.search(new SearchRequest({ sort: new Sort({ key: 'from' }) }))
    }
}