import { useProgram } from "@peerbit/react"
import { useEffect, useState } from "react";
import { VerifiedEmailStore, Email } from "forward-auth-verified-emails";
import { Credentials } from "./Credential";

export const Explore = () => {

    const { loading: loadingProgram, program, peerCounter } = useProgram<VerifiedEmailStore>(new VerifiedEmailStore())
    const [credential, setCredentials] = useState<Email[]>([])

    useEffect(() => {
        if (!program || program.closed) {
            return
        }

        console.log("Email database opened!", program.address)
        const changeListener = async () => {
            console.log(await program.getAll())
            setCredentials(await program.getAll())
        }
        changeListener()
        program.emails.events.addEventListener('change', changeListener)
        return () => program.emails.events.removeEventListener('change', changeListener)

    }, [program?.closed])

    return (
        <div className="flex flex-col">
            <h1>Explore</h1>
            <Credentials emails={credential} />
            <div>Seeders: {peerCounter}</div>
        </div>
    );
}