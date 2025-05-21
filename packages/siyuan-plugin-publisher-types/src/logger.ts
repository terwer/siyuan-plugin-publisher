/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { PtApiLogger } from "./types/global";

/**
 * 带模块名的日志实例
 *
 * @author terwer
 * @since 2.0.0
 */
export class ModuleLogger implements PtApiLogger {
    private readonly prefix: string

    constructor(moduleName: string) {
        this.prefix = `[PLUGIN:${moduleName}]`
    }

    info(message: string, ...args: any[]): void {
        console.info(`${this.prefix} ${message}`, ...args)
    }

    warn(message: string, ...args: any[]): void {
        console.warn(`${this.prefix} ${message}`, ...args)
    }

    error(message: string, ...args: any[]): void {
        console.error(`${this.prefix} ${message}`, ...args)
    }

    debug(message: string, ...args: any[]): void {
        if (process.env.NODE_ENV !== 'production') {
            console.debug(`${this.prefix} [DEBUG] ${message}`, ...args)
        }
    }
}