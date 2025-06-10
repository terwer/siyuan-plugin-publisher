export default {
  id: "image-plugin",
  name: "Image Plugin",
  type: "plugin",
  async initialize() {
    console.log("Initializing Image Plugin")
    return { success: true }
  },
  async processPost(content) {
    console.log("Processing Image:", content)
    return { success: true }
  }
} 