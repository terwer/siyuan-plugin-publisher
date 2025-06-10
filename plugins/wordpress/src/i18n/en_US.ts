export default {
  pluginName: "WordPress Publisher",
  config: {
    endpoint: {
      title: "WordPress XMLRPC API Endpoint",
      description: "Your WordPress site's XMLRPC API endpoint (e.g., https://your-site.com/xmlrpc.php)",
    },
    username: {
      title: "Username",
      description: "WordPress username",
    },
    password: {
      title: "WordPress password",
      description: "WordPress password",
    },
  },
  messages: {
    publishSuccess: "Post published successfully",
    publishFailed: "Failed to publish to WordPress",
    platformAvailable: "WordPress platform connection successful",
    platformUnavailable: "WordPress platform connection failed",
  },
}
