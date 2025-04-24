[English](README.md)

# 发布工具

<img alt="logo" width="160" height="160" src="./icon.png"/>

将思源笔记的文章发布到语雀等平台，`开源`、`免费` 。

> [猛击这里](https://siyuan.wiki/s/20230810132040-nn4q7vs)，查看最新帮助文档。

**遇到其他问题或者需求建议？1群已满，请加QQ2群讨论。**

[![](https://img.shields.io/badge/QQ群-722632752-blue)](https://qm.qq.com/cgi-bin/qm/qr?k=fYrA79XDvtr4JuEgez-dmj1h3tOef8pg&jump_from=webapi&authKey=DC+XcjkoTH762jxvkSgpt7V97QFETnaLVTZIWhd8PdZoX+MNSr+LsprWFYYELXu8)

收费的 [在线分享专业版](https://siyuan.wiki) 已上线，一键分享您的思源笔记，欢迎关注。

## 更新历史

请直接查看 [CHANGELOG](https://github.com/terwer/siyuan-plugin-publisher/blob/main/CHANGELOG.md)

## 开发

请参考 [DEVELOPMENT](https://github.com/terwer/siyuan-plugin-publisher/blob/main/DEVELOPMENT.md)

## 平台列表

排名不分先后

注意：图片上传可用指的是安装 [PicGo 图床<sup>1.9.0+</sup>](https://github.com/terwer/siyuan-plugin-picgo) 并正确配置的前提下。

|      类型      |      平台       | 状态 | PC 客户端 | PC 图片上传 |         Docker         | Docker 图片上传 | 平台图片上传 | Docker 代理 | PC 端代理 | 备注                                           |
| :------------: | :-------------: | :--: | :-------: | :---------: | :--------------------: | :-------------: | ------------ | ----------- | --------- | :--------------------------------------------- |
|      通用      |      语雀       |  ✔   | 完全兼容  |      ✔      |        完全兼容        |        ✔        | 不支持       | 内置代理    | 不需要    | [官网](https://yuque.com)                      |
|      通用      |     Notion      |  ✔   | 完全兼容  |      ✔      |        完全兼容        |        ✔        | 不支持       | 内置代理    | 不需要    | [官网](https://www.notion.so)                  |
|      通用      |      Halo       |  ✔   | 完全兼容  |      ✔      |        完全兼容        |        ✔        | 支持         | 内置代理    | 不需要    | [官网](https://halo.run)                       |
|      通用      |    印象笔记     | TODO |   TODO    |    TODO     |          TODO          |      TODO       | TODO         | TODO        | TODO      | [官网](https://www.yinxiang.com)               |
|      通用      |     Github      |  ✔   | 完全兼容  |      ✔      |        完全兼容        |        ✔        | 支持         | 不需要      | 不需要    | [官网](https://github.com)                     |
| 静态网站生成器 |      Hexo       |  ✔   | 完全兼容  |      ✔      |        完全兼容        |        ✔        | 支持         | 不需要      | 不需要    | [官网](https://hexo.io/zh-cn/)                 |
| 静态网站生成器 |      Hugo       |  ✔   | 完全兼容  |      ✔      |        完全兼容        |        ✔        | 支持         | 不需要      | 不需要    | [官网](https://gohugo.io/)                     |
| 静态网站生成器 |     Jekyll      |  ✔   | 完全兼容  |      ✔      |        完全兼容        |        ✔        | 支持         | 不需要      | 不需要    | [官网](https://jekyllrb.com/)                  |
| 静态网站生成器 |    Vuepress     |  ✔   | 完全兼容  |      ✔      |        完全兼容        |        ✔        | 支持         | 不需要      | 不需要    | [官网](https://vuepress.vuejs.org/)            |
| 静态网站生成器 |    Vuepress2    |  ✔   | 完全兼容  |      ✔      |        完全兼容        |        ✔        | 支持         | 不需要      | 不需要    | [官网](https://v2.vuepress.vuejs.org/)         |
| 静态网站生成器 |    Vitepress    |  ✔   | 完全兼容  |      ✔      |        完全兼容        |        ✔        | 支持         | 不需要      | 不需要    | [官网](https://vitepress.vuejs.org/)           |
| 静态网站生成器 |     Antora      | TODO |   TODO    |    TODO     |          TODO          |      TODO       | TODO         | TODO        | TODO      | [官网](https://antora.org/)                    |
| 静态网站生成器 |     Docsify     | TODO |   TODO    |    TODO     |          TODO          |      TODO       | TODO         | TODO        | TODO      | [官网](https://docsify.js.org/)                |
|    Git 托管    |     Gitlab      |  ✔   | 完全兼容  |      ✔      |        完全兼容        |        ✔        | 支持         | 不需要      | 不需要    | [官网](https://gitlab.com/)                    |
|    Git 托管    |   Gitlabhexo    |  ✔   | 完全兼容  |      ✔      |        完全兼容        |        ✔        | 支持         | 不需要      | 不需要    | [官网](https://gitlab.com/)                    |
|    Git 托管    |   Gitlabhugo    |  ✔   | 完全兼容  |      ✔      |        完全兼容        |        ✔        | 支持         | 不需要      | 不需要    | [官网](https://gitlab.com/)                    |
|    Git 托管    |  Gitlabjekyll   |  ✔   | 完全兼容  |      ✔      |        完全兼容        |        ✔        | 支持         | 不需要      | 不需要    | [官网](https://gitlab.com/)                    |
|    Git 托管    | Gitlabvuepress  |  ✔   | 完全兼容  |      ✔      |        完全兼容        |        ✔        | 支持         | 不需要      | 不需要    | [官网](https://gitlab.com/)                    |
|    Git 托管    | Gitlabvuepress2 |  ✔   | 完全兼容  |      ✔      |        完全兼容        |        ✔        | 支持         | 不需要      | 不需要    | [官网](https://gitlab.com/)                    |
|    Git 托管    | Gitlabvitepress |  ✔   | 完全兼容  |      ✔      |        完全兼容        |        ✔        | 支持         | 不需要      | 不需要    | [官网](https://gitlab.com/)                    |
|    Git 托管    |  Gitlabantora   | TODO |   TODO    |    TODO     |          TODO          |      TODO       | TODO         | TODO        | TODO      | [官网](https://gitlab.com/)                    |
|    Git 托管    |  Gitlabdocsify  | TODO |   TODO    |    TODO     |          TODO          |      TODO       | TODO         | TODO        | TODO      | [官网](https://gitlab.com/)                    |
|      博客      |   Metaweblog    |  ✔   | 完全兼容  |      ✔      |        完全兼容        |        ✔        | 支持         | 内置代理    | 不需要    | [官网](http://xmlrpc.scripting.com/metaWeblog) |
|      博客      |     CnBlogs     |  ✔   | 完全兼容  |      ✔      |        完全兼容        |        ✔        | 支持         | 内置代理    | 不需要    | [官网](https://cnblogs.com)                    |
|      博客      |     Typecho     |  ✔   | 完全兼容  |      ✔      |        完全兼容        |        ✔        | 支持         | 内置代理    | 不需要    | [官网](https://typecho.org/)                   |
|      博客      |      Jvue       |  ✔   | 完全兼容  |      ✔      |        完全兼容        |        ✔        | 支持         | 内置代理    | 不需要    | [官网](https://github.com/terwer/jvue)         |
|      博客      |    WordPress    |  ✔   | 完全兼容  |      ✔      |        完全兼容        |        ✔        | 支持         | 内置代理    | 不需要    | [官网](https://wordpress.org/)                 |
|      博客      |  WordPress.com  |  ✔   | 完全兼容  |      ✔      |        完全兼容        |        ✔        | 支持         | 自建代理    | 自建代理  | [官网](https://wordpress.com)                  |
|    社交媒体    |      知乎       |  ✔   | 完全兼容  |      ✔      | PC 验证或者填写 Cookie |        ✔        | 支持         | 内置代理    | 不需要    | [官网](https://www.zhihu.com/)                 |
|    社交媒体    |      CSDN       |  ✔   | 完全兼容  |      ✔      | PC 验证或者填写 Cookie |        ✔        | 支持         | 内置代理    | 不需要    | [官网](https://www.csdn.net/)                  |
|    社交媒体    |   微信公众号    |  ✔   | 完全兼容  |      ✔      |      填写 Cookie       |        ✔        | 支持         | 内置代理    | 不需要    | [官网](https://mp.weixin.qq.com/)              |
|    社交媒体    |      简书       |  ✔   | 完全兼容  |      ✔      | PC 验证或者填写 Cookie |        ✔        | 支持         | 内置代理    | 不需要    | [官网](https://www.jianshu.com/)               |
|    社交媒体    |      掘金       |  ✔   | 完全兼容  |      ✔      | PC 验证或者填写 Cookie |        ✔        | 不支持       | 内置代理    | 不需要    | [官网](https://juejin.cn/)                     |
|      社区      |     52破解      | TODO |   TODO    |    TODO     |          TODO          |      TODO       | TODO         | TODO        | TODO      | [官网](https://www.52pojie.cn/)                |
|      社区      |    Bilibili     | TODO |   TODO    |    TODO     |          TODO          |      TODO       | TODO         | TODO        | TODO      | [官网](https://www.bilibili.com/)              |
|      社区      |     小红书      | TODO |   TODO    |    TODO     |          TODO          |      TODO       | TODO         | TODO        | TODO      | [官网](https://www.xiaohongshu.com/)           |
|      社区      |      豆瓣       | TODO |   TODO    |    TODO     |          TODO          |      TODO       | TODO         | TODO        | TODO      | [官网](https://www.douban.com/)                |
|      其他      |      Xlog       | TODO |   TODO    |    TODO     |          TODO          |      TODO       | TODO         | TODO        | TODO      | [官网](https://xlog.cn/)                       |
|      其他      |     Mdnice      | TODO |   TODO    |    TODO     |          TODO          |      TODO       | TODO         | TODO        | TODO      | [官网](https://mdnice.com/)                    |
|      其他      |     Flowus      | TODO |   TODO    |    TODO     |          TODO          |      TODO       | TODO         | TODO        | TODO      | [官网](https://www.flowus.com/)                |
|      其他      |   telegra.ph    |  ✔   | 完全兼容  |      ✔      |        完全兼容        |        ✔        | 不支持       | 自建代理    | 自建代理  | [官网](https://telegra.ph)                     |

## 核心特色

- [x] **极速发布**：一次配置，一键发布
- [x] **图床管理**：集成 PicGO 图床，支持
  s3、minio、水印插件，需要在集市安装 [Picgo 插件](https://github.com/terwer/siyuan-plugin-picgo) ，**目前仅支持 PC 客户端**
- [x] **支持扩展**：基于统一的博客 API 规范，内置 metaweblogAPI 、 WordPress 、Wechatsync 和 Github
  支持，并提供了统一的适配器，理论上可支持扩展到任何平台
- [x] **平台开关**：所有平台均支持启用禁用
- [x] **动态新增**：支持自定义添加平台
- [x] **AI 集成**：集成自由聊天和基于当前文档上下文的聊天
- [x] **智能分类**：支持智能 slug 别名、智能标题、智能摘要、智能标签、智能分类
- [x] **文章绑定**：支持关联已有的平台文章到思源笔记，方便后续管理，支持思源-> 平台单向同步
- [x] **适应主题**：自动适配暗黑模式与浅色模式
- [x] **语言支持**：多语言支持，支持中文版和英文版
- [x] **发布视图**：支持多种发布视图，简单模式、详细模式和源码模式
- [x] **多种部署**：支持思源笔记插件<sup>强烈推荐</sup>、Chrome 浏览器扩展、自部署

本插件承诺，**插件本身的基础功能永久免费**
，第三方平台提供的相关服务的可能需要自己注册账号或者购买服务。如果您想支持开发者，请在这里 [随意打赏](https://github.com/terwer/siyuan-plugin-publisher/blob/main/README_zh_CN.md#捐赠)。

> 🌹 温馨提示：这个插件是原 `思源笔记发布工具` 挂件的插件升级版，功能包含原有挂件提供的所有功能，同时提供了方便的菜单操作入口，并进行了一系列问题修复和体验优化。
>
> 除 [扩展功能] 外，**其他功能无需任何依赖** ，也无需下载之前的挂件，挂件在插件中已经内置。

## 思源笔记兼容情况

本插件完全兼容 **思源笔记PC客户端、Docker版<sup>1.20.2+</sup>、移动客户端（安卓、iOS）<sup>1.20.2+</sup>** 。

## 支持的分类体系

- [x] 分类

    - [x] 多选分类

- [x] 知识空间

    - [x] 单选知识空间
    - [x] 树形单选知识空间

- [x] 标签

    - [x] 多选标签

- [x] 标签别名
    - [x] 单选标签别名

## 平台适配计划

如果你有想使用的平台，但是此工具目前还没实现，可在这里提交 [思源笔记发布工具插件平台适配跟踪表](https://terwergreen.feishu.cn/share/base/form/shrcnGRdThUiqnhBg15xgclMM0c)
，开发者会考虑列入开发计划中。

平台适配情况请查看请参考 [最新适配情况](https://terwergreen.feishu.cn/share/base/view/shrcnWT2IGIz1r94z9qvqUghDzd)

## 版本预告

### 1.26.2-preview - 截止到 2025 年 Q1

- 解决部分平台在某些场景下重复上传图片的问题
- 修复微信公众号排版问题
- #990 修复发布到简书时部分格式显示不正常的问题
- #989 部分文章发布到 Notion 失败
- 修复部分场景发布到微信公众号报错的问题
- #948 #905 halo 平台相关问题修复
- vuepress2 相关问题

### 1.26.3-preview - 截止到 2025 年 Q1

- 支持 B 站、小红书

### 1.27.0-preview - 截止到 2025 年 Q2

- 支持 Evernote、Antora（包括 GitHub 和 gitlab）

### 1.28.0-preview - 截止到 2025 年 Q2

- 支持 Docsify（包括 GitHub 和 gitlab）、Douban

### 1.29.0-preview - 截止到 2025 年 Q2

- 支持 flowus

### 1.30.0-preview - 截止到 2025 年 Q2

- 支持 Xlog、mdnice、zola

### 1.31.0-preview - 截止到 2025 年 Q3

- #956 和 OceanPress 联动

## FAQ

- Q1：发布工具插件怎么安装？安装之后在哪里找到他的入口？

  A1：找到 **`集市->插件->发布工具`** 下载启用即可。

  安装过程无需其他任何操作。这个跟其他插件的下载安装无任何区别。

  安装完成后，在顶部右侧工具栏找到 ✈️ 图标，点击菜单，按照对应说明操作使用即可。

- Q2：装了发布工具插件之后，还需要安装挂件吗？

  A2：**不需要。**

  插件版包含挂件版的所有功能。

- Q3：我不习惯新版操作，想继续使用以前的挂件，可以吗？

  A3：**可以但是不推荐。**

  **我们强烈推荐您直接使用插件版，因为插件版将是以后长久维护的主要版本，挂架版本已废弃，仅作为修复问题以及兼容历史用户。**

- Q4：我以前是通过 `自定义JS片段 ` 或者 直接添加 `挂件` 来使用的，现在还需要下载该插件吗？

  A4：**可选。** 但是我们强烈推荐您删除 JS 片段和挂件，下载插件版使用。

  如果您不想使用插件版，那么您无需下载，使用原有 `自定义 JS 片段` 或者 添加 `挂件` 继续使用即可。

  如果您想使用插件版，那么我们强烈建议您删除之前添加的 `自定义JS片段` 和 `挂件`，直接下载插件版，启用即可。无需其他额外操作。

- Q5：我的历史配置数据项迁移到插件，可以吗？
- A5：**可以。** 注意：数据迁移将在后续版本提供。

  请在 `发布设置->检测并迁移历史配置。` 操作。

  注意：挂件版配置数据导入仅支持 `sy-p-cfg-v0.8.1.json` 。

- Q6：我需要发布的平台，发布工具没有提供怎么办？
-

A6：参考：[平台适配计划](https://github.com/terwer/siyuan-plugin-publisher/blob/main/README_zh_CN.md#平台适配计划 "平台适配计划")

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

### 爱发电

https://afdian.net/a/terwer

# 感谢

感谢第三方框架对本项目底层的支持

排名不分先后

|    Name     | version |  vendor   |
| :---------: | :-----: | :-------: |
|    turbo    |  1.9+   |  Vercel   |
|     Vue     | 3.3.4+  | Evan You  |
|    Vite     |  4.2+   | Evan You  |
| TypeScript  |  5.0+   | Microsoft |
| siyuan-note | 2.9.0+  |    D,V    |

- 感谢 [leolee9086](https://github.com/leolee9086) 和 [赐我一胖]() 提供的图标资源

- 感谢以下热心用户的支持，我会坚持一直持续更新维护下去！

    - 2024-03-31 *仁 捐赠到 [发布工具]
    
    - 2024-03-22 *铭 捐赠到 [发布工具]
    - 2024-03-05 *ruler 捐赠到 [发布工具]
    
    - 2024-03-12 *? 捐赠到 [发布工具]
    - 2024-03-04 *azar 捐赠到 [发布工具]
    - 2024-02-28 *昭 捐赠到 [发布工具]
    - 2024-01-15 自* 捐赠到 [发布工具]
    - 2024-01-09 自* 捐赠到 [发布工具]
    - 2023-11-12 S* 捐赠到 [发布工具]
    - 2023-10-15 *线 捐赠到 [发布工具]
    - 2023-09-04 \*霞 捐赠到 [发布工具]
    - 2023-08-31 \*成 捐赠到 [发布工具] 感谢提供笔记发布工具，催更
    - 2023-08-31 \*? 捐赠到 [发布工具] 感谢提供思源笔记发布工具
    - 2023-08-14 \*? 捐赠到 [发布工具]
    - 2023-08-10 \*f 捐赠到 [发布工具] 为发布插件点赞
    - 2023-08-10 \*2 捐赠到 [发布工具] 支持开发思源发布插件
    - 2023-07-13 \*亮 捐赠到 [文档别名] 有没有可能把功能扩展到 H1？
    - 2023-07-09 \*z 捐赠到 [在线分享] 在线分享插件好用，感谢
    - 2023-06-14 \*俊 捐赠到 [文档漫游] 感谢文档漫游这个功能
    - 2023-01-16 \*站 捐赠到 [导入工具] 终于可以导入 epub 了
    
      如果您不想展示捐赠信息，可直接发邮件到 youweics@163.com 。
