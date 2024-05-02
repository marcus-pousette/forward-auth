import { expect } from "chai";
import { Peerbit } from 'peerbit'
import { EmailServerAndCredentialIssuer } from "../src";

describe('program', () => {

    let client: Peerbit;
    let store: EmailServerAndCredentialIssuer

    beforeEach(async () => {
        client = await Peerbit.create()
        store = await client.open(new EmailServerAndCredentialIssuer())
    })

    it('should start', () => {
        expect(store).to.be.exist;
    })
})