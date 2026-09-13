# 语雀网页版退出设计评估计划

## 目标
评估现有 `logoutUrl` 设计是否适合语雀网页版退出流程，并给出不使用 mock/占位方案的可实施设计建议。

## 阶段
- [x] 阶段 1：恢复/创建规划上下文
- [x] 阶段 2：定位当前 `logoutUrl` 设计与调用链
- [x] 阶段 3：分析语雀真实退出请求对当前抽象的冲击
- [x] 阶段 4：形成设计方案与待确认决策点

## 约束
- 不使用 mock 数据、占位符或临时方案。
- 涉及不确定业务/技术决策时，需要向用户确认后再实施。
- 用户提供的 cookie/token 视为敏感信息，不写入代码或规划文件原文。

## 新增阶段
- [x] 阶段 5：生成 OpenSpec 提案 `fix-yuqueweb-logout-action`

- [x] 阶段 6：创建 zhi-blog-api `logoutWebAuth` SPI 提案并回写当前提案依赖

- [x] 阶段 7：实施 OpenSpec 变更 `fix-yuqueweb-logout-action` 并完成验证
