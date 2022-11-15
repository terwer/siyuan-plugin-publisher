/**
 * 检测是否运行在Firefox插件中
 */
export function isInFirefoxExtension() {
    // @ts-ignore
    return typeof InstallTrigger !== 'undefined';
}