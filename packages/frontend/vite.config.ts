import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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
    build: {
        target: "esnext",
        outDir: '../../docs'
    },
    define: {
        APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
    /*  server: fs.existsSync("./.cert/key.pem")
         ? {
               https: {
                   key: fs.readFileSync("./.cert/key.pem"),
                   cert: fs.readFileSync("./.cert/cert.pem"),
               },
               host: "meet.dao.xyz",
           }
         : undefined, */
});
