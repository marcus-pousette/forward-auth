import { Email, VerifiedEmailStore } from "forward-auth-verified-emails";
import { Ed25519PublicKey } from '@peerbit/crypto'
import { deserialize } from '@dao-xyz/borsh';
import { useState } from "react";
import { CreateEmailDialog } from "./CreateEmailDialog";

const Credential = (props: { from: string, email: Email[] }) => {
    const [open, setOpen] = useState(false);
    return <>
        <div className="flex flex-row items-center gap-2 mb-3">
            <p>{props.from}</p>
            <button onClick={() => {
                alert(props.email.map(x => deserialize(x.publicKey, Ed25519PublicKey).hashcode()).join("\n"))
            }} className="ml-auto btn-elevated p-2">Keys ({props.email.length}) </button>
            <button className="btn-elevated p-2" disabled={open} onClick={() => setOpen(true)} >Send E2EE email</button>
            <CreateEmailDialog open={open} recipentKeys={props.email.map(x => deserialize(x.publicKey, Ed25519PublicKey))} recipent={props.from} setOpen={setOpen} />
        </div>
    </>
}
export const Credentials = (props: { emails: Email[] }) => {

    // group emails by 'from' property
    const grouped = props.emails.reduce((acc, email) => {
        if (!acc[email.from]) {
            acc[email.from] = []
        }
        acc[email.from].push(email)
        return acc
    }, {} as { [from: string]: Email[] })

    return (
        <div>
            <h1>People</h1>
            {Object.entries(grouped).map(([from, email]) => <Credential key={from} from={from} email={email} />)}
        </div>
    );
}