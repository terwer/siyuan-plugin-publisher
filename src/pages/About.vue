<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { reactive } from "vue"
import { dependencies, version } from "../../package.json"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { aboutUrl } from "~/src/utils/constants.ts"

const { t } = useVueI18n()

const formData = reactive({
  v: version,
  deps: Object.entries(dependencies).slice(0, 24),
})
</script>

<template>
  <back-page title="关于作者">
    <div id="about-box">
      <div class="logo">
        <img src="../../icon.png" alt="logo" />
      </div>
      <div class="notice">
        <p class="title">发布工具 v{{ formData.v }}</p>

        <div class="param slogan">
          <span>{{ t("slogan.make.written.fun") }}</span>
        </div>
        <div class="space"></div>
        <div class="param">Created by <a :href="aboutUrl" target="_blank">terwer</a></div>

        <div class="space"></div>
        <div class="third-libs">
          <div class="lib-title">Thanks for third party libraries:</div>
          <div class="lib-container">
            <div class="lib-item" v-for="value in formData.deps">
              {{ value }}
            </div>
            <div class="lib-item" v-if="formData.deps.length >= 24">
              <a target="_blank" href="https://github.com/terwer/siyuan-plugin-publisher/blob/main/package.json#L54"
                >more...
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </back-page>
</template>

<style scoped lang="stylus">
#about-box
  padding 16px 20px
  .logo
    display inline-block
    vertical-align top
    img
      width 160px
      height 160px
  .notice
    display inline-block
    vertical-align top
    padding-left 20px
    width calc(100% - 250px)
    .param
      padding 10px 0
    .space
      padding-bottom 10px
    .slogan
      font-size 24px
    .third-libs
      .lib-title
        font-weight bold
        margin-bottom 4px
      .lib-container
        display flex
        flex-wrap wrap
        .lib-item
          width 50%
          font-size 14px
          padding 4px 0
          color #bbb

.param.slogan span
  // 红色色系
  background-image linear-gradient(to right, #E03E2F, #f1c0b6)
  // 灰白色系
  // background-image linear-gradient(to right, #222222, #bbb)
  // 蓝色色系
  // background-image linear-gradient(to right, #0079ff, #36a1ff)
  -webkit-background-clip text
  -webkit-text-fill-color transparent
</style>
