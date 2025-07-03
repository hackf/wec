import { fileURLToPath } from "node:url";
import globals from "globals";

import { defineConfig } from "eslint/config";

import js from "@eslint/js";
import { includeIgnoreFile } from "@eslint/compat";

import reactPlugin from "eslint-plugin-react";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default defineConfig([
  includeIgnoreFile(gitignorePath, "Imported .gitignore patterns"),
  reactPlugin.configs.flat['jsx-runtime'],
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    ...reactPlugin.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
]);
