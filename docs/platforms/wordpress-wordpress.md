# WordPress 配置指南

通过 **XML-RPC** 发布到自建/托管 WordPress。

## 一、准备

1. 一个 WordPress 站点（含管理员账号）。
2. 一个 **应用程序密码**（Application Password，推荐；也可用账号密码）。

## 二、获取应用程序密码

WordPress 后台 → 用户 → 编辑 → 滚动到「应用程序密码」→ 生成。地址：`https://你的站点/wp-admin/profile.php`

## 三、配置

| 字段 | 填什么 |
|------|--------|
| 平台首页 | 站点首页，如 `https://yourblog.com` |
| API 地址 | 通常自动推导为 `https://yourblog.com/xmlrpc.php` |
| 用户名 | WordPress 管理员用户名 |
| 密码 | 账号密码；建议用后台生成的**应用程序密码** |
| 预览规则 | 默认 `/?p=[postid]`，与默认固定链接一致，一般不改 |
| 发布格式 | 默认 **HTML**（插件先把笔记转成 HTML 再提交）；选 Markdown 则提交 Markdown 原文 |
| 图床服务 | 默认「当前平台」：经 XML-RPC 上传到 WordPress 媒体库；也可改选「PicGo 强烈推荐」用你配置的 PicGo；「不使用」跳过图片处理、按原图地址引用（需公网可访问） |

## 四、验证与发布

1. 点「验证」→ 通过后保存。
2. 快速发布 → 选 WordPress → 发布。

## 五、特色图片

发布页切到「详细模式」后有「特色图片」一栏（仅 WordPress 支持），三种填写方式任选：

- **上传图片**：从本机选一张图片，插件先存进思源资源库（`assets/`），发布时再随文章上传到 WordPress 媒体库；
- **取正文首图**：直接引用正文第一张图片；
- 手动填思源资源相对路径（如 `assets/cover.png`）或完整图片链接。

无论哪种方式，图片都会先上传到 WordPress 媒体库，再设为该文章的**特写图（Featured Image）**。

设置会被记在文档的 WordPress 平台属性里（`featured_image`），下次打开发布页会自动回填；清空后重新发布会移除已设置的特写图。

## 六、思源文档 ID（siyuanid）

发布到自建 WordPress 时，插件会把**来源思源文档 ID** 写入文章的 `siyuanid` 自定义字段（post meta），方便外部工具把 WordPress 文章和思源文档对应起来。

- **新建文章**：随 `metaWeblog.newPost` 创建该字段。
- **再次发布/更新**：读取文章已有的 `custom_fields`，按已有 meta 的 `id` 原地更新；不会重复添加同名字段，也不会改动其他自定义字段。
- **没有来源文档 ID 时**：不写入该字段，不会伪造空值。
- **权限要求**：账号需要有编辑文章和 post meta 的权限；XML-RPC 需开启（与发布本身的要求一致）。
- **WordPress.com**：走独立的适配器，不写入该字段。

读取方式（WordPress 侧）：

```php
$siyuanId = get_post_meta($post_id, 'siyuanid', true);
```

如果需要在 REST API 响应里看到 `meta.siyuanid`，需要在 WordPress 侧注册该 meta：

```php
register_post_meta('post', 'siyuanid', [
    'type' => 'string',
    'single' => true,
    'show_in_rest' => true,
]);
```

> 该字段只用于**关联来源文档**，本身不会自动去重、查找既有文章或阻止重复发布；这些需要额外的匹配/唯一性逻辑。

## 常见问题

- **XML-RPC 被禁用**：检查 WordPress 是否开启 XML-RPC，安全插件是否拦截 `/xmlrpc.php`。
- **应用程序密码在哪**：后台 → 用户 → 编辑 → 应用程序密码 → 生成。
- **图片上传失败**：确认「图床服务」选的是「当前平台」（经 XML-RPC 上传到 WordPress 媒体库）、站点媒体库权限和网络连通；也可改用「PicGo 强烈推荐」。
