# 文章管理「平台显示已删除」根因分析（issue #2045 归类）

## 症状
- V1 / V2 文章管理（仪表盘）展开某篇文章后，`平台` 一栏显示 `× [已删除]`（图标图标为 `iconOTRemove`，名称回退为 `articleManage.platformDeleted`）。
- 用户报告：Halo 平台发布后仪表盘显示「已删除」，点击提示「未找到 post_id」，预览地址错误（issue #2045）。
- 本机复现：`v2.0测试专用`（`20260402213507-plv0e54`）展开详情显示两个 `[已删除]`。

## 渲染机制（已确认）
`src/components/common/ArticleManageList.vue`（142-165 行）：
```html
{{ t("articleManage.extend.platform") }}:
<span v-if="props.row.yamlCount > 0">
  <span v-for="(value, key) in props.row.yamlAttrs">
    <a @click="dispatchPlatform('platform-single', props.row, key.toString())">
      {{ props.row.dynCfgs[key]?.platformName ?? t("articleManage.platformDeleted") }}
    </a>
  </span>
</span>
```
平台显示依赖 `dynCfgs[key]`（`DynamicConfig`），取不到就回退 `platformDeleted`（「已删除」）。

`dynCfgs` 由 `src/composables/useArticleManage.ts` 的 `enrichYaml` 填充：
```ts
const newKey = key.replace("-yaml", "").replace("custom-", "").replace("-", "_")
dynCfgs[newKey] = getDynCfgByKey(dynamicConfigArray, newKey)
```
`getDynCfgByKey`（`src/platforms/dynamicConfig.ts:496`）做**平台 config.platformKey 的字符串全等比较**。

## 根因（已确认）
文档块属性（`custom-*-yaml`）的 key 与 `DynamicConfig.platformKey` **大小写/形态不一致**，导致 `getDynCfgByKey` 返回 `null`。

本机实测数据：
- 文档属性（旧版插件写入，全小写）：
  - `custom-fs-localsystem-yaml`
  - `custom-custom-yuqueweb-yaml`
- 运行时 `dynamic-config.totalCfg` 的 `platformKey`（经 `sy-p-plus-cfg.json` 确认，27 项）：
  - `fs_LocalSystem`（本地系统）
  - `custom_Yuqueweb`（语雀网页版）
  - `common_Halo`（Halo29）等

`enrichYaml` 由 `custom-fs-localsystem-yaml` 推导 `newKey = fs_localsystem`（保留小写），与 `fs_LocalSystem` 不相等 → `getDynCfgByKey` 返回 `null` → 显示「已删除」。

## 写/读两侧 key 口径
- 写（发布，`src/composables/usePublish.ts:237 / 469`）：`getDynYamlKey(platformKey)` = `"custom-" + platformKey.replace(/_/g,"-") + "-yaml"`。`platformKey` 为混合大小写（如 `fs_LocalSystem`），故**当前代码新发布写入的是混合大小写 key**（`custom-fs-LocalSystem-yaml`）。
- 读（`enrichYaml`）：对混合大小写 key，`newKey = fs_LocalSystem`，能与 `platformKey` 相等匹配。
- **结论**：当前版本「新发布」写/读自洽、能匹配；「已删除」主要影响**旧版本插件写入的小写 key 属性**（历史数据）。#2045 的 Halo 属同类旧数据/旧版本场景。

## 影响范围
- V1（`Admin.vue`）与 V2（`V2ArticleManage`）共用 `useArticleManage`/`ArticleManageList`，均受影响。
- 仅影响**平台名称/图标显示**与「点击平台单发」对 platformKey 的解析；不影响发布数据本身。属显示层/解析层缺陷。

## 待补充确认（实现在前需拍板）
- 建议统一新增一个「规范化」key 做匹配：`normalizePlatformKey(key) = <去尾部 -<id>、转小写>`，`enrichYaml` 与 `getDynCfgByKey` 均按规范化 key 匹配，做到大小写/带 id 皆可命中；同时保留 `platform-single` 图标/名称联动正确。
