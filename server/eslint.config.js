import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // `_`-prefixed args are intentionally unused — most commonly Express's
            // (err, req, res, next) signature, where `next` must be present for
            // Express to recognize a handler as error-handling middleware even if
            // it's never called.
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        },
    },
    {
        // Several real, known `any` boundaries exist here (Knex's raw/joined query
        // results are only partially typed — INSERT/UPDATE shapes are covered,
        // SELECT-with-JOIN results aren't; plus third-party callback typings from
        // Knex's pool hooks and jsonwebtoken). Fully closing that gap is separate,
        // larger work — downgraded to warnings so it's visible without blocking.
        rules: {
            "@typescript-eslint/no-unsafe-assignment": "warn",
            "@typescript-eslint/no-unsafe-member-access": "warn",
            "@typescript-eslint/no-unsafe-call": "warn",
            "@typescript-eslint/no-unsafe-return": "warn",
            "@typescript-eslint/no-unsafe-argument": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
        },
    },
    {
        // Supertest's `res.body` is untyped (`any`) by design — there's no way to
        // know a response's shape ahead of time, so every assertion that reaches
        // into it trips the strict "unsafe any" rules. That's expected friction in
        // integration tests, not a real bug risk, so it's off here rather than for
        // the whole project.
        files: ["tests/**/*.ts"],
        rules: {
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
    {
        // Not part of the tsconfig'd program, and doesn't need type-aware rules —
        // it's a small, self-contained config file.
        files: ["eslint.config.js"],
        ...tseslint.configs.disableTypeChecked,
    },
    {
        ignores: ["node_modules/**"],
    }
);
