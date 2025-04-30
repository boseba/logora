// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import namingConvention from "./eslint/eslint.naming.mjs";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module"
    },
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "@typescript-eslint/naming-convention": namingConvention,
    },
  },
];