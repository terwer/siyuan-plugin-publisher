import {createApp} from "vue"
import Publish from "./pages/Publish/Index.vue"

const createBootStrap = (container: string | HTMLElement) => {
    createApp(Publish).mount(container)
}

export {createBootStrap}