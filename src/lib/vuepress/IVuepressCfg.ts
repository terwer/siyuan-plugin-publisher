/**
 * Vuepress配置接口
 */
export interface IVuepressCfg {
    /**
     * Github用户名
     */
    githubUser: string
    /**
     * Github仓库名称
     */
    githubRepo: string
    /**
     * Github个人Token令牌
     */
    githubToken: string
    /**
     * 文章存储的默认目录（相对于仓库根目录的相对路径，例如：docs/_posts/）
     */
    defaultPath?: string
    /**
     * 默认提交信息
     */
    defaultMsg?: string
    /**
     * 作者
     */
    author: string
    /**
     * 邮箱
     */
    email: string
}