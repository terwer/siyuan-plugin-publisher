<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<!--
  发布修复。

  文档在思源里的 ID 变化后（删除重建、拆分、外部导入），原发布记录找不到对应文档，
  界面上会显示「未发布」，但平台上的文章其实还在。这里把所有平台的文章 ID 列在一起，
  填写后统一保存，即可把记录重新对上，不必重新发布。

  文档 ID 默认取当前文档，无需手填。
-->
<template>
  <section class="syp-settings-page">
    <div class="syp-settings-page__header">
      <div>
        <div class="syp-settings-page__eyebrow">{{ t("repair.eyebrow") }}</div>
        <h2 class="syp-settings-page__title">{{ t("repair.title") }}</h2>
        <p class="syp-settings-page__desc">{{ t("repair.desc") }}</p>
      </div>
    </div>

    <div class="syp-settings-group-list">
      <article class="syp-settings-group">
        <!-- 当前文档 -->
        <div class="syp-repair-doc">
          <span class="syp-repair-doc__label">{{ t("repair.doc.label") }}</span>
          <span class="syp-repair-doc__title">{{ docTitle || docId || t("repair.doc.none") }}</span>
        </div>

        <el-alert
          v-if="!docId"
          :title="t('repair.noDoc')"
          type="warning"
          :closable="false"
          class="syp-repair-alert"
        />

        <template v-else>
          <el-alert v-if="rows.length === 0" :title="t('repair.empty')" type="info" :closable="false" class="syp-repair-alert" />

          <template v-else>
            <p class="syp-repair-hint">{{ t("repair.hint") }}</p>

            <div class="syp-settings-form-list">
              <div v-for="row in rows" :key="row.key" class="syp-settings-form-row">
                <div class="syp-settings-form-main">
                  <div class="syp-settings-form-label">{{ row.name }}</div>
                  <div class="syp-settings-form-desc">{{ row.key }}</div>
                </div>
                <div class="syp-settings-form-control">
                  <el-input v-model="postIdMap[row.key]" :placeholder="row.postId || t('repair.field.placeholder')" />
                </div>
              </div>
            </div>

            <div class="syp-repair-actions">
              <el-button type="primary" :loading="saving" @click="handleSave">{{ t("repair.save") }}</el-button>
              <span v-if="saved" class="syp-settings-status-text is-saved">✓ {{ t("repair.saved") }}</span>
            </div>
          </template>
        </template>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue"
import { ElMessage } from "element-plus"
import { SiyuanDevice } from "zhi-device"
import { ObjectUtil, StrUtil } from "zhi-common"
import { usePublishConfig } from "~/src/composables/usePublishConfig.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"
import { getSiyuanPageId } from "~/src/utils/siyuanUtils.ts"
import { getMainWindowPageId } from "~/src/utils/widgetUtils.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"

const logger = createAppLogger("repair")

const props = defineProps<{
  /** 当前文档 ID；未传时自行获取 */
  docId?: string
}>()

const { t } = useAppI18n()
const { getPublishCfg } = usePublishConfig()
const { updateSetting } = usePublishSettingStore()
const { kernelApi } = useSiyuanApi()

const docId = ref("")
const docTitle = ref("")
const saving = ref(false)
const saved = ref(false)
const postIdMap = reactive<Record<string, string>>({})

interface PlatformRow {
  key: string
  name: string
  postId: string
}

const rows = ref<PlatformRow[]>([])

/**
 * 解析当前文档 ID。
 *
 * 顺序：打开面板时传入的 docId → 挂件/新窗口场景 → 当前活动文档（读宿主 DOM）。
 * 读活动文档这一步覆盖了最常用的场景：在文档中打开面板，div.protyle 就是当前文档。
 */
async function resolveDocId(): Promise<string> {
  if (!StrUtil.isEmptyString(props.docId)) {
    return props.docId as string
  }

  const fromDevice = await getSiyuanPageId()
  if (!StrUtil.isEmptyString(fromDevice)) {
    return fromDevice
  }

  try {
    const hostDoc = SiyuanDevice.siyuanWindow()?.document
    if (hostDoc) {
      const active = getMainWindowPageId(hostDoc)
      if (!StrUtil.isEmptyString(active)) {
        return active as string
      }
    }
  } catch (e) {
    logger.debug("read active document failed", e)
  }

  return ""
}

/** 读取当前文档的发布记录，列出所有可写入的平台 */
async function loadRows() {
  rows.value = []
  docTitle.value = ""

  const id = await resolveDocId()
  if (StrUtil.isEmptyString(id)) {
    return
  }
  docId.value = id

  try {
    try {
      const block = await kernelApi.getBlockByID(id)
      docTitle.value = StrUtil.isEmptyString(block?.content) ? "" : String(block.content)
    } catch {
      docTitle.value = ""
    }

    const publishCfg = await getPublishCfg()
    const setting = publishCfg.setting
    const postMeta = ObjectUtil.getProperty(setting, id, {})

    const list: PlatformRow[] = []
    for (const item of publishCfg.dynamicConfigArray) {
      const cfg = ObjectUtil.getProperty(setting, item.platformKey, {})
      const posidKey = cfg?.posidKey
      if (StrUtil.isEmptyString(posidKey)) {
        continue
      }
      const current = ObjectUtil.getProperty(postMeta, posidKey, "")
      postIdMap[item.platformKey] = current
      list.push({ key: item.platformKey, name: item.platformName ?? item.platformKey, postId: current })
    }
    rows.value = list
  } catch (e) {
    logger.error("load publish records failed", e)
  }
}

/** 一次保存所有平台 */
async function handleSave() {
  if (StrUtil.isEmptyString(docId.value)) {
    ElMessage.warning(t("repair.noDoc"))
    return
  }

  saving.value = true
  saved.value = false
  try {
    const publishCfg = await getPublishCfg()
    const setting = publishCfg.setting
    const postMeta = ObjectUtil.getProperty(setting, docId.value, {})

    for (const row of rows.value) {
      const next = (postIdMap[row.key] ?? "").trim()
      if (StrUtil.isEmptyString(next)) {
        continue
      }
      const cfg = ObjectUtil.getProperty(setting, row.key, {})
      const posidKey = cfg?.posidKey
      if (!StrUtil.isEmptyString(posidKey)) {
        postMeta[posidKey] = next
      }
    }

    setting[docId.value] = postMeta
    await updateSetting(setting)
    saved.value = true
    ElMessage.success(t("repair.saved"))
    setTimeout(() => {
      saved.value = false
    }, 2000)
  } catch (e) {
    logger.error("save publish records failed", e)
    ElMessage.error(`${t("repair.failed")}: ${e}`)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  void loadRows()
})
</script>

<style scoped lang="stylus">
@import "../../assets/variables.styl"

.syp-repair-doc
  display flex
  align-items baseline
  gap 10px
  margin-bottom 14px

.syp-repair-doc__label
  flex 0 0 auto
  font-size 13px
  color $syp-text-tertiary

.syp-repair-doc__title
  font-size 14px
  font-weight 500
  color $syp-text-primary

.syp-repair-alert
  margin 10px 0

.syp-repair-hint
  margin 0 0 6px
  font-size 12px
  line-height 1.6
  color $syp-text-tertiary

.syp-repair-actions
  display flex
  align-items center
  gap 12px
  margin-top 16px

.syp-settings-status-text.is-saved
  color $syp-badge-ready-text
</style>