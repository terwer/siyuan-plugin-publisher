<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { useVueI18n } from "~/src/composables/useVueI18n.ts"

// uses
const { t } = useVueI18n()
</script>

<template>
  <div class="right-setting-tips">
    <div class="el-alert el-alert--warning is-light" role="alert">
      <div class="el-alert__content">
        <div class="el-alert__title">
          <div>{{ t("setting.platform.right.tips0") }}</div>
          <div>{{ t("setting.platform.right.tips1") }}</div>
          <div>{{ t("setting.platform.right.tips2") }}</div>
          <div>{{ t("setting.platform.right.tips3") }}</div>
          <div>{{ t("setting.platform.right.tips4") }}</div>
        </div>
      </div>
    </div>

    <h2>FAQ:</h2>
    <div class="setting-help">
      {{ t("setting.tips.faq.config.problem") }}
      <span style="font-weight: bold; color: red">
        <a
          href="https://qm.qq.com/cgi-bin/qm/qr?k=fYrA79XDvtr4JuEgez-dmj1h3tOef8pg&jump_from=webapi&authKey=DC+XcjkoTH762jxvkSgpt7V97QFETnaLVTZIWhd8PdZoX+MNSr+LsprWFYYELXu8"
          target="_blank"
        >
          722632752
        </a>
      </span>
      {{ t("setting.tips.faq.discuss") }}
    </div>

    <div class="setting-help">
      {{ t("setting.tips.faq.config.guide") }}
      <a href="https://siyuan.wiki/s/20230810132040-nn4q7vs" target="_blank">{{ t("setting.tips.faq.config.guide.link") }}</a>
    </div>

    <div class="tips-form">
      {{ t("setting.tips.faq.platform.missing") }}<a
        href="https://terwergreen.feishu.cn/share/base/form/shrcnGRdThUiqnhBg15xgclMM0c"
        target="_blank"
      >
        {{ t("setting.tips.faq.platform.missing.link") }}
      </a>
    </div>

    <div class="tips-form">
      {{ t("setting.tips.faq.contact") }}<a href="mailto:youweics@163.com"> {{ t("setting.tips.faq.contact.email") }} </a>
    </div>
  </div>
</template>

<style scoped lang="stylus">
.right-setting-tips
  text-align left
  //padding-left 10px
  //padding-right 10px

  .setting-help
    font-size 12px
    margin-top 14px

  .tips-form
    font-size 12px
    margin-top 14px
</style>
