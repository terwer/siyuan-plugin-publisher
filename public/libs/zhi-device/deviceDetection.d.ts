import DeviceTypeEnum from "./lib/deviceTypeEnum";
/**
 * 设备检测
 *
 * @public
 * @author terwer
 * @version 0.1.0
 * @since 0.1.0
 */
declare class DeviceDetection {
    /**
     * 获取当前设备
     */
    static getDevice(): DeviceTypeEnum;
    /**
     * 检测移动端
     * @private
     */
    private static detectMobileDevice;
}
export default DeviceDetection;
