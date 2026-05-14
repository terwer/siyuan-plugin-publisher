## 1. 真实取证与边界确认

- [ ] 1.1 复核当前工作区差异，只记录与图片上传、APP_BASE、错误详情相关的已改动，不触碰 `src/utils/staticI18n.ts` 遗留状态
- [ ] 1.2 在思源 Electron V2 宿主插件中复现语雀图片发布失败，记录当前错误详情截图对应的调用时间和平台账号，不修改历史文章
- [ ] 1.3 对 `newMediaObject -> yuquewebFormFetch -> BaseWebApi.webFormFetch -> useProxy.forwardProxy/zhi-formdata-fetch` 增加最小脱敏诊断，确保不输出 Cookie/token
- [ ] 1.4 使用真实图片文件和真实语雀登录态重新触发上传，取得脱敏证据：实际分支、目标 URL、状态码、响应摘要、错误类型、文件安全元信息
- [ ] 1.5 基于 1.4 证据写明根因，禁止使用“可能/嫌疑”作为修复依据

## 2. 语雀图片上传根因修复

- [ ] 2.1 按证据修复 FormData/Blob、APP_BASE 依赖路径、`zhi-formdata-fetch` 或 `forwardProxy` 响应解析中的真实问题
- [ ] 2.2 保留 `forwardProxy` 主链路，不删除、不 mock、不改走未验证外部代理
- [ ] 2.3 让 `YuquewebRequestError` 或包装错误携带 `cause` 与脱敏 `diagnosticMessage`，避免吞掉底层错误
- [ ] 2.4 确认 `newMediaObject()` 仍只上传单张图片并返回 `Attachment.url`，不新增语雀专用 Markdown 解析/替换逻辑
- [ ] 2.5 复测包含本地图片的新建/更新发布，确认语雀侧正文图片 URL 正确替换且图片可访问

## 3. V2 宿主安全错误详情 UI

- [ ] 3.1 新增 V2 局部错误详情组件或等价局部面板，挂载在 `.syp-v2` 内，不再用全局 `ElMessageBox.alert` 展示长错误详情
- [ ] 3.2 详情组件支持标题、友好摘要、脱敏详情、复制、关闭和内部滚动，视觉保持小而密
- [ ] 3.3 快速发布 warning/failed 的“查看详情”改为打开局部详情组件，状态卡片仍只保留简短提示
- [ ] 3.4 保留 `SypMessageBox` 作为短确认弹窗用途；如继续使用 Element Plus 确认，必须保证删除确认不与详情面板体验割裂
- [ ] 3.5 在思源宿主弹窗中人工检查遮罩、定位、尺寸、滚动和关闭行为，不得再出现全局错位弹窗

## 4. 测试与构建

- [ ] 4.1 增加或更新单测覆盖 V2 APP_BASE 为 `/plugins/siyuan-plugin-publisher/` 且 FormData 依赖路径指向插件目录
- [ ] 4.2 增加或更新单测覆盖图片上传失败会保留脱敏底层诊断详情
- [ ] 4.3 增加或更新单测覆盖 V2 错误详情不调用全局 `ElMessageBox.alert`，而由局部组件渲染
- [ ] 4.4 增加或更新单测覆盖 Cookie、Authorization、ctoken、token、csrf、ticket 在详情与日志中被脱敏
- [ ] 4.5 只运行 `pnpm build:v2` 做最终构建验证

## 5. OpenSpec 与人工验收同步

- [ ] 5.1 将脱敏取证结论写入本变更或 `add-yuque-web-v2-auth-sample` 的验证记录，不写入任何敏感凭据
- [ ] 5.2 用户确认 8.6 图片发布通过后，才允许勾选 `add-yuque-web-v2-auth-sample` 的 5.3 与 8.6
- [ ] 5.3 用户确认宿主错误详情 UI 通过后，才允许勾选本变更的 UI 验收任务
