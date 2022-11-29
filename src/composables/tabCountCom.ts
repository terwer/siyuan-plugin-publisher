import {getBooleanConf} from "~/utils/config";
import SWITCH_CONSTANTS from "../utils/constants/switchConstants";
import {reactive, ref} from "vue";
import {useTabCountStore} from "~/stores/tabCountStore";
import {DynamicConfig, getDynamicJsonCfg, getDynSwitchKey, getDynSwitchModelValue} from "~/utils/dynamicConfig";

export function useTabCount() {
    const tabCountStore = useTabCountStore()

    // Github
    const vuepressEnabled = ref(false)
    const hugoEnabled = ref(false)
    const hexoEnabled = ref(false)
    const jekyllEnabled = ref(false)

    // Metaweblog API
    const jvueEnabled = ref(false)
    const confEnabled = ref(false)
    const cnblogsEnabled = ref(false)

    // Wordpress
    const wordpressEnabled = ref(false)

    // Commmon API
    const liandiEnabled = ref(false)
    const yuqueEnabled = ref(false)
    const kmsEnabled = ref(false)

    let switchFormData = reactive({
        dynamicConfigArray: <Array<DynamicConfig>>[]
    })

    function doCount() {
        // 重新计数
        tabCountStore.resetCount()

        vuepressEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY)
        tabCountStore.incrementIf(vuepressEnabled.value)

        hugoEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_HUGO_KEY)
        tabCountStore.incrementIf(hugoEnabled.value)

        hexoEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_HEXO_KEY)
        tabCountStore.incrementIf(hexoEnabled.value)

        jekyllEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_JEKYLL_KEY)
        tabCountStore.incrementIf(jekyllEnabled.value)

        jvueEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_JVUE_KEY)
        tabCountStore.incrementIf(jvueEnabled.value)

        confEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_CONF_KEY)
        tabCountStore.incrementIf(confEnabled.value)

        cnblogsEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_CNBLOGS_KEY)
        tabCountStore.incrementIf(cnblogsEnabled.value)

        wordpressEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_WORDPRESS_KEY)
        tabCountStore.incrementIf(wordpressEnabled.value)

        liandiEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_LIANDI_KEY)
        tabCountStore.incrementIf(liandiEnabled.value)

        yuqueEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_YUQUE_KEY)
        tabCountStore.incrementIf(yuqueEnabled.value)

        kmsEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_KMS_KEY)
        tabCountStore.incrementIf(kmsEnabled.value)

        const dynamicJsonCfg = getDynamicJsonCfg()
        const results = dynamicJsonCfg.totalCfg || []
        switchFormData.dynamicConfigArray = []
        results.forEach(item => {
            const switchKey = getDynSwitchKey(item.plantformKey)
            const switchValue = getBooleanConf(switchKey)
            item.modelValue = getDynSwitchModelValue({
                switchKey: item.plantformKey,
                switchValue: switchValue
            })
            tabCountStore.incrementIf(switchValue)

            switchFormData.dynamicConfigArray.push(item)
        });
    }

    return {
        tabCountStore,
        vuepressEnabled,
        hugoEnabled,
        hexoEnabled,
        jekyllEnabled,
        jvueEnabled,
        confEnabled,
        cnblogsEnabled,
        wordpressEnabled,
        liandiEnabled,
        yuqueEnabled,
        kmsEnabled,
        switchFormData,
        doCount
    }
}