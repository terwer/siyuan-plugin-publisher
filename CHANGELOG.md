## v0.0.3

- [#59](https://github.com/terwer/src-sy-post-publisher/issues/59) 标题支持数字编号
- [#59](https://github.com/terwer/src-sy-post-publisher/issues/59) 标题支持数字编号
- [#59](https://github.com/terwer/src-sy-post-publisher/issues/59) 标题支持数字编号
- [#59](https://github.com/terwer/src-sy-post-publisher/issues/59) 修复数字编号
- [#59](https://github.com/terwer/src-sy-post-publisher/issues/59) 修复数字编号
- [#59](https://github.com/terwer/src-sy-post-publisher/issues/59) 修复数字编号
- [#59](https://github.com/terwer/src-sy-post-publisher/issues/59) WordPress 默认发布为 Markdown
- [#66](https://github.com/terwer/src-sy-post-publisher/issues/66) 发布到语雀偶发的获取默认知识库失败问题
- [#67](https://github.com/terwer/src-sy-post-publisher/issues/67) 动态类型支持选择发布格式
- [#74](https://github.com/terwer/src-sy-post-publisher/issues/74) 支持 Metaweblog 选择分类（博客园、Wordpress 等）
- [#78](https://github.com/terwer/src-sy-post-publisher/issues/78) 支持取消所有平台
- [#78](https://github.com/terwer/src-sy-post-publisher/issues/78) 支持取消所有平台-修复取消平台后的提示问题
- [#85](https://github.com/terwer/src-sy-post-publisher/issues/85) Google 插件扩展-多页面支持
- [#80](https://github.com/terwer/src-sy-post-publisher/issues/80) 适配暗色模式
- [#87](https://github.com/terwer/src-sy-post-publisher/issues/87) 整合 node-siyuan 到挂件-首页基本布局
- [#87](https://github.com/terwer/src-sy-post-publisher/issues/87) 整合 node-siyuan 到挂件-优化首页布局
- [#85](https://github.com/terwer/src-sy-post-publisher/issues/85) Google 插件扩展-同时兼容 Google 扩展与思源挂件构建
- [#85](https://github.com/terwer/src-sy-post-publisher/issues/85) Google 插件扩展-当前页面使用发布工具
- [#85](https://github.com/terwer/src-sy-post-publisher/issues/85) Google 插件扩展-当前页面样式问题修复
- [#85](https://github.com/terwer/src-sy-post-publisher/issues/85) Google 插件扩展-暗黑模式适配
- [#85](https://github.com/terwer/src-sy-post-publisher/issues/85) Google 插件扩展-文章详情页支持新窗口单独预览
- [#85](https://github.com/terwer/src-sy-post-publisher/issues/85) Google 插件扩展-修复样式
- [#85](https://github.com/terwer/src-sy-post-publisher/issues/85) Google 插件扩展-已兼容 Chrome 插件
- [#85](https://github.com/terwer/src-sy-post-publisher/issues/85) Google 插件扩展-数据适配
- [#85](https://github.com/terwer/src-sy-post-publisher/issues/85) Google 插件扩展-公共请求及错误处理
- [#85](https://github.com/terwer/src-sy-post-publisher/issues/85) Google 插件扩展-修复 Form 表单参数传递
- [#101](https://github.com/terwer/src-sy-post-publisher/issues/101) 代码优化以及空状态处理
- [#65](https://github.com/terwer/src-sy-post-publisher/issues/65) 支持可设置分类的平台选择分类-语雀支持选择分类
- [#69](https://github.com/terwer/src-sy-post-publisher/issues/69) 动态类型支持自定义预览地址
- [#69](https://github.com/terwer/src-sy-post-publisher/issues/69) 动态类型支持自定义预览地址-适配暗黑模式
- [#84](https://github.com/terwer/src-sy-post-publisher/issues/84) 平台配置帮助文档

## v0.0.2

- [x] [#15](https://github.com/terwer/src-sy-post-publisher/issues/15) 发布到其他平台-博客园、Wordpress、链滴社区等

  - [x] [#18](https://github.com/terwer/src-sy-post-publisher/issues/18) 实现 metaweblog-api 客户端

  - [x] [#24](https://github.com/terwer/src-sy-post-publisher/issues/24) 非挂件服务器版，需要传递文档 ID，建议配合我的另一个作品 node-siyuan 使用

  - [x] [#25](https://github.com/terwer/src-sy-post-publisher/issues/25) Vercel 部署

  - [x] [#38](https://github.com/terwer/src-sy-post-publisher/issues/38) 部分平台支持取消发布

  - [x] [#39](https://github.com/terwer/src-sy-post-publisher/issues/39) 支持 electron 接口

  - [x] [#40](https://github.com/terwer/src-sy-post-publisher/issues/40) 发布到 Confluence，需要配合我的另一个 [适配器项目](https://github.com/terwer/node-metaweblog-api-adaptor) 使用（强烈推荐

  - [x] [#41](https://github.com/terwer/src-sy-post-publisher/issues/41) 发布到 Wordless

  - [x] [#42](https://github.com/terwer/src-sy-post-publisher/issues/42) 发布到链滴

  - [x] [#43](https://github.com/terwer/src-sy-post-publisher/issues/43) 发布到语雀

  - [x] [#44](https://github.com/terwer/src-sy-post-publisher/issues/44) 发布到 KMS

- [#19](https://github.com/terwer/src-sy-post-publisher/issues/19) 增强 Vuepress 支持，如果设置了 Github 参数，使用 Github API 实现自动发布，否则自行复制文本

  - 1、新增 Github 的 rest api

  - 2、ts 泛型实现 Vuepress 发布参数配置

  - 3、修复 octokit 在 vite 构建报错问题，替换 `node-fetch` 为 `isomorphic-fetch`

  - 4、新增配置验证

  - 5、耗时的按钮操作添加 `loading`

  - 6、如果设置了 Github 参数，使用 Github API 实现自动发布，否则自行复制文本

  - 7、支持选择自定义发布目录

  - 8、支持修改发布后的文件名

  - 9、Vuepress 的 slug 添加 hash 避免文章重复的冲突问题

  - 10、支持简洁模式与详细模式

  - 11、新增 api 状态，确保 api 可用性

  - 12、配置开关自动生效

  - 13、默认目录开关

  - 14、页面初始化也附加内容

  - 15、支持文章取消发布

## v0.0.1

- [#13](https://github.com/terwer/src-sy-post-publisher/issues/13) Vuepress 基本支持
