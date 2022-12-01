import {describe} from "vitest";
import {PageType} from "~/utils/platform/metaweblog/IMetaweblogCfg";
import {mdToHtml, removeMdWidgetTag, removeWidgetTag} from "~/utils/htmlUtil";
import logUtil from "~/utils/logUtil";

describe("htmlUtil test", () => {
    it("mdToHtml test", () => {
        const md = `# 数据类型之字典类型
### **二、字典类型的操作**

#### 1、\`get\`​ 获取值

\`\`\`python
data = {"name":"张三","age":27}
v1 = data.get("name")

print(v1)
\`\`\``;
        let pageType = PageType.Html
        pageType = PageType.Markdown

        let content = md
        // @ts-ignore
        if (PageType.Html == pageType) {
            const html = mdToHtml(md)
            content = removeWidgetTag(html)
        } else {
            // logUtil.logWarn("md=>", md)
            content = removeMdWidgetTag(md)
        }

        logUtil.logInfo("content=>", content)
    })
})