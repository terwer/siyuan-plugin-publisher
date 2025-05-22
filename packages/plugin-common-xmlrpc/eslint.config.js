import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import { defineConfig } from "eslint/config"

export default defineConfig(
  {
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      semi: "off",
      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
          semi: false,
          printWidth: 120,
          tabWidth: 2,
        },
      ],
    },
  },
  eslintPluginPrettierRecommended,
)
