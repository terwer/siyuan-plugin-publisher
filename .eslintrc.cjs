module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended",
    "turbo",
    "prettier",
  ],

  // https://eslint.vuejs.org/user-guide/#how-to-use-a-custom-parser
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },

  plugins: ["@typescript-eslint", "vue", "prettier"],

  rules: {
    // Note: you must disable the base rule as it can report incorrect errors
    semi: "off",
    quotes: "off",
    "no-undef": "off",
    "vue/no-v-htm": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "turbo/no-undeclared-env-vars": "off",
    "prettier/prettier": "error",
  },
}
