export default {
  id: "markdown-plugin",
  name: "Markdown Plugin",
  type: "plugin",
  async initialize() {
    console.log("Initializing Markdown Plugin")
    return { success: true }
  },
  async processPost(content) {
    console.log("Processing Markdown:", content)
    return { success: true }
  }
} 