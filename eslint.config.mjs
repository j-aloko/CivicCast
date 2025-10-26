import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import sortKeysFix from "eslint-plugin-sort-keys-fix";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "airbnb",
    "airbnb/hooks",
    "plugin:prettier/recommended",
  ),
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      "jsx-a11y": jsxA11y,
      "sort-keys-fix": sortKeysFix,
    },
    rules: {
      "comma-dangle": ["error", "only-multiline"],
      "function-paren-newline": "off",
      "implicit-arrow-linebreak": "off",
      "import/imports-first": ["error", "absolute-first"],
      "import/newline-after-import": "error",
      "import/no-cycle": "error",
      "import/no-dynamic-require": "warn",
      "import/no-extraneous-dependencies": "off",
      "import/no-named-as-default": 0,
      "import/no-unresolved": [2, { ignore: ["react"] }],
      "import/order": [
        "error",
        {
          alphabetize: {
            caseInsensitive: true,
            order: "asc",
          },
          groups: ["builtin", "external", "internal"],
          "newlines-between": "always",
          pathGroups: [
            {
              group: "external",
              pattern: "react",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["react"],
        },
      ],
      "import/prefer-default-export": 0,
      indent: "off",
      "jsx-a11y/anchor-is-valid": 0,
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/control-has-associated-label": "warn",
      "jsx-a11y/label-has-associated-control": [
        "error",
        {
          required: {
            some: ["nesting", "id"],
          },
        },
      ],
      "jsx-a11y/label-has-for": "warn",
      "jsx-a11y/no-static-element-interactions": "warn",
      "linebreak-style": 0,
      "max-len": ["error", { code: 2000 }],
      "no-await-in-loop": 0,
      "no-confusing-arrow": "off",
      "no-empty": "warn",
      "no-nested-ternary": "warn",
      "no-param-reassign": [
        "error",
        {
          props: false,
        },
      ],
      "no-plusplus": 0,
      "no-underscore-dangle": [
        "error",
        {
          allow: ["__filename", "__dirname", "_count", "_avg", "_sum"],
        },
      ],
      "no-unsafe-optional-chaining": "warn",
      "no-unused-expressions": "off",
      "no-unused-vars": "warn",
      "no-use-before-define": [
        "error",
        { classes: true, functions: false, variables: false },
      ],
      "object-curly-newline": "off",
      "operator-linebreak": "off",
      "prettier/prettier": [
        "error",
        {},
        {
          usePrettierrc: true,
        },
      ],
      "react/jsx-curly-newline": "off",
      "react/jsx-filename-extension": [
        "error",
        { extensions: [".js", ".jsx"] },
      ],
      "react/jsx-no-useless-fragment": "off",
      "react/jsx-props-no-spreading": "off",
      "react/jsx-wrap-multilines": ["error", { prop: false }],
      "react/prop-types": "off",
      "sort-keys-fix/sort-keys-fix": "warn",
    },
    settings: {
      "import/resolver": {
        alias: {
          extensions: [".js", ".jsx", ".json", ".tx"],
          map: [["@", "./src"]],
        },
      },
    },
  },
];

export default eslintConfig;
