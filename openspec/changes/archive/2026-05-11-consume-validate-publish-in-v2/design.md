## Context

当前 V2 流程里，`checkAuth()` 或 Cookie 元数据校验成功后，部分路径会直接启用账号或跳回快速发布。但 `checkAuth()` 只能说明登录/授权有效，不能说明平台已经具备发布目标。语雀 Web 的知识库选择就是独立于登录的发布前置条件：用户 Cookie 有效，但没有选择知识库时仍然不能发布。

之前考虑过让 UI 事件携带“是否可以发布”的信息，但这会让每个平台表单、桥接组件和 V2App 都承担记忆规则的责任，新增平台或修改平台时极容易遗漏。更稳妥的方式是让 API/adaptor 暴露统一的 `validatePublish()`，由平台自己判断自己的发布前置条件，V2 只根据统一返回值做流程决策。

本变更依赖 `zhi-blog-api` 的 `add-validate-publish-spi` 变更。实现前需要先发布并安装包含该 SPI 的新版包。

## Goals / Non-Goals

**Goals:**
- 使用平台 API 的 `validatePublish()` 作为发布前置条件的唯一可信来源。
- 保持平台规则不进入 V2App、桥接组件和通用表单 `emit` payload。
- Cookie 授权成功只代表授权有效，不再自动启用账号或直接回快速发布。
- 用户点击“验证”或“保存”后，只有授权有效且发布前置校验通过，才完成账号配置流程。
- 语雀 Web 通过 `validatePublish()` 校验知识库目标是否完整，缺少知识库时阻止快速发布。
- 在快速发布初始化和真正发布前增加兜底校验，防止历史脏数据或手动编辑配置绕过流程。

**Non-Goals:**
- 不重构所有 V1 平台设置流程。
- 不新增持久化的“发布就绪”标记；发布就绪状态由当前配置和 API 校验动态得出。
- 不让 Cookie 授权逻辑执行发布前置校验，也不让发布校验创建/更新/删除远端内容。
- 不在 V2 通用 UI 中写语雀知识库、分类、空间等平台特判。

## Decisions

1. 用集中式 V2 完成校验替代 `emit` 传规则。
   - 表单事件只表示“用户动作完成”，例如验证完成或保存完成。
   - V2App/设置流程收到事件后重新读取当前平台配置，创建对应 API，再调用 `validatePublish()`。
   - 这样新增或修改平台时，只要平台 API 实现自己的规则，UI 层不会漏传规则。

2. 启用账号必须同时满足授权和发布前置校验。
   - `dynCfg.isAuth` 继续只表示登录/授权状态。
   - `dynCfg.isEnabled` 只能由 V2 统一完成逻辑在 `validatePublish().canPublish === true` 后设置。
   - Cookie 自动授权可以写入授权状态和元数据，但不能直接启用。

3. 发布规则放在 API/adaptor 内。
   - 语雀 Web 的 `validatePublish()` 使用发布时需要的同一套目标解析要求。
   - 其他平台如果没有额外发布前置条件，可暂时使用 `zhi-blog-api` 默认的 `{ canPublish: true }`。
   - 当某个平台以后需要分类、空间、目录、组织等配置时，只需要覆盖自己的 `validatePublish()`。

4. 新增保存完成事件，但不携带规则。
   - `CommonBlogSetting.saveConf()` 在用户明确点击保存时发出 V2 可消费的保存完成动作。
   - `valiConf()` 内部触发的保存不重复发出保存完成事件，避免一次操作触发两次跳转。
   - 桥接组件只转发动作，V2App 通过集中式校验决定是否完成流程。

## Risks / Trade-offs

- [Risk] publisher 在新版 `zhi-blog-api` 发布前无法编译。→ Mitigation：该变更保持独立，先完成并发布 SPI 包，再实施 publisher 消费。
- [Risk] 历史上已经启用但配置不完整的账号仍可能存在。→ Mitigation：快速发布初始化和真正发布前都调用 `validatePublish()` 做兜底。
- [Risk] 新平台有发布前置条件却忘记覆盖 `validatePublish()`。→ Mitigation：新增平台前置条件时必须补平台自己的 `validatePublish()` 测试。
- [Risk] 多一次校验可能增加延迟。→ Mitigation：`validatePublish()` 默认只读取当前配置，不做远端写操作；除非平台明确需要，否则不做昂贵远程检查。

## Migration Plan

1. 等 `zhi-blog-api` 的 `add-validate-publish-spi` 发布后，更新 publisher 依赖。
2. 在 V2 设置流程中新增集中式发布前置校验 helper/service。
3. 移除 Cookie 授权成功后的 V2 自动启用和自动跳回快速发布行为。
4. 在语雀 Web adaptor 中实现 `validatePublish()`，并补测试。
5. 在快速发布初始化和发布前增加 `validatePublish()` 兜底。
6. 验证 V2 账号配置、快速发布、Cookie 授权和 V1 设置流程仍兼容。
7. 回滚方式：停止 V2 消费 `validatePublish()`；授权和手动发布错误保持原样。
