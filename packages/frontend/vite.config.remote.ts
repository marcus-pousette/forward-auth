import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        esbuildOptions: {
            target: "esnext",
        },
        include: ["@protobufjs/float", "@protobufjs/utf8"],
        exclude: ["@peerbit/any-store"],
    },
    define: {
        APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
    build: {
        target: "esnext"
    },
    server: fs.existsSync("./.cert/key.pem")
        ? {
            https: {
                key: fs.readFileSync("./.cert/key.pem"),
                cert: fs.readFileSync("./.cert/cert.pem"),
            },
            host: "text.test.xyz",
            port: 5803,
        }
        : undefined,
});
