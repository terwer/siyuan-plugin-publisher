# sy-post-publisher

![](https://img1.terwer.space/api/public/202212181125714.png)

将 [思源笔记](https://github.com/siyuan-note/siyuan) 的文章发布到支持的平台的 **思源笔记挂件**

![version](https://img.shields.io/github/release/terwer/sy-post-publisher.svg?style=flat-square)
[![](https://img.shields.io/badge/online-preview-faad14.svg?style=popout-square)](https://publish.terwer.space/blog/index.html)
![GitHub last commit](https://img.shields.io/github/last-commit/terwer/src-sy-post-publisher)
![](https://img.shields.io/badge/license-GPL-blue.svg?style=popout-square)

[![](https://img.shields.io/badge/%E9%A1%B9%E7%9B%AE%E6%BA%90%E7%A0%81-code-brightgreen)](https://github.com/terwer/src-sy-post-publisher)
[![](https://img.shields.io/badge/%E5%B8%AE%E5%8A%A9%E6%96%87%E6%A1%A3-doc-blue)](https://docs.publish.terwer.space)
[![](https://img.shields.io/badge/视频教程（旧）-video-purple)](https://docs.publish.terwer.space/post/configure-entry-video-brpm9.html)
[![](https://img.shields.io/badge/视频教程（新）-video-red)](https://docs.publish.terwer.space/post/the-pendant-mode-is-used-in-the-method-of-mounting-menu-169wrw.html#%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B)

![](https://img1.terwer.space/api/public/202212181127124.png)

## 状态

[![dev checks](https://img.shields.io/github/checks-status/terwer/src-sy-post-publisher/main?label=main)](https://github.com/terwer/src-sy-post-publisher)
[![dev checks](https://img.shields.io/github/checks-status/terwer/src-sy-post-publisher/dev?label=dev)](https://github.com/terwer/src-sy-post-publisher/tree/dev)
<a title="Downloads" target="_blank" href="https://github.com/terwer/src-sy-post-publisher/releases"><img src="https://img.shields.io/github/downloads/terwer/src-sy-post-publisher/total.svg?label=extension-downloads&style=flat-square&color=blueviolet"></a>
<a title="Downloads" target="_blank" href="https://github.com/terwer/src-sy-post-publisher/releases"><img src="https://img.shields.io/github/downloads/terwer/sy-post-publisher/total.svg?label=widget-downloads&style=flat-square&color=blue"></a>

## v0.6.8 特性一览<sup>new</sup>

- 提供通用的集成接口，方便思源笔记主题集成本插件
- 重构数据存储方案，思源笔记内部使用 JSON 存储，解决多空间随机端口问题

## 快速上手

### 挂件版挂载菜单打开新窗口操作方式快速上手

首先在设置 - 集市 - 挂件 中下载 sy-post-publisher

点击设置 - 外观- 代码片段，代码片段加上下面的 `js` 片段，然后重启思源

```js
// 如果不喜欢这个菜单，直接去掉这个代码片段引用即可，去掉之后仍然可以通过挂件版通用方式使用
import("/widgets/sy-post-publisher/lib/siyuanhook.js")
```

点击按钮开始体验

![](https://img1.terwer.space/api/public/20221228-175950.jpeg)

详情请参考: [挂件模式用挂载菜单的方式使用](https://docs.publish.terwer.space/post/the-pendant-mode-is-used-in-the-method-of-mounting-menu-169wrw.html)<sup>
强烈推荐</sup> <sup>0.4.2+</sup>

### 挂件版通用方式快速上手

首先在设置 - 集市 - 挂件 中下载 sy-post-publisher

然后写好文章

在文中最后面输入 / 找到挂件，选择 sy-post-publisher

然后选择你需要的平台然后进行设置

点击发布即可

### 浏览器插件快速上手

参考 [浏览器插件快速上手指南](https://docs.publish.terwer.space/docs/getting-started/#%E6%B5%8F%E8%A7%88%E5%99%A8%E6%8F%92%E4%BB%B6%E6%96%B9%E5%BC%8F%E4%BD%BF%E7%94%A8)

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
