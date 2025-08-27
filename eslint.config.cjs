const js = require("@eslint/js");
const pluginReact = require("eslint-plugin-react");
const pluginReactNative = require("eslint-plugin-react-native");
const pluginPrettier = require("eslint-plugin-prettier");
const parserTs = require("@typescript-eslint/parser");
const pluginTs = require("@typescript-eslint/eslint-plugin");

module.exports = [
  {
    ignores: [
      "node_modules",
      "android",
      "ios",
      ".eslintrc.js",
      ".prettierrc.js",
      "eslint.config.cjs"
    ],
  },
  js.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"], // adjust if your code is not in src/
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      },
    },
    plugins: {
      "@typescript-eslint": pluginTs,
      react: pluginReact,
      "react-native": pluginReactNative,
      prettier: pluginPrettier,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...pluginTs.configs.recommended.rules,
      "prettier/prettier": "error",
      "react/react-in-jsx-scope": "off", // not needed in RN
      "react-native/no-inline-styles": "off",
    },
  },
];
