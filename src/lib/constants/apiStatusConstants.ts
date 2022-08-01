const API_STATUS_VUEPRESS = "vuepress-status";
const API_STATUS_CNBLPGS = "cnblogs-status";
const API_STATUS_WORDPRESS = "wordpress-status";
const API_STATUS_CONFLUENCE = "confluence-status";
const API_STATUS_JVUE = "jvue-status";
const API_STATUS_YUQUE = "yuque-status";
const API_STATUS_WECHAT = "wechat-status";
const API_STATUS_LIANDI = "liandi-status";

/**
 * api状态是否可用
 * 为了确保配置准确无误，增加这个字段保证配置的正确性
 * 所有配置必须先验证通过才能使用
 */
export const API_STATUS_CONSTANTS = {
    API_STATUS_VUEPRESS,
    API_STATUS_CNBLPGS,
    API_STATUS_WORDPRESS,
    API_STATUS_CONFLUENCE,
    API_STATUS_JVUE,
    API_STATUS_YUQUE,
    API_STATUS_WECHAT,
    API_STATUS_LIANDI
};