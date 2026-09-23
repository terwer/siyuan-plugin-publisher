## Context

我已经核查当前代码：

- `src/platforms/dynamicConfig.ts` 里的 `DynamicConfig` 当前没有 `order`、`displayOrder`、`sortOrder`、`sortIndex`、`position` 等账号展示排序字段。
- 搜到的 `github.weight` / `Post.weight` 是文章 Frontmatter 或 GitHub/Hugo 文章显示权重，不是发布账号列表顺序，不能复用。
- 搜到的 `priority` 是 Halo 分类/API 内部字段，不是 V2 账号展示顺序，不能复用。
- 搜到的 `seq` 是微信接口请求参数，不是账号排序，不能复用。
- `useV2Settings.loadAccountItems()` 当前直接按 `DYNAMIC_CONFIG_KEY.totalCfg` 的数组顺序展示账号。
- `useV2QuickPublish.init()` 当前先筛选 `isEnabled`，再按 `totalCfg` 原数组顺序展示快速发布卡片。

所以本提案的前提是：**目前没有可沿用的账号展示 order 字段**。如果后续你指出有其他隐藏配置字段，我会优先沿用现有字段，不新增 `displayOrder`。

## Goals / Non-Goals

**Goals:**

- 已启用账号在 V2 账号列表中稳定排在未启用账号前面。
- 用户可以在账号管理页拖拽调整平台顺序。
- 排序结果持久化到现有发布设置中，重启和刷新后保留。
- V2 快速发布复用账号管理页保存的同一份顺序。
- 历史配置无排序字段时平滑兼容，按原 `totalCfg` 相对顺序兜底。
- 排序只影响展示，不改变授权、启用、发布校验、Cookie 或平台配置。
- UI 保持「小而密」：只增加低噪声拖拽手柄和必要反馈，不把快速发布做成管理后台。

**Non-Goals:**

- 不改平台授权流程。
- 不改 Cookie 自动读取流程。
- 不改 `validatePublish()` 规则。
- 不改发布/删除文章流程。
- 不在快速发布页默认加入复杂排序控件。
- 不新增第二套 V2-only 排序配置表，除非后续明确否定写入 `DynamicConfig`。

## Decisions

### 1. 字段选择：新增 `DynamicConfig.displayOrder?: number`

当前没有可沿用的账号展示排序字段，因此建议在 `DynamicConfig` 上新增可选字段：

```ts
/**
 * V2 展示排序，仅用于账号列表和快速发布的展示顺序。
 * 数字越小越靠前；不代表发布执行顺序。
 */
displayOrder?: number
```

为什么不直接叫 `order`：

- `order` 太宽泛，容易被误解成发布执行顺序、接口顺序、文章排序或平台协议顺序。
- `displayOrder` 明确这是 UI 展示顺序。
- 后续如果别的平台配置已经存在业务 `order`，不容易冲突。

为什么不复用 `weight`：

- 现有 `weight` 是文章/Frontmatter 层概念，中文文案也是“权重（决定显示顺序）”，但它服务的是文章在站点中的显示顺序，不是发布账号的显示顺序。
- 复用会造成语义污染，审计时更难解释。

### 2. 持久化位置：写回 `DYNAMIC_CONFIG_KEY.totalCfg` 里的账号对象

当前动态平台账号保存在发布设置中的 `DYNAMIC_CONFIG_KEY` 下面，大致结构是：

```ts
setting[DYNAMIC_CONFIG_KEY] = JSON.stringify({
  totalCfg: [
    {
      platformKey: "common_Yuque",
      platformName: "语雀",
      isEnabled: true,
      isAuth: true,
      displayOrder: 0
    },
    {
      platformKey: "custom_Zhihu",
      platformName: "知乎",
      isEnabled: false,
      isAuth: false,
      displayOrder: 1
    }
  ]
})
```

也就是说：

- 每个账号自己的顺序随自己的 `DynamicConfig` 存储。
- 不新增 `V2_PLATFORM_ORDER_KEY` 这种独立 map。
- 账号删除时，对应 `displayOrder` 自然随账号删除，不会留下孤儿 order。
- 旧版本代码如果不认识 `displayOrder`，会忽略它，不影响旧字段读取。

历史数据处理：

- 如果 `displayOrder` 是有效数字，则使用它。
- 如果没有 `displayOrder`，则用它在 `totalCfg` 中的原始下标作为 fallback order。
- 仅加载时计算 fallback，不立刻写回，避免用户只是打开页面就污染配置。

### 3. 排序规则：展示层统一走有效顺序

建议新增纯工具模块，例如：

```ts
src/composables/v2/platformOrdering.ts
```

职责：

- `resolveDisplayOrder(item, fallbackIndex)`：返回有效展示顺序。
- `sortV2Accounts(items)`：账号列表排序。
- `sortV2QuickPublish(items)`：快速发布卡片排序。
- `assignDisplayOrders(dynamicConfigArray, orderedPlatformKeys)`：拖拽后写入稠密顺序。

账号列表排序：

1. 已启用账号在前，未启用账号在后。
2. 同一组内按 `displayOrder` 从小到大。
3. `displayOrder` 相同或缺失时，用原 `totalCfg` 下标兜底，保证稳定。

快速发布排序：

1. 只展示已启用账号。
2. 复用同一 `displayOrder`。
3. 可发布卡片优先于已启用但被授权/发布校验阻塞的卡片。
4. 同一可发布状态内继续按 `displayOrder`。

第 3 点是体验选择：快速发布是直达场景，可发布目标不应被“已启用但当前不可发布”的卡片挡住。如果你希望快速发布绝对尊重手动顺序，即使 blocked 卡片在前也不后置，这一点需要你确认后再实现。

