import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

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
        outDir: '../../docs',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                404: resolve(__dirname, "public/404.html"),
            },
        },
    },
    base: "/forward-auth/",
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
