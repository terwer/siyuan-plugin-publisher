/**
 * 通用分类模型定义
 *
 * @author terwer
 * @version 1.0.0
 * @since 1.0.0
 */
declare class CategoryInfo {
    /**
     * 分类ID
     */
    categoryId: string;
    /**
     * 父分类ID
     */
    parentId: string;
    /**
     * 分类名称
     */
    description: string;
    /**
     * 分类英文名
     */
    categoryName: string;
    /**
     * 分类详情
     */
    categoryDescription: string;
    /**
     * 分类地址
     */
    htmlUrl: string;
    /**
     * 分类订阅地址
     */
    rssUrl: string;
    constructor();
}
export default CategoryInfo;
