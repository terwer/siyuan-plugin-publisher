import {LiandiApi} from "../src/lib/platform/commonblog/liandi/liandiApi";
import {initTestEnv} from "./testEnv";

// 初始化测试环境变量
initTestEnv()

// @ts-ignore
const liandiApi = new LiandiApi(process.env.VITE_LIANDI_API_URL, process.env.VITE_LIANDI_CONFIG_TOKEN)
const result = await liandiApi.getUser()
console.log(result)

export default {}