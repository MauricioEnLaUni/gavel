import { paraglide } from '@inlang/paraglide-sveltekit/vite'
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

import { resolve } from "path";

export default defineConfig({
    plugins: [paraglide({ project: './project.inlang', outdir: './src/lib/paraglide' }),sveltekit()],
    resolve: {
        alias: {
            $lib: resolve("./src/lib"),
            $cmp: resolve("./src/lib/component"),
            $utl: resolve("./src/lib/utils"),
            $def: resolve("./src/lib/models"),
        },
    },
    build: {
        rollupOptions: {},
    },
    server: {
        host: true,
        port: 3000,
        strictPort: true,
        cors: {
            origin: "*",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            preflightContinue: false,
            optionsSuccessStatus: 204,
        },
    },
    test: {
        coverage: {
            enabled: true,
            provider: "v8",
            reporter: ["text", "json", "html"],
            include: ["src/lib/**/*", "**/*.svelte"],
            exclude: [
                "coverage/**",
                "dist/**",
                "**/[.]**",
                "packages/*/test?(s)/**",
                "**/*.d.ts",
                "**/virtual:*",
                "**/__x00__*",
                "**/\x00*",
                "cypress/**",
                "test?(s)/**",
                "test?(-*).?(c|m)[jt]s?(x)",
                "**/*{.,-}{test,spec}.?(c|m)[jt]s?(x)",
                "**/__tests__/**",
                "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
                "**/vitest.{workspace,projects}.[jt]s?(on)",
                "**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}",
                "src/lib/utils.ts",
                "src/lib/vitest-setup.js",
            ],
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 80,
                statements: 60,
            },
        },
        environment: "jsdom",
        setupFiles: ["src/lib/vitest-setup.js"],
        include: ["src/**/*.{test,spec}.{js,ts}"]
    }
});
