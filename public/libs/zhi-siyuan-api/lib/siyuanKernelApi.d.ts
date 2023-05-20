import { Env } from "zhi-env";
import SiyuanConfig from "./siyuanConfig";
import ISiyuanKernelApi, { type SiyuanData } from "./ISiyuanKernelApi";
/**
 * 思源笔记服务端API v2.8.2
 *
 * 1. 均是 POST 方法
 *
 * 2. 需要带参的接口，参数为 JSON 字符串，放置到 body 里，标头 Content-Type 为 application/json
 *
 * 3. 鉴权：在 `设置` - `关于` 里查看 API token，请求标头：Authorization: Token xxx
 *
 * @public
 * @author terwer
 * @since 1.0.0
 * @see {@link https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md#%E9%89%B4%E6%9D%83 siyuan-api}
 * @see {@link https://github.com/leolee9086/noob-core/blob/master/frontEnd/noobApi/util/kernelApi.js kernelApi}
 */
declare class SiyuanKernelApi implements ISiyuanKernelApi {
    /**
     * 思源笔记服务端API版本号
     */
    readonly VERSION: string;
    private logger;
    private env;
    private common;
    readonly siyuanConfig: SiyuanConfig;
    /**
     * 初始化思源服务端 API
     *
     * @param cfg - 环境变量 或者 配置项
     */
    constructor(cfg: Env | SiyuanConfig);
    init(appInstance: any): void;
    /**
     * 分页获取根文档
     *
     * @param keyword - 关键字
     */
    getRootBlocksCount(keyword: string): Promise<number>;
    /**
       * 分页获取根文档
  
       * ```sql
       * select DISTINCT b2.root_id,b2.parent_id,b2.content from blocks b2
       *        WHERE 1==1
       * AND b2.id IN (
       *     SELECT DISTINCT b1.root_id
       *        FROM blocks b1
       *        WHERE 1 = 1
       *        AND ((b1.content LIKE '%github%') OR (b1.tag LIKE '%github%'))
       *        ORDER BY b1.updated DESC,b1.created DESC LIMIT 0,10
       * )
       * ORDER BY b2.updated DESC,b2.created DESC
       * ```
       *
       * @param page 页码
       * @param pagesize 数目
       * @param keyword 可选，搜索关键字
       */
    getRootBlocks(page: number, pagesize: number, keyword: string): Promise<any>;
    /**
     * 获取该文档下面的子文档个数
     *
     * ```sql
     * SELECT COUNT(DISTINCT b1.root_id) AS count
     * FROM blocks b1
     * WHERE b1.path LIKE '%/20220927094918-1d85uyp%';
     * ```
     *
     * @param docId 文档ID
     */
    getSubdocCount(docId: string): Promise<number>;
    /**
     * 分页获取子文档
     *
     * ```sql
     * SELECT DISTINCT b2.root_id,b2.content,b2.path FROM blocks b2
     * WHERE b2.id IN (
     *   SELECT DISTINCT b1.root_id
     *      FROM blocks b1
     *      WHERE b1.path like '%/20220927094918-1d85uyp%'
     *      AND ((b1.content LIKE '%文档%') OR (b1.tag LIKE '%文档%'))
     *      ORDER BY b1.updated DESC,b1.created DESC LIMIT 0,10
     * )
     * ORDER BY b2.updated DESC,b2.created DESC
     * ```
     *
     * @param docId 文档ID
     * @param page 页码
     * @param pagesize 数目
     * @param keyword 关键字
     */
    getSubdocs(docId: string, page: number, pagesize: number, keyword: string): Promise<any>;
    /**
     * 以id获取思源块信息
     * @param blockId 块ID
     */
    getBlockByID(blockId: string): Promise<any>;
    /**
     * 以slug获取思源块信息
     * @param slug 内容快别名
     */
    getRootBlockBySlug(slug: string): Promise<any>;
    /**
     * 以内容块ID获取根块
     *
     * @param blockID 内容块ID
     */
    getRootBlock(blockID: string): Promise<any>;
    /**
     * 导出markdown文本
     * @param docId 文档id
     */
    exportMdContent(docId: string): Promise<any>;
    /**
     * 以sql发送请求
     *
     * @param sql - sql
     */
    sql(sql: string): Promise<SiyuanData["data"]>;
    /**
     * 向思源请求数据
     *
     * @param url - url
     * @param data - 数据
     */
    siyuanRequest(url: string, data: object): Promise<SiyuanData>;
    /**
     * 列出笔记本
     */
    lsNotebooks(): Promise<SiyuanData>;
    /**
     * 打开笔记本
     *
     * @param notebookId - 笔记本ID
     */
    openNotebook(notebookId: string): Promise<SiyuanData>;
    /**
     * 关闭笔记本
     *
     * @param notebookId - 笔记本ID
     */
    closeNotebook(notebookId: string): Promise<SiyuanData>;
    /**
     * 重命名笔记本
     *
     * @param notebookId - 笔记本ID
     * @param name - 新笔记本名称
     */
    renameNotebook(notebookId: string, name: string): Promise<SiyuanData>;
    /**
     * 创建笔记本
     *
     * @param name - 新笔记本名称
     */
    createNotebook(name: string): Promise<SiyuanData>;
    /**
     * 删除笔记本
     *
     * @param notebookId - 笔记本ID
     */
    removeNotebook(notebookId: string): Promise<SiyuanData>;
    /**
     * 获取笔记本配置
     *
     * @param notebookId - 笔记本ID
     */
    getNotebookConf(notebookId: string): Promise<SiyuanData>;
    /**
     * 保存笔记本配置
     *
     * ```json
     * {
     *   "notebook": "20210817205410-2kvfpfn",
     *   "conf": {
     *       "name": "测试笔记本",
     *       "closed": false,
     *       "refCreateSavePath": "",
     *       "createDocNameTemplate": "",
     *       "dailyNoteSavePath": "/daily note/{{now | date \"2006/01\"}}/{{now | date \"2006-01-02\"}}",
     *       "dailyNoteTemplatePath": ""
     *     }
     * }
     * ```
     * @param notebookConf - 笔记本配置
     */
    setNotebookConf(notebookConf: object): Promise<SiyuanData>;
    /**
     * 推送消息
     *
     * 参数
     *
     * ```json
     * {
     *   "msg": "test",
     *   "timeout": 7000
     * }
     * ```
     *
     * timeout：消息持续显示时间，单位为毫秒。可以不传入该字段，默认为 7000 毫秒
     *
     * 返回值
     *
     * ```
     * {
     *   "code": 0,
     *   "msg": "",
     *   "data": {
     *       "id": "62jtmqi"
     *   }
     * }
     *
     * id：消息 ID
     * ```
     *
     * @param msgObj 消息体
     */
    pushMsg(msgObj: object): Promise<SiyuanData>;
    /**
     * 推送报错消息
     *
     * 参数
     *
     * ```
     * {
     *   "msg": "test",
     *   "timeout": 7000
     * }
     * ```
     *
     * timeout：消息持续显示时间，单位为毫秒。可以不传入该字段，默认为 7000 毫秒
     *
     * 返回值
     *
     * ```
     * {
     *   "code": 0,
     *   "msg": "",
     *   "data": {
     *       "id": "qc9znut"
     *   }
     * }
     *
     * id：消息 ID
     * ```
     *
     * @param msgObj
     */
    pushErrMsg(msgObj: object): Promise<SiyuanData>;
    /**
     * 获取块属性
     * @param blockId
     */
    getBlockAttrs(blockId: string): Promise<any>;
    /**
     * 设置块属性
     * @param blockId
     * @param attrs
     */
    setBlockAttrs(blockId: string, attrs: any): Promise<any>;
}
export default SiyuanKernelApi;
