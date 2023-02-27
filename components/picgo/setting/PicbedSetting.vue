<!--
  - Copyright (c) 2023, Terwer . All rights reserved.
  - DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
  -  
  - This code is free software; you can redistribute it and/or modify it
  - under the terms of the GNU General Public License version 2 only, as
  - published by the Free Software Foundation.  Terwer designates this
  - particular file as subject to the "Classpath" exception as provided
  - by Terwer in the LICENSE file that accompanied this code.
  -  
  - This code is distributed in the hope that it will be useful, but WITHOUT
  - ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
  - FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
  - version 2 for more details (a copy is included in the LICENSE file that
  - accompanied this code).
  -  
  - You should have received a copy of the GNU General Public License version
  - 2 along with this work; if not, write to the Free Software Foundation,
  - Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
  -  
  - Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
  - or visit www.terwer.space if you need additional information or have any
  - questions.
  -->

<template>
  <div class="picbed-setting">
    <el-alert
      :title="
        $t('setting.picgo.picbed.current.selected.tip') +
        type +
        '，' +
        $t('setting.picgo.picbed.current.tip') +
        defaultType
      "
      type="success"
      :closable="false"
    />

    <!-- 图床配置列表 -->
    <div class="bed-type-list">
      <el-button-group>
        <el-button
          v-for="item in picBedData.showPicBedList"
          :type="type === item.type ? 'primary' : ''"
          :key="item.name"
          @click="handlePicBedTypeChange(item)"
          >{{ item.name }}
        </el-button>
      </el-button-group>
    </div>

    <div class="profile-box">
      <div class="profile-setting" v-if="!showConfigForm">
        <!-- 图床配置列表 -->
        <div class="profile-card-box">
          <div
            v-bind:key="config._id"
            class="profile-card-item"
            v-for="config in profileData.curConfigList"
            @click="() => selectItem(config._id)"
          >
            <el-card>
              <div class="profile-card-line">
                <span>{{ config._configName }}</span>
                <span class="pull-right">
                  <el-tooltip
                    :content="$t('main.opt.edit')"
                    class="box-item"
                    effect="dark"
                    placement="bottom"
                    popper-class="publish-menu-tooltip"
                  >
                    <el-button @click.stop="editConfig(config._id)">
                      <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                    </el-button>
                  </el-tooltip>
                  <el-tooltip
                    :content="$t('main.opt.delete')"
                    class="box-item"
                    effect="dark"
                    placement="bottom"
                    popper-class="publish-menu-tooltip"
                  >
                    <el-button @click.stop="deleteConfig(config._id)">
                      <font-awesome-icon icon="fa-solid fa-trash-can" />
                    </el-button>
                  </el-tooltip>
                </span>
              </div>
              <div class="profile-date">
                {{ dateUtil.formatTimestampToZhDate(config._updatedAt) }}
              </div>
              <div
                :class="{
                  selected: config._id === profileData.defaultConfigId,
                }"
              >
                {{
                  config._id === profileData.defaultConfigId
                    ? $t("setting.picgo.picbed.selected.tip")
                    : $t("setting.picgo.picbed.unselected.tip")
                }}
              </div>
            </el-card>
          </div>
          <div class="profile-card-item" @click="addNewConfig">+</div>
        </div>

        <!-- 配置操作 -->
        <div class="profile-action">
          <el-button
            class="set-default-btn"
            type="success"
            :disabled="picbedStore.defaultPicBed === type"
            @click="setDefaultPicBed(type)"
          >
            {{ $t("setting.picgo.picbed.set.default") }}
          </el-button>
        </div>
      </div>

      <!-- 图床配置表单 -->
      <div class="profile-form" v-else>
        <config-form
          config-type="uploader"
          :id="type"
          :config="profileData.curConfig"
          :config-id="profileData.curConfigId"
          :is-new-form="isNewForm"
          @on-change="emitBackFn"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRaw, watch } from "vue"
import { ElCard, ElMessage } from "element-plus"
import picgoUtil from "~/utils/otherlib/picgoUtil"
import { LogFactory } from "~/utils/logUtil"
import dateUtil from "../../../utils/dateUtil"
import { usePicbedStore } from "~/stores/picbedStore"
import { useI18n } from "vue-i18n"
import ConfigForm from "~/components/picgo/common/ConfigForm.vue"

const logger = LogFactory.getLogger(
  "components/picgo/setting/PicbedSetting.vue"
)

const props = defineProps({
  isReload: Boolean,
})

