declare class FormdataFetch {
    private logger;
    constructor(isDev?: boolean);
    /**
     * 执行网络请求并返回数据
     *
     * @param url - 请求的URL地址
     * @param headers - 请求头信息
     * @param formData - 可选的FormData对象，用于发送表单数据
     * @returns 包含响应数据的Promise
     */
    doFetch(url: string, headers: Record<string, any>, formData?: FormData): Promise<string>;
}
export default FormdataFetch;
//# sourceMappingURL=formdataFetch.d.ts.map