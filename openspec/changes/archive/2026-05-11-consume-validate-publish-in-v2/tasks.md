## 1. 依赖和契约接入

- [x] 1.1 更新 `zhi-blog-api` 到已经包含 `PublishValidationResult` 和 `validatePublish()` 的发布版本。
- [x] 1.2 在 V2 发布校验流程需要的位置引入 `PublishValidationResult` 类型。
- [x] 1.3 确认 `Adaptors.getAdaptor()`、`Utils.blogApi`、`Utils.webApi` 创建出的 API 包装器都暴露 `validatePublish()`。

## 2. 平台 API 发布校验

- [x] 2.1 实现 `YuquewebWebAdaptor.validatePublish()`，使用和发布流程一致的目标要求：`bookId`、`bookSlug`、`login` 必须全部存在。
- [x] 2.2 当语雀知识库未选择或元数据不完整时，返回面向用户的 `reason`，提示需要选择可发布的语雀知识库。
- [x] 2.3 确保语雀发布校验不会创建、更新、删除或上传任何远端内容。

## 3. V2 配置流程

- [x] 3.1 新增集中式 V2 helper/service：读取当前选中平台配置，调用 `validatePublish()`，并返回统一结果。
- [x] 3.2 移除或停止使用 V2 Cookie 自动授权里的 `enableOnSuccess` 语义。
- [x] 3.3 停止仅凭 `apiStatus` 或 `checkAuth()` 成功就在通用验证流程中启用账号。
- [x] 3.4 在 `CommonBlogSetting.saveConf()` 中增加用户保存完成动作事件，并通过桥接组件转发给 `V2App`。
- [x] 3.5 更新 `V2App`：Cookie 授权成功只刷新状态，不跳回快速发布。
- [x] 3.6 更新 `V2App` 的验证/保存处理：只有 `isAuth === true` 且 `validatePublish().canPublish === true` 才启用账号并完成配置流程。
- [x] 3.7 当验证/保存后仍不能完成流程时，展示 `validatePublish().reason`；没有 reason 时展示通用的“请完成发布配置”提示。

## 4. 快速发布兜底

- [x] 4.1 快速发布初始化时，不把 `validatePublish()` 返回 `canPublish: false` 的平台视为可发布。
- [x] 4.2 真正执行发布前增加一次 `validatePublish()` preflight，防止历史脏数据或手动编辑配置绕过。
- [x] 4.3 保持快速发布和账号列表界面简洁，不展示冗长 Cookie 授权说明。

## 5. 测试和验证

- [x] 5.1 增加语雀 Web 单元测试，覆盖未选择目标、目标元数据不完整、目标完整三种 `validatePublish()` 结果。
- [x] 5.2 增加 V2 Cookie 授权测试，证明授权成功不会启用账号，也不会跳转。
- [x] 5.3 增加 V2 验证/保存流程测试，证明只有 `canPublish: true` 才完成流程。
- [x] 5.4 增加快速发布兜底测试，覆盖已启用但配置无效的历史账号。
- [x] 5.5 运行 V2 设置、快速发布、Cookie 授权、语雀 Web 校验相关的 Vitest 用例。
- [x] 5.6 运行 `pnpm build:v2`。
- [x] 5.7 运行 `openspec validate consume-validate-publish-in-v2` 和 `openspec validate --all`。
