<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<!--
  已发布文章。

  列出当前文档在各平台上的发布记录，每行可以直接改文章 ID 或解绑；
  解绑只清理插件里的记录，不会删除平台上的文章。

  「平台上有旧文章」用于原发布修复场景：文档 ID 变化后记录对不上，
  填入平台上已有的文章 ID 即可重新关联，不必重新发布。
-->
<template>
  <section class="syp-settings-page">
    <div class="syp-settings-page__header">
      <div>
        <div class="syp-settings-page__eyebrow">{{ t("records.eyebrow") }}</div>
        <h2 class="syp-settings-page__title">{{ t("records.title") }}</h2>
        <p class="syp-settings-page__desc">{{ t("records.desc") }}</p>
      </div>
    </div>

    <div class="syp-settings-group-list">
      <article class="syp-settings-group">
        <div class="syp-records-doc">
          <span class="syp-records-doc__label">{{ t("records.doc.label") }}</span>
          <span class="syp-records-doc__title">{{ docTitle || docId || t("records.doc.none") }}</span>
        </div>

        <el-alert
          v-if="!docId && !isLoading"
          :title="t('records.noDoc')"
          type="warning"
          :closable="false"
          class="syp-records-alert"
        />

        <el-skeleton v-else-if="isLoading" :rows="3" animated />

        <template v-else>
          <ul v-if="records.length > 0" class="syp-records-list">
            <li v-for="record in records" :key="record.platformKey" class="syp-records-item">
              <div class="syp-records-row">
                <span class="syp-records-row__icon">
                  <span v-if="record.platformIcon" v-html="record.platformIcon"></span>
                  <span v-else class="syp-records-row__fallback">{{ record.platformName.slice(0, 1) }}</span>
                </span>
                <div class="syp-records-row__main">
                  <div class="syp-records-row__name">{{ record.platformName }}</div>
                  <div v-if="recordAccountHint(record)" class="syp-records-row__account">
                    {{ recordAccountHint(record) }}
                  </div>
                  <div class="syp-records-row__id">
                    <template v-if="editingKey !== record.platformKey">
                      <span class="syp-records-row__id-label">{{ t("records.field.id") }}</span>
                      <code class="syp-records-row__id-value">{{ record.postid }}</code>
                    </template>
                    <el-input
                      v-else
                      v-model="editingPostid"
                      class="syp-records-row__input"
                      size="small"
                      :placeholder="t('records.field.id.placeholder')"
                      @keyup.enter="saveEdit(record)"
                    />
                  </div>
                </div>
                <div class="syp-records-row__actions">
                  <template v-if="editingKey === record.platformKey">
                    <el-button size="small" type="primary" :loading="saving" @click="saveEdit(record)">
                      {{ t("records.action.save") }}
                    </el-button>
                    <el-button size="small" @click="cancelEdit">{{ t("records.action.cancel") }}</el-button>
                  </template>
                  <template v-else>
                    <el-button size="small" @click="startEdit(record)">{{ t("records.action.edit") }}</el-button>
                    <el-button size="small" type="danger" plain @click="startUnbind(record)">
                      {{ t("records.action.unbind") }}
                    </el-button>
                  </template>
                </div>
              </div>
              <SypConfirmBar
                :visible="unbindingKey === record.platformKey"
                :message="t('records.confirm.unbindText', { platform: record.platformName })"
                :confirm-text="t('records.confirm.unbind')"
                :cancel-text="t('records.action.cancel')"
                :loading="saving"
                @confirm="confirmUnbind(record)"
                @cancel="cancelUnbind"
              />
            </li>
          </ul>

          <div v-else class="syp-settings-empty">
            <div class="syp-settings-empty__title">{{ t("records.empty.title") }}</div>
            <div class="syp-settings-empty__desc">{{ t("records.empty.desc") }}</div>
          </div>

          <div v-if="candidates.length > 0" class="syp-records-associate">
            <button type="button" class="syp-records-associate__toggle" @click="toggleAssociate">
              <span class="syp-records-associate__arrow" :class="{ 'is-open': associateOpen }">▸</span>
              {{ t("records.associate.entry") }}
            </button>
            <div v-if="associateOpen" class="syp-records-associate__form">
              <p class="syp-records-associate__hint">{{ t("records.associate.hint") }}</p>
              <el-select
                v-model="associatePlatformKey"
                class="syp-records-associate__platform"
                size="small"
                filterable
                :placeholder="t('records.associate.platform.placeholder')"
              >
                <el-option
                  v-for="candidate in candidates"
                  :key="candidate.platformKey"
                  :label="candidateLabel(candidate)"
                  :value="candidate.platformKey"
                />
              </el-select>
              <el-input
                v-model="associatePostid"
                class="syp-records-associate__postid"
                size="small"
                :placeholder="t('records.field.id.placeholder')"
                @keyup.enter="saveAssociate"
              />
              <el-button
                size="small"
                type="primary"
                :loading="saving"
                :disabled="!canAssociate"
                @click="saveAssociate"
              >
                {{ t("records.associate.action") }}
              </el-button>
            </div>
          </div>
        </template>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { ElMessage } from "element-plus"
