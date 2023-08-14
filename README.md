[中文](README_zh_CN.md)

# Publisher

![](./icon.png)

Publish articles from Siyuan Notes to platforms such as Yuque, Notion, Cnblogs, WordPress, Typecho, Hexo, Zhihu and more.

Support features such as fast publishing, image bed management, platform expansion, smart labels, etc.

> **Front Announcement 1: Release Tool's first platform-wide version `1.8.0` using the forward agent of Siyuan Note!**
>
> **Front Announcement 2: The first version of the release tool that fully supports image upload `1.8.0` is released!**

Tips: Zhihu uses the image upload of the Zhihu platform, Yuque, Notion, and Hexo need Picgo plugin support, and the Metaweblog series platform supports both Picgo plugin and self-contained image upload (install Picgo plugin to use Picgo plugin, otherwise use their own platform)

We recommend that you use the `uninstall->install` method to update. If the configuration is abnormal, please back up `[workspace]/data/storage/syp/sy-p-plus-cfg.json` , and then delete it, this configuration file will be automatically initialized the first time it is used.

In later releases, the release configuration will only be backward compatible to `1.6.0+`.

## Recent critical updates and bug fixes

- Yuque, Notion, and Hexo support image links, and automatic upload requires Picgo plugin support
- Zhihu platform supports automatic image upload
- When the Picgo plugin is not installed, some platforms can use the built-in image upload, such as Cnblogs, Typecho, WordPress
- Support replacing picture bed image links with Picgo plugin
- Fixed the issue that the release preview of the authorization code mode was invalidated
- Support publishing to Zhihu
- Support for publishing to Hexo
- Support for publishing to Notion
- Support for Yuque,Cnblogs, Metaweblog, Typecho, WordPress
- Support automatic generation of article aliases
- Support for changing the default knowledge base

## Compatibility of Origin notes

This plugin supports almost all devices and platforms of Siyuan Note, and the specific compatibility is as follows:

- [X] Siyuan Note Client (zero configuration) <sup>is highly recommended</sup>
- [X] Servo environment (Zero configuration, cross-domain request proxy built-in)
  - [X] CentSource Note Browser Servo
  - [X] Siyuan Note Client Servo
  - [X] Siyuan Notemaker mobile servo
- [X] Siyuan Note docker version (Zero configuration, cross-domain request proxy built-in)

🎉 **All platforms have been migrated to the official forward proxy, achieving zero user configuration and supporting cross-domain request proxies by default 🎉**


## Platform List

Names not listed in order

- [X] Yuque
- [X] Metaweblog
- [X] Cnblogs
- [X] Typecho
- [X] WordPress
- [X] Github
  - [X] Hexo
- [X] Notion
- [X] Zhihu

## Core Features

- [X] **Extremely fast release**: One-time configuration, one-click release
- [X] **Picture bed management**: Integrate PicGO picture bed, support s3, minio, watermark plugin
- [X] **Support for extensions**: Based on the unified blog API specification, built-in support for metaweblogAPI, WordPress
  and GitHub, and provides a unified adapter, which can theoretically be extended to any platform
- [X] **Platform switch**: All platforms support enabling and disabling, the blog garden is enabled by default, and can be
  disabled at any time
- [X] **Dynamic Newly Added**: Support custom adding platform
- [ ] **Smart Classification**: Support smart tags, smart slug aliases, smart summaries, and continue to improve
- [X] **Article Binding**: Support linking existing platform articles to Siyuan Notes to facilitate follow-up management,
  support Siyuan->platform one-way synchronization
- [X] **Adapt to Theme**: Automatically adapt to dark mode and light mode
- [X] **Language support**: multi-language support, support Chinese version and English version
- [ ] **Release view**: Support multiple release views, simple mode, detailed mode and source code mode
- [X] **Multiple deployments**: support Siyuan notes plugin<sup>Highly recommended</sup>, Chrome browser extension, self-deployment

This plugin promises that the basic functions will be free forever, and the follow-up related to intelligent AI may be charged, and the closed beta stage is completely free. If you want to support developers, please [feel free to support](https://github.com/terwer/siyuan-plugin-publisher/blob/main/README_zh_CN.md#Donate) here.

> 🌹 Tips: This plugin is an upgraded version of the original 'Siyuan Note Publishing Tool' widget, which includes all the functions provided by the original widget, provides a convenient menu operation entry, and has carried out a series of problem fixes and experience optimizations.
>
> In addition to [Extended Functions], **Other functions do not require any dependencies** , and there is no need to download the previous widget, which is already built-in in the plugin.

## Platform Adaptation Plan

If you have a platform you want to use, but this tool has not yet been implemented, you can submit
the [Siyuan Note Publishing Tool Plugin Platform Adaptation Tracking Form](https://terwergreen.feishu.cn/share/base/form/shrcnGRdThUiqnhBg15xgclMM0c%20)
, the developer will consider including it in the development plan.

For platform adaptation, please refer
to [Latest Adaptation](https://terwergreen.feishu.cn/share/base/view/shrcnWT2IGIz1r94z9qvqUghDzd)

## Update history

Please check [CHANGELOG](./CHANGELOG.MD)

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

  |Name|version|vendor|
  | :---------: | :-----: | :---------: |
  |turbo|1.9+|Vercel|
  |vite|4.2+|Evan You|
  |Svelte|3.57+|Rich Harris|
  |TypeScript|5.0+|Microsoft|
  |siyuan-note|2.9.0+|D,V|
- Thanks to [leolee9086](https://github.com/leolee9086) for the icon resource
