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
  <div>
    <el-form-item>
      <el-button-group>
        <el-button type="primary"
          >{{ $t("setting.picgo.picbed.github") }}
        </el-button>
        <el-button>{{ $t("setting.picgo.picbed.aliyun.oss") }}</el-button>
        <el-button>{{ $t("setting.picgo.picbed.tencent.cos") }}</el-button>
        <el-button>{{ $t("setting.picgo.picbed.qiniu") }}</el-button>
        <el-button>{{ $t("setting.picgo.picbed.youpai") }}</el-button>
      </el-button-group>
    </el-form-item>

    <el-form-item>
      <div class="profile-card-box">
        <div
          v-bind:key="profile.index"
          class="profile-card-item"
          v-for="profile in profileData.profileList"
        >
          <el-card>
            <div class="profile-card-line">
              <span>{{ profile.profileName }}</span>
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
            <div>{{ formatIsoToZhDate(new Date().toISOString()) }}</div>
            <div :class="{ selected: profile.selected }">已选中</div>
          </el-card>
        </div>
      </div>
    </el-form-item>

    <div class="profile-form">
      <el-form label-width="120px">
        <div>
          <el-form-item label="图床配置名">
            <el-input />
          </el-form-item>
          <el-form-item label="Github仓库名">
            <el-input />
          </el-form-item>
          <el-form-item label="Github分支名">
            <el-input />
          </el-form-item>
          <el-form-item label="Token">
            <el-input />
          </el-form-item>
          <el-form-item label="存储路径">
            <el-input />
          </el-form-item>
          <el-form-item label="自定义域名">
            <el-input />
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue"
import { PicbedType } from "~/utils/common/picbedType"
import { ElCard } from "element-plus"
import { formatIsoToZhDate } from "~/utils/dateUtil"
import { PicbedConfig } from "~/utils/platform/picgo/picbedConfig"

const profileData = reactive({
  profileList: <PicbedConfig[]>[],
})

const getProfileList = (bedType: PicbedType) => {
  const picbedCfgList = <PicbedConfig[]>[]

  for (let i = 0; i < 12; i++) {
    const picbedCfg = new PicbedConfig()
    const index = i + 1
    picbedCfg.index = index
    picbedCfg.profileName = "Profile-" + index

    if (i === 0) {
      picbedCfg.selected = true
    }

    picbedCfgList.push(picbedCfg)
  }

  return picbedCfgList
}

onMounted(() => {
  profileData.profileList = getProfileList(PicbedType.PICBED_GITHUB)
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
