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
    <!-- 图床配置列表 -->
    <div class="bed-type-list">
      <el-button-group>
        <el-button
          v-for="item in picBedData.showPicBedList"
          :type="
            currentPicbed === item.type
              ? 'primary'
              : arrayUtil.getRandomItem(btnTypes)
          "
          :key="item.name"
          @click="handlePicBedTypeChange(item)"
          >{{ item.name }}
        </el-button>
      </el-button-group>
    </div>

    <div class="profile-box">
      <!-- 图床配置列表 -->
      <div class="profile-card-box">
        <div
          v-bind:key="config._id"
          class="profile-card-item"
          v-for="config in profileData.profileList.configList"
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
                  <el-button>
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
                  <el-button>
                    <font-awesome-icon icon="fa-solid fa-trash-can" />
                  </el-button>
                </el-tooltip>
              </span>
            </div>
            <div>{{ config._updatedAt }}</div>
            <div
              :class="{
                selected: config._id === profileData.profileList.defaultId,
              }"
            >
              {{ $t("setting.picgo.picbed.selected.tip") }}
            </div>
          </el-card>
        </div>
      </div>

      <!-- 图床配置表单 -->
      <div class="profile-form">
        <picbed-config-form />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue"
import { ElCard } from "element-plus"
import picgoUtil from "~/utils/otherlib/picgoUtil"
import { LogFactory } from "~/utils/logUtil"
import arrayUtil from "~/utils/arrayUtil"
import PicbedConfigForm from "~/components/picgo/setting/PicbedConfigForm.vue"

const logger = LogFactory.getLogger(
  "components/picgo/setting/PicbedSetting.vue"
)

const picBedData = reactive({
  showPicBedList: <IPicBedType[]>[],
})
const profileData = reactive({
  profileList: {
    configList: [],
    defaultId: "",
  },
})

// 按钮类型
const btnTypes = ["success", "info", "warning", "danger"]
const currentPicbed = ref("")

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
  currentPicbed.value = item.type

  reloadConfig(item.type)
  logger.info("item=>", item)
}

const reloadConfig = (bedType = undefined) => {
  // 获取图床列表
  const picbeds = getPicBeds()

  // 默认第一个图床
  if (!bedType) {
    bedType = picbeds.length > 0 ? picbeds[0].type : "github"
  }

  currentPicbed.value = bedType

  picBedData.showPicBedList = picbeds
  profileData.profileList = getProfileList(bedType)
}

onMounted(() => {
  // 重新加载配置
  reloadConfig()
})
</script>

<style scoped>
.profile-card-item {
  display: inline-block;
  margin-right: 10px;
  width: 48%;
}

.profile-card-item .selected {
  color: green;
}
</style>
