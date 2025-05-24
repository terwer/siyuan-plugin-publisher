import { createBootStrap } from "./bootstrap"

// 获取挂载点元素
const appEl = document.getElementById("app")
if (!appEl) {
  throw new Error("Mount element #app not found")
}

// 模拟思源实例
const appInstance = {
  i18n: {
    publisher: "发布工具",
  },
  addCommand: () => {},
  addTopBar: () => {},
  // 其他必要的模拟方法
}

// 创建并挂载应用
createBootStrap({ appInstance: appInstance as any }, appEl)
