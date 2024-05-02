import { usePeer } from "@peerbit/react"
import { useEffect, useState } from "react";
import { decryptMessage } from "./email";
import { Ed25519Keypair } from '@peerbit/crypto'
import { useSearchParams } from 'react-router-dom';
export const Read = () => {

    const { peer } = usePeer();
    const [decryptedMessage, setDecryptedMessage] = useState<string | null>(null);
    const [from, setFrom] = useState<string | null>(null);
    // get query param 'message'

    const [params] = useSearchParams()


    // url
    useEffect(() => {
        const message = params.get("message");
        const from = params.get("from");

        if (!message || message.length === 0) {
            console.error("No message found")
            return;
        }
        if (!peer?.identity) {
            return;
        }
        console.log(message, from)
        setFrom(from);
        decryptMessage(message, peer.identity as Ed25519Keypair).then((decryptedMessage) => {
            setDecryptedMessage(decryptedMessage);
        }); // TODO check types
    }, [peer?.identity?.publicKey.hashcode(), params])
    return <div className="m-2">
        <h1>Read email</h1>
        <div>From: {from}</div>
        <div>{decryptedMessage}</div>
    </div>
}