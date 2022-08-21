# sy-post-publisher

将思源笔记的文章发布到支持的开放平台的**思源笔记挂件**

目前支持 Vuepress 以及 2 种博客平台标准、metaweblog api 和基于 Wordpress 的 xmlrpc 远程调用 api

同时提供了一个 [统一通用的API适配器](https://github.com/terwer/src-sy-post-publisher/blob/main/src/lib/api.ts) ，让适配任何平台成为可能。

<a href="https://img1.terwergreen.com/api/public/20220729233245.gif" target="_blank" >点击查看操作演示</a>

![](img/v001.gif)

## 支持平台

* [X] Vuepress-v0.0.1版本支持，2022-07-29发布

* [X] 博客园-延期到v0.0.2版本，~~预计2022-10-31发布~~，已提前，2022-08-21发布

* [X] 链滴社区-延期到v0.0.2版本，~~预计2022-10-31发布~~，已提前，2022-08-21发布

* [X] 语雀-延期到v0.0.2版本，~~预计2022-10-31发布~~，已提前，2022-08-21发布

## 最近更新

[点击这里查看开发进度](https://github.com/users/terwer/projects/1/views/1)

### v0.0.2
- [X] [#15](https://github.com/terwer/src-sy-post-publisher/issues/15) 发布到其他平台-博客园、Wordpress、链滴社区等

  - [x] [#18](https://github.com/terwer/src-sy-post-publisher/issues/18) 实现metaweblog-api客户端

  - [x] [#24](https://github.com/terwer/src-sy-post-publisher/issues/24) 非挂件服务器版，需要传递文档ID，建议配合我的另一个作品 node-siyuan 使用

  - [x] [#25](https://github.com/terwer/src-sy-post-publisher/issues/25) Vercel部署

  - [X] [#38](https://github.com/terwer/src-sy-post-publisher/issues/38) 部分平台支持取消发布

  - [X] [#39](https://github.com/terwer/src-sy-post-publisher/issues/39) 支持eletron接口

  - [X] [#40](https://github.com/terwer/src-sy-post-publisher/issues/40) 发布到Confluence，需要配合我的另一个 [适配器项目](https://github.com/terwer/node-metaweblog-api-adaptor) 使用（强烈推荐

  - [x] [#41](https://github.com/terwer/src-sy-post-publisher/issues/41) 发布到Wordpess

  - [x] [#42](https://github.com/terwer/src-sy-post-publisher/issues/42) 发布到链滴

  - [x] [#43](https://github.com/terwer/src-sy-post-publisher/issues/43) 发布到语雀

  - [x] [#44](https://github.com/terwer/src-sy-post-publisher/issues/44) 发布到KMS

- [#19](https://github.com/terwer/src-sy-post-publisher/issues/19) 增强Vuepress支持，如果设置了Github参数，使用Github API实现自动发布，否则自行复制文本

    - 1、新增Github的rest api
  
    - 2、ts泛型实现Vuepress发布参数配置
  
    - 3、修复 octokit 在 vite 构建报错问题，替换 `node-fetch` 为 `isomorphic-fetch`
  
    - 4、新增配置验证 
  
    - 5、耗时的按钮操作添加 `loading`
  
    - 6、如果设置了Github参数，使用Github API实现自动发布，否则自行复制文本
  
    - 7、支持选择自定义发布目录
  
    - 8、支持修改发布后的文件名
  
    - 9、Vuepress的slug添加hash避免文章重复的冲突问题
  
    - 10、支持简洁模式与详细模式 
  
    - 11、新增api状态，确保api可用性 
  
    - 12、配置开关自动生效 
  
    - 13、默认目录开关 
  
    - 14、页面初始化也附加内容 
  
    - 15、支持文章取消发布

### v0.0.1

- [#13](https://github.com/terwer/src-sy-post-publisher/issues/13) Vuepress基本支持

## Vue 3 + TypeScript + Vite

项目使用 Vue 3 框架，TypeScript 开发语言，Vite 作为构建工具。

项目使用了 Vue 3 的 `<script setup>`，可以查看文档 [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) 了解更多。

## 推荐开发工具

* [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

* IntelliJ IDEA 或者 WebStorm

## 开始开发

```bash
yarn
yarn dev
```

## 依赖版本

| 工具   | 版本       |
|------|----------| 
| node | v16.16.0 |
| yarn | 1.22.19  |

## 初始化项目

```bash
yarn create vite
```

## 部署

```bash
yarn deploy
```

## Vercel CLI

```
npm i -g vercel
```

[Vercel CLI](https://vercel.com/docs/cli#introduction/installing-the-cli)