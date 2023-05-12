[English](README.md)

# 发布工具

将思源笔记的文章发布到语雀、cnblogs、WordPress、Typecho、HUGO、HEXO等支持的开放平台。

> 🌹温馨提示：这个插件是原 `思源笔记发布工具` 挂件的插件升级版，功能包含原有挂件提供的所有功能，同时提供了方便的菜单操作入口，并进行了一系列问题修复和体验优化。

> 如果想看 `0.8.0`
> 之前的版本，请参考我之前写的的挂件：[sy-post-publisher](https://github.com/terwer/src-sy-post-publisher)

## 核心特色

- **极速发布**：一次配置，一键发布
- **图床管理**：集成PicGO图床，支持 s3、minio、水印插件
- **支持扩展**：基于统一的博客API规范，内置 metaweblogAPI 、 WordPress 和 Github 支持，并提供了统一的适配器，理论上可支持扩展到任何平台
- **平台开关**：所有平台均支持启用禁用，默认开启博客园，可随时禁用
- **动态新增**：支持自定义添加平台
- **智能分类**：支持智能标签、智能slug别名、智能摘要，并持续完善中
- **文章绑定**：支持关联已有的平台文章到思源笔记，方便后续管理，支持思源->平台单向同步
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

## 捐赠

如果您认可这个项目，请我喝一杯咖啡吧，这将鼓励我持续更新，并创作出更多好用的工具~

### 微信

<img src="https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/donate/wechat.jpg" alt="wechat" style="width:280px;height:375px;" />

### 支付宝

<img src="https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/donate/alipay.jpg" alt="alipay" style="width:280px;height:375px;" />

# 感谢

感谢第三方框架对本项目底层的支持

排名不分先后

|    Name     | version |   vendor    |
|:-----------:|:-------:|:-----------:|
|    turbo    |  1.9+   |   Vercel    |
|   esbuild   |  0.17+  |    evanw    |
|    vite     |  4.2+   |  Evan You   |
|   Svelte    |  3.57+  | Rich Harris |
| TypeScript  |  5.0+   |  Microsoft  |
| siyuan-note | 2.9.0+  |     D,V     |
