[English](README.md)

# 在线分享

<img src="https://ghproxy.com/https://github.com/terwer/siyuan-plugin-blog/blob/main/icon.png" width="160" height="160" alt="icon">

您梦寐以求的类 notion 分享功能，这里也有。

基于思源笔记的本地化理念，本插件原生支持本地局域网分享、并且可通过 docker 版插件支持远程分享。无需任何额外的服务端支持，有思源笔记即可。

本插件的核心理念是：`一切皆页面` 。您可以设置某个页面为主页。

> 重要提示：
> 1. 2.0.0，新增适配 VIP 版本，新增更多链接形式如下：    
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
> 2. 在线分享专业版已上线🎉，欢迎试用，访问地址：https://siyuannote.site

[帮助文档](https://share.terwergreen.com/s/20230621001422-xsimx5v)

[自部署免费版体验地址](https://freeshare.terwergreen.com)

[收费版体验地址](https://share.terwergreen.com)

## 核心特色

- **一键分享**：支持一键分享文档到局域网，如果需要远程分享，可使用 docker 部署在服务器，然后安装插件
- **权限控制**：只能查看已分享的页面，未分享的页面无权限查看
- **过期时间**：支持设置过期时间，过期时间之后将无法查看
- **个人主页**：支持设置已分享的某个页面为主页，可作为自定义博客主页
- **主题集成**：默认集成 默认主题 和 [Zhihu](https://github.com/terwer/siyuan-theme-zhihu) 主题，后续可支持切换其他主题
- **SEO优化**：支持自动生成标题、摘要、首图，便于SEO
- **多种部署**
  ：支持思源笔记插件、docker自部署、Vercel托管满足各种人群的需求，详情请看 [docs](https://blog.terwer.space/s/20230621001422-xsimx5v)
    - [入门级]思源笔记插件：零配置，开箱即用，本地SPA应用，直接访问思源本体，因此速度极快，但是SEO不太友好
    - [高手级]docker自部署：需要自己购买服务器，SSR服务端渲染，SEO友好，速度快
    - [白嫖级]Vercel托管：需要自己购买域名，否则可能无法访问，成本低，速度适中
    - [零部署]<sup>new</sup>在 VIP
      服务商模式下，用户只需要安装 [在线分享专业版](https://github.com/terwerinc/siyuan-plugin-share-pro)
      即可使用，此项目作为服务商部署版本。
- **分享模式**：默认支持公共笔记分享，开启授权码之后可支持有限的分享功能。
- **VIP 服务商模式**<sup>2.0.0+</sup>：可以部署此项目作为 VIP
  服务商，需要后端分享服务（例如：https://github.com/terwerinc/siyuan-note-service ）支持

## 功能对比

| 功能                                                 | 免费版 | 收费版  |
|----------------------------------------------------|-----|------|
| 支持替换图片链接                                           | ✔️  | ✔️   |
| 集成目前已有的热门主题                                        | ✔️  | ✔️   |
| 支持内部链接和外部链接                                        | ✔️  | ✔️   |
| 支持任务列表                                             | ✔️  | ✔️   |
| 支持开启授权码下的分享                                        | ✔️  | ✔️   |
| 无序列表样式适配                                           | ✔️  | ✔️   |
| Latex 公式渲染                                         | ✔️  | ✔️   |
| 支持思源自带的svg，例如 `<use xlink:href="#iconMore"></use>` | ✔️  | ✔️   |
| 支持图床托管                                             | ❌   | ✔️   |
| 支持自定义域名                                            | ❌   | ✔️   |
| 已分享页面的批量管理                                         | ❌   | ✔️   |
| 文档树                                                | ❌   | ✔️   |
| 页面大纲                                               | ❌   | ✔️   |
| 支持单页面设置分享密码                                        | ❌   | 规划中  |
| 支持文档别名访问                                           | ❌   | 规划中  |
| 支持显示 MD 原文                                         | ❌   | 规划中  |
| 支持显示 KMD 原文                                        | ❌   | 规划中  |
| 标签、摘要                                              | ❌   | 规划中️ |
| 自定义属性                                              | ❌   | 规划中️ |
| 图片放大效果                                             | ❌   | 规划中  |
| plantuml 图表支持                                      | ❌   | 规划中  |
| echats 图表支持                                        | ❌   | 规划中️ |

## 更新历史

请参考 [CHANGELOG](https://github.com/terwer/siyuan-plugin-blog/blob/main/CHANGELOG.md)

## 开发

请参考 [DEVELOPMENT](./DEVELOPMENT.md)

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

## 感谢

感谢来自开源社区提供的解决方案，简化了本项目的不少工作！

- [notion](https://notion.so)