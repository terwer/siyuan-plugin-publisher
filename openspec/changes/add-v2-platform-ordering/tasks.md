## 1. 数据模型与排序规则

- [ ] 1.1 在 `DynamicConfig` 增加可选 `displayOrder?: number`，注释清楚它只表示 V2 展示顺序，不表示发布执行顺序。
- [ ] 1.2 新增 V2 平台排序工具，集中处理有效顺序计算、账号列表排序、快速发布排序、拖拽后稠密顺序分配。
- [ ] 1.3 为排序工具添加单测，覆盖历史配置无排序字段、已启用优先、快速发布复用顺序、新账号顺序分配。

## 2. 设置状态接入

- [ ] 2.1 改造 `useV2Settings.loadAccountItems()`，通过共享排序工具生成账号列表。
- [ ] 2.2 在 `useV2Settings` 新增 `reorderAccounts(orderedPlatformKeys)`，只持久化 `displayOrder`，不得修改授权、启用、凭据或发布校验状态。
- [ ] 2.3 改造账号创建逻辑，让新账号获得当前最大 `displayOrder + 1`，默认出现在对应分组末尾。
- [ ] 2.4 补充或调整 `useV2Settings` 单测，覆盖排序、拖拽保存、启停后排序、新增、删除。

## 3. 账号列表交互

- [ ] 3.1 在 `V2AccountList.vue` 增加紧凑拖拽手柄，禁止整行 draggable，避免误触授权/开关/删除。
- [ ] 3.2 实现拖拽过程的本地顺序反馈，并在 drop 后 emit 最终 `orderedPlatformKeys`。
- [ ] 3.3 增加键盘可访问的上移/下移兜底操作，并复用同一保存机制。
- [ ] 3.4 补齐排序手柄、上移、下移、保存失败等 i18n 文案。
- [ ] 3.5 增加组件测试，覆盖拖拽 reorder emit 和键盘 fallback。

## 4. 快速发布接入

- [ ] 4.1 改造 `useV2QuickPublish.init()`，使用同一排序工具排序已启用平台卡片。
- [ ] 4.2 确认并实现快速发布中 blocked 卡片的排序策略；默认不改变可发布状态，只影响展示位置。
- [ ] 4.3 补充或调整快速发布测试，覆盖持久化顺序、历史兜底顺序、blocked 卡片展示。

## 5. 验证

- [ ] 5.1 运行 V2 排序工具、V2 settings、账号列表、快速发布相关 Vitest。
- [ ] 5.2 运行 `pnpm build:v2`。
- [ ] 5.3 手工复查 V2 账号列表：启用优先、拖拽保存、新增、删除、启停后顺序是否符合预期。
- [ ] 5.4 手工复查 V2 快速发布：顺序是否继承账号列表，快速发布界面是否仍然足够安静。
- [ ] 5.5 运行 `POSTHOG_DISABLED=1 DO_NOT_TRACK=1 openspec validate add-v2-platform-ordering`。
