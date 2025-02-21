[中文](README_zh_CN.md)

# Share to web

<img src="https://ghproxy.com/https://github.com/terwer/siyuan-plugin-blog/blob/main/icon.png" width="160" height="160" alt="icon">

The notion like sharing feature you've always dreamed of is here, too.

Based on the localization concept of siyuan-note , this plugin is natively shared locally on a local area network and
can be shared remotely through the docker plugin. No additional server-side support is required, just take siyuan-note.

The core idea of this plugin is: `Everything is a Page` . You can set a page to be the home page.

> Important Notice:
> 1. Version 2.0.0 introduces support for VIP versions, add mode link rules as follows:    
     /s/[id]  
     /static/[id]  
     /p/[id]  
     /post/[id]  
     /link/[id]  
     /doc/[id]  
     /article/[id]  
     /x/[id]  
     /a/[id]  
     /d/[id]
> 2. Share pro is released on the VIP service, please visit：https://siyuannote.site


[docs](https://siyuannote.site/x/20241115104036-8pprbgr)

[Self-deployed free version experience address](https://freeshare.terwergreen.com)

[Paid version experience address](https:///siyuannote.site)

## Core Features

* **One-click sharing**: You can share your documents to the local area network with just one click. If you need to
  share remotely, you can deploy it on a server using Docker and then install the plugin.
* **Permission control**: Only shared pages can be viewed, and pages that have not been shared cannot be viewed without
  permission.
* **Expiration time**: Support setting expired time, after which you cannot view it
* **Personal homepage**: You can set a shared page as your homepage, which can be used as a custom blog homepage.
* **Theme integration**: The default theme is [Zhihu](https://github.com/terwer/siyuan-theme-zhihu), and other themes
  will be supported in the future.
* **SEO optimization**: support automatically generating titles, summaries, and cover images for better SEO.
* **Multiple Deployment Options**: Supports deployment as a plugin for siyuan-note, self-deployment using Docker, and
  hosting on Vercel to meet different needs. For more details, please see
  the [docs](https://siyuan.wiki/s/20230621001422-xsimx5v) .
    - [Beginner-Level] siyuan-note Plugin: Zero configuration, ready to use out of the box, runs as a local SPA
      application and accesses the Siyuan ontology directly, resulting in extremely fast speed but not very
      SEO-friendly.
    - [Expert-Level] Self-Deployment using Docker: Requires purchasing a server, SSR server-side rendering,
      SEO-friendly, high speed.
    - [Cost-Free Option] Vercel Hosting: Requires purchasing a domain and may not be accessible in some countries, low
      cost, moderate speed.
* **Sharing mode (experimental)**: Public note sharing is supported by default, and limited sharing functions can be
  supported after enabling the authorization code.
* **VIP Service Provider Mode**<sup>2.0.0+</sup>: Allows deploying this project as a VIP service provider, requiring
  backend sharing service(eg. https://github.com/terwerinc/siyuan-note-service) support.

## Features compare

| Feature                                       | Free Version | Paid Version |
|-----------------------------------------------|--------------|--------------|
| Support for replacing image links             | ✔️           | ✔️           |
| Integration with currently popular themes     | ✔️           | ✔️           |
| Support for internal and external links       | ✔️           | ✔️           |
| Support for task lists                        | ✔️           | ✔️           |
| Support for sharing with authorization code   | ✔️           | ✔️           |
| Unordered list style adaptation               | ✔️           | ✔️           |
| Latex formula rendering                       | ✔️           | ✔️           |
| Support for siyuan-note's SVGs                | ✔️           | ✔️           |
| Support for image hosting                     | ❌            | ✔️           |
| Support for custom domain                     | ❌            | ✔️           |
| Batch management for shared pages             | ❌            | ✔️           |
| Document tree                                 | ❌            | ✔️           |
| Page outline                                  | ❌            | ✔️           |
| Support for sharing password for single pages | ❌            | Planned      |
| Support for document alias access             | ❌            | Planned      |
| Support for displaying original MD content    | ❌            | Planned      |
| Support for displaying original KMD content   | ❌            | Planned      |
| Tags, summaries                               | ❌            | Planned      |
| Custom properties                             | ❌            | Planned      |
| Image zoom effect                             | ❌            | Planned      |
| PlantUML diagram support                      | ❌            | Planned      |
| ECharts diagram support                       | ❌            | Planned      |

## Changelog

Please refer to [CHANGELOG](https://github.com/terwer/siyuan-plugin-blog/blob/main/CHANGELOG.md)

## Development

Please refer to [DEVELOPMENT](./DEVELOPMENT.md)

## Donate

If you approve of this project, invite me to have a cup of coffee, which will encourage me to keep updating and create
more useful tools~

### WeChat

<div>
<img src="https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/donate/wechat.jpg" alt="wechat" style="width:280px;height:375px;" />
</div>

### Alipay

<div>
<img src="https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/donate/alipay.jpg" alt="alipay" style="width:280px;height:375px;" />
</div>

## Thanks

Thanks to the solutions provided by the open source community, which simplifies a lot of work for this project!

- [notion](https://notion.so)