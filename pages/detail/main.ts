import pageUtil from "~/utils/pageUtil"
import detail from "./App.vue"

// 创建统一的Vue实例
const app = pageUtil.createPage(detail)
// 挂载Vue
app.mount("#app")
