export default {
  id: "wordpress-adaptor",
  name: "WordPress Adaptor",
  type: "adaptor",
  async initialize() {
    console.log("Initializing WordPress Adaptor")
    return { success: true }
  },
  async publish(content) {
    console.log("Publishing to WordPress:", content)
    return { success: true }
  },
}
