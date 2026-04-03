<template>
  <section class="syp-settings-page">
    <div class="syp-settings-page__header">
      <div>
        <div class="syp-settings-page__eyebrow">{{ t("v2.i18nTest.eyebrow") }}</div>
        <h2 class="syp-settings-page__title">{{ t("v2.i18nTest.title") }}</h2>
        <p class="syp-settings-page__desc">{{ t("v2.i18nTest.desc") }}</p>
      </div>
    </div>

    <div class="syp-settings-detail-grid">
      <article class="syp-settings-detail-card">
        <div class="syp-settings-detail-card__title">{{ t("v2.i18nTest.summary.title") }}</div>
        <div class="syp-settings-detail-list">
          <div class="syp-settings-detail-row">
            <div class="syp-settings-detail-label">{{ t("v2.i18nTest.summary.locale") }}</div>
            <div class="syp-settings-detail-value">{{ String(locale) }}</div>
          </div>
          <div class="syp-settings-detail-row">
            <div class="syp-settings-detail-label">{{ t("v2.i18nTest.summary.groups") }}</div>
            <div class="syp-settings-detail-value">{{ sampleGroups.length }}</div>
          </div>
        </div>
      </article>

      <article class="syp-settings-detail-card">
        <div class="syp-settings-detail-card__title">{{ t("v2.i18nTest.summary.tipTitle") }}</div>
        <div class="syp-settings-detail-list">
          <div class="syp-settings-detail-row">
            <div class="syp-settings-detail-label">{{ t("v2.i18nTest.summary.tipLabel") }}</div>
            <div class="syp-settings-detail-value">{{ t("v2.i18nTest.summary.tipValue") }}</div>
          </div>
        </div>
      </article>
    </div>

    <div class="syp-settings-group-list">
      <article v-for="group in sampleGroups" :key="group.title" class="syp-settings-group">
        <div class="syp-settings-group__title">{{ group.title }}</div>
        <div class="syp-settings-group__desc">{{ group.description }}</div>

        <div class="syp-i18n-test-table">
          <div v-for="item in group.items" :key="item.key" class="syp-i18n-test-row">
            <div class="syp-i18n-test-key">{{ item.key }}</div>
            <div class="syp-i18n-test-value">
              <div class="syp-i18n-test-value__line">
                <span class="syp-i18n-test-value__label">{{ t("v2.i18nTest.column.locale") }}</span>
                <span>{{ inspect(item.key, item.params).localeText ?? "-" }}</span>
              </div>
              <div class="syp-i18n-test-value__line">
                <span class="syp-i18n-test-value__label">{{ t("v2.i18nTest.column.fallback") }}</span>
                <span>{{ inspect(item.key, item.params).fallbackText ?? "-" }}</span>
              </div>
              <div class="syp-i18n-test-value__line is-final">
                <span class="syp-i18n-test-value__label">{{ t("v2.i18nTest.column.final") }}</span>
                <span>{{ inspect(item.key, item.params).text }}</span>
              </div>
            </div>
            <div class="syp-i18n-test-source" :class="`is-${inspect(item.key, item.params).source}`">
              {{ t(`v2.i18nTest.source.${inspect(item.key, item.params).source}`) }}
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useV2I18n } from "~/src/composables/v2/useV2I18n.ts"

interface SampleItem {
  key: string
  params?: Record<string, string>
}

interface SampleGroup {
  title: string
  description: string
  items: SampleItem[]
}

const { t, inspect, locale } = useV2I18n()

const sampleGroups = computed<SampleGroup[]>(() => [
  {
    title: t("v2.i18nTest.group.publish.title"),
    description: t("v2.i18nTest.group.publish.desc"),
    items: [
      { key: "v2.app.panel.quickPublish" },
      { key: "v2.quickPublish.empty.noDocument.title" },
      { key: "v2.publish.desc.publishing.named", params: { name: "WordPress" } },
      { key: "v2.card.action.preview" },
    ],
  },
  {
    title: t("v2.i18nTest.group.settings.title"),
    description: t("v2.i18nTest.group.settings.desc"),
    items: [
      { key: "v2.account.title" },
      { key: "v2.picbed.title" },
      { key: "v2.preference.title" },
      { key: "v2.platformConfig.title" },
    ],
  },
  {
    title: t("v2.i18nTest.group.bridge.title"),
    description: t("v2.i18nTest.group.bridge.desc"),
    items: [
      { key: "setting.blog.previewUrl" },
      { key: "publisher.picbed.service" },
      { key: "setting.wordpress.home.tip" },
      { key: "setting.cnblogs.previewUrl.tip" },
      { key: "preference.setting.fixTitle" },
    ],
  },
  {
    title: t("v2.i18nTest.group.probe.title"),
    description: t("v2.i18nTest.group.probe.desc"),
    items: [
      { key: "v2.i18nTest.probe.localeOnly" },
      { key: "v2.i18nTest.probe.fallbackOnly" },
      { key: "v2.i18nTest.probe.nested.deep" },
      { key: "v2.i18nTest.probe.missing" },
    ],
  },
])
</script>

<style scoped lang="stylus">
.syp-i18n-test-table
  display flex
  flex-direction column
  gap 10px
  margin-top 16px

.syp-i18n-test-row
  display grid
  grid-template-columns minmax(0, 220px) minmax(0, 1fr) 72px
  gap 12px
  align-items start
  padding 12px 0
  border-bottom 1px solid #e6ebf2

  &:last-child
    border-bottom none
    padding-bottom 0

.syp-i18n-test-key
  font-size 12px
  color #7b8490
  word-break break-all

.syp-i18n-test-value
  font-size 14px
  color #1f2329
  word-break break-word

.syp-i18n-test-value__line
  display flex
  gap 8px
  align-items flex-start
  margin-bottom 4px

  &:last-child
    margin-bottom 0

  &.is-final
    font-weight 600

.syp-i18n-test-value__label
  min-width 64px
  flex-shrink 0
  font-size 12px
  color #7b8490

.syp-i18n-test-source
  font-size 12px
  color #667085

  &.is-locale
    color #2f8b24

  &.is-fallback
    color #ad5b00

  &.is-missing
    color #b42318

@media (max-width: 960px)
  .syp-i18n-test-row
    grid-template-columns 1fr
</style>
