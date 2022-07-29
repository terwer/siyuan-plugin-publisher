/* 配置文件(可以被 data/widgets/custom.js 覆盖) */

import {getEnv} from "../envUtil";

export const config = {
    token: getEnv("VITE_SIYUAN_CONFIG_TOKEN"), // API token, 无需填写
};