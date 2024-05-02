import { PeerProvider } from "@peerbit/react";
import { Content } from "./Content";
document.documentElement.classList.add("dark");

export const App = () => {
    return (
        <PeerProvider
            network = {import.meta.env.MODE === "development" ? "local" : "remote"}
            host={true}
            waitForConnnected={true}
        >
            <Content/>
        </PeerProvider>
    );
};
