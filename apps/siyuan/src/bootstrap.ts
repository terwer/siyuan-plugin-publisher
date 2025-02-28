import {createApp} from "vue"
import Publish from "./pages/Publish/Index.vue"

const createBootStrap = (props: any, container: string | HTMLElement) => {
    createApp(Publish, props).mount(container)
}

export {createBootStrap}