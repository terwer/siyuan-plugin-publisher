/**
 * 通用分类模型定义
 */
export class CategoryInfo {
    categoryId: string
    parentId: string
    description: string
    categoryDescription: string
    categoryName: string
    htmlUrl: string
    rssUrl: string


    constructor() {
        this.categoryId = ""
        this.parentId = "0"
        this.description = ""
        this.categoryDescription = ""
        this.categoryName = ""
        this.htmlUrl = ""
        this.rssUrl = ""
    }
}