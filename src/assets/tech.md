## 愿景

<h1>用思源笔记记录你的创作，剩下的交给我</h1>

为什么要做这个项目？

发布到不同平台，并且保持同步，一直以来都是一个痛苦的过程。试想一下，带着灵感满心欢喜的创作完成，然后打开每个平台，登录账号，复制粘贴，修改格式，填写属性，点击发布，还没到最后一步，已经感觉不耐烦了。如果有多个平台，那会更加抓狂。

此时，您可能会想，要是有一个一次配置，然后以后一键发布更新的该多好。恭喜你，用我就对了。

如果您有幸接触我这个不起眼的项目，我希望它能让这个过程变成自动的（或者某种操作简单的半自动）、高效的、愉快的，这也是创作本来该有的体验。

## 尝鲜体验

从 0.1.0+ 版本开始，增加临时尝鲜版，直接体验最新特性，无需等待版本发布，支持自定义配置思源笔记的 API 地址。只要修改思源 API
地址和 token 即可，网页版需要填写外网地址。所有配置均存储在浏览器本地。切换浏览器或者换电脑配置不共享。

猛击入口体验：https://publish.terwer.space/blog/index.html

共享说明：https://publish.terwer.space/detail/index.html?id=20221120201546-daxmt2z

## 快速上手

