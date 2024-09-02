import adapter from "svelte-adapter-bun";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter(),
        alias: {
            "$cmp/*": "./src/lib/components/*",
            "$utl/*": "./src/lib/utils/*",
            "$def/*": "./src/lib/models/*",
            "$infra/*": "./src/lib/server/infrastructure/*",
            "$server/*": "./src/lib/server/*",
            "$stores/*": "./src/lib/stores/*",
            "$msg": "./src/lib/paraglide/messages.js",
        },
        csp: {
            mode: "hash",
            directives: {
                "script-src": ["self"],
            },
        },
    },
};

export default config;
