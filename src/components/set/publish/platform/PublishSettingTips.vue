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
      不会配置，或者配置遇到问题？ 请加QQ群
      <span style="font-weight: bold; color: red">
        <a
          href="https://qm.qq.com/cgi-bin/qm/qr?k=fYrA79XDvtr4JuEgez-dmj1h3tOef8pg&jump_from=webapi&authKey=DC+XcjkoTH762jxvkSgpt7V97QFETnaLVTZIWhd8PdZoX+MNSr+LsprWFYYELXu8"
          target="_blank"
        >
          722632752
        </a>
      </span>
      讨论。
    </div>

    <div class="setting-help">
      需要详细的配置指导？请查看在线文档
      <a href="https://siyuan.wiki/s/20230810132040-nn4q7vs" target="_blank">平台配置指南</a>
    </div>

    <div class="tips-form">
      我想要的平台这里没有？<a
        href="https://terwergreen.feishu.cn/share/base/form/shrcnGRdThUiqnhBg15xgclMM0c"
        target="_blank"
      >
        点击这里提交发布工具平台适配跟踪表
      </a>
    </div>

    <div class="tips-form">
      我还有其他问题或者想私下沟通作者？<a href="mailto:youweics@163.com"> 直接发邮件到：youweics@163.com </a>
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
