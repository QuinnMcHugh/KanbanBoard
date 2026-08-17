// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook"

import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import jsxA11y from "eslint-plugin-jsx-a11y"
import tseslint from "typescript-eslint"
import eslintConfigPrettier from "eslint-config-prettier"

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    reactHooks.configs.flat["recommended-latest"],
    reactRefresh.configs.vite,
    jsxA11y.flatConfigs.recommended,
    // Disables any ESLint stylistic rules that could conflict with Prettier.
    // Indentation itself isn't an ESLint rule at all anymore (see below) — this
    // guards against other formatting rules (quotes, semicolons, etc.) if any
    // get added later.
    eslintConfigPrettier,
    {
        languageOptions: {
            ecmaVersion: 2023,
            globals: globals.browser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        // vite.config.ts isn't part of the app's own tsconfig (it's covered by
        // tsconfig.node.json, a separate project for Node-side config), and
        // eslint.config.js isn't part of either — neither needs type-aware rules.
        files: ["eslint.config.js", "vite.config.ts"],
        ...tseslint.configs.disableTypeChecked,
    },
    {
        // Story files are excluded from tsconfig.app.json (kept out of the
        // production build/typecheck gate — see tsconfig.storybook.json for
        // their standalone typecheck), so they're outside the app's tsconfig
        // project and can't use type-aware rules here either.
        files: [".storybook/**", "src/**/*.stories.tsx"],
        ...tseslint.configs.disableTypeChecked,
    },
    {
        ignores: ["dist/**", "node_modules/**"],
    },
    storybook.configs["flat/recommended"],
)
