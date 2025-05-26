<!--
 * @Author: 2nu
 * @Date: 2025-02-19 14:00:00
 * @LastEditors: 2nu
 * @LastEditTime: 2025-02-19 14:00:00
 * @Description: SettingPanel 组件测试
-->

<script setup lang="ts">
import { ref } from "vue"
import SettingPanel from "../components/navigation/SettingPanel.vue"
import SettingGroup from "../components/navigation/SettingGroup.vue"
import Button from "../components/form/Button.vue"
import type { SettingItem } from "../types"
import "../styles/navigation/setting-panel.styl"
import "../styles/navigation/setting-group.styl"

// 基础设置
const basicSettings = ref<SettingItem[]>([
  {
    type: "input",
    label: "名称",
    value: "",
    placeholder: "请输入名称",
  },
  {
    type: "select",
    label: "类型",
    value: "type1",
    options: [
      { label: "类型1", value: "type1" },
      { label: "类型2", value: "type2" },
    ],
  },
])

// 分组设置
const groupedSettings = ref<SettingItem[]>([
  {
    type: "group",
    label: "通知设置",
    items: [
      {
        type: "switch",
        label: "邮件通知",
        value: true,
      },
      {
        type: "switch",
        label: "系统通知",
        value: false,
      },
      {
        type: "select",
        label: "通知频率",
        value: "daily",
        options: [
          { label: "每天", value: "daily" },
          { label: "每周", value: "weekly" },
          { label: "每月", value: "monthly" },
        ],
      },
    ],
  },
])

// 复杂表单设置
const complexSettings = ref<SettingItem[]>([
  {
    type: "input",
    label: "标题",
    value: "",
    placeholder: "请输入标题",
  },
  {
    type: "textarea",
    label: "描述",
    value: "",
    placeholder: "请输入描述",
  },
  {
    type: "number",
    label: "数量",
    value: 0,
    placeholder: "请输入数量",
  },
])

// 禁用状态设置
const disabledSettings = ref<SettingItem[]>([
  {
    type: "input",
    label: "禁用输入框",
    value: "禁用状态",
    disabled: true,
  },
  {
    type: "switch",
    label: "禁用开关",
    value: true,
    disabled: true,
  },
  {
    type: "select",
    label: "禁用选择器",
    value: "option1",
    options: [
      { label: "选项1", value: "option1" },
      { label: "选项2", value: "option2" },
    ],
    disabled: true,
  },
])

// 空状态设置
const emptySettings = ref<SettingItem[]>([])

// 多分组设置
const multiGroupSettings = ref<SettingItem[]>([
  {
    type: "group",
    label: "分组1",
    items: [
      {
        type: "input",
        label: "输入框1",
        value: "",
      },
      {
        type: "switch",
        label: "开关1",
        value: true,
      },
    ],
  },
  {
    type: "group",
    label: "分组2",
    items: [
      {
        type: "input",
        label: "输入框2",
        value: "",
      },
      {
        type: "switch",
        label: "开关2",
        value: false,
      },
    ],
  },
])

// 嵌套分组设置
const nestedGroupSettings = ref<SettingItem[]>([
  {
    type: "group",
    label: "外层分组",
    items: [
      {
        type: "group",
        label: "内层分组1",
        items: [
          {
            type: "input",
            label: "输入框1",
            value: "",
          },
          {
            type: "switch",
            label: "开关1",
            value: true,
          },
        ],
      },
      {
        type: "group",
        label: "内层分组2",
        items: [
          {
            type: "input",
            label: "输入框2",
            value: "",
          },
          {
            type: "switch",
            label: "开关2",
            value: false,
          },
        ],
      },
    ],
  },
])

// 复杂嵌套分组设置
const complexNestedSettings = ref<SettingItem[]>([
  {
    type: "group",
    label: "发布设置",
    items: [
      {
        type: "input",
        label: "发布标题",
        value: "",
        placeholder: "请输入发布标题",
      },
      {
        type: "textarea",
        label: "发布描述",
        value: "",
        placeholder: "请输入发布描述",
      },
      {
        type: "group",
        label: "高级设置",
        items: [
          {
            type: "switch",
            label: "自动发布",
            value: false,
          },
          {
            type: "select",
            label: "发布频率",
            value: "daily",
            options: [
              { label: "每天", value: "daily" },
              { label: "每周", value: "weekly" },
              { label: "每月", value: "monthly" },
            ],
          },
        ],
      },
    ],
  },
  {
    type: "group",
    label: "同步设置",
    items: [
      {
        type: "switch",
        label: "启用同步",
        value: true,
      },
      {
        type: "group",
        label: "同步选项",
        items: [
          {
            type: "input",
            label: "同步地址",
            value: "",
            placeholder: "请输入同步地址",
          },
          {
            type: "number",
            label: "同步间隔",
            value: 30,
            placeholder: "请输入同步间隔（分钟）",
          },
        ],
      },
    ],
  },
])

