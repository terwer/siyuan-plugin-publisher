import {getBooleanConf, getConf} from "../lib/config";
import SWITCH_CONSTANTS from "../lib/constants/switchConstants";
import {ref} from "vue";
import {useTabCountStore} from "../stores/tabCountStore";
import {getDynamicJsonCfg} from "../lib/dynamicConfig";


export function useTabCount() {
    const tabCountStore = useTabCountStore()

    const vuepressEnabled = ref(false)
    const jvueEnabled = ref(false)
    const confEnabled = ref(false)
    const cnblogsEnabled = ref(false)
    const wordpressEnabled = ref(false)
    const liandiEnabled = ref(false)
    const yuqueEnabled = ref(false)
    const kmsEnabled = ref(false)

    function doCount() {
        // 重新计数
        tabCountStore.resetCount()

        vuepressEnabled.value = getBooleanConf(SWITCH_CONSTANTS.SWITCH_VUEPRESS_KEY)
        tabCountStore.incrementIf(vuepressEnabled.value)

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
        results.forEach(item => {
            const switchKey = "switch-" + item.plantformKey
            const switchValue = getConf(switchKey)
            item.modelValue = item.plantformKey + "_" + switchValue
            const dynEnabled = switchValue.toLowerCase() === "true"

            tabCountStore.incrementIf(dynEnabled)
        });
    }


    return {
        tabCountStore,
        vuepressEnabled,
        jvueEnabled,
        confEnabled,
        cnblogsEnabled,
        wordpressEnabled,
        liandiEnabled,
        yuqueEnabled,
        kmsEnabled,
        doCount
    }
}