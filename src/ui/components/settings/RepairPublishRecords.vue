<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<!--
  发布记录修复面板。

  文档在思源里的 ID 变化后（删除重建、拆分、外部导入），原发布记录找不到对应文档，
  界面上会显示「未发布」，但平台上的文章其实还在。这里按平台填写平台上已有的文章 ID，
  即可把记录重新对上，不必重新发布。
-->
<template>
  <el-dialog
    :model-value="visible"
    :title="t('preference.repair.title')"
    width="560px"
    :append-to-body="false"
    :close-on-click-modal="true"
    class="syp-repair-dialog"
    @update:model-value="emit('update:visible', $event)"
  >
    <p class="syp-repair-desc">{{ t("preference.repair.desc") }}</p>

    <div class="syp-repair-field">
      <label class="syp-repair-label">{{ t("preference.repair.pageId.label") }}</label>
      <el-input
        v-model="pageId"
        :placeholder="t('preference.repair.pageId.placeholder')"
        clearable
        @change="handlePageIdChange"
      />
      <p class="syp-repair-tips">{{ t("preference.repair.tips") }}</p>
    </div>

    <template v-if="pageId">
      <el-alert
        v-if="platformRows.length === 0"
        :title="t('preference.repair.empty')"
        type="info"
        :closable="false"
        class="syp-repair-alert"
      />
      <template v-else>
        <el-alert :title="targetTitle" type="warning" :closable="false" class="syp-repair-alert" />
        <div class="syp-repair-rows">
          <div v-for="row in platformRows" :key="row.key" class="syp-repair-row">
            <span class="syp-repair-row__name">{{ row.name }}</span>
            <el-input v-model="postIdMap[row.key]" :placeholder="row.postId || '—'" />
          </div>
        </div>
        <p class="syp-repair-hint">{{ t("preference.repair.column.hint") }}</p>
      </template>
    </template>

    <template #footer>
      <el-button @click="emit('update:visible', false)">{{ t("main.opt.cancel") }}</el-button>
      <el-button type="primary" :loading="saving" @click="handleSave">{{ t("preference.repair.save") }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue"
import { ElMessage } from "element-plus"
import { ObjectUtil, StrUtil } from "zhi-common"
import { usePublishConfig } from "~/src/composables/usePublishConfig.ts"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { useAppI18n } from "~/src/ui/composables/useAppI18n.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"

const logger = createAppLogger("repair-publish-records")

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void
}>()

const { t } = useAppI18n()
const { getPublishCfg } = usePublishConfig()
const { updateSetting } = usePublishSettingStore()
const { kernelApi } = useSiyuanApi()

const pageId = ref("")
const saving = ref(false)
const docTitle = ref("")
const postIdMap = reactive<Record<string, string>>({})

interface PlatformRow {
  key: string
  name: string
  postId: string
}

const platformRows = ref<PlatformRow[]>([])

const targetTitle = computed(() =>
  t("preference.repair.target").replace("{title}", docTitle.value || pageId.value)
)

/** 文档 ID 变化时，读取该文档的发布记录并列出各平台当前值 */
async function handlePageIdChange() {
  platformRows.value = []
  docTitle.value = ""

  const id = pageId.value.trim()
  if (StrUtil.isEmptyString(id)) {
    return
  }

  try {
    // 文档标题（取不到就用 ID）
    try {
      const block = await kernelApi.getBlockByID(id)
      docTitle.value = Utils_emptyOrDefault(block?.content, id)
    } catch {
      docTitle.value = id
    }

    const publishCfg = await getPublishCfg()
    const setting = publishCfg.setting
    const postMeta = ObjectUtil.getProperty(setting, id, {})

    const rows: PlatformRow[] = []
    for (const item of publishCfg.dynamicConfigArray) {
      const cfg = ObjectUtil.getProperty(setting, item.platformKey, {})
      const posidKey = cfg?.posidKey
      if (StrUtil.isEmptyString(posidKey)) {
        continue
      }
      const current = ObjectUtil.getProperty(postMeta, posidKey, "")
      postIdMap[item.platformKey] = current
      rows.push({ key: item.platformKey, name: item.platformName ?? item.platformKey, postId: current })
    }
    platformRows.value = rows
  } catch (e) {
    logger.error("load publish records failed", e)
  }
}

/** 把填写的内容写回发布记录 */
async function handleSave() {
  const id = pageId.value.trim()
  if (StrUtil.isEmptyString(id)) {
    ElMessage.warning(t("preference.repair.noPageId"))
    return
  }

  saving.value = true
  try {
    const publishCfg = await getPublishCfg()
    const setting = publishCfg.setting
    const postMeta = ObjectUtil.getProperty(setting, id, {})

    for (const row of platformRows.value) {
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

    setting[id] = postMeta
    await updateSetting(setting)
    ElMessage.success(t("preference.repair.success"))
    emit("update:visible", false)
  } catch (e) {
    logger.error("save publish records failed", e)
    ElMessage.error(`${t("preference.repair.failure")}: ${e}`)
  } finally {
    saving.value = false
  }
}

/** 每次打开时重置 */
watch(
  () => props.visible,
  (open) => {
    if (open) {
      void handlePageIdChange()
    }
  }
)

function Utils_emptyOrDefault(value: unknown, fallback: string): string {
  return StrUtil.isEmptyString(value as string) ? fallback : String(value)
}
</script>

<style scoped lang="stylus">
@import "../../assets/variables.styl"

.syp-repair-desc
  margin 0 0 16px
  font-size 13px
  line-height 1.7
  color $syp-text-secondary

.syp-repair-field
  margin-bottom 8px

.syp-repair-label
  display block
  margin-bottom 6px
  font-size 13px
  font-weight 500
  color $syp-text-primary

.syp-repair-tips
  margin 6px 0 0
  font-size 12px
  line-height 1.6
  color $syp-text-tertiary

.syp-repair-alert
  margin 12px 0

.syp-repair-rows
  max-height 300px
  overflow-y auto
  padding-right 4px

.syp-repair-row
  display flex
  align-items center
  gap 12px
  margin-bottom 10px

.syp-repair-row__name
  flex 0 0 120px
  font-size 13px
  color $syp-text-secondary
  overflow hidden
  text-overflow ellipsis
  white-space nowrap

.syp-repair-hint
  margin 8px 0 0
  font-size 12px
  color $syp-text-tertiary
</style>