import { defineConfig } from "eslint/config";
import react from "eslint-plugin-react";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends("eslint:recommended", "plugin:react/recommended"),

    plugins: {
        react,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        ecmaVersion: 12,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    rules: {
        "no-unused-vars": "warn",
        eqeqeq: "warn",

        "array-bracket-newline": ["error", {
            multiline: true,
        }],

        "array-bracket-spacing": ["error", "always"],
        "array-element-newline": ["error", "consistent"],

        "brace-style": ["error", "1tbs", {
            allowSingleLine: true,
        }],

        "function-call-argument-newline": ["error", "consistent"],
        "multiline-ternary": ["error", "always-multiline"],

        "object-curly-newline": ["error", {
            consistent: true,
        }],

        "object-curly-spacing": ["error", "always"],

        "object-property-newline": ["error", {
            allowAllPropertiesOnSameLine: true,
        }],

        "operator-linebreak": ["error", "after", {
            overrides: {
                "?": "ignore",
                ":": "ignore",
            },
        }],

        quotes: ["error", "single"],

        semi: ["error", "never", {
            beforeStatementContinuationChars: "always",
        }],

        "react/jsx-closing-bracket-location": ["error", "after-props"],

        "react/jsx-curly-spacing": ["error", {
            when: "always",
        }],

        "react/jsx-indent-props": ["error", 2],

        "react/jsx-indent": ["error", 2, {
            indentLogicalExpressions: true,
        }],

        "react/jsx-wrap-multilines": ["error", {
            declaration: "parens-new-line",
            assignment: "parens-new-line",
            logical: "ignore",
            return: "parens-new-line",
            arrow: "parens-new-line",
        }],
    },
}]);