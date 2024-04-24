[中文](README_zh_CN.md)

# Publisher

<img alt="logo" width="160" height="160" src="./icon.png"/>

Publish articles from siyuan-note to platforms like Yuque etc. `Free` and `open source`.

> Please [click here to see the latest docs](https://blog.terwer.space/s/20240330142711-bc3gjg0), it updates in real
> time.

**Should you encounter any issues or wish to submit suggestions, feel free to join QQ group `895063267` for discussions.**

If you're interested in the paid professional version, please check the paied
➡️ [Publishing Tool Professional Edition](https://github.com/terwer/siyuan-plugin-publisher-pro)

## Update history

Please check [CHANGELOG](./CHANGELOG.MD)

## Development

Please refer to [DEVELOPMENT](./DEVELOPMENT.md)

## Platform List

The sequence is insignificant

Note: Image upload availability refers to the installation
of [PicGo plugin<sup>1.9.0+</sup>](https://github.com/terwer/siyuan-plugin-picgo) and accurate
configuration.

|         Type          |        Platform         | Status |    PC Client     | PC Image Upload |           Docker           | Docker Image Upload | Platform Image Upload | Docker Proxy  | PC  Proxy    | Note                                                       |
| :-------------------: | :---------------------: | :----: | :--------------: | :-------------: | :------------------------: | :-----------------: | --------------------- | ------------- | ------------ | :--------------------------------------------------------- |
|        Generic        |          Yuque          |   ✔    |    Compatible    |        ✔        |         Compatible         |          ✔          | Not Supported         | Bundled Proxy | No           | [Official Website](https://yuque.com)                      |
|        Generic        |         Notion          |   ✔    |    Compatible    |        ✔        |         Compatible         |          ✔          | Not Supported         | Bundled Proxy | No           | [Official Website](https://www.notion.so)                  |
|        Generic        |          Halo           |   ✔    |    Compatible    |        ✔        |         Compatible         |          ✔          | Supported             | Bundled Proxy | No           | [Official Website](https://halo.run)                       |
|        Generic        |        Evernote         |  TODO  |       TODO       |      TODO       |            TODO            |        TODO         | TODO                  | TODO          | TODO         | [Official Website](https://www.evernote.com)               |
|        Generic        |         Github          |   ✔    |    Compatible    |        ✔        |         Compatible         |          ✔          | Supported             | No            | No           | [Official Website](https://github.com)                     |
| Static Site Generator |          Hexo           |   ✔    |    Compatible    |        ✔        |         Compatible         |          ✔          | Supported             | No            | No           | [Official Website](https://hexo.io/zh-cn/)                 |
| Static Site Generator |          Hugo           |   ✔    |    Compatible    |        ✔        |         Compatible         |          ✔          | Supported             | No            | No           | [Official Website](https://gohugo.io/)                     |
| Static Site Generator |         Jekyll          |   ✔    |    Compatible    |        ✔        |         Compatible         |          ✔          | Supported             | No            | No           | [Official Website](https://jekyllrb.com/)                  |
| Static Site Generator |        Vuepress         |   ✔    |    Compatible    |        ✔        |         Compatible         |          ✔          | Supported             | No            | No           | [Official Website](https://vuepress.vuejs.org/)            |
| Static Site Generator |        Vuepress2        |   ✔    |    Compatible    |        ✔        |         Compatible         |          ✔          | Supported             | No            | No           | [Official Website](https://v2.vuepress.vuejs.org/)         |
| Static Site Generator |        Vitepress        |   ✔    |    Compatible    |        ✔        |         Compatible         |          ✔          | Supported             | No            | No           | [Official Website](https://vitepress.vuejs.org/)           |
| Static Site Generator |         Antora          |  TODO  |       TODO       |      TODO       |            TODO            |        TODO         | TODO                  | TODO          | TODO         | [Official Website](https://antora.org/)                    |
| Static Site Generator |         Docsify         |  TODO  |       TODO       |      TODO       |            TODO            |        TODO         | TODO                  | TODO          | TODO         | [Official Website](https://docsify.js.org/)                |
|      Git Hosting      |         Gitlab          |   ✔    |    Compatible    |        ✔        |         Compatible         |          ✔          | Supported             | No            | No           | [Official Website](https://gitlab.com/)                    |
|      Git Hosting      |       Gitlabhexo        |   ✔    |    Compatible    |        ✔        |         Compatible         |          ✔          | Supported             | No            | No           | [Official Website](https://gitlab.com/)                    |
|      Git Hosting      |       Gitlabhugo        |   ✔    |    Compatible    |        ✔        |         Compatible         |          ✔          | Supported             | No            | No           | [Official Website](https://gitlab.com/)                    |
|      Git Hosting      |      Gitlabjekyll       |   ✔    |    Compatible    |        ✔        |         Compatible         |          ✔          | Supported             | No            | No           | [Official Website](https://gitlab.com/)                    |
|      Git Hosting      |     Gitlabvuepress      |   ✔    |    Compatible    |        ✔        |         Compatible         |          ✔          | Supported             | No            | No           | [Official Website](https://gitlab.com/)                    |
|      Git Hosting      |     Gitlabvuepress2     |   ✔    |    Compatible    |        ✔        |         Compatible         |          ✔          | Supported             | No            | No           | [Official Website](https://gitlab.com/)                    |
|      Git Hosting      |     Gitlabvitepress     |   ✔    |    Compatible    |        ✔        |         Compatible         |          ✔          | Supported             | No            | No           | [Official Website](https://gitlab.com/)                    |
|      Git Hosting      |      Gitlabantora       |  TODO  |       TODO       |      TODO       |            TODO            |        TODO         | Supported             | TODO          | TODO         | [Official Website](https://gitlab.com/)                    |
|      Git Hosting      |      Gitlabdocsify      |  TODO  |       TODO       |      TODO       |            TODO            |        TODO         | Supported             | TODO          | TODO         | [Official Website](https://gitlab.com/)                    |
|         Blog          |       Metaweblog        |   ✔    |    Compatible    |        ✔        |         Compatible         |          ✔          | Supported             | Bundled Proxy | No           | [Official Website](http://xmlrpc.scripting.com/metaWeblog) |
|         Blog          |         CnBlogs         |   ✔    |    Compatible    |        ✔        |         Compatible         |          ✔          | Supported             | Bundled Proxy | No           | [Official Website](https://cnblogs.com)                    |
|         Blog          |         Typecho         |   ✔    |    Compatible    |        ✔        |         Compatible         |          ✔          | Supported             | Bundled Proxy | No           | [Official Website](https://typecho.org/)                   |
|         Blog          |          Jvue           |   ✔    |    Compatible    |        ✔        |         Compatible         |          ✔          | Supported             | Bundled Proxy | No           | [Official Website](https://github.com/terwer/jvue)         |
|         Blog          |        WordPress        |   ✔    |    Compatible    |        ✔        |         Compatible         |          ✔          | Supported             | Bundled Proxy | No           | [Official Website](https://wordpress.org/)                 |
|         Blog          |      WordPress.com      |   ✔    |    Compatible    |        ✔        |         Compatible         |          ✔          | Supported             | Custom Proxy  | Custom Proxy | [Official Website](https://wordpress.com)                  |
|     Social Media      |          Zhihu          |   ✔    | Fully Compatible |        ✔        | Requires PC Auth or Cookie |          ✔          | Supported             | Bundled Proxy | No           | [Official Website](https://www.zhihu.com/)                 |
|     Social Media      |          CSDN           |   ✔    | Fully Compatible |        ✔        | Requires PC Auth or Cookie |          ✔          | Supported             | Bundled Proxy | No           | [Official Website](https://www.csdn.net/)                  |
|     Social Media      | WeChat Official Account |   ✔    | Fully Compatible |        ✔        |           Cookie           |          ✔          | Supported             | Bundled Proxy | No           | [Official Website](https://mp.weixin.qq.com/)              |
|     Social Media      |         Jianshu         |   ✔    | Fully Compatible |        ✔        | Requires PC Auth or Cookie |          ✔          | Supported             | Bundled Proxy | No           | [Official Website](https://www.jianshu.com/)               |
|     Social Media      |         Juejin          |   ✔    | Fully Compatible |        ✔        | Requires PC Auth or Cookie |          ✔          | Not Supported         | Bundled Proxy | No           | [Official Website](https://juejin.cn/)                     |
|       Community       |         52pojie         |  TODO  |       TODO       |      TODO       |            TODO            |        TODO         | TODO                  | TODO          | TODO         | [Official Website](https://www.52pojie.cn/)                |
|       Community       |        Bilibili         |  TODO  |       TODO       |      TODO       |            TODO            |        TODO         | TODO                  | TODO          | TODO         | [Official Website](https://www.bilibili.com/)              |
|       Community       |       Xiaohongshu       |  TODO  |       TODO       |      TODO       |            TODO            |        TODO         | TODO                  | TODO          | TODO         | [Official Website](https://www.xiaohongshu.com/)           |
|       Community       |         Douban          |  TODO  |       TODO       |      TODO       |            TODO            |        TODO         | TODO                  | TODO          | TODO         | [Official Website](https://www.douban.com/)                |
|        Others         |          Xlog           |  TODO  |       TODO       |      TODO       |            TODO            |        TODO         | TODO                  | TODO          | TODO         | [Official Website](https://xlog.cn/)                       |
|        Others         |         Mdnice          |  TODO  |       TODO       |      TODO       |            TODO            |        TODO         | TODO                  | TODO          | TODO         | [Official Website](https://mdnice.com/)                    |
|        Others         |         Flowus          |  TODO  |       TODO       |      TODO       |            TODO            |        TODO         | TODO                  | TODO          | TODO         | [Official Website](https://www.flowus.com/)                |
|        Others         |       telegra.ph        |   ✔    | Fully Compatible |        ✔        |      Fully Compatible      |          ✔          | Not Supported         | Custom Proxy  | Custom Proxy | [Official Website](https://telegra.ph)                     |

## Core Features

- [X] **Rapid Publishing**: One-time configuration, one-click publishing.
- [X] **Image Hosting Management**: Integrated with PicGO image hosting, supports s3, minio, watermark plugins. Requires
  installation of [Picgo plugin](https://github.com/terwer/siyuan-plugin-picgo) from the marketplace. **Currently only
  available for PC client**.
- [X] **Extension Support**: Built on a unified blog API specification, with built-in metaweblogAPI, WordPress,
  Wechatsync, and Github support. Provides a unified adapter, theoretically extensible to any platform.
- [X] **Platform Toggle**: Enable or disable all platforms.
- [X] **Dynamic Addition**: Supports custom adding of platforms.
- [X] **AI Integration**: Integrates freeform chat and context-based chat based on the current document.
- [X] **Intelligent Categorization**: Supports intelligent slug aliases, intelligent titles, intelligent summaries,
  intelligent tags, intelligent categories.
- [X] **Article Association**: Supports linking existing platform articles to SiYuan notes for convenient future
  management. Supports one-way synchronization from SiYuan to platforms.
- [X] **Theme Adaptation**: Automatically adapts to dark mode and light mode.
- [X] **Language Support**: Multi-language support, including Chinese and English versions.
- [X] **Publishing Views**: Supports various publishing views - simple mode, detailed mode, and source code mode.
- [X] **Multiple Deployment Options**: Supports SiYuan Note plugin <sup>highly recommended</sup>, Chrome browser
  extension, and self-deployment.

This plugin promises that the basic functions will be free forever, and the follow-up related to intelligent AI may be
charged, and the closed beta stage is completely free. If you want to support developers,
please [feel free to support](https://github.com/terwer/siyuan-plugin-publisher/blob/main/README_zh_CN.md#Donate) here.

> 🌹 Tips: This plugin is an upgraded version of the original 'Siyuan Note Publishing Tool' widget, which includes all
> the functions provided by the original widget, provides a convenient menu operation entry, and has carried out a
> series
> of problem fixes and experience optimizations.
>
> In addition to [Extended Functions], **Other functions do not require any dependencies** , and there is no need to
> download the previous widget, which is already built-in in the plugin.

## Compatibility of siyuan-note

This plugin is fully compatible with **siyuan-note PC client, Docker version <sup>1.20.2+</sup>, and mobile clients (
Android, iOS) <sup>1.20.2+</sup>**.

## Supported taxonomy

- [X] Classification
    - [X] Multi-select classification

- [X] Knowledge space
    - [X] Single-choice knowledge space
    - [X] Tree-shaped radio knowledge space

- [X] tag
    - [X] Multi-select tab

- [X] Label alias
    - [X] Radio label alias

## Platform Adaptation Plan

If you have a platform you want to use, but this tool has not yet been implemented, you can submit
the [Siyuan Note Publishing Tool Plugin Platform Adaptation Tracking Form](https://terwergreen.feishu.cn/share/base/form/shrcnGRdThUiqnhBg15xgclMM0c%20)
, the developer will consider including it in the development plan.

For platform adaptation, please refer
to [Latest Adaptation](https://terwergreen.feishu.cn/share/base/view/shrcnWT2IGIz1r94z9qvqUghDzd)

## Version Preview

### 1.21.5-preview – As of Q1 2024

- Expansion of telegra.ph support for image uploads
    - Reference: https://www.npmjs.com/package/telegraph-uploader
- Rectification of scenarios entailing repetitive image uploads across select platforms
- Resolution of formatting discrepancies within WeChat public accounts
- #990 Rectification of irregular display issues while posting to Jian Shu
- #989 Failure in posting certain articles to Notion
- Rectifying error scenarios during posting to WeChat public accounts in certain contexts
- #948 #905 Corrections addressing halo platform-related concerns
- Addressing vuepress2 related issues

### 1.21.6-preview – As of Q1 2024

- Inclusion of support for BiliBili and Xiaohongshu platforms

### 1.22.0-preview – As of Q2 2024

- Embracing compatibility for Evernote and Antora (including GitHub and GitLab)

### 1.23.0-preview – As of Q2 2024

- Enabling support for Docsify (inclusive of GitHub and GitLab) and Douban

### 1.24.0-preview – As of Q2 2024

- Integration with flowus platform

### 1.25.0-preview – As of Q2 2024

- Extending support to Xlog, mdnice, and zola platforms

### 1.26.0-preview – As of Q3 2024

- Collaborative interactions with #956 and OceanPress

## FAQ

* Q1：How to install the publishing tool plugin? Where can I find his entrance after installation?

  A1：Find **`Bazaar->Plugins->Publishing Tools`** to download and enable.

  The installation process requires no further action. This is no different from the download and installation of other
  plugins.

  After the installation is complete, find the ✈️ icon on the top right toolbar, click the menu, and follow the
  corresponding instructions to use it.


* Q2：After installing the publishing tool plugin, do I still need to install the widget?

  A2：**unnecessary.**

  The plugin version contains all the functions of the widget version.

* Q3: I am not used to the new version of the operation and want to continue to use the previous widget, can I?

  A3:**Yes but not recommended.**

  **We strongly recommend that you use the plug-in version directly, because the plug-in version will be the main
  version for long-term maintenance in the future, and the hanger version has been deprecated only as a fix for problems
  and compatible with historical users.**


* Q4：I used to use `Custom JS Fragment` or add `WidgetInvoke` directly, do I still need to download the plugin now?

  A4：**Optional.** But we highly recommended to remove JS snippets and widgets to download the plugin version.

  If you don't want to use the plugin version, you don't need to download it, just use the original `custom JS fragment`
  or add `widget` to continue using.

  If you want to use the plugin version, then we strongly recommend that you delete the previously
  added `custom JS snippets` and `widgets`, download the plugin version directly, and enable it. No other additional
  action is required.


* Q5：Is it possible to migrate my historical configuration data items to the plugin?

* A5：**Yes.**

  Please go to `Settings->Import and Export->Import the historical data of the widget version. ` Operation.

  Note: The widget version configuration data import only supports `sy-p-cfg-v0.8.0.json` and `picgo.json`.


* Q6：What should I do if the platform I need to publish is not provided by the publishing tool?

  A6：Reference: [Platform Adaptation Plan](https://github.com/terwer/siyuan-plugin-publisher/blob/main/README_zh_CN.md#platform-adaptation-plan "Platform Adaptation Plan")

## Donate

If you approve of this project, invite me to have a cup of coffee, which will encourage me to keep updating and create
more useful tools~

### Wechat

<div>
<img src="https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/donate/wechat.jpg" alt="wechat" style="width:280px;height:375px;" />
</div>

### Alipay

<div>
<img src="https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/donate/alipay.jpg" alt="alipay" style="width:280px;height:375px;" />
</div>

### Afdian

https://afdian.net/a/terwer

# Thanks

- Thanks to the third-party framework for supporting the bottom layer of this project

  Names not listed in order

  |    Name     | version |vendor|
  |:-----------:|:-------:| :---------: |
  |    turbo    |  1.9+   |Vercel|
  |     Vue     | 3.3.4+  |Evan You|
  |    Vite     |  4.2+   |Evan You|
  | TypeScript  |  5.0+   |Microsoft|
  | siyuan-note | 2.9.0+  |D,V|

- Thanks to [leolee9086](https://github.com/leolee9086) and [ciwoyipang]() for the icon resource

* Thanks to the enthusiastic support of the following users, I will continue to update and maintain the project!

    - 2024-03-31 *Ren Donated to [Publish Tool]
    - 2024-03-22 *Ming Donated to [Publish Tool]
    - 2024-03-05 *ruler Donated to [Publish Tool]
    
    - 2024-03-12 *? Donated to [Publish Tool]
    - 2024-03-04 *azar Donated to [Publish Tool]
    - 2024-02-28 *Zhao Donated to [Publish Tool]
    - 2024-01-15 Zi* Donated to [Publish Tool]
    - 2024-01-09 Zi* Donated to [Publish Tool]
    - 2023-11-12 S* Donated to [Publish Tool]
    - 2023-10-15 *Xian Donated to [Publish Tool]
    - 2023-09-04 *Xia Donated to [Publish Tool]

    - 2023-08-31 *Cheng Donate to [Publishing Tool] Thanks for providing the note posting tool, reminder change
    - 2023-08-31 *? Donated to [Publish Tool] Thanks for providing the siyuan-note Publish Tool.
    - 2023-08-14 *? Donated to [Publish Tool]
    - 2023-08-10 *f Donated to [Publish Tool] for liking the release plugin.
    - 2023-08-10 *2 Donated to [Publish Tool] to support the development of Source Release Plugin.
    - 2023-07-13 *Liang Donated to [Document Alias] Is it possible to expand the functionality to H1?
    - 2023-07-09 *z Donated to [Online Sharing] The online sharing plugin is great, thanks!
    - 2023-06-14 *Jun Donated to [Document Roaming] Thanks for the Document Roaming feature.
    - 2023-01-16 *Zhan Donated to [Import Tool] Finally, we can import epub files.
    
      If you do not want to display donation information, you can send an email directly to youweics@163.com.
