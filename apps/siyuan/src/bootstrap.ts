import {createApp} from "vue"
import Share from "./share.vue"

const createBootStrap = (container: string | HTMLElement) => {
    createApp(Share).mount(container)
}

export {createBootStrap}