// 页脚设置
const footerSettings = ref<SettingItem[]>([
  {
    type: "switch",
    label: "自动保存",
    value: true,
  },
  {
    type: "select",
    label: "保存频率",
    value: "5min",
    options: [
      { label: "5分钟", value: "5min" },
      { label: "10分钟", value: "10min" },
      { label: "30分钟", value: "30min" },
    ],
  },
])

// 当前设置状态
const currentSettings = ref({
  basic: basicSettings.value,
  grouped: groupedSettings.value,
  complex: complexSettings.value,
  disabled: disabledSettings.value,
  empty: emptySettings.value,
  multiGroup: multiGroupSettings.value,
  nestedGroup: nestedGroupSettings.value,
  complexNested: complexNestedSettings.value,
  footer: footerSettings.value,
})

// 显示当前设置状态
const showCurrentSettings = ref(false)

// 处理保存事件
const handleSave = () => {
  console.log("保存设置", currentSettings.value)
}

// 处理取消事件
const handleCancel = () => {
  console.log("取消设置")
}
</script>

<template>
  <div id="publisherApp" class="pt-test-page">
    <h1 class="pt-page-title">设置面板测试</h1>

    <!-- 基础设置 -->
    <section class="pt-test-section">
      <h2 class="pt-section-title">基础设置</h2>
      <SettingPanel>
        <SettingGroup :setting-group="{ title: '基础设置', items: basicSettings }" />
      </SettingPanel>
    </section>

    <!-- 分组设置 -->
    <section class="pt-test-section">
      <h2 class="pt-section-title">分组设置</h2>
      <SettingPanel>
        <SettingGroup :setting-group="{ title: '分组设置', items: groupedSettings }" />
      </SettingPanel>
    </section>

    <!-- 复杂表单设置 -->
    <section class="pt-test-section">
      <h2 class="pt-section-title">复杂表单设置</h2>
      <SettingPanel>
        <SettingGroup :setting-group="{ title: '复杂表单', items: complexSettings }" />
      </SettingPanel>
    </section>

    <!-- 禁用状态设置 -->
    <section class="pt-test-section">
      <h2 class="pt-section-title">禁用状态设置</h2>
      <SettingPanel>
        <SettingGroup :setting-group="{ title: '禁用状态', items: disabledSettings }" />
      </SettingPanel>
    </section>

    <!-- 空状态设置 -->
    <section class="pt-test-section">
      <h2 class="pt-section-title">空状态设置</h2>
      <SettingPanel>
        <SettingGroup :setting-group="{ title: '空状态', items: emptySettings }" />
      </SettingPanel>
    </section>

    <!-- 多分组设置 -->
    <section class="pt-test-section">
      <h2 class="pt-section-title">多分组设置</h2>
      <SettingPanel>
        <SettingGroup :setting-group="{ title: '多分组', items: multiGroupSettings }" />
      </SettingPanel>
    </section>

    <!-- 嵌套分组设置 -->
    <section class="pt-test-section">
      <h2 class="pt-section-title">嵌套分组设置</h2>
      <SettingPanel>
        <SettingGroup :setting-group="{ title: '嵌套分组', items: nestedGroupSettings }" />
      </SettingPanel>
    </section>

    <!-- 复杂嵌套分组设置 -->
    <section class="pt-test-section">
      <h2 class="pt-section-title">复杂嵌套分组设置</h2>
      <SettingPanel>
        <SettingGroup :setting-group="{ title: '复杂嵌套', items: complexNestedSettings }" />
      </SettingPanel>
    </section>

    <!-- 页脚设置 -->
    <section class="pt-test-section">
      <h2 class="pt-section-title">页脚设置</h2>
      <SettingPanel @save="handleSave" @cancel="handleCancel">
        <SettingGroup :setting-group="{ title: '页脚设置', items: footerSettings }" />
      </SettingPanel>
    </section>

    <!-- 显示当前设置状态 -->
    <section class="pt-test-section">
      <button class="pt-toggle-button" @click="showCurrentSettings = !showCurrentSettings">
        {{ showCurrentSettings ? "隐藏" : "显示" }}当前设置状态
      </button>
      <pre v-if="showCurrentSettings" class="pt-settings-state">{{ JSON.stringify(currentSettings, null, 2) }}</pre>
    </section>
  </div>
</template>
