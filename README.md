[中文](README_zh_CN.md)

# Publisher

![](./icon.png)

Publish articles from siyuan-note to platforms like Yuque etc. `Free` and `open source`. 

If you're interested in the paid professional version, please check the paied ➡️ [Publishing Tool Professional Edition](https://github.com/terwer/siyuan-plugin-publisher-pro)

> Recent Update: 🎉 Publish Tool new version `1.18.11` released.

- `1.18.0` brings new features and enhanced user experience.
- The `1.18.11` Version primarily includes the following minor optimizations and bug fixes:
  - Improved prompts for unpublished articles. 
  - Fixed abnormal formula parsing issues on CSDN and Zhihu.
- The `1.18.10` version, the primary rectifications encompass:
  - Introduction of a streamlined confirmation for the one-click preview.
  - Resolution of conversion errors in VuePress.
- The `1.18.9` version primarily addresses the following issues:
  - Resolved the issue where newly added tags would disappear upon selecting them.
  - Refactored the logic within the YAML section.
- The `1.18.8` version primarily introduces the following enhancements and addresses certain defects:
  - Facilitation of singular preview and one-click preview in standard release mode
  - Rectification of the issue where alterations to article properties, made outside of source code mode, were not persisting
  - Imposition of control over the default display method, with a preference for showcasing in `yaml` in source code mode if adapters are present
- The `1.18.7` version brings the following features:
  - Added menu configuration
  - Added document menu
- The `1.18.6` version primarily addresses the following issues:
  - Rectified the issue of misaligned previews at the end of the homepage.
  - Addressed potential preview errors that may arise on Cnblogs.
  - Resolved the debugging issue that prevented troubleshooting via the server.
  - Corrected error messages during publishing on Jianshu.
  - Ensured compatibility with formulas on CSDN.
  - Extended compatibility to accommodate formulas on Zhihu.
  - Imposed constraints on the abstract length within the range of 50 to 100 characters on the Juejin platform.
  - Tailored certain scenarios to adapt to the docker browser version<sup>beta</sup>.
- The `1.18.5` version primarily addresses the following issues:
  - Resolved a bug that could cause erroneous YAML generation on certain platforms.
  - Enhanced project building efficiency by utilizing symbolic links.
  - Preview of the Professional Edition
- The `1.18.4` version primarily addresses the following issues:
  - Fixed the problem of YAML modifications not taking effect
  - Fixed an issue where not setting tag categories could lead to errors
  - Automatically saves attributes and removes unnecessary prompts
- The `1.18.3` version primarily addresses the following defects:
  - Resolved the issue where automatic classification paths could be empty.
  - Rectify the potential path error issue that may arise when publishing documents in the root directory.
- The `1.18.2` version primarily addresses the following bug fixes:
  - Resolved the issue with uploading images on Blog Park.
- The `1.18.1` version primarily addresses the following bug fixes:
  - Only add the path as a category when automatically mapping categories.
  - Fixed the incorrect path for viewing the latest articles.
- `1.18.0` introduces the following important changes:
  - Added a clever workaround to support document updates in Notion.
  - Added support for external link conversion.
  - Added the ability to manually set file rules in the publishing configuration.
  - Integrated menu enhancements to focus on core functionality.
  - Enabled automatic mapping of document paths to categories.
  - Enhanced the platform list with hover tooltips, improved display of platform names, and added new platform prompts.
  - Strengthened validation for GitHub and Gitlab platforms.
  - Fixed compatibility issues with CSDN error prompts, reducing unnecessary disruptions.
  - Fixed the problem of AI tab not being openable.
  - Resolved formatting issues when publishing HTML content.
  - Fixed the issue of formulas not displaying correctly in HTML publishing.
  - Modify the authorization mode to read-only, in order to prevent misinterpretation or misconfiguration.
  - Preserve labels and classifications for each platform.
- Ahem, in addition, the author secretly developed an import feature after version `1.14.0`. You can easily import predefined platforms through the `Settings` -> `Publish Settings` -> `Import Predefined Platforms` function 😄

