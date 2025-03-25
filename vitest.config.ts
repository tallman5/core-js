import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "jsdom",
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            include: [
                "src"
            ],
            exclude: [
                "**/*.d.ts",
                "**/*.test.ts",
                "**/index.ts",
                "**/models.ts",
                "**/*.models.ts",
                "**/*.model.ts",
            ]
        }
    },
    resolve: {
        alias: {
            "monaco-editor": "./node_modules/monaco-editor"
        }
    }
});
