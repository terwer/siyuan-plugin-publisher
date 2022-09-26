import {defineStore} from "pinia";
import {ref} from "vue";

/**
 * 可用平台数
 */
export const useTabCountStore = defineStore("tabCount", () => {
    const tabCount = ref(0)

    function resetCount() {
        tabCount.value = 0;
    }

    function incrementIf(isAdd: boolean) {
        if (isAdd) {
            tabCount.value++;
        }
    }

    return {tabCount, resetCount, incrementIf}
})