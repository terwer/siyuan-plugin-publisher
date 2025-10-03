# 故障排查

### 401/403 错误
- Token 缺失或权限不足。
- Base URL 配置错误（注意 http/https 或末尾斜杠）。

### 文件路径错误
- 确认仓库中存在 `content/posts` 与 `static/img`。
- Slug 冲突：插件默认生成 `YYYY-MM-DD-slug.md`，如需覆盖必须携带 `sha`。

### 图片不显示
- 如果使用直传：检查 Markdown 是否引用 `static/img/...` 路径，并与 Hugo 主题一致。
- 如果使用 PicGo：先单独测试 PicGo 上传是否正常。

### CI/CD 不触发
- 确认 workflow 文件放在正确目录（例如 `.github/workflows/` 或对应平台）。
- 检查 runner 标签是否匹配（如 `docker` 或自定义标签）。
