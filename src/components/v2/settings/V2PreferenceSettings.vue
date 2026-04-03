<template>
  <section class="syp-settings-page">
    <div class="syp-settings-page__header">
      <div>
        <div class="syp-settings-page__eyebrow">偏好设置</div>
        <h2 class="syp-settings-page__title">偏好设置</h2>
        <p class="syp-settings-page__desc">
          这里的开关会直接写入当前偏好配置。除“使用新版 UI”外，其余设置会立即生效。
        </p>
      </div>
    </div>

    <div class="syp-settings-group-list">
      <article v-for="group in visibleGroups" :key="group.title" class="syp-settings-group">
        <div class="syp-settings-group__title">{{ group.title }}</div>
        <div class="syp-settings-group__desc">{{ group.description }}</div>

        <div class="syp-settings-form-list">
          <div v-for="item in group.items" :key="item.key" class="syp-settings-form-row">
            <div class="syp-settings-form-main">
              <div class="syp-settings-form-label">{{ item.label }}</div>
              <div class="syp-settings-form-desc">{{ item.description }}</div>
            </div>

            <div class="syp-settings-form-control">
              <span class="syp-settings-status-text">{{ getBooleanValue(item.key) ? "开启" : "关闭" }}</span>
              <label class="syp-toggle" :title="getBooleanValue(item.key) ? '点击关闭' : '点击开启'">
                <input
                  type="checkbox"
                  :checked="getBooleanValue(item.key)"
                  :aria-label="item.label"
                  @change="handleToggle(item.key, $event)"
                />
                <span class="syp-toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { WarnTriangleFilled } from "@element-plus/icons-vue"
import { ElMessageBox } from "element-plus"
import { computed, markRaw } from "vue"
import { StrUtil } from "zhi-common"
import { useSiyuanDevice } from "~/src/composables/useSiyuanDevice.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { usePreferenceSettingStore } from "~/src/stores/usePreferenceSettingStore.ts"
import { getSiyuanWidgetId } from "~/src/utils/siyuanUtils.ts"

type PreferenceKey =
  | "fixTitle"
  | "keepTitle"
  | "removeFirstH1"
  | "removeMdWidgetTag"
  | "showDocQuickMenu"
  | "showQuickMenu"
  | "showSingleMenu"
  | "showBatchMenu"
  | "showAIMenu"
  | "showExtendMenu"
  | "showArticleManageMenu"
  | "ignoreBlockRef"
  | "allowChangeSlug"
  | "useV2UI"

interface PreferenceItem {
  key: PreferenceKey
  label: string
  description: string
  pluginOnly?: boolean
}

interface PreferenceGroup {
  title: string
  description: string
  items: PreferenceItem[]
}

const { t } = useVueI18n()
const { getPublishPreferenceSetting } = usePreferenceSettingStore()
const { isInSiyuanWin, isInSiyuanWidget } = useSiyuanDevice()
const preferenceForm = getPublishPreferenceSetting()

const isSiyuanPlugin = computed(() => {
  return isInSiyuanWin() || (isInSiyuanWidget() && StrUtil.isEmptyString(getSiyuanWidgetId()))
})

const groups: PreferenceGroup[] = [
  {
    title: "内容处理",
    description: "控制发布前对文档标题和内容的基础处理方式。",
    items: [
      {
        key: "fixTitle",
        label: "修正标题编号",
        description: "发布前移除标题中的自动编号和冗余后缀。",
      },
      {
        key: "keepTitle",
        label: "保留原标题",
        description: "尽量保留文档原始标题，不额外覆盖标题内容。",
      },
      {
        key: "removeFirstH1",
        label: "移除首个 H1",
        description: "导出正文时去掉首个一级标题，避免重复标题。",
      },
      {
        key: "removeMdWidgetTag",
        label: "移除挂件标记",
        description: "发布前移除 Markdown 中的挂件标记内容。",
      },
      {
        key: "ignoreBlockRef",
        label: "忽略块引用",
        description: "发布时忽略块引用，减少跨文档依赖内容进入正文。",
        pluginOnly: true,
      },
      {
        key: "allowChangeSlug",
        label: "允许修改别名",
        description: "开启后允许修改文章别名。首次开启时会弹出确认提醒。",
        pluginOnly: true,
      },
    ],
  },
  {
    title: "菜单入口",
    description: "控制思源插件环境中的菜单入口展示。",
    items: [
      {
        key: "showDocQuickMenu",
        label: "文档快捷菜单",
        description: "在文档上下文中展示快捷发布入口。",
        pluginOnly: true,
      },
      {
        key: "showQuickMenu",
        label: "顶栏快捷发布",
        description: "在顶栏菜单中展示快速发布入口。",
        pluginOnly: true,
      },
      {
        key: "showSingleMenu",
        label: "单篇发布菜单",
        description: "在顶栏菜单中展示单篇发布入口。",
        pluginOnly: true,
      },
      {
        key: "showBatchMenu",
        label: "批量发布菜单",
        description: "在顶栏菜单中展示批量发布入口。",
        pluginOnly: true,
      },
      {
        key: "showAIMenu",
        label: "AI 菜单",
        description: "在顶栏菜单中展示 AI 工具入口。",
        pluginOnly: true,
      },
      {
        key: "showExtendMenu",
        label: "扩展菜单",
        description: "在顶栏菜单中展示扩展功能入口。",
        pluginOnly: true,
      },
      {
        key: "showArticleManageMenu",
        label: "文章管理菜单",
        description: "在插件菜单中展示文章管理入口。",
        pluginOnly: true,
      },
    ],
  },
  {
    title: "实验功能",
    description: "实验功能会影响整体界面行为，请谨慎切换。",
    items: [
      {
        key: "useV2UI",
        label: "使用新版 UI",
        description: "开启后将优先使用 V2 界面。重启插件后会完全生效。",
        pluginOnly: true,
      },
    ],
  },
]

const visibleGroups = computed(() => {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.pluginOnly || isSiyuanPlugin.value),
    }))
    .filter((group) => group.items.length > 0)
})

function getBooleanValue(key: PreferenceKey) {
  return preferenceForm.value[key] === true
}

async function handleToggle(key: PreferenceKey, event: Event) {
  const target = event.target as HTMLInputElement | null
  const nextValue = target?.checked === true

  if (key === "allowChangeSlug" && nextValue && preferenceForm.value.allowChangeSlug !== true) {
    const confirmed = await confirmAllowChangeSlug()
    if (!confirmed) {
      if (target) {
        target.checked = false
      }
      return
    }
  }

  preferenceForm.value[key] = nextValue as never
}

async function confirmAllowChangeSlug() {
  try {
    const result = await ElMessageBox.confirm(t("preference.setting.allowChangeSlug.tips"), {
      type: "error",
      icon: markRaw(WarnTriangleFilled),
      confirmButtonText: t("main.opt.ok"),
      cancelButtonText: t("main.opt.cancel"),
    } as any)

    return result === "confirm"
  } catch {
    return false
  }
}
</script>