// 图床数据
const picBedData = reactive({
  showPicBedList: <IPicBedType[]>[],
})
// 配置数据
const profileData = reactive({
  // 默认配置I项D
  defaultConfigId: "",

  // 当前图床配置列表
  curConfigList: [],
  // 当前配置
  curConfig: {},
  // 当前配置项ID
  curConfigId: "",
})

// 当前选择的图床类型
const type = ref("")
const defaultType = ref("")
// use
const picbedStore = usePicbedStore()
const { t } = useI18n()

// 表单展示
const isNewForm = ref(false)
const showConfigForm = ref(false)

/**
 * 获取当前图床
 */
const getCurrentUploader = () => {
  return (
    picgoUtil.getPicgoConfig("picBed.uploader") ||
    picgoUtil.getPicgoConfig("picBed.current") ||
    "github"
  )
}

const getPicBeds = () => {
  const picBeds = picgoUtil.getPicBeds() as IPicBedType[]
  return picBeds
    .map((item: IPicBedType) => {
      if (item.visible) {
        return item
      }
      return null
    })
    .filter((item) => item) as IPicBedType[]
}

const getProfileList = (bedType: string): IUploaderConfigItem => {
  const profileList = picgoUtil.getUploaderConfigList(bedType)
  return profileList
}

const handlePicBedTypeChange = (item: IPicBedType) => {
  emitBackFn()

  type.value = item.type
  reloadConfig(item.type)
  logger.debug("item=>", item)
}

/**
 * 选择默认配置
 * @param id 配置ID
 */
function selectItem(id: string) {
  profileData.defaultConfigId = id
  const config = picgoUtil.selectUploaderConfig(type.value, id)

  logger.debug("selectItem config=>", config)
}

/**
 * 新增配置
 */
function addNewConfig() {
  const configObj = picgoUtil.getPicBedConfig(type.value)
  profileData.curConfig = configObj.config
  profileData.curConfigId = undefined

  isNewForm.value = true
  showConfigForm.value = true

  logger.debug("addNewConfig type=>", type.value)
  logger.debug("addNewConfig id=>", profileData.curConfigId)
  logger.debug("addNewConfig config=>", toRaw(profileData.curConfig))
}

/**
 * 编辑配置
 * @param id 配置ID
 */
function editConfig(id: string) {
  const configObj = picgoUtil.getPicBedConfig(type.value)
  profileData.curConfig = configObj.config
  profileData.curConfigId = id

  isNewForm.value = false
  showConfigForm.value = true

  logger.debug("editConfig type=>", type.value)
  logger.debug("editConfig id=>", profileData.curConfigId)
  logger.debug("editConfig config=>", toRaw(profileData.curConfig))
}

/**
 * 删除配置
 * @param id 配置ID
 */
function deleteConfig(id: string) {
  picgoUtil.deleteUploaderConfig(type.value, id)
}

function emitBackFn() {
  isNewForm.value = false
  showConfigForm.value = false
}

function setDefaultPicBed(tp: string) {
  picgoUtil.savePicgoConfig({
    "picBed.current": tp,
    "picBed.uploader": tp,
  })

  picbedStore.setDefaultPicBed(tp)

  defaultType.value = tp

  logger.info("当前存储的图床类型=>", tp)
  ElMessage.success(t("main.opt.success"))
}

const reloadConfig = (bedType = undefined) => {
  // 获取图床列表
  const picbeds = getPicBeds()

  // 默认第一个图床
  if (!bedType) {
    bedType = picbeds.length > 0 ? picbeds[0].type : "github"
  }

  type.value = bedType

  picBedData.showPicBedList = picbeds
  const profileList = getProfileList(bedType)
  profileData.curConfigList = profileList.configList
  profileData.defaultConfigId = profileList.defaultId

  defaultType.value = getCurrentUploader()
  picbedStore.setDefaultPicBed(defaultType.value)
}

/* 监听props */
watch(
  () => props.isReload,
  () => {
    reloadConfig()
    logger.debug("picbed-setting初始化")
  }
)

onMounted(() => {
  // 重新加载配置
  reloadConfig()
})
</script>

<style scoped>
.bed-type-list {
  margin-top: 10px;
}

.profile-card-item {
  display: inline-block;
  margin-right: 10px;
  width: 48%;
  margin-top: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}

.profile-card-item .profile-date {
  font-size: 12px;
  color: var(--el-text-color-primary);
  margin: 10px 0;
}

.profile-card-item .selected {
  color: green;
}
</style>
