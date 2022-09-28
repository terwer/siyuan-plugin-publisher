# sy-post-publisher

将思源笔记的文章发布到支持的开放平台的**思源笔记挂件**

目前支持 Vuepress 以及 2 种博客平台标准、metaweblog api 和基于 Wordpress 的 xmlrpc 远程调用 api

同时提供了一个 [统一通用的API适配器](https://github.com/terwer/src-sy-post-publisher/blob/main/src/lib/api.ts)
，让适配任何平台成为可能。

**[点击查看帮助文档]()**

**[点击查看配置视频教程]()**

## 最近更新

[点击这里查看开发进度](https://github.com/users/terwer/projects/1/views/1)

- 0.0.3 key fatures

- [X] #1

[历史更新日志](Changelog.md)

## 支持平台

* [X] Vuepress

* [X] 博客园

* [X] 链滴社区

* [X] 语雀

* [X] Wordpress

* [X] Metaweblog API

## Vue 3 + TypeScript + Vite

项目使用 Vue 3 框架，TypeScript 开发语言，Vite 作为构建工具。

项目使用了 Vue 3 的 `<script setup>`
，可以查看文档 [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) 了解更多。

## 推荐开发工具

* [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

* IntelliJ IDEA 或者 WebStorm

## 依赖版本

| 工具     | 版本       |
|--------|----------|
| node   | v16.16.0 |
| yarn   | 1.22.19  |
| vercel | 28.0.1   |
| pm2    | 5.2.0    |

## 环境变量

**设置环境变量**

复制 `.env.local.example` 文件到 `.env.local` (会被git忽略):

```bash
cp .env.local.example .env.local
```

打开 `.env.local` 并且设置 SIYUAN_API_URL。例如：
http://127.0.0.1:6806。

你的 `.env.local` 文件大概像下面这样：

```properties
# log level
VITE_LOG_INFO_ENABLED=false
# siyuan api
VITE_SIYUAN_API_URL=http://127.0.0.1:6806
VITE_SIYUAN_CONFIG_TOKEN=
# middlware to support cors, optional
# VITE_MIDDLEWARE_URL=
```

你也可以设置`.env.development.local`, `.env.production.local`, `.env.test.local` 用于不同环境，开发、测试、构建等。

参考 [Vite .env 设置文档](https://cn.vitejs.dev/guide/env-and-mode.html#env-files)

## 开发

准备

```bash
npm i -g yarn
npm i -g vercel
```

开发阶段运行

```bash
# yarn create vite
yarn
yarn vdev
```

## 部署

从0.0.3版本开始，思源笔记发布辅助工具提供3种部署方式。

### 方式1、部署到思源笔记挂件

```bash
yarn w
```

压缩 `dist` 文件夹为 `.zip`, 上架思源笔记挂件集市。

### 方式2、部署到Google Chrome浏览器插件

```bash
yarn e
```

压缩 `extension` 文件夹为 `.zip`, 上架Google Chrome应用商店。

### 方式3、部署到服务器后台服务

准备

```bash
npm i -g yarn
npm i -g vercel
npm i -g pm2
```

启动

```bash
yarn pm2
```

停止

```bash
yarn pm2s
```

查看

```bash
pm2 ls
```