# sy-post-publisher

Publish siyuan article to supported open platforms

At present, it supports vuepress and two open API standard blog platforms, <code>metaweblog api</code> and <code>xmlrpc</code> remote call API based on <code>wordpress</code>

ALso provide a [common API adaptor](https://github.com/terwer/src-sy-post-publisher/blob/main/src/lib/api.ts) , make every plantform posiable.

<a href="https://img1.terwergreen.com/api/public/20220729233245.gif" target="_blank" >Click me</a>

![](img/v001.gif)

[中文版说明](README-zh_CN.md)

## Support plantforms

* [X] Vuepress-v0.0.1 support，2022-07-29 release

* [X] Cnblogs-relay on v0.0.2 version，~~will release on 2022-10-31~~，released now on 2022-08-21

* [X] Liandi-relay on v0.0.2 version，~~will release on 2022-10-31~~，released now on 2022-08-21

* [X] Yueque-relay on v0.0.2 version，~~will release on 2022-10-31~~，released now on 2022-08-21

* [X] Metaweblog API on v0.0.2，released now on 2022-08-21

* [X] Wordpress on v0.0.2，released now on 2022-08-21

## Updates

[Click here to view development progress](https://github.com/users/terwer/projects/1/views/1)

### v0.0.2
- [X] [#15](https://github.com/terwer/src-sy-post-publisher/issues/15) Published to other platforms-blog parks, WordPress, chain drop community, etc.

  - [x] [#18](https://github.com/terwer/src-sy-post-publisher/issues/18) Implement MetaWeblog-API client

  - [x] [#24](https://github.com/terwer/src-sy-post-publisher/issues/24) Non-pendant server version, you need to pass the document ID. It is recommended to cooperate with my other work [node-siyuan](https://github.com/terwer/node-siyuan) use

  - [x] [#25](https://github.com/terwer/src-sy-post-publisher/issues/25) Vercel deploy

  - [X] [#38](https://github.com/terwer/src-sy-post-publisher/issues/38) Some platforms support cancel the release

  - [X] [#39](https://github.com/terwer/src-sy-post-publisher/issues/39) Support ELETRON interface

  - [X] [#40](https://github.com/terwer/src-sy-post-publisher/issues/40) Published to Confluence, you need to cooperate with my project [node-metaweblog-api-adaptor](https://github.com/terwer/node-metaweblog-api-adaptor)

  - [x] [#41](https://github.com/terwer/src-sy-post-publisher/issues/41) Send to Wordpess

  - [x] [#42](https://github.com/terwer/src-sy-post-publisher/issues/42) Sendto Liandi

  - [x] [#43](https://github.com/terwer/src-sy-post-publisher/issues/43) Send to Yuque

  - [x] [#44](https://github.com/terwer/src-sy-post-publisher/issues/44) Send to KMS
  
- [#19](https://github.com/terwer/src-sy-post-publisher/issues/19) 增强Vuepress支持，如果设置了Github参数，使用Github API实现自动发布，否则自行复制文本

    - 1、add aupport for Github rest api

    - 2、TS generic implementation Vuepress release parameter configuration

    - 3、Fix Octokit to build an error in vite, replace `node-fetch` as `isomorphic-fetch`
  
    - 4、Add config valifation

    - 5、Time-consuming button operation add `loading`
  
    - 6、If the GitHub parameter is set, the GitHub API is set to be automatically published, otherwise the text will be copied by yourself
  
    - 7、Support selection of custom release directory
  
    - 8、Support modified file name
  
    - 9、Vuepress's slug add hash to avoid the conflict of repeated articles
  
    - 10、Support simple and complex mode
  
    - 11、New API status to ensure the availability of the API
  
    - 12、Configuration switch automatically takes effect
  
    - 13、Default directory switch
  
    - 14、Page initialization is also additional content
  
    - 15、Support article cancellation and release

### v0.0.1

- [#13](https://github.com/terwer/src-sy-post-publisher/issues/13) Vuepress基本支持

## Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

* [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's Take Over mode by following these steps:

1. Run `Extensions: Show Built-in Extensions` from VS Code's command palette, look for `TypeScript and JavaScript Language Features`, then right click and select `Disable (Workspace)`. By default, Take Over mode will enable itself if the default TypeScript extension is disabled.

2. Reload the VS Code window by running `Developer: Reload Window` from the command palette.

You can learn more about Take Over mode [here](https://github.com/johnsoncodehk/volar/discussions/471).

## Devlopment

```bash
yarn
yarn dev
```

## Tool Version

|Tool|Version|
| ------| ----------|
|node|v16.16.0|
|yarn|1.22.19|

## Init Project

```bash
yarn create vite
```

## Deploy

```bash
yarn deploy
```

## Vercel CLI

```
npm i -g vercel
```

[Vercel CLI](https://vercel.com/docs/cli#introduction/installing-the-cli)

