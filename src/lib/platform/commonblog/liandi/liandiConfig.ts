/* 配置文件(可以被 data/widgets/custom.js 覆盖) */

import {getEnv} from "../../../envUtil";

export const config = {
    baseUrl: getEnv("VITE_LIANDI_API_URL"),// Base Url，开发阶段需要填写
    token: getEnv("VITE_LIANDI_CONFIG_TOKEN"), // API token, 无需填写
};