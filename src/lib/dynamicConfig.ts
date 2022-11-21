import {getJSONConf, setJSONConf} from "./config";
import {CONSTANTS} from "./constants/constants";

export class DynamicConfig {
    /**
     * 用于文章绑定的临时变量
     */
    posid?: any
    /**
     * 用于平台开关的临时变量
     */
    modelValue?: any
    /**
     * 动态平台类型(通用类型)
     */
    plantformType: PlantformType
    /**
     * 子平台类型(细分子类型)
     * @since 0.1.0+
     */
    subPlantformType?: SubPlantformType
    /**
     * 平台Key
     */
    plantformKey: string
    /**
     * 平台名称
     */
    plantformName: string

    constructor(plantformType: PlantformType, plantformKey: string, plantformName: string) {
        this.plantformType = plantformType;
        this.plantformKey = plantformKey;
        this.plantformName = plantformName;
    }
}

/**
 * 动态平台类型枚举
 */
export enum PlantformType {
    /**
     * Metaweblog
     */
    Metaweblog = "Metaweblog",
    /**
     * Wordpress
     */
    Wordpress = "Wordpress",
    /**
     * Github(Hugo、Hexo、Jekyll、Vuepress、Vitepress、Nuxt content、Next.js)
     */
    Github = "github",
    /**
     * 自定义
     */
    Custom = "Custom"
}

/**
 * 平台子类型
 * @since 0.1.0+
 * @author terwer
 */
export enum SubPlantformType {
    Github_pages = "pages",
    Github_giteePages = "giteePages",
    Github_codingPages = "codingPages",
    Github_Hexo = "hexo",
    Github_Vuepress = "vuepress",
    Github_Vitepress = "vitepress",
    Github_Nuxt = "nuxt",
    Github_Next = "next"
}

/**
 * 动态配置类型封装
 */
export type DynamicJsonCfg = {
    totalCfg: DynamicConfig[]
    metaweblogCfg: DynamicConfig[]
    wordpressCfg: DynamicConfig[]
}

/**
 * 获取动态平台JSON配置
 */
export function getDynamicJsonCfg(): DynamicJsonCfg {
    return getJSONConf<DynamicJsonCfg>(CONSTANTS.DYNAMIC_CONFIG_KEY);
}

/**
 * 设置动态平台JSON配置
 * @param dynamicConfigArray
 */
export function setDynamicJsonCfg(dynamicConfigArray: DynamicConfig[]) {
    let totalCfg: DynamicConfig[] = dynamicConfigArray
    const metaweblogCfg: DynamicConfig[] = []
    const wordpressCfg: DynamicConfig[] = []

    // 按照类型组装便于后面数据使用
    totalCfg.forEach(item => {
        switch (item.plantformType) {
            case PlantformType.Metaweblog:
                metaweblogCfg.push(item)
                break;
            case PlantformType.Wordpress:
                wordpressCfg.push(item)
                break;
            default:
                break;
        }
    })

    const dynamicJsonCfg: DynamicJsonCfg = {
        totalCfg: totalCfg,
        metaweblogCfg: metaweblogCfg,
        wordpressCfg: wordpressCfg
    };

    setJSONConf<DynamicJsonCfg>(CONSTANTS.DYNAMIC_CONFIG_KEY, dynamicJsonCfg)
}