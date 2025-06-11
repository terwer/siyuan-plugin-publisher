<template>
  <div class="tg-test-dialog">
    <h2>Dialog 对话框</h2>

    <!-- 基础用法 -->
    <div class="tg-test-section">
      <h3>基础用法</h3>
      <div class="tg-test-content">
        <TgButton @click="basicVisible = true">打开对话框</TgButton>
        <TgDialog v-model="basicVisible" title="提示">
          <span>这是一段内容</span>
          <template #footer>
            <span class="dialog-footer">
              <TgButton @click="basicVisible = false">取消</TgButton>
              <TgButton type="primary" @click="basicVisible = false">确定</TgButton>
            </span>
          </template>
        </TgDialog>
      </div>
    </div>

    <!-- 自定义内容 -->
    <div class="tg-test-section">
      <h3>自定义内容</h3>
      <div class="tg-test-content">
        <TgButton @click="customVisible = true">自定义内容</TgButton>
        <TgDialog v-model="customVisible" title="自定义内容">
          <template #header>
            <div class="custom-header">
              <h3>自定义标题</h3>
            </div>
          </template>
          <div class="custom-content">
            <p>这是自定义内容</p>
          </div>
          <template #footer>
            <div class="custom-footer">
              <TgButton @click="customVisible = false">取消</TgButton>
              <TgButton type="primary" @click="customVisible = false">确定</TgButton>
            </div>
          </template>
        </TgDialog>
      </div>
    </div>

    <!-- 不同尺寸 -->
    <div class="tg-test-section">
      <h3>不同尺寸</h3>
      <div class="tg-test-content">
        <div class="tg-test-buttons">
          <TgButton @click="smallVisible = true">小型对话框</TgButton>
          <TgButton @click="defaultVisible = true">默认对话框</TgButton>
          <TgButton @click="largeVisible = true">大型对话框</TgButton>
        </div>

        <TgDialog v-model="smallVisible" title="小型对话框" size="small">
          <span>这是一个小型对话框</span>
        </TgDialog>

        <TgDialog v-model="defaultVisible" title="默认对话框" size="default">
          <span>这是一个默认对话框</span>
        </TgDialog>

        <TgDialog v-model="largeVisible" title="大型对话框" size="large">
          <span>这是一个大型对话框</span>
        </TgDialog>
      </div>
    </div>

    <!-- 居中布局 -->
    <div class="tg-test-section">
      <h3>居中布局</h3>
      <div class="tg-test-content">
        <TgButton @click="centerVisible = true">居中对话框</TgButton>
        <TgDialog v-model="centerVisible" title="居中对话框" center>
          <span>这是一个居中显示的对话框</span>
        </TgDialog>
      </div>
    </div>

    <!-- 关闭前确认 -->
    <div class="tg-test-section">
      <h3>关闭前确认</h3>
      <div class="tg-test-content">
        <TgButton @click="confirmVisible = true">关闭前确认</TgButton>
        <TgDialog
          v-model="confirmVisible"
          title="提示"
          :before-close="handleClose"
        >
          <span>这是一段内容</span>
        </TgDialog>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { TgButton, TgDialog } from "../index"

// 基础用法
const basicVisible = ref(false)

// 自定义内容
const customVisible = ref(false)

// 不同尺寸
const smallVisible = ref(false)
const defaultVisible = ref(false)
const largeVisible = ref(false)

// 居中布局
const centerVisible = ref(false)

// 关闭前确认
const confirmVisible = ref(false)

const handleClose = (done: () => void) => {
  if (confirm("确定要关闭吗？")) {
    done()
  }
}
</script>

<style lang="stylus" scoped>
.tg-test-dialog
  padding $tg-spacing-lg

  .tg-test-section
    margin-bottom $tg-spacing-xl

    h3
      margin-bottom $tg-spacing-md
      color var(--tg-color-text-1)
      font-size $tg-font-size-lg

  .tg-test-content
    padding $tg-spacing-lg
    background-color var(--tg-color-bg)
    border-radius $tg-border-radius-lg
    border 1px solid var(--tg-color-border)

  .tg-test-buttons
    display flex
    gap $tg-spacing-md

  .dialog-footer
    display flex
    justify-content flex-end
    gap $tg-spacing-md

  .custom-header
    h3
      margin 0
      color var(--tg-color-text-1)

  .custom-content
    padding $tg-spacing-md 0

  .custom-footer
    display flex
    justify-content flex-end
    gap $tg-spacing-md
</style> 