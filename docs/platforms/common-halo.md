# Halo API 配置指南

通过 **Halo API**（基础认证）发布到 Halo 2.x 博客，对应平台列表里的 **Halo29**。

## 一、准备

1. 一个可访问的 Halo 2.x 站点。
2. 能登录该站点的**用户名与密码**。
3. Halo **2.20 及以上**需要先开启 Basic Auth，见下一节。

## 二、Halo 2.20+ 需要开启 Basic Auth

Halo 2.20 起默认关闭 Basic Auth，而 Halo29 正是用它做认证。开启方式是在 **Halo 容器的启动命令**里追加一个参数：

![在 Halo 容器启动命令里追加参数](/images/shots/halo-basic-auth.webp)

```bash
--halo.security.basic-auth.disabled=false
```

以 Docker Compose 为例，把参数加到 `command` 里：

```yaml
services:
  halo:
    image: registry.fit2cloud.com/halo/halo:2.20
    command:
      - --halo.security.basic-auth.disabled=false
```

以 `docker run` 为例：

```bash
docker run -d \
  --name halo \
  -p 8090:8090 \
  registry.fit2cloud.com/halo/halo:2.20 \
  --halo.security.basic-auth.disabled=false
```

改完**重启容器**生效。之后按下面的步骤配置即可正常使用。

::: tip 在 Portainer 里改
容器 → **Duplicate/Edit** → 找到 **Command** 那一行，在现有参数末尾追加 `--halo.security.basic-auth.disabled=false`，然后重新创建容器。
:::

::: warning 关于安全性
Basic Auth 会让账号密码以可解码的方式随请求发送。建议只在自用或内网站点开启，并确保站点使用 HTTPS。Halo 官方的 Basic Auth 说明见 [RESTful API 文档](https://docs.halo.run/developer-guide/restful-api/introduction/#basic-auth)。
:::

## 三、配置

| 字段 | 填什么 |
|------|--------|
| 平台首页 | Halo 站点首页地址，通常与 API 地址一致，如 `https://yourhalo.com` |
| API 地址 | Halo 站点 API 地址，通常与首页地址相同 |
| 用户名 | Halo 登录用户名（非令牌） |
| 密码 | Halo 登录密码，与用户名一起用于 API 认证（非令牌） |
| 预览规则 | 默认 `/archives/{slug}`；查看链接为 `https://<host>/archives/<slug>`，可修改 |
| 图床 | 三选一：「不使用」按原地址引用图片（图片需可公网访问）；「当前平台」上传到 Halo 附件，文章中为 `/upload/<图片名>`；「PicGo」先传外部图床再引用外链。带思源本地图片发布时选「当前平台」 |

## 四、验证与发布

1. 点「验证」→ 拉取分类列表 → 选择文章所属分类 → 保存。
2. 快速发布 → 选 Halo29 → 发布。

## 常见问题

### 验证失败，提示认证错误

Halo 2.20+ 多半是没开 Basic Auth。按第二节在容器启动命令里加上 `--halo.security.basic-auth.disabled=false` 并重启容器。

### 验证通过但发布失败

确认平台首页与 API 地址可访问（http 与 https 保持一致）、用户名与密码正确，且账号有发文与上传附件的权限。

### 图片要怎么发布

选「当前平台」图床，图片会上传到 Halo 附件，文章中展示为 `/upload/<图片名>`。

### 查看链接打不开

确认预览规则（默认 `/archives/{slug}`）与该文章的 slug 匹配，且文章已发布、不是草稿状态。

### 和「Halo网页版」有什么区别

| | Halo29（本页） | Halo网页版 |
|---|---|---|
| 认证 | 用户名 + 密码（Basic Auth） | 浏览器 Cookie |
| 适用版本 | Halo 2.x（2.20+ 需开 Basic Auth） | Halo 2.x |
| 需要改容器参数 | 2.20+ 需要 | 不需要 |

如果不想改容器配置，可以用 [Halo 网页版](./custom-haloweb)。