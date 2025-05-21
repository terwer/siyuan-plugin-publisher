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
    fetch: (
        url: string,
        options?: {
            headers?: any[];
            params?: any;
            method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
            contentType?: string;
            payloadEncoding?: "text" | "base64" | "base64-std" | "base64-url" | "base32" | "base32-std" | "base32-hex" | "hex";
            responseEncoding?: "text" | "base64" | "base64-std" | "base64-url" | "base32" | "base32-std" | "base32-hex" | "hex";
        }
    ) => Promise<Response>;
}

export interface SiyuanApi{
    config: Record<string, any>
    kernelApi: any
}

// 主 API 接口
export interface PtApi {
    logger: PtApiLogger;
    siyuan: SiyuanApi
    util: PtApiUtil;
}

export interface PluginApi {
    siyuan: SiyuanApi,
    util: {
        fetch: typeof window.pt.api.util.fetch
        Lodash: typeof window.pt.api.util.Lodash
    }
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