import { SiyuanDevice } from "zhi-device"
import { StrUtil } from "zhi-common"
import { usePublishRecords, type PublishedRecord } from "~/src/composables/usePublishRecords.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"
import SypConfirmBar from "~/src/ui/components/common/SypConfirmBar.vue"
import { getSiyuanPageId } from "~/src/utils/siyuanUtils.ts"
import { getMainWindowPageId } from "~/src/utils/widgetUtils.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"

const logger = createAppLogger("publish-records-page")

const props = defineProps<{
  /** 当前文档 ID；未传时自行获取 */
  docId?: string
}>()

const { t } = useAppI18n()
const { load, save, unbind } = usePublishRecords()
const { kernelApi } = useSiyuanApi()

const docId = ref("")
const docTitle = ref("")
const isLoading = ref(true)
const saving = ref(false)
const records = ref<PublishedRecord[]>([])
const candidates = ref<PublishedRecord[]>([])

const editingKey = ref("")
const editingPostid = ref("")
const unbindingKey = ref("")

const associateOpen = ref(false)
const associatePlatformKey = ref("")
const associatePostid = ref("")

const canAssociate = computed(
  () => !StrUtil.isEmptyString(associatePlatformKey.value) && !StrUtil.isEmptyString(associatePostid.value.trim())
)

/** 同一平台可能有多个账号（同名），用账号名/平台 key 区分，避免改错/解绑错账号 */
const countByPlatformName = (rows: PublishedRecord[]) => {
  const counts = new Map<string, number>()
  for (const row of rows) {
    counts.set(row.platformName, (counts.get(row.platformName) ?? 0) + 1)
  }
  return counts
}

const recordNameCounts = computed(() => countByPlatformName(records.value))
const candidateNameCounts = computed(() => countByPlatformName(candidates.value))

const recordAccountHint = (record: PublishedRecord) => {
  if ((recordNameCounts.value.get(record.platformName) ?? 0) <= 1) {
    return ""
  }
  return record.accountLabel || record.platformKey
}

const candidateLabel = (candidate: PublishedRecord) => {
  if ((candidateNameCounts.value.get(candidate.platformName) ?? 0) <= 1) {
    return candidate.platformName
  }
  return `${candidate.platformName} · ${candidate.accountLabel || candidate.platformKey}`
}

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
    // 此处失败不阻断主流程
  }

  return ""
}

/** 读取当前文档的标题与发布记录 */
async function loadRecords() {
  isLoading.value = true
  editingKey.value = ""
  unbindingKey.value = ""
  docTitle.value = ""
  records.value = []
  candidates.value = []

  try {
    const id = await resolveDocId()
    if (StrUtil.isEmptyString(id)) {
      return
    }
    docId.value = id

    try {
      const block = await kernelApi.getBlockByID(id)
      docTitle.value = StrUtil.isEmptyString(block?.content) ? "" : String(block.content)
    } catch {
      docTitle.value = ""
    }

    const overview = await load(id)
    records.value = overview.records
    candidates.value = overview.candidates
  } catch (e) {
    logger.error("load publish records failed", e)
    ElMessage.error(`${t("records.loadFailed")}: ${e}`)
  } finally {
    isLoading.value = false
  }
}

const startEdit = (record: PublishedRecord) => {
  unbindingKey.value = ""
  editingKey.value = record.platformKey
  editingPostid.value = record.postid
}

const cancelEdit = () => {
  editingKey.value = ""
  editingPostid.value = ""
}

async function saveEdit(record: PublishedRecord) {
  const next = editingPostid.value.trim()
  if (StrUtil.isEmptyString(next)) {
    ElMessage.warning(t("records.field.id.required"))
    return
  }
  if (next === record.postid) {
    cancelEdit()
    return
  }

  saving.value = true
  try {
    await save(docId.value, record.posidKey, next)
    record.postid = next
    cancelEdit()
    ElMessage.success(t("records.saved"))
  } catch (e) {
    logger.error("save publish record failed", e)
    ElMessage.error(`${t("records.saveFailed")}: ${e}`)
  } finally {
    saving.value = false
  }
}

