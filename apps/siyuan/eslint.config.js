import pluginVue from "eslint-plugin-vue";
import {defineConfigWithVueTs, vueTsConfigs} from "@vue/eslint-config-typescript";

export default defineConfigWithVueTs(
    pluginVue.configs["flat/essential"],
    vueTsConfigs.recommended,
    {
        rules: {
            "vue/multi-word-component-names": "off",
            "vue/no-v-html": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "semi": ["error", "never"]
        }
    }
);