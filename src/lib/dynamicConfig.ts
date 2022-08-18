export class DynamicConfig {
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