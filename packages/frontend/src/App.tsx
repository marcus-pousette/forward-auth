import { PeerProvider } from "@peerbit/react";
import { BaseRoutes } from "./routes";
document.documentElement.classList.add("dark");
import { HashRouter } from "react-router-dom";

export const App = () => {
    return (
        <PeerProvider
            network={import.meta.env.MODE === "development" ? "local" : "remote"}
            host={true}
            waitForConnnected={true}
            bootstrap={["/dns4/d43dcad6997c733b34b34e9e4f68f1b274ee6876.peerchecker.com/tcp/4003/wss/p2p/12D3KooWDJpmpRxEfeSr7EBYci31VrjvMHp9GLhpv9211eXcchNf"]}
        >
            <HashRouter basename="/">
                <BaseRoutes />
            </HashRouter>
        </PeerProvider>
    );
};
