import pageUtil from "~/utils/pageUtil"
import index from "./App.vue"

// 创建统一的Vue实例
const app = pageUtil.createPage(index)
// 挂载Vue
app.mount("#app")
