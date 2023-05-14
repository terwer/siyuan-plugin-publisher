[English](README.md)

# 发布工具

![](https://raw.githubusercontent.com/terwer/siyuan-plugin-publisher/main/plugins/publisher-main/public/icon.png)

将思源笔记的文章发布到语雀、Cnblogs、WordPress、Typecho、Hexo、Hugo 等支持的开放平台，支持极速发布、图床管理、平台扩展、智能标签等特色功能。

本插件承诺，所有功能永久免费。如果您想支持开发者，请在这里 [随意打赏](https://github.com/terwer/siyuan-plugin-publisher/blob/main/README_zh_CN.md#捐赠)。

> 🌹 温馨提示：这个插件是原 `思源笔记发布工具` 挂件的插件升级版，功能包含原有挂件提供的所有功能，同时提供了方便的菜单操作入口，并进行了一系列问题修复和体验优化。

> 如果想看 `0.8.0`
> 之前的版本，请参考我之前写的的挂件：[sy-post-publisher](https://github.com/terwer/src-sy-post-publisher)

## 核心特色

- **极速发布**：一次配置，一键发布
- **图床管理**：集成 PicGO 图床，支持 s3、minio、水印插件
- **支持扩展**：基于统一的博客 API 规范，内置 metaweblogAPI 、 WordPress 和 Github 支持，并提供了统一的适配器，理论上可支持扩展到任何平台
- **平台开关**：所有平台均支持启用禁用，默认开启博客园，可随时禁用
- **动态新增**：支持自定义添加平台
- **智能分类**：支持智能标签、智能 slug 别名、智能摘要，并持续完善中
- **文章绑定**：支持关联已有的平台文章到思源笔记，方便后续管理，支持思源-> 平台单向同步
- **适应主题**：自动适配暗黑模式与浅色模式
- **语言支持**：多语言支持，支持中文版和英文版
- **发布视图**：支持多种发布视图，简单模式、详细模式和源码模式
- **多种部署**：支持思源笔记插件、Chrome 浏览器扩展、自部署

## 平台列表

排名不分先后

- 博客园
- WordPress
- 语雀
- Github
    - Hexo
    - Hugo

## 平台适配计划

如果你有想使用的平台，但是此工具目前还没实现，可在这里提交 [思源笔记发布工具插件平台适配跟踪表](https://terwergreen.feishu.cn/share/base/form/shrcnGRdThUiqnhBg15xgclMM0c)
，开发者会考虑列入开发计划中。

平台适配情况请查看请参考 [最新适配情况](https://terwergreen.feishu.cn/share/base/view/shrcnWT2IGIz1r94z9qvqUghDzd)

## FAQ

* Q1：发布工具插件怎么安装？

  A1：找到 `集市->插件->发布工具` 下载启用即可。无需其他任何操作。这个跟其他插件的下载安装无任何区别。

‍

* Q2：装了发布工具插件之后，还需要安装挂件吗？

  A2：**不需要。**

  插件版包含挂件版的所有功能。

‍

* Q3：我不习惯新版操作，想继续通过插件使用以前的挂件，可以吗？

  A3：**可以。**

  插件默认内置了一个桥接器，可以通过插件唤起挂件。该功能需要在 `设置 -> 使用挂件版`​​ 开启。

  <u>注意 1：插件版用插件系统内置的菜单，所有插件版唤起的时候菜单插槽会禁用。</u>

  <u>注意 2：开启挂件版之后会关闭插件版的所有功能，避免引起混淆。</u>

  **我们强烈推荐您使用插件版，因为插件版将是以后长久维护的主要版本，挂架版本已废弃，仅作为修复问题以及兼容历史用户。**

‍

* Q4：我以前是通过 `自定义JS片段 ​`​​ 或者 直接添加 `挂件`​​ 来使用的，现在还需要下载该插件吗？

  A4：**可选。** 但是我们强烈推荐您删除 JS 片段和挂件，下载插件版使用。

  如果您不想使用插件版，那么您无需下载，使用原有 `自定义 JS 片段`​​ 或者 添加 `挂件`​​ 继续使用即可。

  如果您想使用插件版，那么我们强烈建议您删除之前添加的 `自定义JS片段`​​ 和 `挂件`​​，直接下载插件版，启用即可。无需其他额外操作。

‍

* Q5：我需要发布的平台，发布工具没有提供怎么办？
* A5：参考：[平台适配计划](https://github.com/terwer/siyuan-plugin-publisher/blob/main/README_zh_CN.md#平台适配计划 "平台适配计划")​

## 捐赠

如果您认可这个项目，请我喝一杯咖啡吧，这将鼓励我持续更新，并创作出更多好用的工具~

### 微信

<div>
<img src="https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/donate/wechat.jpg" alt="wechat" style="width:280px;height:375px;" />
</div>

### 支付宝

<div>
<img src="https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/donate/alipay.jpg" alt="alipay" style="width:280px;height:375px;" />
</div>

# 感谢

* 感谢第三方框架对本项目底层的支持

  排名不分先后

  |Name|version|vendor|
  | :---------: | :-----: | :---------: |
  |turbo|1.9+|Vercel|
  |vite|4.2+|Evan You|
  |Svelte|3.57+|Rich Harris|
  |TypeScript|5.0+|Microsoft|
  |siyuan-note|2.9.0+|D,V|

* 感谢 [leolee9086](https://github.com/leolee9086) 提供的图标资源