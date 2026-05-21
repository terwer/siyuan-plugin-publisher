## 发现

### A. `indexOf` 崩溃（可独立修，与 BlogAdaptor 无关）

- 复现：`XmlrpcUtil.removeXmlHeader({})` → `i.indexOf is not a function`
- 链路：`afterValid` → `api.getUsersBlogs` → `metaweblogCall` → `proxyXmlrpc` → `removeXmlHeader(非字符串)`
- **根因修复（认可）**：`normalizeXmlrpcResponseText` + `proxyXmlrpc` 先规范化再解析
- 与是否走 `BlogAdaptor.checkAuth` 无关

### B. `BlogAdaptor.checkAuth` 契约（用户要求必须经 BlogAdaptor，禁止绕过）

- `zhi-blog-api` 中 `BlogAdaptor.checkAuth()` 实现为：`throw await this.apiAdaptor.checkAuth()`
- 当子类返回 `true` 时，Promise resolve 为 `true`，但被 **throw** 出去，在 `valiConf` 里表现为 `catch (e)` 且 `typeof e === "boolean"`
- 原 `CommonBlogSetting.valiConf` **刻意**用 `boolean` 分支处理该契约（日志 `======校验修正结束======` 即此路径），随后再 `afterValid`
- **用户否决的方案（回避，禁止）**：`commonblogApiAdaptor.checkAuth()` 直连，跳过 `api.checkAuth()` / BlogAdaptor
- **用户原则**：校验必须经 `Utils.blogApi` → `BlogAdaptor` 抽血（校验）链路，不能为省事改调用面

### C. 根因修复路径（审计结论，待实现前确认）

| 层级 | 做法 | 是否根因 | 用户可接受 |
|------|------|----------|------------|
| 1 | 升级/修补 `zhi-blog-api`：`checkAuth` 改为 `return await` 而非 `throw await` | 是 | 首选（若可发版） |
| 2 | 本仓库 `Utils.blogApi` 子类包装器：对外 `checkAuth` 正常 return，内部仍委托 adaptor | 是 | 可接受（统一入口） |
| 3 | 恢复 `valiConf` 的 `await api.checkAuth()` + `boolean` 分支，仅修 `proxyXmlrpc` | 部分 | 可接受（保留历史契约，indexOf 仍要修） |
| 4 | `valiConf` 直连 `commonblogApiAdaptor.checkAuth()` | **否** | **禁止** |

### D. 「页面提示通过」误解

- 非 API 真通过：`checkAuth` 抛 `true` 进入「修正」分支后仍可能 `afterValid` 失败
- 绿色成功条仅应在 `apiStatus === true` 时出现；与 BlogAdaptor 绕过无关

## 遇到的错误

| 错误 | 尝试 | 结论 |
|------|------|------|
| `i.indexOf is not a function` | proxy 规范化 | 保留 |
| 绕过 BlogAdaptor.checkAuth | 直连 adaptor | **用户否决，需回滚该 diff** |

## 审计模式约束（用户 2026-05-21）

- **禁止改代码**，仅更新规划/审计文档
- 实现前须用户确认：回滚 `valiConf` 直连方案 + 选定 B 层根因修复（1 或 2）+ 保留 A