> [Click here](https://blog.terwer.space/s/20230810132040-nn4q7vs) to access the latest documentation.

**For any further inquiries or suggestions, please join QQ Group `895063267` for discussion**

## Update history

Please check [CHANGELOG](./CHANGELOG.MD)

## Platform List

Names not listed in order

- [X] Yuque
- [X] Notion
- [X] Halo
- [ ] Evernote - TODO
- [X] Github
  - [X] Hexo
  - [X] Hugo
  - [X] Jekyll
  - [X] Vuepress
  - [X] Vuepress2
  - [X] Vitepress
  - [ ] Antora - TODO
  - [ ] Docsify - TODO
- [X] Gitlab
  - [X] Gitlabhexo
  - [X] Gitlabhugo
  - [X] Gitlabjekyll
  - [X] Gitlabvuepress
  - [X] Gitlabvuepress2
  - [X] Gitlabvitepress
  - [ ] Gitlabantora - TODO
  - [ ] Gitlabdocsify - TODO
- [X] Metaweblog
- [X] CnBlogs
- [X] Typecho
- [X] WordPress
- [X] Zhihu
- [X] CSDN
- [X] WeChat Official Account
- [X] Jianshu
- [X] Juejin
- [ ] 52pojie - TODO
- [ ] Bilibili - TODO
- [ ] Xiaohongshu - TODO
- [ ] Douban - TODO
- [ ] Xlog - TODO
- [ ] Mdnice - TODO
- [ ] Flowus - TODO

## Core Features

- [X] **Rapid Publishing**: One-time configuration, one-click publishing.
- [X] **Image Hosting Management**: Integrated with PicGO image hosting, supports s3, minio, watermark plugins. Requires installation of [Picgo plugin](https://github.com/terwer/siyuan-plugin-picgo) from the marketplace. **Currently only available for PC client**.
- [X] **Extension Support**: Built on a unified blog API specification, with built-in metaweblogAPI, WordPress, Wechatsync, and Github support. Provides a unified adapter, theoretically extensible to any platform.
- [X] **Platform Toggle**: Enable or disable all platforms.
- [X] **Dynamic Addition**: Supports custom adding of platforms.
- [X] **AI Integration**: Integrates freeform chat and context-based chat based on the current document.
- [X] **Intelligent Categorization**: Supports intelligent slug aliases, intelligent titles, intelligent summaries, intelligent tags, intelligent categories.
- [X] **Article Association**: Supports linking existing platform articles to SiYuan notes for convenient future management. Supports one-way synchronization from SiYuan to platforms.
- [X] **Theme Adaptation**: Automatically adapts to dark mode and light mode.
- [X] **Language Support**: Multi-language support, including Chinese and English versions.
- [X] **Publishing Views**: Supports various publishing views - simple mode, detailed mode, and source code mode.
- [X] **Multiple Deployment Options**: Supports SiYuan Note plugin <sup>highly recommended</sup>, Chrome browser extension, and self-deployment.

This plugin promises that the basic functions will be free forever, and the follow-up related to intelligent AI may be charged, and the closed beta stage is completely free. If you want to support developers, please [feel free to support](https://github.com/terwer/siyuan-plugin-publisher/blob/main/README_zh_CN.md#Donate) here.

> 🌹 Tips: This plugin is an upgraded version of the original 'Siyuan Note Publishing Tool' widget, which includes all the functions provided by the original widget, provides a convenient menu operation entry, and has carried out a series of problem fixes and experience optimizations.
>
> In addition to [Extended Functions], **Other functions do not require any dependencies** , and there is no need to download the previous widget, which is already built-in in the plugin.

## Compatibility of Origin notes

This plugin is fully compatible with `siyuan-note PC Client` , due to limited personal energy, other devices are no longer supported.

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

  The installation process requires no further action. This is no different from the download and installation of other plugins.

  After the installation is complete, find the ✈️ icon on the top right toolbar, click the menu, and follow the corresponding instructions to use it.


* Q2：After installing the publishing tool plugin, do I still need to install the widget?

  A2：**unnecessary.**

  The plugin version contains all the functions of the widget version.

* Q3: I am not used to the new version of the operation and want to continue to use the previous widget, can I?

  A3:**Yes but not recommended.**

  **We strongly recommend that you use the plug-in version directly, because the plug-in version will be the main version for long-term maintenance in the future, and the hanger version has been deprecated only as a fix for problems and compatible with historical users.**


* Q4：I used to use `Custom JS Fragment` or add `WidgetInvoke` directly, do I still need to download the plugin now?

  A4：**Optional.** But we highly recommended to remove JS snippets and widgets to download the plugin version.

  If you don't want to use the plugin version, you don't need to download it, just use the original `custom JS fragment` or add `widget` to continue using.

  If you want to use the plugin version, then we strongly recommend that you delete the previously added `custom JS snippets` and `widgets`, download the plugin version directly, and enable it. No other additional action is required.


* Q5：Is it possible to migrate my historical configuration data items to the plugin?

* A5：**Yes.**

  Please go to `Settings->Import and Export->Import the historical data of the widget version. ` Operation.

  Note: The widget version configuration data import only supports `sy-p-cfg-v0.8.0.json` and `picgo.json`.


* Q6：What should I do if the platform I need to publish is not provided by the publishing tool?
* A6：Reference: [Platform Adaptation Plan](https://github.com/terwer/siyuan-plugin-publisher/blob/main/README_zh_CN.md#platform-adaptation-plan "Platform Adaptation Plan")

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
