# sy-post-publisher

![](https://img1.terwer.space/api/public/202212181125714.png)

将 [思源笔记](https://github.com/siyuan-note/siyuan) 的文章发布到支持的平台的 **思源笔记挂件**

[![dev checks](https://img.shields.io/github/checks-status/terwer/src-sy-post-publisher/dev?label=build)](https://github.com/terwer/src-sy-post-publisher/tree/dev)
![version](https://img.shields.io/github/release/terwer/sy-post-publisher.svg?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/terwer/src-sy-post-publisher)
![](https://img.shields.io/badge/license-GPL-blue.svg?style=popout-square)

[![](https://img.shields.io/badge/帮助文档-doc-blue)](https://docs.publish.terwer.space)
[![](https://img.shields.io/badge/视频教程-video-red)](https://docs.publish.terwer.space/post/the-pendant-mode-is-used-in-the-method-of-mounting-menu-169wrw.html#%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B)
[![](https://img.shields.io/badge/在线体验-preview-faad14.svg?style=popout-square)](https://publish.terwer.space/blog/index.html)
[![](https://img.shields.io/badge/项目源码-code-red)](https://github.com/terwer/src-sy-post-publisher)

![](https://static.terwergreen.com/img/202302222313542.png)

使用之前请务必详细阅读 [快速上手指南](#快速上手指南)

<a title="Downloads" target="_blank" href="https://github.com/terwer/src-sy-post-publisher/releases"><img src="https://img.shields.io/github/downloads/terwer/src-sy-post-publisher/total.svg?label=extension-downloads&style=flat-square&color=blueviolet"></a>
<a title="Downloads" target="_blank" href="https://github.com/terwer/src-sy-post-publisher/releases"><img src="https://img.shields.io/github/downloads/terwer/sy-post-publisher/total.svg?label=widget-downloads&style=flat-square&color=blue"></a>

## v0.8.0

### Bug 修复

- 修复普通挂件版使用方式 WordPress 和博客园发布文章报错问题
- 修复图片有备注时无法上传问题，现在支持显示备注为图片的 alt
- 修复 PicGo 设置中的时间戳重命名关闭后会自动打开的问题
- #434 文章没有图片时候图床错误文章发布失败

### 新特性

- 发布至语雀支持笔记间的内部链接替换
- 博客园、WordPress、Typecho 平台支持笔记间的内部链接替换
- Github 平台（HUGO、Hexo、Vitepress 等）支持笔记间的内部链接替换
- 普通挂件版使用方式支持使用图床[受限于 Electron 机制，主窗口直接上传会导致内核崩溃，目前仅支持链接替换，上传仍需打开新窗口]

### 开发重构

- 移除不必要的日志打印
- #420 ankisiyuan.bin（仅支持 Mac） 默认不提供，手动下载，减小打包体积
- 鉴于主窗口直接上传会导致内核崩溃，主窗口移除 PicGO 支持，仅支持新窗口模式使用 PicGO

## v0.7.2 Bug 修复

- 修复 PicGO 初始化失败问题

## v0.7.1 Bug 修复

- 修复 PicGO 旧的配置文件迁移过程中路径拼接错误问题

## v0.7.0 特性一览<sup>new</sup>

⚠️ 特别提醒: `0.7.0` 为灰度测试版本，所以随时可能发布 `0.7.x` 修复版本，请考虑好之后再升级。

### PicGO 相关

- 新增用户友好的 PicGO 图形化配置界面
- 优化 PicGO 配置，支持 PicGO 插件（目前支持水印、s3、minio 三个插件）
- PicGO 默认图床为 github
- PicGO 支持图片重命名
- 云床配置 buffer 读取报错问题，测试常用图床
- PicGO 引入事件监听机制，支持事件注册、事件发布
- PicGO 支持读取多个图床，单个图床支持多份配置

### 系统配置相关

- 整合系统所有配置项，提供统一的配置入口底部的【偏好设置】
- 统一整合导入导出操作位底部的【导入导出】
- 整合【思源 API 地址】设置到【偏好设置】的一个 tab 页
- 整合原通用设置为【个性设置】，操作入口移到【偏好设置】的一个 tab 页

### 发布体验相关

- 【文章绑定】操作非配置项，也是可选功能，放在发布页面容易造成误解，现将操作移入详情页，仅在需要将平台文章与思源笔记建立联系时候使用。新增文章无需操作，新增会自动进行绑定
- 修复浏览器插件不能使用 http，只能用 https 问题
- 修复 typecho 发布文章未成功解析文章 id
- 文章列表图标添加 tooltip
- 插槽按钮添加文字提示
- 新窗口打开时操作按钮 fixed 不随页面滑动

### 开发者相关

- 使用 python 重构项目构建脚本-支持一键打包
- 挂载 SyCmd，适配 Anki 同步（目前仅 Mac 可用）

### 其他

- 修复已知问题，升级部分组件。

温馨提示：

`0.7.0` 之前的更新日志请参考 [CHANGELOG](CHANGELOG.md)

## 快速上手指南

### FAQ

Q1：使用此思源笔记挂件或者浏览器插件有什么注意事项吗？

A1：有。 **特别提示：【自定义 JS 片段】请不要和【挂件通用版】混合使用，使用其中一种即可。避免因为混用导致配置同步问题。**
浏览器插件无限制。

Q2：有哪些方式可以使用？具体步骤是什么？

A2：请参考下面三种模式及其详细说明。特别注意温馨提示的内容。

### 模式一：挂件版挂载菜单打开新窗口操作方式快速上手 <sup>强烈推荐</sup> <sup>0.4.2+</sup>

首先在设置 - 集市 - 挂件 中下载 sy-post-publisher

点击设置 - 外观- 代码片段，代码片段加上下面的 `js` 片段，然后重启思源

```js
// 如果不喜欢这个菜单，直接去掉这个代码片段引用即可，去掉之后仍然可以通过挂件版通用方式使用
import("/widgets/sy-post-publisher/lib/siyuanhook.js")
```

点击按钮开始体验。

详情请参考: [挂件模式用挂载菜单的方式使用](https://docs.publish.terwer.space/post/the-pendant-mode-is-used-in-the-method-of-mounting-menu-169wrw.html)

温馨提示：此模式下，功能已经是最全面的了，直接使用菜单功能即可，请不要再添加挂件。避免因为混用导致配置同步问题。

### 模式二：挂件版通用方式快速上手

首先在设置 - 集市 - 挂件 中下载 sy-post-publisher

然后写好文章

在文中最后面输入 / 找到挂件，选择 sy-post-publisher

然后选择你需要的平台然后进行设置

点击发布即可。

温馨提示：不建议通用版模式下添加 JS 片段，可能会导致配置不同步问题。要么单独使用通用版，要么单独使用挂载菜单。

### 模式三：浏览器插件快速上手

参考 [浏览器插件快速上手指南](https://docs.publish.terwer.space/docs/getting-started/#%E6%B5%8F%E8%A7%88%E5%99%A8%E6%8F%92%E4%BB%B6%E6%96%B9%E5%BC%8F%E4%BD%BF%E7%94%A8)

Q3: `siyuanhook.js` 新增挂载了哪些对象？在哪些场景挂载？目的是什么？

A3：SyPicgo、syp、terwer（仅新窗口）、SyCmd。仅在 `Electron` 环境（即思源笔记内部挂载）。

浏览器插件和自部署模式无此功能。目的是为了扩展思源笔记的功能。

Q4：有哪些是已知问题，需要特别注意的？

1. 思源笔记的【优化排版】会导致 Anki 标记字符被转义。

   目前可用解决方案：如果使用了优化排版，使用完成之后一定要打开 Anki 列表，重新保存一下 Anki 笔记来修复。

## 支持平台

- [x] [Hugo](https://gohugo.io/) <sup>推荐</sup>
- [x] [Docsy](https://www.docsy.dev/) <sup>推荐</sup>
- [x] [Hexo](https://hexo.io/zh-cn/)
- [x] [Jekyll](https://github.com/lorepirri/cayman-blog)（Github pages 默认内置支持的平台）
- [x] [Vuepress](https://github.com/terwer/terwer.github.io)
- [x] [Vitepress](https://vitepress.vuejs.org/guide/getting-started)
- [x] [Nuxt](https://content.nuxtjs.org/)
- [x] [Next](https://nextra.site/)
- [x] [博客园](https://cnblogs.com) <sup>推荐</sup>
- [ ] CSDN <sup>预研</sup>
- [ ] 知乎 <sup>预研</sup>
- [x] [语雀](https://yuque.com) <sup>推荐</sup>
- [x] [开源中国](https://my.oschina.net/terwergreen)
- [x] [链滴社区](https://ld246.com)
- [x] [WordPress](https://blog.terwergreen.com)
- [x] [Confluence](https://github.com/terwer/node-metaweblog-api-adaptor) <sup>通过接口适配器支持</sup>
- [x] [Metaweblog API](http://xmlrpc.com/spec.md)
- [ ] 自定义 HTTP 协议 <sup>预研</sup>

更多内容请查看

[技术方案](https://github.com/terwer/src-sy-post-publisher/blob/main/tech.md)

[开发进度](https://github.com/users/terwer/projects/1/views/1)

[更新日志](https://github.com/terwer/src-sy-post-publisher/blob/main/CHANGELOG.md)

## 🎈 鸣谢

sy-post-publisher 项目的诞生与成长离不开下列开源项目的贡献，以及热心网友的反馈和建议。

### 思源社区

[思源笔记](https://github.com/siyuan-note/siyuan)

### 思源笔记非官方 QQ 群

欢迎加入 **思源爱好者折腾群** : `1017854502` ， 群内有各种爱折腾的技术大佬、萌妹子、热心网友，绝对不容错过。。。

### 资源

UI 框架：（排名不分先后）

- [Vue3](https://vuejs.org/)
- [Element-Plus](https://element-plus.org/)
- [lute](https://github.com/88250/lute)
- [FontAwesome](https://fontawesome.com/)

技术框架或托管平台：（排名不分先后）

- [xmlrpc](https://github.com/baalexander/node-xmlrpc)
- [yaml](https://github.com/nodeca/js-yaml)
- [vercel](https://vercel.com/)

### 个人

技术支持：（排名不分先后）

- 感谢 [Soltus](https://github.com/Soltus) 提供的新窗口打开相关代码及实现思路

- 感谢 [leolee9086](https://github.com/leolee9086) 提供的挂载菜单相关代码及实现思路

- 感谢 [Zuoqiu-Yingyi](https://github.com/Zuoqiu-Yingyi)
  开源的 [Dark+](https://github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus) 主题的灵感

- 感谢 [svchord](https://github.com/svchord) 开源的 [Rem Craft](https://github.com/svchord/Rem-Craft) 主题的灵感

## 版权声明

本作品以 [GPL V3](https://github.com/terwer/src-sy-post-publisher/blob/main/LICENSE) 形式开源

```
/*
 * Copyright (c) 2022, Terwer . All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Terwer designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Terwer in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
 * or visit www.terwer.space if you need additional information or have any
 * questions.
 */
```
