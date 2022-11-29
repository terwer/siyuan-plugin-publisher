import {getJSONConf, setJSONConf} from "./config";
import {CONSTANTS} from "./constants/constants";
import {newID} from "~/utils/idUtil";
import {isEmptyString} from "~/utils/util";
import {upperFirst} from "~/utils/strUtil";

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
    Github = "Github",
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
    Github_Hugo = "Hugo",
    Github_Hexo = "Hexo",
    Github_Jekyll = "Jekyll",
    Github_Vuepress = "Vuepress",
    Github_Vitepress = "Vitepress",
    Github_Nuxt = "Nuxt",
    Github_Next = "Next",
    NONE = "none"
}

/**
 * 动态配置类型封装
 */
export type DynamicJsonCfg = {
    totalCfg: DynamicConfig[]
    githubCfg: DynamicConfig[]
    metaweblogCfg: DynamicConfig[]
    wordpressCfg: DynamicConfig[]
}

/**
 * 获取子平台列表
 */
export function getSubtypeList(ptype: PlantformType): Array<SubPlantformType> {
    let subtypeList: Array<SubPlantformType> = []

    switch (ptype) {
        case PlantformType.Github:
            subtypeList.push(SubPlantformType.Github_pages)
            subtypeList.push(SubPlantformType.Github_giteePages)
            subtypeList.push(SubPlantformType.Github_Hugo)
            subtypeList.push(SubPlantformType.Github_Hexo)
            subtypeList.push(SubPlantformType.Github_Jekyll)
            subtypeList.push(SubPlantformType.Github_Vuepress)
            subtypeList.push(SubPlantformType.Github_Vitepress)
            subtypeList.push(SubPlantformType.Github_Nuxt)
            subtypeList.push(SubPlantformType.Github_Next)
            break
        default:
            break
    }

    return subtypeList
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
    const githubCfg: DynamicConfig[] = []
    const metaweblogCfg: DynamicConfig[] = []
    const wordpressCfg: DynamicConfig[] = []

    // 按照类型组装便于后面数据使用
    totalCfg.forEach(item => {
        switch (item.plantformType) {
            case PlantformType.Github:
                githubCfg.push(item)
                break
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
        githubCfg: githubCfg,
        metaweblogCfg: metaweblogCfg,
        wordpressCfg: wordpressCfg
    };

    setJSONConf<DynamicJsonCfg>(CONSTANTS.DYNAMIC_CONFIG_KEY, dynamicJsonCfg)
}

// =====================
// 动态平台key规则
// =====================
/**
 * 生成新的平台keym
 * 平台与ID之间用-分割
 * 平台与子平台直接用_分割
 * @param ptype 平台类型
 * @param subtype 子平台类型
 */
export function getNewPlatformKey(ptype: PlantformType, subtype: SubPlantformType) {
    let ret
    const newId = newID();
    ret = ptype.toLowerCase()

    if (!isEmptyString(subtype) && SubPlantformType.NONE != subtype) {
        ret = ret + upperFirst(subtype)
    }
    return ret + "-" + newId;
}

/**
 * 检测动态平台key是否重复
 */
export function isDynamicKeyExists(dynamicConfigArray: Array<DynamicConfig>, key: string): boolean {
    let flag = false
    // logUtil.logInfo("isDynamicKeyExists,dynamicConfigArray=>")
    // logUtil.logInfo(dynamicConfigArray)
    for (let i = 0; i < dynamicConfigArray.length; i++) {
        if (dynamicConfigArray[i].plantformKey == key) {
            flag = true;
            break;
        }
    }
    return flag
}

/**
 * 生成默认的平台名
 * @param ptype 平台
 * @param subtype 子平台
 * @param isShowSubtype 是否显示子平台
 */
export function getDefaultPlatfoemName(ptype: PlantformType, subtype: SubPlantformType, isShowSubtype: boolean): string {
    if (PlantformType.Github == ptype && SubPlantformType.NONE == subtype) {
        return ""
    }

    let pname: string = ptype
    if (isShowSubtype) {
        pname = subtype
    }
    pname = pname + "-1"
    return pname;
}

// =====================
// 动态平台开关key规则
// =====================
type SwitchItem = {
    switchKey: string
    switchValue: boolean
}

export function getDynSwitchKey(plantformKey: string) {
    return "switch-" + plantformKey;
}

/**
 * 平台开关启用状态值
 * @param plantformKey
 */
export function getDynSwitchActive(plantformKey: string) {
    return plantformKey + '_true'
}

/**
 * 平台开关禁用状态值
 * @param plantformKey
 */
export function getDynSwitchInactive(plantformKey: string) {
    return plantformKey + '_false';
}

/**
 * 组装Switch显示值
 * @param switchItem 开关
 */
export function getDynSwitchModelValue(switchItem: SwitchItem) {
    return switchItem.switchKey + "_" + switchItem.switchValue;
}

/**
 * 解析选中项
 * @param selectedText 选中的值
 */
export function getSwitchItem(selectedText: string): SwitchItem {
    const valArr = selectedText.split("_")
    const switchKey = getDynSwitchKey(valArr[0])
    const switchStatus = valArr[1] == 'true'

    return {
        switchKey: switchKey,
        switchValue: switchStatus
    }
}

// =====================
// 动态平台文章ID规则
// =====================
/**
 * 获取动态文章ID的key
 * @param plantformKey
 */
export function getDynPostidKey(plantformKey: string): string {
    return "custom-" + plantformKey + "-post-id"
}
