import { useProgram } from "@peerbit/react"
import { useEffect, useState } from "react";
import { VerifiedEmailStore, Email } from "verified-emails";

export const Explore = () => {

    const { loading: loadingProgram, program } = useProgram<VerifiedEmailStore>(new VerifiedEmailStore())
    const [credential, setCredentials] = useState<Email[]>([])

    useEffect(() => {
        if (!program || program.closed) {
            return
        }

        const changeListener = async () => {
            setCredentials(await program.getAll())
        }

        program.emails.events.addEventListener('change', changeListener)
        return () => program.emails.events.removeEventListener('change', changeListener)

    }, [program?.closed])

    return (
        <div>
            <h1>Explore</h1>
        </div>
    );
}