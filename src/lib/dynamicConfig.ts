export class DynamicConfig {
    /**
     * 用于某些控件的临时变量
     */
    modelValue?: any
    /**
     * 平台Key
     */
    plantformKey: string
    /**
     * 平台名称
     */
    plantformName: string

    constructor(plantformKey: string, plantformName: string) {
        this.plantformKey = plantformKey;
        this.plantformName = plantformName;
    }
}