import MarkdownAdaptor from "./MarkdownAdaptor";
/**
 * Lute 适配器
 *
 * 引用 lute 库的方法
 *
 * 1 dev/prod 环境
 * 在 index.html 直接引用 <script src="/lib/lute/lute.min.js"></script>
 *
 * 2 test 环境
 * 在 setup.ts 引用 require("../public/lib/lute/lute.min.js")
 *
 * 3 es 环境（不推荐）
 *
 *   ```
 *   // https://stackoverflow.com/a/73702082/4037224
 *   const require = createRequire(import.meta.url)
 *   global.require = require //this will make require at the global scobe and treat it like the original require
 *   require("./lute.min.cjs")
 *   ```
 *
 *   更好的方法
 *
 *   ```
 *   import Module from "node:module"
 *
 *   const require = Module.createRequire(import.meta.url)
 *   require("./lute.min.cjs")
 *   ```
 *
 *   2023-04-09 - lute version 2.7.5 - update at April 9, 2023 09:32
 *
 * 4 Nuxt3 环境
 *   参考：https://github.com/88250/lute/issues/191
 *
 * @see {@link https://github.com/88250/lute/tree/master/javascript lute}
 *
 * @author terwer
 * @version 1.0.0
 * @since 1.0.0
 */
declare class LuteAdaptor implements MarkdownAdaptor {
    private readonly logger;
    constructor();
    isAvailable(): boolean;
    /**
     * 高亮关键字
     *
     * @param str - 字符串
     * @private
     */
    private highlightWords;
    /**
     * 渲染Markdown
     *
     * @param md - Markdown
     */
    renderMarkdownStr(md: string): Promise<string>;
}
export default LuteAdaptor;
