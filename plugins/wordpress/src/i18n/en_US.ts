export default {
  pluginName: "WordPress Publisher",
  config: {
    endpoint: {
      title: "WordPress REST API Endpoint",
      description: "Your WordPress site's REST API endpoint (e.g., https://your-site.com/wp-json/wp/v2)"
    },
    username: {
      title: "Username",
      description: "WordPress username"
    },
    password: {
      title: "Application Password",
      description: "WordPress application password"
    }
  },
  messages: {
    publishSuccess: "Post published successfully",
    publishFailed: "Failed to publish to WordPress"
  }
} 