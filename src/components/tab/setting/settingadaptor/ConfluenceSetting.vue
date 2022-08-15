<template>
<metaweblog-setting :api-type="apiType"/>
</template>

<script lang="ts" setup>
import {API_TYPE_CONSTANTS} from "../../../../lib/constants/apiTypeConstants";
import {ref} from "vue";
import MetaweblogSetting from "../MetaweblogSetting.vue";

const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_CONFLUENCE)

</script>

<script lang="ts">
export default {
  name: "ConfluenceSetting"
}
</script>

<style scoped>

</style>