<!--
 * @Author: 2nu
 * @Date: 2025-02-19 14:00:00
 * @LastEditors: 2nu
 * @LastEditTime: 2025-02-19 14:00:00
 * @Description: SettingPanel 组件测试
-->

<script setup lang="ts">
import { ref } from 'vue'
import { SettingPanel } from '../index'

const title = ref('测试标题')
const description = ref('测试描述')
const required = ref(true)
</script>

<template>
  <div class="test-section">
    <h3>基础用法</h3>
    <SettingPanel title="基础标题">
      <div>基础内容</div>
    </SettingPanel>
  </div>

  <div class="test-section">
    <h3>带描述</h3>
    <SettingPanel title="带描述的标题" description="这是一段描述文字">
      <div>带描述的内容</div>
    </SettingPanel>
  </div>

  <div class="test-section">
    <h3>必填项</h3>
    <SettingPanel title="必填项" required>
      <div>必填项内容</div>
    </SettingPanel>
  </div>

  <div class="test-section">
    <h3>动态属性</h3>
    <SettingPanel :title="title" :description="description" :required="required">
      <div>动态属性内容</div>
    </SettingPanel>
  </div>
</template>

<style>
.test-section {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.test-section h3 {
  margin-bottom: 10px;
  color: #666;
}
</style>
