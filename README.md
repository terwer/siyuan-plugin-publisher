[中文](README_zh_CN.md)

# Publisher

![](./icon.png)

Publish articles from siyuan-note to platforms like Yuque etc. `Free` and `open source`.

If you're interested in the paid professional version, please check the paied
➡️ [Publishing Tool Professional Edition](https://github.com/terwer/siyuan-plugin-publisher-pro)

> The latest Publish Tool version `1.20.0` is released🎉, potentially one of the most revolutionary iterations since the
> inception of first releases👀.

- Notable inclusions within version `1.20.0` comprise the introduction of additional publishing platforms, an initial
  foray into supporting the docker version, along with enhancements tailored to optimize user interactions.

    - The prominent features integrated into `1.20.0` encompass:

        - #958 #1009 Experimental support for the docker edition of siyuan-note, marking a preliminary step towards its
          implementation. Should anomalies surface during deployment, the extension welcomes the addition of GitHub
          issues for resolution.
            - **Please note: Unavailability of CORS proxy configuration will render the functionality inactive!!!**
            - The image feature of the Picgo plugin is currently unavailable in the Docker version; support will be
              introduced in 1.20.1.
        - #1053 Introduction of the publishing platform telegra.ph
            - **Please note: Unavailability of CORS proxy configuration will render the functionality inactive!!!
              Furthermore, accessing article previews mandates circumventing restrictions via appropriate means.**
            - For discussions on CORS proxy complications or other inquiries, feel free to engage in group discussions
              or reach out to the author at youweics@163.com
            - At present, only anonymous posting and updates are supported; login functionality will be incorporated in
              version 1.20.1.
        - #1054 Addition of article management capabilities
            - Renamed article management as Dashboard. Feedback regarding nomenclature adjustments can be deliberated
              via issues, facilitating responsive modifications by the author.
            - Facilitation of displaying all platform publication icons
            - Provision for exhibiting the count of publishing platforms
            - Integration of filters for curated published articles

    - `1.20.0` predominantly refines the following areas of focus:

        - Incorporation of development documentation alongside a preview of forthcoming version agendas
        - Enhanced Plugin Store experience
        - Streamlined import processes, now accommodating customized imports
        - Exquisitely refined iteration of `sy-post-publisher widget

    - Furthermore, post the `1.14.0` version, the author discretely developed an import function. Users can swiftly
      import built-in platforms through `Settings` -> `Publish Settings` -> `Import Platforms` feature 😄

> For further details, kindly [click here](https://blog.terwer.space/s/20230810132040-nn4q7vs) to peruse the latest help
> documentation.

**Should you encounter any issues or wish to submit suggestions, feel free to join QQ group `895063267` for discussions.
**

## Version Preview

### 1.20.1-preview – As of Q1 2024

- Support picture upload form picgo via docker
- Expansion of telegra.ph support for image uploads
    - Reference: https://www.npmjs.com/package/telegraph-uploader
- Support login for telegra.ph
- Rectification of scenarios entailing repetitive image uploads across select platforms
- Resolution of formatting discrepancies within WeChat public accounts
- #990 Rectification of irregular display issues while posting to Jian Shu
- #989 Failure in posting certain articles to Notion
- Rectifying error scenarios during posting to WeChat public accounts in certain contexts
- #948 #905 Corrections addressing halo platform-related concerns
- Addressing vuepress2 related issues

### 1.21.0-preview – As of Q1 2024

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

## Update history

Please check [CHANGELOG](./CHANGELOG.MD)

## Development

Please refer to [DEVELOPMENT](./DEVELOPMENT.md)

## Platform List

Names not listed in order

|         Type          |        Platform         | Status |      PC Client       | PC Image Upload |                         Docker                         | Docker Image Upload |                            Note                            |
|:---------------------:|:-----------------------:|:------:|:--------------------:|:---------------:|:------------------------------------------------------:|:-------------------:|:----------------------------------------------------------:|
|        Generic        |          Yuque          |   ✔    |   Fully Compatible   |        ✔        |                  Partially Compatible                  |          ❌          |           [Official Website](https://yuque.com)            |
|        Generic        |         Notion          |   ✔    |   Fully Compatible   |        ✔        |                  Partially Compatible                  |          ❌          |         [Official Website](https://www.notion.so)          |
|        Generic        |          Halo           |   ✔    |   Fully Compatible   |        ✔        |                  Partially Compatible                  |          ❌          |            [Official Website](https://halo.run)            |
|        Generic        |        Evernote         |  TODO  |         TODO         |      TODO       |                          TODO                          |        TODO         |        [Official Website](https://www.evernote.com)        |
|        Generic        |         Github          |   ✔    |   Fully Compatible   |        ✔        |                  Partially Compatible                  |          ❌          |           [Official Website](https://github.com)           |
| Static Site Generator |          Hexo           |   ✔    |   Fully Compatible   |        ✔        |                  Partially Compatible                  |          ❌          |         [Official Website](https://hexo.io/zh-cn/)         |
| Static Site Generator |          Hugo           |   ✔    |   Fully Compatible   |        ✔        |                  Partially Compatible                  |          ❌          |           [Official Website](https://gohugo.io/)           |
| Static Site Generator |         Jekyll          |   ✔    |   Fully Compatible   |        ✔        |                  Partially Compatible                  |          ❌          |         [Official Website](https://jekyllrb.com/)          |
| Static Site Generator |        Vuepress         |   ✔    |   Fully Compatible   |        ✔        |                  Partially Compatible                  |          ❌          |      [Official Website](https://vuepress.vuejs.org/)       |
| Static Site Generator |        Vuepress2        |   ✔    |   Fully Compatible   |        ✔        |                  Partially Compatible                  |          ❌          |     [Official Website](https://v2.vuepress.vuejs.org/)     |
| Static Site Generator |        Vitepress        |   ✔    |   Fully Compatible   |        ✔        |                  Partially Compatible                  |          ❌          |      [Official Website](https://vitepress.vuejs.org/)      |
| Static Site Generator |         Antora          |  TODO  |         TODO         |      TODO       |                          TODO                          |        TODO         |          [Official Website](https://antora.org/)           |
| Static Site Generator |         Docsify         |  TODO  |         TODO         |      TODO       |                          TODO                          |        TODO         |        [Official Website](https://docsify.js.org/)         |
|      Git Hosting      |         Gitlab          |   ✔    |   Fully Compatible   |        ✔        |                  Partially Compatible                  |          ❌          |          [Official Website](https://gitlab.com/)           |
|      Git Hosting      |       Gitlabhexo        |   ✔    |   Fully Compatible   |        ✔        |                  Partially Compatible                  |          ❌          |          [Official Website](https://gitlab.com/)           |
|      Git Hosting      |       Gitlabhugo        |   ✔    |   Fully Compatible   |        ✔        |                  Partially Compatible                  |          ❌          |          [Official Website](https://gitlab.com/)           |
|      Git Hosting      |      Gitlabjekyll       |   ✔    |   Fully Compatible   |        ✔        |                  Partially Compatible                  |          ❌          |          [Official Website](https://gitlab.com/)           |
|      Git Hosting      |     Gitlabvuepress      |   ✔    |   Fully Compatible   |        ✔        |                  Partially Compatible                  |          ❌          |          [Official Website](https://gitlab.com/)           |
|      Git Hosting      |     Gitlabvuepress2     |   ✔    |   Fully Compatible   |        ✔        |                  Partially Compatible                  |          ❌          |          [Official Website](https://gitlab.com/)           |
|      Git Hosting      |     Gitlabvitepress     |   ✔    |   Fully Compatible   |        ✔        |                  Partially Compatible                  |          ❌          |          [Official Website](https://gitlab.com/)           |
|      Git Hosting      |      Gitlabantora       |  TODO  |         TODO         |      TODO       |                          TODO                          |        TODO         |          [Official Website](https://gitlab.com/)           |
|      Git Hosting      |      Gitlabdocsify      |  TODO  |         TODO         |      TODO       |                          TODO                          |        TODO         |          [Official Website](https://gitlab.com/)           |
|         Blog          |       Metaweblog        |   ✔    |   Fully Compatible   |        ✔        |                  Partially Compatible                  |          ❌          | [Official Website](http://xmlrpc.scripting.com/metaWeblog) |
|         Blog          |         CnBlogs         |   ✔    |   Fully Compatible   |        ✔        |                  Partially Compatible                  |          ❌          |          [Official Website](https://cnblogs.com)           |
|         Blog          |         Typecho         |   ✔    |   Fully Compatible   |        ✔        |                  Partially Compatible                  |          ❌          |          [Official Website](https://typecho.org/)          |
|         Blog          |          Jvue           |   ✔    |   Fully Compatible   |        ✔        |                  Partially Compatible                  |          ❌          |     [Official Website](https://github.com/terwer/jvue)     |
|         Blog          |        WordPress        |   ✔    |   Fully Compatible   |        ✔        |                  Partially Compatible                  |          ❌          |         [Official Website](https://wordpress.org/)         |
|     Social Media      |          Zhihu          |   ✔    |   Fully Compatible   |        ✔        | Partially Compatible, Requires PC Account Verification |          ❌          |         [Official Website](https://www.zhihu.com/)         |
|     Social Media      |          CSDN           |   ✔    |   Fully Compatible   |        ✔        | Partially Compatible, Requires PC Account Verification |          ❌          |         [Official Website](https://www.csdn.net/)          |
|     Social Media      | WeChat Official Account |   ✔    |   Fully Compatible   |        ✔        | Partially Compatible, Requires PC Account Verification |          ❌          |       [Official Website](https://mp.weixin.qq.com/)        |
|     Social Media      |         Jianshu         |   ✔    |   Fully Compatible   |        ✔        | Partially Compatible, Requires PC Account Verification |          ❌          |        [Official Website](https://www.jianshu.com/)        |
|     Social Media      |         Juejin          |   ✔    |   Fully Compatible   |        ✔        | Partially Compatible, Requires PC Account Verification |          ❌          |           [Official Website](https://juejin.cn/)           |
|       Community       |         52pojie         |  TODO  |         TODO         |      TODO       |                          TODO                          |        TODO         |        [Official Website](https://www.52pojie.cn/)         |
|       Community       |        Bilibili         |  TODO  |         TODO         |      TODO       |                          TODO                          |        TODO         |       [Official Website](https://www.bilibili.com/)        |
|       Community       |       Xiaohongshu       |  TODO  |         TODO         |      TODO       |                          TODO                          |        TODO         |      [Official Website](https://www.xiaohongshu.com/)      |
|       Community       |         Douban          |  TODO  |         TODO         |      TODO       |                          TODO                          |        TODO         |        [Official Website](https://www.douban.com/)         |
|        Others         |          Xlog           |  TODO  |         TODO         |      TODO       |                          TODO                          |        TODO         |            [Official Website](https://xlog.cn/)            |
|        Others         |         Mdnice          |  TODO  |         TODO         |      TODO       |                          TODO                          |        TODO         |          [Official Website](https://mdnice.com/)           |
|        Others         |         Flowus          |  TODO  |         TODO         |      TODO       |                          TODO                          |        TODO         |        [Official Website](https://www.flowus.com/)         |
|        Others         |       telegra.ph        |   ✔    | Partially Compatible |        ❌        |                  Partially Compatible                  |          ❌          |           [Official Website](https://telegra.ph)           |

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

## Compatibility of Origin notes

This plugin is fully compatible with `siyuan-note PC Client` , due to limited personal energy, other devices are no
longer supported.

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
*

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

    - 2023-09-04 *Xia Donate to [Publish Tool]
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
