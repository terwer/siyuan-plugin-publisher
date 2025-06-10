export default {
  id: "github-adaptor",
  name: "GitHub Adaptor",
  type: "adaptor",
  async initialize() {
    console.log("Initializing GitHub Adaptor")
    return { success: true }
  },
  async publish(content) {
    console.log("Publishing to GitHub:", content)
    return { success: true }
  },
}
