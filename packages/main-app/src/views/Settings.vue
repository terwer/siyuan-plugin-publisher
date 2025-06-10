<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<template>
  <div class="settings">
    <h1>设置</h1>
    <TgCard class="settings-card">
      <TgTabs v-model="activeTab" :items="tabItems">
        <template #platforms>
          <PlatformList
            :platforms="platformAdapters"
            @platform-toggle="handlePlatformToggle"
            @config-update="handleConfigUpdate"
            @test-connection="handleTestConnection"
          />
        </template>
        <template #plugins>
          <PluginList
            :plugins="plugins"
            @plugin-toggle="handlePluginToggle"
            @configure="handlePluginConfigure"
            @uninstall="handlePluginUninstall"
          />
        </template>
        <template #global>
          <TgSpace direction="vertical" size="large">
            <TgCard title="全局设置">
              <TgForm ref="formRef" v-model="formData" :config="globalFormConfig" @validate="handleValidate" />
            </TgCard>
            <TgCard title="配置管理">
              <TgSpace>
                <TgButton @click="handleExportConfig">导出配置</TgButton>
                <TgButton @click="handleImportConfig">导入配置</TgButton>
                <input ref="importInput" type="file" accept=".json" style="display: none" @change="handleFileChange" />
              </TgSpace>
            </TgCard>
            <div class="form-actions">
              <TgButton type="primary" @click="handleSubmit" :loading="submitting">
                {{ submitting ? "提交中..." : "保存设置" }}
              </TgButton>
            </div>
          </TgSpace>
        </template>
      </TgTabs>
    </TgCard>
    <Teleport to="body">
      <TgMessage
        v-if="message.visible"
        :type="message.type"
        :message="message.content"
        :duration="3000"
        :onClose="() => (message.visible = false)"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue"
import { TgTabs, TgForm, TgButton, TgInput, TgMessage, TgCard, TgSpace } from "@terwer/ui"
import type { FormConfig, FormInstance } from "@terwer/ui"
import { usePluginSystem } from "../composables/usePluginSystem"
import { usePublisher } from "../composables/usePublisher"
import { useConfig } from "../composables/useConfig"
import PlatformList from "../components/PlatformList.vue"
import PluginList from "../components/PluginList.vue"
import type { PlatformAdapter, PlatformConfig, Plugin } from "@siyuan-publisher/common"

const tabItems = [
  { key: "platforms", label: "平台配置" },
  { key: "plugins", label: "插件管理" },
  { key: "global", label: "全局设置" },
]
const activeTab = ref(tabItems[0].key)

// 表单引用
const formRef = ref<FormInstance>()

// 提交状态
const submitting = ref(false)

// 消息提示
const message = ref({
  visible: false,
  type: "info" as "success" | "error" | "warning" | "info",
  content: "",
})

// 显示消息提示
const showMessage = (type: "success" | "error" | "warning" | "info", content: string) => {
  message.value = {
    visible: true,
    type,
    content,
  }
}

// 配置管理
const { config: globalConfig, exportConfig, importConfig } = useConfig()

// 确保全局配置有默认值
const formData = ref({
  name: "",
  theme: "light",
  language: "zh_CN",
  autoSave: true,
  defaultPlatform: "",
  publishOptions: {
    defaultStatus: "draft",
    defaultCategories: "",
    defaultTags: "",
  },
})

// 监听 globalConfig 变化
watch(
  () => globalConfig.value,
  (newVal) => {
    if (newVal) {
      formData.value = { ...newVal }
    }
  },
  { immediate: true },
)

// 监听表单数据变化
watch(
  () => formData.value,
  (newVal) => {
    globalConfig.value = { ...newVal }
  },
  { deep: true },
)

// 导入文件输入引用
const importInput = ref<HTMLInputElement | null>(null)

// 处理表单验证结果
const handleValidate = (errors: Record<string, string[]>) => {
  console.log("表单验证结果：", errors)
  if (Object.keys(errors).length === 0) {
    console.log("表单验证通过")
    // 这里可以处理表单验证通过后的逻辑
  } else {
    console.log("表单验证失败")
    // 这里可以处理表单验证失败后的逻辑
  }
}

// 处理表单提交
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    submitting.value = true
    // 验证表单
    const isValid = await formRef.value.validate()
    if (!isValid) {
      showMessage("error", "表单验证失败，请检查输入")
      return
    }

    // 配置已经通过 watch 自动保存到 localStorage
    showMessage("success", "设置保存成功")
  } catch (error) {
    console.error("提交失败：", error)
    showMessage("error", "设置保存失败，请重试")
  } finally {
    submitting.value = false
  }
}

// 处理导出配置
const handleExportConfig = () => {
  exportConfig()
  showMessage("success", "配置导出成功")
}

// 处理导入配置
const handleImportConfig = () => {
  importInput.value?.click()
}

