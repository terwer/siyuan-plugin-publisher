<template>
  <div class="locale-changer">
    <el-form label-width="120px">
      <el-form-item :label="$t('lang.choose')">
        <el-select :placeholder="$t('lang.choose.placeholder')" v-model="$i18n.locale" @change="langChanged">
          <el-option :key="i" v-for="(lang, i) in langs" :label="lang.label" :value="lang.value"/>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import {useI18n} from "vue-i18n";
import {onMounted} from "vue";

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

const langChanged = (lang: string) => {
  console.log("langChanged=>", lang);
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