### 4. 拖拽保存机制：drop 后一次性写回稠密 order

拖拽流程建议如下：

1. `V2AccountList.vue` 每行只在拖拽手柄上启用拖拽，不让整行 draggable，避免点“去授权 / 开关 / 删除”时误触拖拽。
2. 拖拽过程中组件只维护本地临时顺序，用于视觉反馈，不立即写配置。
3. 用户 drop 后，组件向父层 emit：

```ts
emit("reorder", orderedPlatformKeys)
```

其中 `orderedPlatformKeys` 是当前账号列表的最终展示顺序，例如：

```ts
["common_Yuque", "custom_Zhihu", "metaweblog_Typecho"]
```

4. `V2App.vue` 调用 `settings.reorderAccounts(orderedPlatformKeys)`。
5. `useV2Settings.reorderAccounts()` 重新读取最新 setting，找到 `DYNAMIC_CONFIG_KEY.totalCfg`。
6. 按 `orderedPlatformKeys` 给对应账号写入稠密顺序：

```ts
common_Yuque.displayOrder = 0
custom_Zhihu.displayOrder = 1
metaweblog_Typecho.displayOrder = 2
```

7. 对没有出现在 `orderedPlatformKeys` 里的账号，保留原有相对顺序并追加到后面，避免并发/隐藏平台丢失。
8. 调用现有 `setDynamicJsonCfg(dynamicConfigArray)` 写回 `setting[DYNAMIC_CONFIG_KEY]`。
9. 调用现有 `updateSetting(setting)` 持久化。
10. 保存成功后重新 `loadAccountItems()`，让 UI 用真实持久化结果刷新。
11. 保存失败时恢复拖拽前顺序，并显示 V2 统一错误提示。

关键点：

- 拖拽过程中不频繁写配置，只在 drop 后保存一次。
- 保存的是数字顺序，不保存 DOM 位置、不保存临时数组。
- 不重排 `totalCfg` 本身也可以；排序时优先读 `displayOrder`。如果实现时发现重排数组能显著简化，也必须确保 `displayOrder` 仍是权威展示顺序，不能把数组顺序重新变成隐式 order。
- `reorderAccounts()` 只改 `displayOrder`，不能顺手改 `isEnabled`、`isAuth`、Cookie、metadata、blogid 等字段。

### 5. 新增、删除、启停账号时的 order 规则

新增账号：

- 创建草稿时读取当前 `totalCfg`。
- 找到最大有效 `displayOrder`。
- 新账号写入 `displayOrder = max + 1`。
- 新账号默认 `isEnabled = false`，因此展示在未启用组末尾。

删除账号：

- 删除对应 `DynamicConfig` 和 `setting[platformKey]`。
- 不需要额外清理 order，因为 order 在账号对象内部。
- 可以不立即压缩剩余账号的 `displayOrder`；下次拖拽保存时会写成稠密顺序。

启停账号：

- 只修改 `isEnabled`。
- 不修改 `displayOrder`。
- 展示时由于“启用优先”，账号会移动到启用/未启用分组，但保留自己的相对顺序。

## Risks / Trade-offs

- **跨启用/未启用分组拖拽容易让用户误解** → 第一版建议只承诺“同组内排序稳定”，跨组 drop 后仍按启用优先重新分组；UI 上可以用分组边界或提示降低误解。
- **快速发布 blocked 后置可能不是用户预期** → 当前建议后置以服务直达发布；这点需要你确认。
- **新增 `displayOrder` 是新字段** → 已核查当前没有可沿用账号 order 字段；如果你确认已有隐藏字段，应改为沿用。
- **原生拖拽兼容性可能不完美** → 第一版不引入依赖，先用账号列表管理面降低交互复杂度；如 Electron/浏览器测试不稳定，再讨论是否引入轻量排序库。
- **保存失败导致顺序回弹** → 失败时恢复原顺序并提示，不静默吞错。

## Migration Plan

1. 增加 `DynamicConfig.displayOrder?: number`，注释清楚它只代表 V2 展示顺序。
2. 新增 V2 平台排序工具和单测，覆盖历史无 order、启用优先、快速发布排序、新增顺序分配。
3. `useV2Settings.loadAccountItems()` 使用排序工具。
4. `useV2Settings` 新增 `reorderAccounts(orderedPlatformKeys)`，只写回 `displayOrder`。
5. 创建账号时写入 `displayOrder = max + 1`。
6. `V2AccountList.vue` 增加紧凑拖拽手柄、drop 保存、键盘上移/下移兜底。
7. `V2App.vue` 接收 reorder 事件，调用 `settings.reorderAccounts()`，保存后刷新账号列表和快速发布。
8. `useV2QuickPublish.init()` 使用同一排序工具。
9. 补齐 i18n 和测试。
10. 运行 V2 build 和 OpenSpec 校验。

Rollback 策略：

- `displayOrder` 是可选字段；回滚代码后旧版本会忽略它。
- 不改原有平台配置 key，不影响 `setting[platformKey]` 的凭据和发布参数。
- 如果需要彻底清理，可以后续提供配置清理工具，但不是本变更必需项。

## Open Questions

- 是否接受字段名 `displayOrder`？如果你坚持沿用 `order`，需要确认不会和其他平台业务字段冲突。
- 快速发布中 blocked 卡片是否后置？当前建议后置，保证可发布目标优先。
- 是否允许跨启用/未启用分组拖拽？当前建议视觉上允许拖，但最终仍按启用优先重新分组。
