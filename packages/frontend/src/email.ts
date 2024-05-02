
import { usePeer } from '@peerbit/react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { serialize, deserialize } from '@dao-xyz/borsh'
import { Ed25519Keypair, Ed25519PublicKey, X25519Keypair, DecryptedThing, toBase64URL, fromBase64URL, EncryptedThing } from '@peerbit/crypto'


const NEW_LINE = "%0D%0A";

export const createEncryptedMessage = async (messageBody: string, identity: Ed25519Keypair, recipentKeys: Ed25519PublicKey[]) => {
    const kp = identity as Ed25519Keypair // TODO  check types
    const xkp = await X25519Keypair.from(kp)
    const decryptedMessage = new DecryptedThing({ data: new TextEncoder().encode(messageBody) })
    const encryptedMessage = await decryptedMessage.encrypt(xkp, recipentKeys)

    let domain = "https://text.test.xyz:5803/" // https://marcus-pousette.github.io/forward-auth/
    const link = `Read this message by clicking here:${NEW_LINE}${NEW_LINE}${domain}#read?message=${toBase64URL(serialize(encryptedMessage))}`
    return `${link}`
}

export const decryptMessage = async (encryptedMessage: string, identity: Ed25519Keypair) => {
    const encryptedMessageData = fromBase64URL(encryptedMessage)
    const encryptedMEssage = deserialize(encryptedMessageData, EncryptedThing)
    const xkp = await X25519Keypair.from(identity)
    const decrypted = await encryptedMEssage.decrypt(xkp)
    return new TextDecoder().decode(decrypted._data!)
}