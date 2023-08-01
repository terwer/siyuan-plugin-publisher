# Changelog

## [1.0.0](https://github.com/terwer/siyuan-plugin-publisher/compare/v0.8.0...v1.0.0) (2023-07-31)
### ⚠ BREAKING CHANGES
* 全面采用插件系统api重构，并进行细节性优化和bug修复，除了菜单插槽移除之外，其他原有功能将完全移植。
### Features
* add publisher hook and bridge ([dc34341](https://github.com/terwer/siyuan-plugin-publisher/commit/dc343414cd1f120a6dde6bf34420ec8c30b42454))
* fix ci ([30982fe](https://github.com/terwer/siyuan-plugin-publisher/commit/30982fe6160805efbcfc1313e716e069e92d37b4))
* **publisher-main:** 加载插件菜单 ([a621fbf](https://github.com/terwer/siyuan-plugin-publisher/commit/a621fbf722cc04f5a18adca71524e33a7b43d4ab))
* **publisher-main:** 集成 svelte 到插件 ([22b7b67](https://github.com/terwer/siyuan-plugin-publisher/commit/22b7b6776ebcf586420419fb55eb1e332d1b8fa6))
* 修改图标 ([25a750e](https://github.com/terwer/siyuan-plugin-publisher/commit/25a750ef9db8789b028641c6906b495cabacdeaa))
* 兼容 siyuanhook ([a0017c3](https://github.com/terwer/siyuan-plugin-publisher/commit/a0017c39cf50e9960b4d459b5d66e622104dc0c4))
* 兼容挂件版 ([e6754fa](https://github.com/terwer/siyuan-plugin-publisher/commit/e6754fac6ebce00aaf74ee4dd1dbf15dc0f7a740))
* 发布工具插件版第一版-优化信息提示 ([69bd749](https://github.com/terwer/siyuan-plugin-publisher/commit/69bd7495bf1642e16815359e2bff6e12c640d68a))
* 发布工具插件版第一版-修改设置菜单 ([618415a](https://github.com/terwer/siyuan-plugin-publisher/commit/618415a1c561a9d284dd826b00126cdb4855774b))
* 发布工具插件版第一版-初始化 ([5e6ad90](https://github.com/terwer/siyuan-plugin-publisher/commit/5e6ad904a20ed5536c7dbc215199676d6b830764))
* 发布工具插件版第一版-动态读取发布菜单 ([b9ef233](https://github.com/terwer/siyuan-plugin-publisher/commit/b9ef233b5c9d8ad5c50cbec8d046e0ad9d74461e))
* 发布工具插件版第一版-发布内测版 ([4b40550](https://github.com/terwer/siyuan-plugin-publisher/commit/4b405502610894f0ff18221d69ac2679aba97605))
* 发布工具插件版第一版-支持发布预览 ([4fc2d56](https://github.com/terwer/siyuan-plugin-publisher/commit/4fc2d56b0c9cd4f20255073f5404bb147f0d9b59))
* 发布工具插件版第一版-整合插件与挂件 ([21e3afd](https://github.com/terwer/siyuan-plugin-publisher/commit/21e3afd68cdfd54d115ed14b9dc3689ef6d0500f))
* 发布工具插件版第一版-新增应用项目 ([4f275e1](https://github.com/terwer/siyuan-plugin-publisher/commit/4f275e1f5da54605d0bf89089a2020e09886da6a))
* 发布工具插件版第一版-更新文档 ([e926ac7](https://github.com/terwer/siyuan-plugin-publisher/commit/e926ac7769ad06da6bd21e5f19a11b108b48204f))
* 发布工具插件版第一版-构建脚本兼容windows ([017a31b](https://github.com/terwer/siyuan-plugin-publisher/commit/017a31b302f52c7651d698774aa039b0b5d7f242))
* 发布工具插件版第一版-调整菜单 ([10df790](https://github.com/terwer/siyuan-plugin-publisher/commit/10df790779e06d69c81dd0438070db0aab0c4ec0))
* 图床直接调用挂件 ([ba57fe3](https://github.com/terwer/siyuan-plugin-publisher/commit/ba57fe3c95fd3296a6efeded5abcb356277d3b9f))
* 增加日志 ([07a075e](https://github.com/terwer/siyuan-plugin-publisher/commit/07a075ed4a8c324491cacb0cc1ae1fa5a4029316))
* 支持复制文档id ([21a5372](https://github.com/terwer/siyuan-plugin-publisher/commit/21a5372de30f2975456bc31039ca21efb8817d96))
* 支持开发模式全自动热重载 ([bc7b5cb](https://github.com/terwer/siyuan-plugin-publisher/commit/bc7b5cb81c5c1800eb42844ed9cb7606d4aaacff))
* 新增 publisher-hook ([c8192cf](https://github.com/terwer/siyuan-plugin-publisher/commit/c8192cf337b9107af8cb9c23a8cdcd8c34be19e1))
* 新增发布 sdk ([b818b47](https://github.com/terwer/siyuan-plugin-publisher/commit/b818b4726a9000f81fce98ba3e3a9dd21c079bfc))
* 新增发布菜单、页面路由 ([70bc06b](https://github.com/terwer/siyuan-plugin-publisher/commit/70bc06b9a56f105ddf6db47620e52b9773b2a6f5))
* 新增打包脚本 ([fc49b74](https://github.com/terwer/siyuan-plugin-publisher/commit/fc49b74abd89f4f419d790f660fcbb521d4007c8))
* 更新图标与项目说明 ([c05d92f](https://github.com/terwer/siyuan-plugin-publisher/commit/c05d92f2dbfd2781fb7d19cca8e9bb73e0d5aff3))
* 更新挂件版 siyuanhook ([4764b0c](https://github.com/terwer/siyuan-plugin-publisher/commit/4764b0c78379be1f5f1e74ca56641c14a0652286))
* 更新项目说明 ([2ef9a1f](https://github.com/terwer/siyuan-plugin-publisher/commit/2ef9a1f886c3dfaae25abad79926328f75b4939f))
* 校验打包 ([c771f12](https://github.com/terwer/siyuan-plugin-publisher/commit/c771f12c688faa8f9505ca4bd2eeba161c75820c))
* 添加菜单和图标 ([9bb152c](https://github.com/terwer/siyuan-plugin-publisher/commit/9bb152cda8edb1385182caecee2dfe8c684298d6))
* 版本号同步 ([4192aa1](https://github.com/terwer/siyuan-plugin-publisher/commit/4192aa13c90a839fc3033e8a242c25d61c6cc7cf))
* 移动 sdk 到类库项目 ([e19d45c](https://github.com/terwer/siyuan-plugin-publisher/commit/e19d45c32e4c1933d8597f497658d62d940f9c72))
* 迁移仓库到集市挂件仓库 ([1343906](https://github.com/terwer/siyuan-plugin-publisher/commit/13439061349c43b080cb0c8fa1070e7af3e0b126))
### Bug Fixes
* allow toc in hexo as default ([1650edc](https://github.com/terwer/siyuan-plugin-publisher/commit/1650edc8aaeb6f31eb72a4857bda50124e02d6d6))
* **deps:** bump pnpm/action-setup from 2.2.4 to 2.4.0 ([255b55a](https://github.com/terwer/siyuan-plugin-publisher/commit/255b55a488802c1e738ab4300346851cce749afc))
* **deps:** bump zhi-lib-base from 0.2.6 to 0.4.2 ([f879df2](https://github.com/terwer/siyuan-plugin-publisher/commit/f879df2e00be10709770dbaa172b4d6599ed0fde))
* fix import ([07f5bb5](https://github.com/terwer/siyuan-plugin-publisher/commit/07f5bb58f925faf92e203a8b24495b4d5f9cc793))
* 调整版本号规则 ([23e228d](https://github.com/terwer/siyuan-plugin-publisher/commit/23e228d60f76f006d6d119ee32a92d596c2dbb5b))
### Code Refactoring
* 优化插件菜单 ([f96202a](https://github.com/terwer/siyuan-plugin-publisher/commit/f96202aac973d7ff8379acaa4d9f44d548499626))
* 全新升级为插件版 ([0337410](https://github.com/terwer/siyuan-plugin-publisher/commit/0337410b2f4c6b8d4fc4519ac0526aa2fc40505c)), closes [#502](https://github.com/terwer/siyuan-plugin-publisher/issues/502)
* 切换为单项目 ([740f4c5](https://github.com/terwer/siyuan-plugin-publisher/commit/740f4c5ac8da2ee4202f216b8effa1f883d4a61b))
* 切换为单项目-polyfill 动态加载模块(zhi-publisher-shk)，拆分zhi-publisher-shk ([57297ab](https://github.com/terwer/siyuan-plugin-publisher/commit/57297ab015e639a283e0820288c4f4f069ae7e4a))
* 切换为单项目-拆分部分类库，减小打包体积 ([ee2e562](https://github.com/terwer/siyuan-plugin-publisher/commit/ee2e562b4f9c4a2f8b30c42f44253bdd8b25604e))
* 引入 electron 工具类 ([d8bb857](https://github.com/terwer/siyuan-plugin-publisher/commit/d8bb857f17611e5321131ea27bb8d3ba5c38f0d5))
* 新增基本页面 ([7d275f7](https://github.com/terwer/siyuan-plugin-publisher/commit/7d275f7a91d7da11b307222925d7855fdb414232))
* 新增按钮菜单 ([664ac12](https://github.com/terwer/siyuan-plugin-publisher/commit/664ac12223e10f2f572cde4b3fff0dc5dffe7c2e))
* 新增页面路由 ([a8cd654](https://github.com/terwer/siyuan-plugin-publisher/commit/a8cd6543413e8cd8d88bb443e9b915c509b2a470))
* 更新代码校验规则 ([1be577b](https://github.com/terwer/siyuan-plugin-publisher/commit/1be577b8842cc8772e50f3db2820c07b27913e97))
* 项目结构重构 ([1129f3d](https://github.com/terwer/siyuan-plugin-publisher/commit/1129f3d83e5bd297664bbd91e0d083af71ca1719))
### Miscellaneous
* **deps-dev:** bump svelte from 3.59.2 to 4.1.2 ([03393d2](https://github.com/terwer/siyuan-plugin-publisher/commit/03393d2ec1a0373aea298dbfd685dd3e1fec8ff2))
* **deps-dev:** bump vite-plugin-static-copy from 0.16.0 to 0.17.0 ([feea39d](https://github.com/terwer/siyuan-plugin-publisher/commit/feea39d39bff74051fe0d68153b0628b00bff53f))
* **deps-dev:** bump vitest from 0.32.4 to 0.33.0 ([f2ce507](https://github.com/terwer/siyuan-plugin-publisher/commit/f2ce507ea537601d7dba21de84524274ec1cbee4))
* release 0.8.0 ([29336cd](https://github.com/terwer/siyuan-plugin-publisher/commit/29336cd847064971bc842e44aee75a8e90c226a8))
* 优化构建流程 ([f4aeea1](https://github.com/terwer/siyuan-plugin-publisher/commit/f4aeea1c618638a7774105a87b3e690d6d5d3927))