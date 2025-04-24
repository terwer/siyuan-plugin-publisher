const pluginVue = require("eslint-plugin-vue")
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended")
const {
  defineConfigWithVueTs,
  vueTsConfigs,
} = require("@vue/eslint-config-typescript")

module.exports = defineConfigWithVueTs(
  pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,
  {
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      // semi: ['error', 'never'],
      semi: "off",
      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
          semi: false,
        },
      ],
    },
  },
  eslintPluginPrettierRecommended,
)
