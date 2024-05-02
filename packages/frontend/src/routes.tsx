import { Routes, Route } from "react-router";
import { Read } from "./ReadEmail";
import { Content } from "./Content";

export const getNameFromPath = (name: string) => decodeURIComponent(name);

export function BaseRoutes() {
    return (
        <Routes>
            <Route path="read/*" element={<Read />} />
            <Route path="/*" element={<Content />} />
        </Routes>
    );
}
