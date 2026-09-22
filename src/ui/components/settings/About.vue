<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <section class="syp-settings-page syp-about">
    <div class="syp-settings-page__header">
      <div>
        <div class="syp-settings-page__eyebrow">{{ t("about.eyebrow") }}</div>
        <h2 class="syp-settings-page__title">{{ t("about.title") }}</h2>
        <p class="syp-settings-page__desc">{{ t("about.desc") }}</p>
      </div>
    </div>

    <div class="syp-about-card">
      <img class="syp-about-logo" src="../../../../icon.png" alt="logo" />
      <div class="syp-about-meta">
        <div class="syp-about-version">{{ t("about.version", { version: appVersion }) }}</div>
        <div class="syp-about-slogan">{{ t("about.slogan") }}</div>
        <div class="syp-about-author">
          <span>{{ t("about.createdBy") }}</span>
          <a :href="aboutUrl" target="_blank" rel="noreferrer">terwer</a>
        </div>
      </div>
    </div>

    <div class="syp-about-legacy">
      <div class="syp-about-legacy__text">{{ t("about.legacy.desc", { version: legacyVersion }) }}</div>
      <button type="button" class="syp-btn syp-btn-secondary" @click="openLegacyDownload">
        {{ t("about.legacy.download", { version: legacyVersion }) }}
      </button>
    </div>

    <div class="syp-about-libs">
      <div class="syp-about-libs__title">{{ t("about.thirdParty") }}</div>
      <div class="syp-about-libs__list">
        <div v-for="dep in dependencies" :key="dep[0]" class="syp-about-libs__item">
          {{ dep[0] }}
          <span class="syp-about-libs__version">{{ dep[1] }}</span>
        </div>
        <a v-if="hasMore" class="syp-about-libs__item is-more" :href="packageJsonUrl" target="_blank" rel="noreferrer">
          {{ t("about.more") }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { dependencies as allDependencies, version as appVersion } from "../../../../package.json"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"
import { aboutUrl, V1_LAST_RELEASE_URL, V1_LAST_VERSION } from "~/src/utils/constants.ts"
import { openPathOrUrl } from "~/src/utils/pathUtils.ts"

const { t } = useAppI18n()
const { kernelApi } = useSiyuanApi()

/** 与「关于」页同源：第三方库列表取自 package.json 的 dependencies */
const DEPS_LIMIT = 24
const dependencies = Object.entries(allDependencies).slice(0, DEPS_LIMIT)
const hasMore = Object.keys(allDependencies).length >= DEPS_LIMIT
const packageJsonUrl = "https://github.com/terwer/siyuan-plugin-publisher/blob/main/package.json"

/**
 * 旧版界面的下载指引。
 *
 * 旧界面已在本版彻底移除，这里只提供「确需旧界面」时的去处；**计划在 2.3.0 移除整块内容**
 * （含 `V1_LAST_VERSION` / `V1_LAST_RELEASE_URL` 两个常量）。
 */
const legacyVersion = V1_LAST_VERSION
const openLegacyDownload = async () => {
  await openPathOrUrl(V1_LAST_RELEASE_URL, kernelApi)
}
</script>

<style scoped lang="stylus">
@import "../../assets/variables.styl"

.syp-about
  display flex
  flex-direction column
  gap 12px

.syp-about-card
  display flex
  align-items center
  gap 16px
  padding 16px
  border 1px solid var(--b3-border-color, $syp-border-primary)
  border-radius $syp-sm-card-radius

.syp-about-logo
  width 72px
  height 72px
  flex 0 0 auto
  border-radius $syp-sm-icon-radius

.syp-about-meta
  display flex
  flex-direction column
  gap 4px
  min-width 0

.syp-about-version
  font-size 14px
  font-weight 600
  color var(--b3-theme-on-background, $syp-text-primary)

.syp-about-slogan
  font-size 16px
  background-image linear-gradient(to right, #e03e2f, #f1c0b6)
  -webkit-background-clip text
  -webkit-text-fill-color transparent

.syp-about-author
  display flex
  align-items center
  gap 4px
  font-size 12px
  color var(--b3-theme-on-surface-light, $syp-text-tertiary)

  a
    color var(--b3-theme-primary, $syp-accent)
    text-decoration none

    &:hover
      text-decoration underline

.syp-about-legacy
  display flex
  align-items center
  justify-content space-between
  gap 12px
  padding 10px 12px
  border 1px solid var(--b3-border-color, $syp-border-primary)
  border-radius $syp-radius-sm
  background var(--b3-theme-surface-lights, $syp-bg-secondary)

  &__text
    flex 1 1 auto
    min-width 0
    font-size 12px
    line-height 1.5
    color var(--b3-theme-on-surface-light, $syp-text-tertiary)

.syp-about-libs
  display flex
  flex-direction column
  gap 6px
  &__title
    font-size 12px
    font-weight 600
    color var(--b3-theme-on-background, $syp-text-primary)

  &__list
    display flex
    flex-wrap wrap
    gap 4px 8px

  &__item
    flex 0 0 calc(50% - 4px)
    min-width 0
    padding 4px 6px
    border-radius $syp-radius-sm
    background var(--b3-theme-surface-lights, $syp-bg-secondary)
    font-size 12px
    color var(--b3-theme-on-surface-light, $syp-text-tertiary)
    overflow hidden
    text-overflow ellipsis
    white-space nowrap

    &.is-more
      flex 0 0 100%
      text-align center
      color var(--b3-theme-primary, $syp-accent)
      text-decoration none

  &__version
    opacity 0.7
</style>