// 处理文件选择
const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = importConfig(e.target?.result as string)
    if (result.success) {
      showMessage("success", "配置导入成功")
    } else {
      showMessage("error", `配置导入失败：${result.error}`)
    }
  }
  reader.readAsText(file)
}

// 全局表单配置
const globalFormConfig: FormConfig = {
  layout: "vertical",
  groups: [
    {
      title: "基本设置",
      items: [
        {
          name: "name",
          label: "名称",
          type: "input",
          required: true,
          rules: [
            {
              required: true,
              message: "请输入名称",
            },
            {
              min: 2,
              max: 20,
              message: "名称长度必须在 2-20 个字符之间",
            },
          ],
        },
        {
          name: "theme",
          label: "主题",
          type: "select",
          options: () => [
            { label: "浅色", value: "light" },
            { label: "深色", value: "dark" },
          ],
        },
        {
          name: "language",
          label: "语言",
          type: "select",
          options: () => [
            { label: "简体中文", value: "zh_CN" },
            { label: "English", value: "en_US" },
          ],
        },
        {
          name: "autoSave",
          label: "自动保存",
          type: "switch",
        },
      ],
    },
    {
      title: "发布设置",
      items: [
        {
          name: "defaultPlatform",
          label: "默认发布平台",
          type: "select",
          options: () => {
            const adapters = platformAdapters.value || []
            return adapters.map((platform) => ({
              label: platform.name,
              value: platform.id,
            }))
          },
        },
        {
          name: "publishOptions.defaultStatus",
          label: "默认发布状态",
          type: "select",
          options: () => [
            { label: "草稿", value: "draft" },
            { label: "已发布", value: "published" },
            { label: "定时发布", value: "scheduled" },
          ],
        },
        {
          name: "publishOptions.defaultCategories",
          label: "默认分类",
          type: "input",
          placeholder: "多个分类用逗号分隔",
        },
        {
          name: "publishOptions.defaultTags",
          label: "默认标签",
          type: "input",
          placeholder: "多个标签用逗号分隔",
        },
      ],
    },
  ],
}

// 插件系统
const { plugins, platformAdapters, getPluginConfig, loadExternalPlugin } = usePluginSystem()

// 发布服务
const { publish: publishService } = usePublisher()

// 处理平台开关
const handlePlatformToggle = async (platform: PlatformAdapter) => {
  try {
    if (platform.enabled) {
      await platform.connect()
    } else {
      await platform.disconnect()
    }
    showMessage("success", `${platform.name} ${platform.enabled ? "已启用" : "已禁用"}`)
  } catch (error) {
    platform.enabled = !platform.enabled
    showMessage("error", `${platform.name} ${platform.enabled ? "启用" : "禁用"}失败`)
  }
}

// 处理配置更新
const handleConfigUpdate = async (platform: PlatformAdapter, config: PlatformConfig) => {
  try {
    await platform.updateConfig(config)
    showMessage("success", `${platform.name} 配置已更新`)
  } catch (error) {
    showMessage("error", `${platform.name} 配置更新失败`)
  }
}

// 处理连接测试
const handleTestConnection = async (platform: PlatformAdapter) => {
  try {
    const result = await publishService.testConnection(platform.id, platform.getConfig() as PlatformConfig)
    if (result.success) {
      showMessage("success", `${platform.name} 连接测试成功`)
    } else {
      showMessage("error", `${platform.name} 连接测试失败：${result.error}`)
    }
  } catch (error) {
    showMessage("error", `${platform.name} 连接测试失败`)
  }
}

// 处理插件开关
const handlePluginToggle = async (plugin: Plugin) => {
  try {
    if (plugin.enabled) {
      await plugin.enable()
    } else {
      await plugin.disable()
    }
    showMessage("success", `${plugin.name} ${plugin.enabled ? "已启用" : "已禁用"}`)
  } catch (error) {
    plugin.enabled = !plugin.enabled
    showMessage("error", `${plugin.name} ${plugin.enabled ? "启用" : "禁用"}失败`)
  }
}

// 处理插件配置
const handlePluginConfigure = (plugin: Plugin) => {
  // TODO: 实现插件配置界面
  showMessage("info", "插件配置功能开发中")
}

// 处理插件卸载
const handlePluginUninstall = async (plugin: Plugin) => {
  try {
    await plugin.uninstall()
    showMessage("success", `${plugin.name} 已卸载`)
  } catch (error) {
    showMessage("error", `${plugin.name} 卸载失败`)
  }
}
</script>

<style lang="stylus">
.settings
  padding $tg-spacing-lg

  h1
    margin-bottom $tg-spacing-xl
    text-align center
    color var(--tg-color-text-1)

  .settings-card
    margin-top $tg-spacing-lg

  .form-actions
    display flex
    justify-content flex-end

    .tg-btn
      min-width 100px
</style>