const startUnbind = (record: PublishedRecord) => {
  editingKey.value = ""
  editingPostid.value = ""
  unbindingKey.value = record.platformKey
}

const cancelUnbind = () => {
  unbindingKey.value = ""
}

async function confirmUnbind(record: PublishedRecord) {
  saving.value = true
  try {
    const yamlCleared = await unbind(docId.value, record.platformKey, record.posidKey)
    records.value = records.value.filter((item) => item.platformKey !== record.platformKey)
    candidates.value = [...candidates.value, { ...record, postid: "" }]
    unbindingKey.value = ""
    if (yamlCleared) {
      ElMessage.success(t("records.unbound"))
    } else {
      ElMessage.warning(t("records.unbindPartial"))
    }
  } catch (e) {
    logger.error("unbind publish record failed", e)
    ElMessage.error(`${t("records.saveFailed")}: ${e}`)
  } finally {
    saving.value = false
  }
}

const toggleAssociate = () => {
  associateOpen.value = !associateOpen.value
  if (!associateOpen.value) {
    associatePlatformKey.value = ""
    associatePostid.value = ""
  }
}

async function saveAssociate() {
  const postid = associatePostid.value.trim()
  const candidate = candidates.value.find((item) => item.platformKey === associatePlatformKey.value)
  if (!candidate || StrUtil.isEmptyString(postid)) {
    return
  }

  saving.value = true
  try {
    await save(docId.value, candidate.posidKey, postid)
    candidates.value = candidates.value.filter((item) => item.platformKey !== candidate.platformKey)
    records.value = [...records.value, { ...candidate, postid }]
    associatePlatformKey.value = ""
    associatePostid.value = ""
    ElMessage.success(t("records.associate.saved"))
  } catch (e) {
    logger.error("associate publish record failed", e)
    ElMessage.error(`${t("records.saveFailed")}: ${e}`)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  void loadRecords()
})
</script>

<style scoped lang="stylus">
@import "../../assets/variables.styl"

.syp-records-doc
  display flex
  align-items baseline
  gap 10px
  margin-bottom 14px

.syp-records-doc__label
  flex 0 0 auto
  font-size 13px
  color $syp-text-tertiary

.syp-records-doc__title
  min-width 0
  font-size 14px
  font-weight 500
  color $syp-text-primary
  word-break break-all

.syp-records-alert
  margin 10px 0

.syp-records-list
  margin 0
  padding 0
  list-style none

.syp-records-item
  border-bottom 1px solid var(--b3-border-color, $syp-border-secondary)

  &:last-child
    border-bottom none

.syp-records-row
  display flex
  align-items center
  gap 12px
  padding 12px 0

.syp-records-row__icon
  flex 0 0 auto
  display inline-flex
  width 22px
  height 22px
  align-items center
  justify-content center
  color $syp-text-tertiary

  :deep(svg)
    width 100%
    height 100%

.syp-records-row__fallback
  font-size 14px
  font-weight 600
  color $syp-text-tertiary

.syp-records-row__main
  flex 1
  min-width 0

.syp-records-row__name
  font-size 14px
  font-weight 500
  color $syp-text-primary

.syp-records-row__account
  margin-top 2px
  font-size 12px
  color $syp-text-tertiary
  word-break break-all

.syp-records-row__id
  display flex
  align-items baseline
  gap 6px
  margin-top 2px
  min-width 0

.syp-records-row__id-label
  flex 0 0 auto
  font-size 12px
  color $syp-text-tertiary

.syp-records-row__id-value
  font-family var(--b3-font-family-code, monospace)
  font-size 12px
  color $syp-text-secondary
  word-break break-all

.syp-records-row__input
  max-width 320px

.syp-records-row__actions
  flex 0 0 auto
  display flex
  align-items center
  gap 8px

.syp-records-associate
  margin-top 14px
  padding-top 14px
  border-top 1px dashed var(--b3-border-color, $syp-border-secondary)

.syp-records-associate__toggle
  display inline-flex
  align-items center
  gap 6px
  padding 0
  border none
  background transparent
  font-size 13px
  color $syp-action-primary
  cursor pointer

.syp-records-associate__arrow
  display inline-block
  transition transform 0.15s ease

  &.is-open
    transform rotate(90deg)

.syp-records-associate__hint
  margin 8px 0 10px
  font-size 12px
  line-height 1.6
  color $syp-text-tertiary

.syp-records-associate__form
  display flex
  align-items center
  gap 8px
  flex-wrap wrap

.syp-records-associate__platform
  width 180px

.syp-records-associate__postid
  width 260px
</style>
