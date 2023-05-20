/**
 * 设备类型枚举
 *
 * @public
 * @author terwer
 * @since 1.0.8
 */
declare enum DeviceTypeEnum {
    /**
     * 移动端
     */
    DeviceType_Mobile_Device = "Mobile",
    /**
     * 思源笔记挂件
     */
    DeviceType_Siyuan_Widget = "Siyuan_Widget",
    /**
     * 思源笔记新窗口
     */
    DeviceType_Siyuan_NewWin = "Siyuan_NewWindow",
    /**
     * 思源笔记主窗口
     */
    DeviceType_Siyuan_MainWin = "Siyuan_MainWindow",
    /**
     * 思源打开的浏览器
     */
    DeviceType_Siyuan_Browser = "Siyuan_Browser",
    /**
     * Google Chrome浏览器插件
     */
    DeviceType_Chrome_Extension = "Chrome_Extension",
    /**
     * Google Chrome浏览器（Docker浏览器共用）
     */
    DeviceType_Chrome_Browser = "Chrome_Browser",
    /**
     * Node环境
     */
    DeviceType_Node = "Node"
}
export default DeviceTypeEnum;
