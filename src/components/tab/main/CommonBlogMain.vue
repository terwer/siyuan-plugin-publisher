<template>
  <el-form label-width="120px">
    <el-alert class="top-version-tip" :title="apiTypeInfo + blogName" type="info" :closable="false"/>
  </el-form>
</template>

<script lang="ts" setup>
import {CommonblogCfg, ICommonblogCfg} from "../../../lib/platform/commonblog/commonblogCfg";
import {onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import {getPageId} from "../../../lib/platform/siyuan/siyuanUtil";
import {getJSONConf} from "../../../lib/config";
import {isEmptyObject} from "../../../lib/util";

const {t} = useI18n()

const props = defineProps({
  isReload: {
    type: Boolean,
    default: false
  },
  apiType: {
    type: String,
    default: ""
  },
  cfg: {
    type: CommonblogCfg,
    default: null
  }
})

const blogName = ref("")
const apiTypeInfo = ref(t('setting.blog.platform.support.common') + props.apiType + " ")
const apiStatus = ref(false)

const initPage = async () => {
  const pageId = await getPageId(true);
  if (!pageId || pageId === "") {
    return
  }

  // conf
  const conf = getJSONConf<ICommonblogCfg>(props.apiType)
  if (!isEmptyObject(conf)) {
    blogName.value = conf.blogName || ""
  }

  apiStatus.value = conf.apiStatus || false
}

onMounted(async () => {
  await initPage()
})
</script>

<script lang="ts">
export default {
  name: "CommonBlogMain"
}
</script>

<style scoped>

</style>