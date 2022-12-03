import pageUtil from "~/utils/pageUtil"
import publish from "./App.vue"

// 创建统一的Vue实例
const app = pageUtil.createPage(publish)
// 挂载Vue
app.mount("#app")
