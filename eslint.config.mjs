import eslintPluginPrettier from "eslint-plugin-prettier";

export default [
  {
    ignores: ["node_modules", "dist"],
  },
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "prettier/prettier": "error",
    },
  },
];
