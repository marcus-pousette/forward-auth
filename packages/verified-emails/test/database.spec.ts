import { expect } from "chai";
import { Peerbit } from 'peerbit'
import { Email, VerifiedEmailStore } from "../src";
import { Ed25519Keypair } from '@peerbit/crypto'

describe('Database', () => {
    let client: Peerbit;
    let store: VerifiedEmailStore

    beforeEach(async () => {
        client = await Peerbit.create()
        store = await client.open(new VerifiedEmailStore())
        await store.add(new Email({ email: 'first', from: "a@b.c", publicKey: client.identity.publicKey }))
        await store.add(new Email({ email: 'second', from: "e@f.g", publicKey: (await Ed25519Keypair.create()).publicKey }))

    })

    afterEach(async () => {
        await client.stop()
    })

    it('can resolve email from public key', async () => {
        const emails = await store.getEmails(client.identity.publicKey)
        expect(emails).to.deep.equal(['a@b.c',])
    })

    it('can resolve public key from email', async () => {
        const emails = await store.getPublicKeys("a@b.c")
        expect(emails).to.have.length(1)
        expect(emails[0].equals(client.identity.publicKey)).to.equal(true)
    })

    it('resolve all', async () => {
        const emails = await store.getAll()
        expect(emails).to.have.length(2)
        expect(emails.map(x => x.from)).to.deep.equal(['a@b.c', 'e@f.g'])
    })
})