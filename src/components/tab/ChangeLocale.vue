<template>
  <div class="locale-changer">
    <el-form label-width="120px">
      <!-- 语言选项 -->
      <el-form-item :label="$t('lang.choose')">
        <el-select :placeholder="$t('lang.choose.placeholder')" v-model="$i18n.locale" @change="langChanged">
          <el-option :key="i" v-for="(lang, i) in langs" :label="lang.label" :value="lang.value"/>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('theme.mode.choose')">
        <!-- 暗黑模式 -->
        <div class="dark-mode-choose">
          <button @click="toggleDark()">
            <i inline-block align-middle i="dark:carbon-moon carbon-sun"/>
            <span class="ml-2">{{ isDark ? $t('theme.mode.light') : $t('theme.mode.dark') }}</span>
          </button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import {useI18n} from "vue-i18n";
import {onMounted} from "vue";
import logUtil from "../../lib/logUtil";
import {useDark, useToggle} from "@vueuse/core";

const {locale} = useI18n()
const langs = [
  {
    value: 'zh_CN',
    label: "简体中文"
  },
  {
    value: 'en_US',
    label: "English"
  }
]

const isDark = useDark()
const toggleDark = useToggle(isDark)

const langChanged = (lang: string) => {
  logUtil.logInfo("langChanged=>", lang);
  localStorage.Lang = lang;
  locale.value = lang;
}

onMounted(() => {
  // 设置默认语言
  if (localStorage.Lang != null) locale.value = localStorage.Lang;
});
</script>

<script lang="ts">
export default {
  name: 'locale-changer'
}
</script>

<style scoped>
.dark-mode-choose button {
  --custom-mode-btn-color: #ffffff;
  --custom-mode-btn-bg-color: #44bd87;
  --custom-mode-btn-border-color: #44bd87;
}

html.dark .dark-mode-choose button {
  --custom-mode-btn-color: #ffffff;
  --custom-mode-btn-bg-color: #44bd87;
  --custom-mode-btn-border-color: #44bd87;
}

.dark-mode-choose button {
  padding: 3px 10px;
  background-color: var(--custom-mode-btn-bg-color);
  border: none;
  outline: none;
  color: var(--custom-mode-btn-color);
  border: 1px solid var(--custom-mode-btn-border-color);
  text-shadow: 1px 1px 1px var(--custom-mode-btn-border-color);
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  vertical-align: middle;
}
</style>