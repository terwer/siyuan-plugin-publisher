<template>
  <div>
    <img alt="Vue logo" src="./assets/vue.svg"/>
  </div>
  <div>
    <a href="javascript:void(0)" @click="change('zh_CN')">中文</a> -
    <a href="javascript:void(0)" @click="change('en_US')">English</a>
  </div>
  <div>{{ $t('message.hello') }}</div>
</template>

<script lang="ts">
import {useI18n} from 'vue-i18n'

export default {
  name: 'App',
  setup() {
    const {locale} = useI18n()

    function change(type: string) {
      locale.value = type;
    }

    return {change}
  }
}
</script>