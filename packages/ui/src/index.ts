import TgButton from "./components/TgButton.vue"
import TgInput from "./components/TgInput.vue"
import TgForm from "./components/TgForm.vue"
import TgSelect from "./components/TgSelect.vue"
import TgRadio from "./components/TgRadio.vue"
import TgCheckbox from "./components/TgCheckbox.vue"
import TgSwitch from "./components/TgSwitch.vue"
import TgDatePicker from "./components/TgDatePicker.vue"

export {
    TgButton,
    TgInput,
    TgForm,
    TgSelect,
    TgRadio,
    TgCheckbox,
    TgSwitch,
    TgDatePicker,
}

export default {
    install(app: any) {
        app.component("TgButton", TgButton)
        app.component("TgInput", TgInput)
        app.component("TgForm", TgForm)
        app.component("TgSelect", TgSelect)
        app.component("TgRadio", TgRadio)
        app.component("TgCheckbox", TgCheckbox)
        app.component("TgSwitch", TgSwitch)
        app.component("TgDatePicker", TgDatePicker)
    },
}