|                                         商店                                         |                                                                                          版本                                                                                           | 上架状态 |
| :----------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------: |
|  ![](https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/icons/browser/edge20.svg)  | [latest](https://microsoftedge.microsoft.com/addons/detail/%E6%80%9D%E6%BA%90%E7%AC%94%E8%AE%B0%E5%8F%91%E5%B8%83%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7/aejmkigifflimhjlhjkdckclhabbilee) |  已上架  |
| ![](https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/icons/browser/chrome20.svg) |     [latest](https://chrome.google.com/webstore/detail/%E6%80%9D%E6%BA%90%E7%AC%94%E8%AE%B0%E5%8F%91%E5%B8%83%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7/gemlnnppcphbiimfjnobfgdkohjmgifm)     |  已上架  |
|                                        网页版                                        |                                                                 [latest](https://publish.terwer.space/blog/index.html)                                                                  |  可使用  |
|                                       离线 zip                                       |                                                           [latest](https://github.com/terwer/sy-post-publisher/releases)                                                            |  可下载  |
|                                        挂件版                                        |                                                             [latest](https://github.com/terwer/sy-post-publisher/releases)                                                              |  可使用  |

小贴士：

1. 推荐直接从 `思源笔记集市`、 `Chrome商店` 或者 `Edge商店` 等官方商店下载使用。

2. 如果您想 `临时尝鲜新版无需等待版本发布`
   可以从网页版直接使用，网页版访问地址：https://publish.terwer.space/blog/index.html

   只要修改思源 API 地址和 token 即可，网页版需要填写外网地址。

   **本插件承诺：所有配置均存储在浏览器本地，本程序不会收集任何敏感资料，请放心使用。本程序不会开发，将来也永远不会开发云端功能。
   **

3. 离线 zip 使用方法=>将 zip 文件解压到某个目录，打开浏览器插件开发者模式，点击加载已解压的扩展程序，选择刚刚解压的目录即可。

4. 因为所有配置是配置直接存储在浏览器本地，切换浏览器数据不会共享。卸载插件也会清空所有的配置数据，后续会考虑配置备份功能(
   需要调研实现这个需求的必要性)。

## 核心特性

目前支持基于 `Github` <sup>0.0.1+</sup> 、 `metaweblog API` <sup>0.0.2+</sup> 、`Wordpress API` <sup>0.0.2+</sup>
以及 `自定义HTTP协议` <sup>1.0.0+(预研)</sup> 的平台

同时提供了一个 [统一通用的 API 适配器](https://github.com/terwer/sy-post-publisher/blob/main/utils/api.ts)
，让适配任何平台成为可能。

- [x] 兼容 Metaweblog API 以及自定义平台 <sup>0.0.3+</sup>
- [x] 支持平台开关 <sup>0.0.3+</sup>
- [x] 支持选择文章分类 <sup>0.0.3+</sup>
- [x] 自动生成 yaml（目前兼容 Vuepress，0.1.0 会兼容更多平台） <sup>0.0.1+</sup>
- [x] 自动生成文档别名（使用 Google 翻译）、摘要与标签（使用 jieba 分词） <sup>0.0.2+</sup>
- [x] 支持文章与平台绑定 <sup>0.0.2+</sup>
- [x] 支持文章文章更新与删除 <sup>0.0.2+</sup>
- [x] 自动适配暗黑模式与浅色模式 <sup>0.0.3+</sup>
- [x] 多语言支持，支持中文版和英文版 <sup>0.0.1+</sup>
- [x] 支持子目录模式 <sup>0.1.0+</sup>

  - 现在无需在所有页面引用挂件了，只需要在父级页面引用一个挂件即可。

  1. 如果检测到没有子文档，会兼容 0.0.3 版本以前的方式，展示当前文档的发布页面。

  2. 如果检测到有子文档，会以列表加分页的方式展示所有子文档列表。可单独选择某个子文档进行发布操作。

- [x] 发布页面支持预览 <sup>0.1.0+</sup>
- [ ] 支持自定义接口协议 <sup>1.0.0+</sup>
- [x] 支持文章标题使用数字编号 <sup>0.0.3+</sup>
- [x] [多平台支持，并且持续适配中](https://github.com/terwer/sy-post-publisher#%E6%94%AF%E6%8C%81%E5%B9%B3%E5%8F%B0) <sup>
      0.0.1+</sup>
- [x] 支持同步到 Github(Github pages、Hugo、Hexo、Jekyll、Vuepress、Vitepress、Nuxt content、Next.js)，0.1.0+
      之后更加通用，支持动态添加管理多个 <sup>0.0.1+</sup> <sup>0.1.0+</sup>
- [x] 支持多种发布视图，简单模式、详细模式和源码模式（Github 系列平台） <sup>0.1.0+</sup> <sup>0.0.1+</sup>
- [x] 支持自定义设置 API 地址，支持本地、局域网、远程 <sup>0.1.0+</sup>
- [x] 支持配置导入导出 <sup>0.2.0+</sup>
- [x] 通用设置支持标题序号开关、正文 H1 开关、新窗口开关、自动标签开关 <sup>0.2.0+</sup>
- [x] 支持设置 Anki 牌组标记 <sup>0.6.0+</sup>

  - anki 使用入门请参考：https://ld246.com/article/1670312056742

- [x] 支持通过 PicGO 管理图床 <sup>
      0.6.0+ [挂件版已经完美集成 PicGO，可直接使用；浏览器插件只能通过 HTTP 调用本地的 PicGO，需手动下载和配置]</sup>

  - PicGO 使用注意事项：

  1. 如果你使用的是浏览器插件，需要从这里下载配置 PicGO 客户端：https://github.com/Molunerfinn/PicGo/releases

  2. 如果你使用的是思源笔记挂件，需要自行配置已经集成好的 PicGO，挂件版 PicGO
     配置文件在：`[思源工作空间]/data/widgets/sy-post-publisher/lib/picgo/picgo.cfg.json`
     ，请参考 PicGO
     官方文档进行配置：https://picgo.github.io/PicGo-Core-Doc/zh/guide/config.html#%E6%89%8B%E5%8A%A8%E7%94%9F%E6%88%90

## Vue 3 + TypeScript + Vite

项目使用 Vue 3 框架，TypeScript 开发语言，Vite 作为构建工具。

项目使用了 Vue 3 的 `<script setup>`
，可以查看文档 [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) 了解更多。

## 推荐开发工具

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- IntelliJ IDEA 或者 WebStorm

## 依赖版本

| 工具   | 版本                 |
| ------ | -------------------- |
| node   | 16.16.0 <sup>+</sup> |
| pnpm   | 7.17.0 <sup>+</sup>  |
| vercel | 28.5.5 <sup>+</sup>  |

## 环境变量

**设置环境变量**

复制 `.env.local.example` 文件到 `.env.local` (会被 `git` 忽略):

```bash
cp .env.local.example .env.local
```

打开 `.env.local` 并且设置 `VITE_SIYUAN_API_URL` 。例如：
http://127.0.0.1:6806。

你的 `.env.local` 文件大概像下面这样：

```properties
## 是否开启info日志，true | false，建议生产环境设置为false
VITE_LOG_INFO_ENABLED=false

## 思源笔记授权api
VITE_SIYUAN_API_URL=http://127.0.0.1:6806
## 思源笔记授权token
VITE_SIYUAN_CONFIG_TOKEN=

## 开发阶段模拟的页面ID，仅限调试使用，生产环境无需此配置
## VITE_SIYUAN_DEV_PAGE_ID=

## 图表服务器
## PLANT_UML_SERVR=https://www.plantuml.com/plantuml/svg/
## PLANT_UML_SERVR=

## 非挂件模式需要中间服务器实现跨域，生产环境可不设置，使用本项目
## VITE_MIDDLEWARE_URL=https://api.terwer.space/api/middleware
VITE_MIDDLEWARE_URL=
```

你也可以设置 `.env.development.local`, `.env.production.local`, `.env.test.local` 用于不同环境，开发、测试、构建等。

参考 [Vite .env 设置文档](https://cn.vitejs.dev/guide/env-and-mode.html#env-files)

## 开发

### 准备

```bash
npm i -g pnpm
npm i -g vercel
```

### 开发阶段运行 <sup>推荐</sup>

```bash
pnpm install
pnpm serve

# windows
# pnpm serveWin
```

### 开发阶段调试

**特别提醒：**

`dev` 模式需要先设置环境变量 `VITE_MIDDLEWARE_URL` 用来支持请求跨域，我这里提供一个

```properties
VITE_MIDDLEWARE_URL=https://api.terwer.space/api/middleware
```

然后用下面命令启动，可以支持热加载。

```bash
pnpm dev

## windows
## pnpm devWin
```

浏览器默认入口连接是

http://localhost:3000/blog/index.html

## 一键打包

```bash
pnpm package
```

## 部署

从 0.0.3+ 版本开始，思源笔记发布辅助工具提供 3 种部署方式。

### 方式 1、部署到思源笔记挂件

```bash
pnpm widget

## windows
## pnpm widgetWin
```

提交 `dist` 文件夹到仓库, 上架思源笔记挂件集市。

### 方式 2、部署到 Google Chrome 浏览器插件

```bash
pnpm extChrome

## windows
## pnpm extChromeWin
```

插件调试

```bash
pnpm extChromeDev
```

将密钥文件修改为 `key.pem` 放到 `extension/chrome` 文件夹 , 然后压缩 `extension/chrome` 文件夹里面的所有文件为 `.zip` ,
上架 Google Chrome 应用商店。

### 方式 3、部署到服务器后台服务

```bash
vercel
```
