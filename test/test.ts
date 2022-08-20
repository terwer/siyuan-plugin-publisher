// import {LiandiApi} from "../src/lib/platform/commonblog/liandi/liandiApi";
// import {initTestEnv} from "./testEnv";
//
// // 初始化测试环境变量
// initTestEnv()
//
// // @ts-ignore
// const liandiApi = new LiandiApi(process.env.VITE_LIANDI_API_URL, process.env.VITE_LIANDI_CONFIG_TOKEN)
// const result = await liandiApi.getUser()
// console.log(result)

// import {curlFileToFetch} from "./testCurl2Fetch";
//
// const result = curlFileToFetch("src/lib/platform/commonblog/kms/test/curl.local")
// console.log(result)

// import {testKmsFetch} from "./testKmsFetch";
//
// await testKmsFetch()

import {testYuqueFetch} from "./testYuqueFetch";

await testYuqueFetch()

export default {}