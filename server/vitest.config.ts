import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        env: {
            NODE_ENV: "test",
            // A fixed, hermetic secret so the suite never depends on a local .env file existing.
            JWT_SECRET: "test_jwt_secret_do_not_use_in_prod",
        },
        setupFiles: "./tests/setup.ts",
        // All test files share one real SQLite file (not :memory:) and reseed between
        // each test — running files in parallel would let one file's reseed stomp on
        // another file's in-flight assertions. Keep it simple: run files sequentially.
        fileParallelism: false,
    },
});
