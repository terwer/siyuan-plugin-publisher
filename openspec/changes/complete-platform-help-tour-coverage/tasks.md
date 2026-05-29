# Tasks: complete-platform-help-tour-coverage

> 关联主线：`v2-platform-verification-v1-retirement`
> 覆盖原则：平台验证完成后补齐帮助，不提前编造未验证平台步骤。

## 0. 治理与基线

- [x] 0.1 创建 OpenSpec 变更 `complete-platform-help-tour-coverage`
- [x] 0.2 明确本变更是 `platform-help-guide-system` 归档后的覆盖补全，不重做帮助框架
- [x] 0.3 确认当前覆盖基线：博客园完整；WordPress/语雀/Halo/语雀网页版/HaloWeb 独立配置；其余 T1 多数仍在 `remaining-t1.ts`
- [x] 0.4 建立帮助覆盖记录文件 `coverage-log.md`，记录每个平台补齐依据与验证日期

## 1. 已验证平台覆盖审计

- [x] 1.1 审计 #21 博客园 `metaweblog_Cnblogs`：确认为完整样板，必要时补充最新 XML-RPC / API Token / Img 经验
- [x] 1.2 审计 #1 语雀 API `common_Yuque`：补齐 summary/fields/faq/tour，记录专业会员政策口径
- [x] 1.3 审计 #25 WordPress `wordpress_Wordpress`：补齐 XML-RPC/API URL、用户名、应用密码或 Token、图床建议
- [x] 1.4 审计 #27 语雀网页版 `custom_Yuqueweb`：补齐 Cookie 授权、图片上传、错误详情说明
- [x] 1.5 审计 #29 本地系统 `fs_LocalSystem`：从 `remaining-t1.ts` 拆出独立配置，补齐本地路径/YAML/图片处理说明
- [x] 1.6 审计 #30 知乎 `custom_Zhihu`：从 `remaining-t1.ts` 拆出独立配置，补齐 Cookie 授权、平台图床、OSS SDK 注意事项
- [x] 1.7 审计 #31 CSDN `custom_Csdn`：从 `remaining-t1.ts` 拆出独立配置，补齐 Cookie 授权、Bundled 图床、发布限制说明

## 2. 当前进行中平台

- [ ] 2.1 等 #28 Halo 网页版 `custom_Haloweb` V2C/Pub/Upd/Del/Img 手验完成后，补齐 `custom-haloweb.ts` 的最新配置与 FAQ
- [ ] 2.2 如果 #28 验证中发现新的失败模式，同步写入 `custom-haloweb.ts` 的 FAQ 或 `coverage-log.md`

## 3. 后续平台联动规则

- [ ] 3.1 当 #2–#5 Common 任一平台验证通过时，同步补齐对应平台帮助配置
- [ ] 3.2 当 #6–#13 Github 任一平台验证通过时，同步补齐对应平台帮助配置，优先沉淀仓库、分支、目录、静态站点类型字段
- [ ] 3.3 当 #14–#20 Gitlab 任一平台验证通过时，同步补齐对应平台帮助配置，优先沉淀 token、仓库路径、分支、目录字段
- [ ] 3.4 当 #22–#24 MetaWeblog 任一平台验证通过时，同步补齐 XML-RPC endpoint、用户名、密码/API Token 说明
- [ ] 3.5 当 #26 WordPress.com 验证通过时，同步补齐 WordPress.com 与自托管 WordPress 的差异说明
- [ ] 3.6 当 #32–#35 Custom V2 Bridge 任一平台验证通过时，同步补齐 Cookie 授权、登录入口、图床/媒体限制说明

## 4. Tour 锚点与表单接入

- [x] 4.1 盘点已验证平台配置表单是否存在稳定 `data-syp-tour` 锚点
- [x] 4.2 对缺少锚点但需要 tour 的平台，补充最小 `data-syp-tour` 标记，不改变业务逻辑
- [ ] 4.3 验证新增 tour step 在 V2 宿主容器内定位正确，不越出插件容器

## 5. 测试与验收

- [x] 5.1 为新增/拆分的平台 help config 补充 registry 单测或快照式覆盖检查
- [x] 5.2 运行 `pnpm vitest run src/helpConfigs/registry.spec.ts`
- [x] 5.3 运行 `pnpm build:v2`
- [ ] 5.4 V2 宿主手验：HelpPanel 可打开、FieldGuide 可见、TourGuide 可完成
- [ ] 5.5 每次平台验证 checklist 更新后，同步检查本 tasks 是否需要新增/勾选帮助覆盖任务
