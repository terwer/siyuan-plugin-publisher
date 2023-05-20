/**
 * 思源 API 返回类型
 */
interface SiyuanData {
    /**
     * 非 0 为异常情况
     */
    code: number;
    /**
     * 正常情况下是空字符串，异常情况下会返回错误文案
     */
    msg: string;
    /**
     * 可能为 \{\}、[] 或者 NULL，根据不同接口而不同
     */
    data: any[] | object | null | undefined;
}
/**
 * 思源笔记内核接口定义
 *
 * @see {@link https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md#%E9%89%B4%E6%9D%83 siyuan-api}
 * @see {@link https://github.com/leolee9086/noob-core/blob/master/frontEnd/noobApi/util/kernelApi.js kernelApi}
 */
interface ISiyuanKernelApi {
    lsNotebooks(): Promise<SiyuanData>;
    openNotebook(notebookId: string): Promise<SiyuanData>;
    closeNotebook(notebookId: string): Promise<SiyuanData>;
    renameNotebook(notebookId: string, name: string): Promise<SiyuanData>;
    createNotebook(name: string): Promise<SiyuanData>;
    removeNotebook(notebookId: string): Promise<SiyuanData>;
    getNotebookConf(notebookId: string): Promise<SiyuanData>;
    setNotebookConf(notebookConf: object): Promise<SiyuanData>;
    pushMsg(msgObj: object): Promise<SiyuanData>;
    pushErrMsg(msgObj: object): Promise<SiyuanData>;
}
export default ISiyuanKernelApi;
export type { SiyuanData };
