// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      env: {
        node: true,
        es2020: true,
      },
    },
    rules: {
      // your custom rules here
      semi: ["error", "always"],
      quotes: ["error", "double"],
    },
  },
];
