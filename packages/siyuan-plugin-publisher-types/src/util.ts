/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 动态挂载属性到 window.pt 下，支持多级路径（如 'api.logger.level'）
 *
 * @param path - 属性路径
 * @param value - 要挂载的值
 * @author terwer
 * @since 2.0.0
 */
export const mountPtAttr = <T>(path: string, value: T): void => {
    if (typeof window === 'undefined') {
        console.warn('window is not defined, skipping pt attribute mount.');
        return;
    }

    // 确保 pt 命名空间存在
    if (!window.pt) {
        (window as any).pt = {};
    }

    const keys = path.split('.');
    let current: any = window.pt;

    // 遍历路径，构建中间结构
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!(key in current)) {
            current[key] = {};
        } else if (typeof current[key] !== 'object') {
            console.warn(`Cannot mount pt.${path}: pt.${key} is not an object.`);
            return;
        }
        current = current[key];
    }

    const lastKey = keys[keys.length - 1];

    // 如果目标属性已存在，避免覆盖
    if (current[lastKey] !== undefined) {
        console.warn(`Attribute pt.${path} already exists. Skipping.`);
        return;
    }

    current[lastKey] = value;
    console.info(`Attribute pt.${path} mounted successfully.`);
};

/**
 * 卸载 window.pt 上的属性，支持多级路径（例如 'api.logger.level'）
 *
 * @param path - 要卸载的属性路径
 * @author terwer
 * @since 2.0.0
 */
export const unmountPtAttr = (path: string): void => {
    if (typeof window === 'undefined' || !window.pt) {
        console.warn('window or window.pt is not defined.');
        return;
    }

    const keys = path.split('.');
    let current: any = window.pt;

    for (let i = 0; i < keys.length - 1; i++) {
        if (current[keys[i]] === undefined) {
            // 路径不存在，无需卸载
            console.warn(`Path pt.${path} does not exist. Skipping.`);
            return;
        }
        current = current[keys[i]];
    }

    const lastKey = keys[keys.length - 1];
    if (current[lastKey] !== undefined) {
        delete current[lastKey];
        console.info(`Attribute pt.${path} has been successfully unmounted.`);
    } else {
        console.warn(`Attribute pt.${path} does not exist. Skipping.`);
    }
};
