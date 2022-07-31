# sy-post-publisher

将思源笔记的文章发布到支持的开放平台的**思源笔记挂件**

目前支持 Vuepress ~~以及 2 种博客平台标准、metaweblog api 和基于 Wordpress 的 xmlrpc 远程调用 api （延期到v0.0.2）~~

<a href="https://img1.terwergreen.com/api/public/20220729233245.gif" target="_blank" >点击查看操作演示</a>

![](img/v001.gif)

## 支持平台

* [X] Vuepress-v0.0.1版本支持，2022-07-29发布

* [ ] 博客园-延期到v0.0.2版本，预计2022-10-31发布

* [ ] 链滴社区-延期到v0.0.2版本，预计2022-10-31发布

* [ ] 语雀-延期到v0.0.2版本，预计2022-10-31发布

## 最近更新

[点击这里查看开发进度](https://github.com/users/terwer/projects/1/views/1)

### v0.0.2

- [#19](https://github.com/terwer/src-sy-post-publisher/issues/19) 增强Vuepress支持，如果设置了Github参数，使用Github API实现自动发布，否则自行复制文本

    - 1、新增Github的rest api
  
    - 2、ts泛型实现Vuepress发布参数配置
  
    - 3、修复 octokit 在 vite 构建报错问题，替换 `node-fetch` 为 `isomorphic-fetch`

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