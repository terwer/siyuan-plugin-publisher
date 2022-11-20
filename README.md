# sy-post-publisher

将 [思源笔记](https://github.com/siyuan-note/siyuan) 的文章发布到支持的开放平台的 **思源笔记挂件**

目前支持 `Vuepress` 、 以及 2 种博客平台标准、`metaweblog api` 和基于 `Wordpress` 的 `xmlrpc` 远程调用 api

同时提供了一个 [统一通用的API适配器](https://github.com/terwer/src-sy-post-publisher/blob/main/src/lib/api.ts)，让适配任何平台成为可能。

![](https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/project/sy-post-publisher/preview.png)

[点击查看项目源码](https://github.com/terwer/src-sy-post-publisher)

[点击查看帮助文档](https://mp.terwer.space/post/readme-1j4ltp.html)

[点击查看新手小白级视频教程](https://mp.terwer.space/post/configure-entry-video-brpm9.html)

## 尝鲜体验

从 0.1.0+ 版本开始，增加临时尝鲜版，直接体验最新特性，无需等待版本发布，支持自定义配置思源笔记的API地址。只要修改思源API地址和token即可，网页版需要填写外网地址。所有配置均存储在浏览器本地。切换浏览器或者换电脑配置不共享。

猛击入口体验：https://publish.terwer.space/blog/index.html

共享说明：https://publish.terwer.space/detail/index.html?id=20221120201546-daxmt2z

## 快速上手

|                                          商店                                           |                                                                                           版本                                                                                            | 上架状态 |
|:-------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----:|
|  ![](https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/icons/browser/edge20.svg)   | [v0.0.3](https://microsoftedge.microsoft.com/addons/detail/%E6%80%9D%E6%BA%90%E7%AC%94%E8%AE%B0%E5%8F%91%E5%B8%83%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7/aejmkigifflimhjlhjkdckclhabbilee) | 已上架  |
| ![](https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/icons/browser/chrome20.svg)  |     [v0.0.3](https://chrome.google.com/webstore/detail/%E6%80%9D%E6%BA%90%E7%AC%94%E8%AE%B0%E5%8F%91%E5%B8%83%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7/gemlnnppcphbiimfjnobfgdkohjmgifm)     | 已上架  |
| ![](https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/icons/browser/firefox20.png) |                                                                                           ---                                                                                           | 审核中  |
|  ![](https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/icons/browser/360-20.png)   |                                                                                           ---                                                                                           | 审核中  |
|                                          网页版                                          |                                                                 [v0.0.3](https://publish.terwer.space/blog/index.html)                                                                  | 可使用  |
|                                         离线zip                                         |                                  [v0.0.3](https://github.com/terwer/src-sy-post-publisher/releases/download/v0.0.3/sy-post-publisher-chrome-0.0.3.zip)                                  | 可下载  |
|                                          挂件版                                          |                                                                  [v0.0.3](https://github.com/terwer/sy-post-publisher)                                                                  | 可使用  |

小贴士：

1. 推荐直接从 `思源笔记集市`、 `Chrome商店` 或者 `Edge商店` 等官方商店下载使用。

   由于技术限制，`Firefox插件` 目前不支持 `Minifist V3` 以及 `background messsage` 事件这个关键特性，需要额外使用请求代理，参照 [#143](https://github.com/terwer/src-sy-post-publisher/issues/143) 。这样的话，性能会差一点，但是功能完全可用。代理地址为：https://publish.terwer.space/api/middleware

2. 如果您想 `临时尝鲜新版无需等待版本发布` 可以从网页版直接使用，网页版访问地址：https://publish.terwer.space/blog/index.html

   只要修改思源API地址和token即可，网页版需要填写外网地址。

   **本插件承诺：所有配置均存储在浏览器本地，本程序不会收集任何敏感资料，请放心使用。本程序不会开发，将来也永远不会开发云端功能。**

3. 离线zip使用方法=>将zip文件解压到某个目录，打开浏览器插件开发者模式，点击加载已解压的扩展程序，选择刚刚解压的目录即可。

4. 因为所有配置是配置直接存储在浏览器本地，切换浏览器数据不会共享。卸载插件也会清空所有的配置数据，后续会考虑配置备份功能(需要调研实现这个需求的必要性)。

## 最近更新

[点击这里查看开发进度](https://github.com/users/terwer/projects/1/views/1)

* 0.0.3 关键特性

  2022-09-28 发布

  * feat: #62 [标题支持数字编号](https://github.com/terwer/src-sy-post-publisher/pull/62)

    例如在思源笔记的标题为 `023.利用pm2后台运行nodejs程序`，发布的时候会自动去掉编号变成 `利用pm2后台运行nodejs程序`。这样做的目的是保持文章在思源笔记的结构化，然后又不影响其他平台的展示。
  * feat: #72 [Wordpress默认发布为Markdown](https://github.com/terwer/src-sy-post-publisher/pull/72)

    这里还做了进一步的优化，现在发布方式支持配置了，可以自定发布为 markdown 还是 HTML，满足不同平台诉求。
  * feat: #76 [动态类型支持选择发布格式](https://github.com/terwer/src-sy-post-publisher/pull/76)

    支持 HTML 和 Markdown 两种发布格式。
  * fix: #73 [发布到语雀偶发的获取默认知识库失败问题](https://github.com/terwer/src-sy-post-publisher/pull/73)
  * feat: #103 [支持可设置分类的平台选择分类-语雀支持选择分类](https://github.com/terwer/src-sy-post-publisher/pull/103)
  * feat: #77 [支持Metaweblog选择分类（博客园、Wordpress等）](https://github.com/terwer/src-sy-post-publisher/pull/77)
  * feat: #81 [支持取消所有平台](https://github.com/terwer/src-sy-post-publisher/pull/81)

    所有平台均支持关闭，不再强制内置任何平台，默认所有平台关闭，用户自行启用。
  * feat: #88 [适配暗色模式](https://github.com/terwer/src-sy-post-publisher/pull/88)​

    现在所有页面都支持暗色模式和浅色模式切换
  * feat: #89 [整合node-siyuan到挂件【非挂件模式】](https://github.com/terwer/src-sy-post-publisher/pull/89)​

    非挂件模式提供文章列表页面，整合我的另外一个 node-siyuan 项目。
  * feat: #99 [Google插件扩展](https://github.com/terwer/src-sy-post-publisher/pull/99)​

    现在可以直接在 Google Chrome 插件扩展中使用了。
  * feat: #102 [代码优化以及空状态处理](https://github.com/terwer/src-sy-post-publisher/pull/102)​

    现在支持加载过程中展示骨架，提供更好的体验。
  * feat: #104 [动态类型支持自定义预览地址](https://github.com/terwer/src-sy-post-publisher/pull/104)​

* 0.0.4 版本预告

  预计 2022-12-31 发布

  * [ ] 支持发布到印象笔记
  * [ ] 支持详情页导出Anki记忆卡【非挂件模式】
  * [ ] 支持微信消息、微信公众号、CSDN、简书、知乎（预研，目前没有公开API，可能需要借助cookie模拟登陆）
  * [ ] 支持Github pages、HUGO、Jekyll、Next.js content、Nuxt.js content
  * [ ] 集成PicGO，可直接粘贴图片自动上传。旧文档的非图床图片，在发布时候使用PicGO上传然后再发布
  * [ ] 详情页支持下载所有图片到本地，并打包成带assets文件夹和md文件的zip包，这个主要是某些分享场景网络不畅通可能有用
  * [ ] 支持发布时候选择一键剔除外链图片，主要是个别平台不允许外链图片

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

|工具|版本|
| ------| --------|
|node|v16.16.0|
|yarn|1.22.19|
|vercel|28.0.1|
|pm2|5.2.0|

## 环境变量

**设置环境变量**

复制 `.env.local.example` 文件到 `.env.local` (会被 git 忽略):

```bash
cp .env.local.example .env.local
```

打开 `.env.local` 并且设置 VITE_SIYUAN_API_URL 。例如：
http://127.0.0.1:6806。

你的 `.env.local` 文件大概像下面这样：

```properties
# 是否开启info日志，true | false，建议生产环境设置为false
VITE_LOG_INFO_ENABLED=false

# 思源笔记授权api
VITE_SIYUAN_API_URL=http://127.0.0.1:6806
# 思源笔记授权token
VITE_SIYUAN_CONFIG_TOKEN=

# 开发阶段模拟的页面ID，仅限调试使用，生产环境无需此配置
# VITE_SIYUAN_DEV_PAGE_ID=

# 非挂件模式需要中间服务器实现跨域，生产环境可不设置，使用本项目
# VITE_MIDDLEWARE_URL=https://publish.terwer.space/api/middleware
VITE_MIDDLEWARE_URL=
```

你也可以设置 `.env.development.local`, `.env.production.local`, `.env.test.local` 用于不同环境，开发、测试、构建等。

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

**特别提醒：**

如果你觉得 vervel 不利于热加载，也可以用下面的方式开发启动，但是环境变量 `VITE_MIDDLEWARE_URL` 需要设置跨域代理，我这里提供一个

```properties
VITE_MIDDLEWARE_URL=https://publish.terwer.space/api/middleware
```

然后用下面命令启动，可以支持热加载。

```bash
yarn dev
```

浏览器默认入口连接是

http://localhost:3000/blog/index.html

## 部署

从 0.0.3+ 版本开始，思源笔记发布辅助工具提供 3 种部署方式。

### 方式 1、部署到思源笔记挂件

```bash
yarn w
```

压缩 `dist` 文件夹为 `.zip`, 上架思源笔记挂件集市。

### 方式 2、部署到 Google Chrome 浏览器插件

```bash
yarn e
```

将密钥文件修改为 key.pem 放到 extension/chrome 文件夹 , 然后压缩 `extension/chrome` 文件夹里面的所有文件为 `.zip`, 上架 Google Chrome 应用商店。

### 方式 3、部署到服务器后台服务

准备

```bash
npm i -g yarn
npm i -g vercel
npm i -g pm2
```

启动

```bash
pm2 start pm2.json
```

停止

```bash
pm2 stop pm2.json
```

查看

```bash
pm2 ls
```