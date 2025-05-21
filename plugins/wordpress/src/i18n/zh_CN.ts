export default {
  pluginName: "WordPress 发布器",
  config: {
    endpoint: {
      title: "WordPress REST API 端点",
      description: "您的 WordPress 站点的 REST API 端点（例如：https://your-site.com/wp-json/wp/v2）"
    },
    username: {
      title: "用户名",
      description: "WordPress 用户名"
    },
    password: {
      title: "应用密码",
      description: "WordPress 应用密码"
    }
  },
  messages: {
    publishSuccess: "文章发布成功",
    publishFailed: "发布到 WordPress 失败"
  }
} 