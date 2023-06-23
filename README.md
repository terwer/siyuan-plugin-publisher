[中文](README_zh_CN.md)

# Publisher

![](https://raw.githubusercontent.com/terwer/siyuan-plugin-publisher/main/icon.png)

Publishing articles from siyuan-note to platforms such as Yuque, Cnblogs, WordPress, Typecho, Hexo, Hugo and more.

Support features such as fast publishing, image bed management, platform expansion, smart labels, etc.

This plugin promises that all functions will be free forever. If you want to support the developer, please [Donate](https://github.com/terwer/siyuan-plugin-publisher#Donate) freely.

> 🌹Reminder: This plugin is an upgraded version of the original `Siyuan Notes Publishing Tool` widget. Its functions
> include all the functions provided by the original widget. It also provides a convenient menu operation entry, and has
> carried out a series of bug fixes and experience optimization.

> If you want to see previous 0.x version, please refer to my original
> widget: [sy-post-publisher](https://github.com/terwer/src-sy-post-publisher)

## Core Features

- **Extremely fast release**: One-time configuration, one-click release
- **Picture bed management**: Integrate PicGO picture bed, support s3, minio, watermark plugin
- **Support for extensions**: Based on the unified blog API specification, built-in support for metaweblogAPI, WordPress
  and GitHub, and provides a unified adapter, which can theoretically be extended to any platform
- **Platform switch**: All platforms support enabling and disabling, the blog garden is enabled by default, and can be
  disabled at any time
- **Dynamic Newly Added**: Support custom adding platform
- **Smart Classification**: Support smart tags, smart slug aliases, smart summaries, and continue to improve
- **Article Binding**: Support linking existing platform articles to Siyuan Notes to facilitate follow-up management,
  support Siyuan->platform one-way synchronization
- **Adapt to Theme**: Automatically adapt to dark mode and light mode
- **Language support**: multi-language support, support Chinese version and English version
- **Release view**: Support multiple release views, simple mode, detailed mode and source code mode
- **Multiple deployments**: support Siyuan notes plugin, Chrome browser extension, self-deployment

## Platform List

Names not listed in order

- Cnblogs
- WordPress
- Yu Que
- Github
    - Hexo
    - Hugo

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

‍

* Q2：After installing the publishing tool plugin, do I still need to install the widget?

  A2：**unnecessary. ​**

  The plugin version contains all the functions of the widget version.

‍

* Q3：I am not used to the operation of the new version, and I want to continue to use the previous widget through the plugin, is that possible?

  A3：**Yes.**

  The plugin has a builtin bridge by default, which can invoke the widget through the plugin. This feature needs to be turned on in `Settings -> Use WidgetInvoke`​.

  <u>Note 1: The plugin version uses the builtin menu of the plugin system, and the menu slot will be disabled when the widget version is activated via plugin. ​</u>

  <u>Note 2: After opening the widget version, all functions of the plugin version will be disabled to avoid confusion.</u>

  **We strongly recommend you to use the plugin version, because the plugin version will be the main version for long-term maintenance in the future, and the widget version is obsolete, and it is only used to fix problems and compatible with historical users.**

‍

* Q4：I used to use `Custom JS Fragment`​ or add `WidgetInvoke`​ directly, do I still need to download the plugin now?

  A4：**Optional.** But we highly recommended to remove JS snippets and widgets to download the plugin version.

  If you don't want to use the plugin version, you don't need to download it, just use the original `custom JS fragment`​ or add `widget`​ to continue using.

  If you want to use the plugin version, then we strongly recommend that you delete the previously added `custom JS snippets`​ and `widgets`​, download the plugin version directly, and enable it. No other additional action is required.

‍

* Q5：Is it possible to migrate my historical configuration data items to the plugin?

* A5：**Yes.**

  Please go to `Settings->Import and Export->Import the historical data of the widget version. ` Operation.

  Note: The widget version configuration data import only supports `sy-p-cfg-v0.8.0.json` and `picgo.json`.

‍

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
