<template>
  <div class="settings">
    <h1>设置</h1>
    <div class="content">
      <TgTabs v-model="activeTab" :items="tabItems">
        <template #platforms>
          <div>平台配置</div>
        </template>
        <template #plugins>
          <div>插件管理</div>
        </template>
        <template #global>
          <TgForm ref="formRef" v-model="globalConfig" :config="globalFormConfig" @validate="handleValidate" />
          <div class="form-values">
            <h3>当前表单值：</h3>
            <div class="form-values-content">
              <TgInput type="textarea" :modelValue="JSON.stringify(globalConfig, null, 2)" readonly :rows="4" />
            </div>
          </div>
          <div class="form-actions">
            <TgButton type="primary" @click="handleSubmit" :loading="submitting">
              {{ submitting ? "提交中..." : "保存设置" }}
            </TgButton>
          </div>
        </template>
      </TgTabs>
    </div>
    <TgMessage
      v-if="message.visible"
      :type="message.type"
      :message="message.content"
      :duration="3000"
      @close="message.visible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { TgTabs, TgForm, TgButton, TgInput, TgMessage } from "@terwer/ui"
import type { FormConfig, FormInstance } from "@terwer/ui"

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

// 全局配置
const globalConfig = ref({
  name: "",
})

// 监听表单值变化
watch(
  () => globalConfig.value,
  (newVal) => {
    console.log("表单值发生变化：", newVal)
    // 这里可以处理表单值变化后的逻辑
    // 例如：保存到本地存储、发送到服务器等
  },
  { deep: true },
)

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

    // 模拟提交
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("提交成功：", globalConfig.value)
    showMessage("success", "设置保存成功")
  } catch (error) {
    console.error("提交失败：", error)
    showMessage("error", "设置保存失败，请重试")
  } finally {
    submitting.value = false
  }
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
      ],
    },
  ],
}
</script>

<style lang="stylus">
.settings
  padding 20px

  .content
    margin-top 20px

  .form-values
    margin-top 20px
    padding 16px
    background-color var(--tg-color-bg-2)
    border-radius 4px

    h3
      margin 0 0 8px 0
      font-size 14px
      color var(--tg-color-text-2)

    .form-values-content
      :deep(.tg-input)
        font-family monospace
        font-size 12px
        color var(--tg-color-text-1)

  .form-actions
    margin-top 20px
    display flex
    justify-content flex-end

    .tg-btn
      min-width 100px
</style>
