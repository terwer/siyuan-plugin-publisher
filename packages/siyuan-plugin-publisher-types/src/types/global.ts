/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

// 插件容器接口
import { IPlugin } from "./plugin"
import type * as _ from "lodash-es"

export interface PtPlugins {
    [key: string]: IPlugin;
}

// API 子模块接口示例
export interface PtApiLogger {
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
}

export interface PtApiUtil {
    initLogger(moduleName: string): PtApiLogger;
    Lodash: typeof _;
}

// 主 API 接口
export interface PtApi {
    logger: PtApiLogger;
    util: PtApiUtil;
}

// 全局 pt 命名空间接口
export interface Pt {
    plugins: PtPlugins;
    api: PtApi;
}

// 扩展 Window 接口
declare global {
    interface Window {
        pt: Pt;
    }
}
