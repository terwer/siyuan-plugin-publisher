import {createI18n} from "vue-i18n";
import zh_CN from "./zh_CN";
import en_US from "./en_US";

const i18n = createI18n({
    locale: 'zh_CN', // 默认显示语言
    fallbackLocale: 'en_US', // 次要语言
    messages: {
        zh_CN,
        en_US
    },
})

export default i18n