# Notion API 配置指南

通过 **Notion API Token** 发布到 Notion 页面。

Notion 的授权分两步：**建集成拿 Token**，再把集成**连接到你自己的页面**。第二步最容易被忽略，漏了会出现「Token 正确但读不到任何页面」。

## 一、新建集成

打开 Notion 集成页：<https://www.notion.so/my-integrations>

点 **New integration**：

![点 New integration](/images/shots/notion-new-integration.webp)

1. **Associated workspace**：选你要发布到的工作空间。
2. **Name**：给集成起个名字，例如 `siyuan-publisher`。
3. 点 **Submit** 提交。

![填写工作空间与名称后提交](/images/shots/notion-workspace.webp)

## 二、复制 Token

进入集成详情页 → 左侧选 **Secrets** → 在 **Internal Integration Secret** 一行点 **Show**，复制该 Token。

![在 Secrets 里复制 Internal Integration Secret](/images/shots/notion-token.webp)

::: tip Token 只显示一次
复制后请妥善保存。泄露的 Token 可以在同一页点 **Refresh** 重置，重置后旧 Token 立即失效。
:::

## 三、把集成连接到你的页面

这一步决定插件能看到哪些页面。

![在页面菜单里 Add connections](/images/shots/notion-connection.webp)

1. 打开你要发布到的**父页面**（根页面）。
2. 点右上角的 **⋯** 菜单 → 找到 **Connections** → **Add connections**。
3. 选择刚建的集成。

::: warning 这一步非常重要
Notion 默认**不给**集成任何页面权限。不连接的话，插件拉取根页面列表会为空。
:::

连接后，该页面及其**子页面**都对集成可见。

## 四、配置

| 字段 | 填什么 |
|------|--------|
| 平台首页 | 通常固定 `https://www.notion.so/`，保持默认 |
| API 地址 | 通常固定 `https://api.notion.com/v1`，保持默认 |
| Token | 第二步复制的集成 Token |
| 预览规则 | 固定 `/[postid]`，不可修改；查看链接为 `https://www.notion.so/<postid>` |
| 根页面 | 点「验证」后从下拉选择，文章作为它的子页面创建 |
| 图床 | Notion 只有「不使用」与「PicGo」两项（无内置图床）。选「PicGo」时图片先传外部图床，再以外部 image 块嵌入页面 |

## 五、验证与发布

1. 点「验证」→ 拉取根页面列表 → 选根页面 → 保存。
2. 快速发布 → 选 Notion → 发布。

## 常见问题

### 为什么发布到 Notion 之后图片不显示

两种原因：

1. **没有配图床**。Notion 没有提供图片上传 API，无法直接上传图片。需要把图片传到图床，再以外链形式存进页面——也就是说，Notion 平台要选「PicGo」图床。
2. **图片链接是 http**。Notion 出于安全只接受 **https** 外链，http 地址会被直接忽略。请确认图床返回的是 https 地址。参考 [Notion 官方说明](https://developers.notion.com/docs/working-with-files-and-media)。

### 提示 Token 无效 / 验证失败

确认 Token 完整无误，且是同一个工作空间下创建的。

### 根页面列表为空

集成还没连接到页面。按第三节在目标页面的 **⋯ → Connections → Add connections** 里添加你的集成。

### 不能修改已发布页面的根页面

Notion 平台限制。先删除该文档的发布记录，再用新根页面重新发布。

### 查看链接打开提示登录

Notion 页面默认私有，需要 Notion 账号且有访问权限才能打开。发布成功且链接正确时，这属于正常现象。

### 更新文章为什么要等更久

Notion 基于块结构而非整篇文档，更新采用「先删除再发布」的方式，因此比普通更新耗时更长。