# 修复 plan：文章管理「平台显示已删除」（#2045 归类）

> 状态：**已实现**（方案 A 已落地，见下方「实现记录」）。当前为修复方案 + 落地记录。

## 目标
让文章管理「平台」栏对所有已发布文档（含旧版小写 key）正确显示平台名称/图标，并让「点击平台↔单发」的 platformKey 解析一致；不再出现「已删除」。

## 现状（see findings.md）
- 读侧 `enrichYaml` 由 `custom-*-yaml` 属性推导 `newKey`，再用 `getDynCfgByKey`（platformKey 全等比较）匹配；旧数据小写 key（`custom-fs-localsystem-yaml` → `fs_localsystem`）与混合大小写 `platformKey`（`fs_LocalSystem`）不等 → null → 「已删除」。
- 当前版本新发布写/读自洽；受影响的是历史数据。

## 方案（推荐 A，需实现前验证）
统一「规范化平台 key」做匹配，size/带 id 皆可命中：

### A. 规范化匹配（推荐）
1. `src/platforms/dynamicConfig.ts` 新增：
   ```ts
   export function normalizePlatformKey(key: string): string {
     // 去尾部 -<id>（可选的 8+ 位 id），并转小写
     return key.replace(/-\d{13,}[a-z0-9]+-?$/i, "").toLowerCase()
   }
   ```
   > 对 `fs-LocalSystem-<id>` / `fs_LocalSystem` / `custom-Yuqueweb-z1awjla` 等形态都能归一化到 `fs-localsystem` / `custom-yuqueweb`。
2. `enrichYaml`（`useArticleManage.ts`）改为以规范化 key 建索引：
   ```ts
   const norm = normalizePlatformKey(newKey)
   dynCfgs[norm] = getDynCfgByKey(dynamicConfigArray, newKey)   // 兜底：仍需在原 key 上找一个能匹配的 config
   ```
   `getDynCfgByKey` 改为「先全等、再规范化相等」。
3. `ArticleManageList.vue` 渲染 `yamlAttrs` 时用规范化后的 `norm` 查 `dynCfgs`；`dispatchPlatform` 把原始 `newKey`（或规范化 key）传出去，保持 `platform-single` 解析一致。

### 权衡
- A：改动集中在「键匹配」层，向下兼容新旧数据；需同步确认 `platform-single`（点击平台单发）与平台配置解析也用同一规范化。
- B（备选，更小但覆盖不足）：仅把 `enrichYaml` 的推导改成 `getDynYamlKey` 的精确逆变换（`replace(/^custom-/,'').replace(/-/g,'_')`），能修复混大小写 key，但**不能**修复旧版全小写 key——不推荐单独用，可作为 A 的补充。

## 验证计划（实现后执行）
1. 单测：新增 `normalizePlatformKey` / 匹配逻辑用例（覆盖 `fs_LocalSystem`、`fs-LocalSystem-<id>`、`custom-Yuqueweb-z1awjla`、`custom-Yuqueweb` 等）。
2. `pnpm build:v2` + `vue-tsc` 通过。
3. V2 宿主手验：打开文章管理 → 展开 `v2.0测试专用`，确认平台显示「本地系统 / 语雀网页版」，无「已删除」；点平台进入「单发」，platformKey 解析正确。
4. V1 宿主手验（任务 7.2 一并做）：`pnpm build` + `makeLink`，`useV2UI=false`，确认同一文档平台显示正常。

## 实现记录（2026-08-24）
- **已落地**方案 A：新增 `normalizePlatformKey()`（`src/platforms/dynamicConfig.ts`）= 统一 `-`→`_`、剥离尾部实例 id、转小写；`getDynCfgByKey` 改为 **精确 → 大小写不敏感 → 规范化** 三级匹配。
- `ArticleManageList.vue`：「点击平台单发」改为传配置真实 `platformKey`（`dynCfgs[key]?.platformKey ?? key`），保证历史数据也能解析到正确平台配置。
- 单测：`dynamicConfig.spec.ts` 新增 `normalizePlatformKey` / `getDynCfgByKey`（历史全小写、带实例 id、精确优先）用例，`vitest` 通过。
- 编译验证：`pnpm lint`（vue-tsc）通过；`pnpm build:v2` 通过（dist-v2 正常产出）。
- AGENTS.md 已加入「警示：平台 key 兼容历史数据（勿再犯）」固化规则。

## 剩余宿主手验（未执行，由用户进行）
- V2 宿主：展开 `v2.0测试专用`，确认平台列显示「本地系统 / 语雀网页版」而非「已删除」；点平台进入单发，platformKey 解析正确。
- V1 宿主（`useV2UI=false`）：`pnpm build` + `makeLink`，确认同一文档平台显示正常。

## 明确不做
- 不改发布数据（attrs）本身。
- 不做数据迁移脚本（除非规范化匹配无法覆盖）；优先看是否 A 能直接兼容。
