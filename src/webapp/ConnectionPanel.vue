<!--
            GNU GENERAL PUBLIC LICENSE
               Version 3, 29 June 2007

  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
  Everyone is permitted to copy and distribute verbatim copies
  of this license document, but changing it is not allowed.
-->

<!--
  扩展壳的「思源连接配置」面板（POC）。

  V2 的分区只有 account / picbed / preference / ai / about，没有 `/setting/siyuan` 的对应物；
  扩展必须能填写内核地址与 Token，因此本面板直接复用既有 store
  `useSiyuanSettingStore`（内部为 vueuse `useStorage`，浏览器环境落 `window.localStorage`），
  不自建存储。
-->
<template>
  <section class="syp-web-connection">
    <header class="syp-web-connection__head">
      <h1 class="syp-web-connection__title">思源连接配置</h1>
      <p class="syp-web-connection__desc">
        扩展弹窗里取不到宿主文档，V2 需要通过思源内核 API 读取文档与发布配置，请填写内核地址与 API Token。
      </p>
    </header>

    <label class="syp-web-connection__field">
      <span class="syp-web-connection__label">思源 API 地址</span>
      <input
        v-model="apiUrl"
        class="syp-web-connection__input"
        type="text"
        placeholder="http://127.0.0.1:6806"
        spellcheck="false"
      />
      <span class="syp-web-connection__hint">
        提示：store 每次读取都会用构建期默认值回写该地址（POC 已知限制，见 README-POC）。
      </span>
    </label>

    <label class="syp-web-connection__field">
      <span class="syp-web-connection__label">API Token</span>
      <input
        v-model="token"
        class="syp-web-connection__input"
        type="password"
        placeholder="思源 → 设置 → 关于 → API token"
        spellcheck="false"
      />
    </label>

    <div class="syp-web-connection__actions">
      <button type="button" class="syp-web-connection__btn is-primary" :disabled="saving" @click="save">保存</button>
      <button type="button" class="syp-web-connection__btn" @click="reload">重新读取</button>
    </div>

    <p class="syp-web-connection__status" role="status" aria-live="polite">{{ status }}</p>

    <dl class="syp-web-connection__meta">
      <dt>存储位置</dt>
      <dd>window.localStorage（浏览器环境）</dd>
      <dt>存储 key</dt>
      <dd><code>siyuan-cfg</code></dd>
      <dt>localStorage 回读</dt>
      <dd><code class="syp-web-connection__raw">{{ persisted }}</code></dd>
      <dt>store 中的 token</dt>
      <dd><code>{{ tokenPreview }}</code></dd>
    </dl>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue"
import { useSiyuanSettingStore } from "~/src/stores/useSiyuanSettingStore.ts"

/** 与 `useSiyuanSettingStore.getSiyuanSetting()` 内部的 storageKey 保持一致（未导出常量）。 */
const STORAGE_KEY = "siyuan-cfg"

const { getSiyuanSetting } = useSiyuanSettingStore()
// 直接复用既有 store；同一对象既是表单数据源也是落盘通道（vueuse useStorage）
const siyuanSetting = getSiyuanSetting()

const apiUrl = ref<string>(siyuanSetting.value?.apiUrl ?? "")
const token = ref<string>(siyuanSetting.value?.password ?? "")
const status = ref<string>("")
const persisted = ref<string>("(未读取)")
const saving = ref<boolean>(false)

const tokenPreview = computed(() => {
  const value = siyuanSetting.value?.password ?? ""
  if (!value) {
    return "(空)"
  }
  return value.length <= 8 ? value : `${value.slice(0, 4)}…${value.slice(-4)} (${value.length} 字符)`
})

const readPersisted = () => {
  try {
    persisted.value = window.localStorage.getItem(STORAGE_KEY) ?? "(空)"
  } catch (e) {
    persisted.value = `读取失败：${e instanceof Error ? e.message : String(e)}`
  }
}

const save = async () => {
  saving.value = true
  try {
    const nextApiUrl = apiUrl.value.trim()
    const nextToken = token.value

    siyuanSetting.value.apiUrl = nextApiUrl
    siyuanSetting.value.password = nextToken

    // useStorage 的落盘由 deep watch 驱动（flush: "pre"），等一拍再回读校验
    await nextTick()
    readPersisted()

    const hit = nextToken !== "" && persisted.value.includes(nextToken)
    if (hit) {
      status.value = `已保存到 localStorage（key: ${STORAGE_KEY}）`
    } else if (nextToken === "") {
      status.value = `已写入 store（Token 为空；key: ${STORAGE_KEY}）`
    } else {
      status.value = "已写入 store，但 localStorage 回读未命中 Token，请检查落盘通道"
    }
  } catch (e) {
    status.value = `保存失败：${e instanceof Error ? e.message : String(e)}`
  } finally {
    saving.value = false
  }
}

const reload = () => {
  try {
    const next = getSiyuanSetting()
    apiUrl.value = next.value?.apiUrl ?? ""
    token.value = next.value?.password ?? ""
    readPersisted()
    status.value = "已重新读取 store"
  } catch (e) {
    status.value = `读取失败：${e instanceof Error ? e.message : String(e)}`
  }
}

readPersisted()
</script>

<style scoped>
.syp-web-connection {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 520px;
}

.syp-web-connection__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2329;
}

.syp-web-connection__desc {
  margin: 6px 0 0;
  font-size: 12px;
  line-height: 1.6;
  color: #646a73;
}

.syp-web-connection__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.syp-web-connection__label {
  font-size: 12px;
  font-weight: 600;
  color: #1f2329;
}

.syp-web-connection__hint {
  font-size: 11px;
  line-height: 1.5;
  color: #a1a5ad;
}

.syp-web-connection__input {
  height: 30px;
  padding: 0 8px;
  border: 1px solid #d0d3d6;
  border-radius: 6px;
  font-size: 12px;
  color: #1f2329;
  background: #ffffff;
}

.syp-web-connection__input:focus {
  outline: none;
  border-color: #1677ff;
}

.syp-web-connection__actions {
  display: flex;
  gap: 8px;
}

.syp-web-connection__btn {
  height: 30px;
  padding: 0 14px;
  border: 1px solid #d0d3d6;
  border-radius: 6px;
  background: #ffffff;
  color: #1f2329;
  font-size: 12px;
  cursor: pointer;
}

.syp-web-connection__btn.is-primary {
  border-color: #1677ff;
  background: #1677ff;
  color: #ffffff;
}

.syp-web-connection__btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.syp-web-connection__status {
  margin: 0;
  min-height: 18px;
  font-size: 12px;
  color: #1677ff;
}

.syp-web-connection__meta {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 4px 10px;
  margin: 0;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #fafbfc;
  font-size: 11px;
}

.syp-web-connection__meta dt {
  color: #646a73;
}

.syp-web-connection__meta dd {
  margin: 0;
  word-break: break-all;
}

.syp-web-connection__raw {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
</style>
