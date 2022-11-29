// Github平台
const API_STATUS_VUEPRESS = "vuepress-status";
const API_STATUS_HUGO = "hugo-status";
const API_STATUS_HEXO = "hexo-status";
const API_STATUS_JEKYLL = "jekyll-status";

// Metaweblog API
const API_STATUS_JVUE = "jvue-status";
const API_STATUS_CONFLUENCE = "confluence-status";
const API_STATUS_CNBLPGS = "cnblogs-status";

// Wordpress
const API_STATUS_WORDPRESS = "wordpress-status";

// Commmon API
const API_STATUS_LIANDI = "liandi-status";
const API_STATUS_YUQUE = "yuque-status";

// Other
const API_STATUS_WECHAT = "wechat-status";

/**
 * api状态是否可用
 * 为了确保配置准确无误，增加这个字段保证配置的正确性
 * 所有配置必须先验证通过才能使用
 */
export const API_STATUS_CONSTANTS = {
    API_STATUS_VUEPRESS,
    API_STATUS_HUGO,
    API_STATUS_HEXO,
    API_STATUS_JEKYLL,
    API_STATUS_JVUE,
    API_STATUS_CONFLUENCE,
    API_STATUS_CNBLPGS,
    API_STATUS_WORDPRESS,
    API_STATUS_LIANDI,
    API_STATUS_YUQUE,
    API_STATUS_WECHAT,
};