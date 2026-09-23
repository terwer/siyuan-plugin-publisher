export const DEFAULT_SIYUAN_LANG =
  typeof window !== "undefined" && (window as any)?.siyuan?.config?.lang
    ? (window as any).siyuan.config.lang
    : "zh_CN"
