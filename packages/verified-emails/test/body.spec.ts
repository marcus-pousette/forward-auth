import { expect } from "chai";
import { Ed25519Keypair } from '@peerbit/crypto'
import { generateEmailBody, verifyEmailBody, } from "../src/body";
describe('Verified emails', () => {
    it('can generate and verify email body', async () => {
        const kp = await Ed25519Keypair.create();
        const body = await generateEmailBody(kp)
        const verifiedPublicKey = await verifyEmailBody(body)
        expect(verifiedPublicKey.equals(kp.publicKey)).to.equal(true)
    })
})