/**
 * 文章状态枚举
 */
declare enum PostStatusEnum {
    /**
     * 已发布
     */
    PostStatusEnum_Publish = "publish",
    /**
     * 草稿
     */
    PostStatusEnum_Draft = "draft",
    /**
     * 继承
     */
    PostStatusEnum_Inherit = "inherit"
}
export default PostStatusEnum;
