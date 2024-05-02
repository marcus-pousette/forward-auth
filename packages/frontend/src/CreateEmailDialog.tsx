import { usePeer } from '@peerbit/react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { serialize } from '@dao-xyz/borsh'
import { Ed25519Keypair, Ed25519PublicKey, X25519Keypair, DecryptedThing, toBase64 } from '@peerbit/crypto'

const START_ENCRYPTED_MESSAGE = "___START_ENCRYPTED_MESSAGE___"
const END_ENCRYPTED_MESSAGE = "___END_ENCRYPTED_MESSAGE___"
const NEWLINE = "%0D%0A"
export const CreateEmailDialog = (props: { recipent: string, recipentKeys: Ed25519PublicKey[], open: boolean, setOpen: (value: boolean) => void }) => {
    const [subject, setSubject] = useState("A secret message")
    const [messageBody, setMessageBody] = useState("Hello!")
    const [encrytedBody, setEncryptedBody] = useState<string>(null)
    const { peer } = usePeer()

    useEffect(() => {

        const fn = async () => {

            const kp = peer.identity as Ed25519Keypair // TODO  check types
            const xkp = await X25519Keypair.from(kp)
            const decryptedMessage = new DecryptedThing({ data: new TextEncoder().encode(messageBody) })
            const encryptedMessage = await decryptedMessage.encrypt(xkp, props.recipentKeys)
            setEncryptedBody(`${START_ENCRYPTED_MESSAGE}${NEWLINE}${toBase64(serialize(encryptedMessage))}${NEWLINE}${END_ENCRYPTED_MESSAGE}`)
        }
        fn()

    }, [subject])
    return <Dialog.Root open={props.open} onOpenChange={props.setOpen}>
        <Dialog.Portal>
            <Dialog.Overlay className="DialogOverlay" />
            <Dialog.Content className="DialogContent">
                <Dialog.Title className="DialogTitle">Send email to {props.recipent}</Dialog.Title>
                <Dialog.Description className="DialogDescription">
                    Write a secret message. Subject is is not encrypted
                </Dialog.Description>
                <fieldset className="Fieldset">
                    <label className="Label" htmlFor="name">
                        Subject
                    </label>
                    <input className="Input" id="name" defaultValue="A secret message" onChange={(ev) => setSubject(ev.target.value)} />
                </fieldset>
                <fieldset className="Fieldset">
                    <input className="Input" id="name" defaultValue="Hello!" onChange={(ev) => setMessageBody(ev.target.value)} />
                </fieldset>
                <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>


                    <a className="ml-auto" href={`mailto:${props.recipent}?subject=${subject}&body=This is an encrypted message!%0D%0A%0D%0A%0D%0A${encrytedBody}`} >
                        <Dialog.Close asChild>
                            <button className="Button green">Send</button>
                        </Dialog.Close>
                    </a>
                </div>
                <Dialog.Close asChild>
                    <button className="IconButton" aria-label="Close">
                        <Cross2Icon />
                    </button>
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>

}