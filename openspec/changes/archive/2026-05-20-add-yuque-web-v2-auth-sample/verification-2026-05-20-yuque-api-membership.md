# 语雀 API 429 根因记录（8.10）

## 结论

`common_Yuque`（Open API + Personal Access Token）返回 **429** 时，实测主因是**语雀平台收费/会员策略**，不是发布插件请求频率异常。

| 现象 | 根因 |
|------|------|
| 配置阶段校验 Token 即 429 | 账号未续费**专业会员**，或 Token 无「超级会员」可用权限 |
| 未续费账号持续 429 | 与插件无关；需开通/续费或改用**语雀网页版**（Cookie） |
| 免费普通用户 | 每月新建文档约 **100 篇** 上限；专业会员文档不限、API/Token 可用 |

官方定价与会员说明：https://www.yuque.com/about/price#personal

## 证据来源

- 用户截图：Personal Access Token 页标注「超级会员」；定价页普通用户 vs 专业会员权益对比
- 变更内历史回归：`add-yuque-web-v2-auth-sample` Context 已记录配置阶段 429

## 产品处理

- 配置页：`YuqueSetting` 顶部窄条提示会员与 429 含义
- 运行时：`YuqueApiAdaptor` 对 403/429 抛出带定价链接的用户化文案（`setting.yuque.error.*`）
- 推荐：需稳定发布且遇 429 时，优先使用 **语雀网页版** 平台（`Custom_Yuqueweb`）
