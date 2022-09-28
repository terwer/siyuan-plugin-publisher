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