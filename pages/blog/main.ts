import pageUtil from "~/utils/pageUtil"
import blog from "./App.vue"

// 创建统一的Vue实例
const app = pageUtil.createPage(blog)
// 挂载Vue
app.mount("#app")
