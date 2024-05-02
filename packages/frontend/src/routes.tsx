import { Routes, Route } from "react-router";
import { App } from "./App";

export const getNameFromPath = (name: string) => decodeURIComponent(name);

export function BaseRoutes() {
    return (
        <Routes>
            <Route path="/*" element={<App />} />
        </Routes>
    );
}
